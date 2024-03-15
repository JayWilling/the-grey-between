import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import "./../assets/styling/StarMap.css";

import * as THREE from "three";
import { Canvas, ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import {
	Grid,
	OrbitControls,
	PerspectiveCamera,
	Sphere,
	useBounds,
} from "@react-three/drei";
import TWEEN from "@tweenjs/tween.js";
// import Stars from "../assets/data/bsc5p_3d.json";
import { StarPoints } from "../components/threeJs/StarPoints";
import { SolarSystem } from "../components/threeJs/SolarSystem/SolarSystem";
import { TradeRoutes } from "../components/threeJs/TradeRoutes";
import { updateCameraPosition } from "../threeJsUtils";
import {
	graphToJson,
	jsonToGraph,
	starComparator,
	vectorToScreenPosition,
} from "../utils";
import { StarMapOverlay } from "../components/overlay/HUDOverlay";
import { JSONStar, OverlayState } from "../interfaces";
import { Star } from "../assets/data/Star";
import {
	getStars,
	addNode,
	onUploadStarList,
	getNodeById,
} from "../api/starsApi";
import { UniverseGraph, Node } from "../assets/data/UniverseGraph";
import { LoadingCanvas } from "../components/loadingScreen/LoadingCanvas";
import { Loader } from "../components/loadingScreen/Loader";

export const POSITION_MULTIPLIER = 3;

// This component wraps children in a group with a click handler
// Clicking any object will refresh and fit bounds
function SelectToZoom({ children }: any) {
	const api = useBounds();
	return (
		<group
			onClick={(e) => (
				e.stopPropagation(), e.delta <= 2 && api.refresh(e.object).fit()
			)}
			onPointerMissed={(e) => e.button === 0 && api.refresh().fit()}
		>
			{children}
		</group>
	);
}

export interface StarsBufferAttributes {
	names: string[];
	positions: THREE.BufferAttribute;
	colours: THREE.BufferAttribute;
	sizes: THREE.BufferAttribute;
	index: THREE.BufferAttribute;
}

interface StarMapProps {
	stars: Star[];
	pointerPos: THREE.Vector2;
	cameraControlsRef: React.MutableRefObject<any>;
	setHighlightPosition: React.Dispatch<
		React.SetStateAction<{ x: number; y: number } | null>
	>;
	selectedStar: Star | null;
	setSelectedStar: React.Dispatch<React.SetStateAction<Star | null>>;
	currentStar: Star;
	setCurrentStar: React.Dispatch<React.SetStateAction<Star | null>>;
	showStarMap: boolean;
	setShowStarMap: React.Dispatch<React.SetStateAction<boolean>>;
	setOverlayState: React.Dispatch<React.SetStateAction<OverlayState>>;
}

type HtmlElementInterface =
	| HTMLDivElement
	| HTMLButtonElement
	| HTMLFormElement;

// Main canvas
export const StarMap = (props: StarMapProps) => {
	const { gl, scene, raycaster, camera } = useThree();

	// const testStars = new StarsClass(Stars as JSONStar[]);
	const tradeDestinations: THREE.Vector3[] = [];

	// Refs
	const pointsRef = useRef<THREE.Points>(null);

	// Raycasting for Point Selection
	const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

	// Converting JSON to graph structure
	// let starGraph = null;
	// if (Stars) {
	// 	starGraph = jsonToGraph(Stars as Star[]);
	// }

	// const starClassList: Star[] = [];
	// for (let i = 0; i < Stars.length; i++) {
	// 	var newStar = new Star((Stars as JSONStar[])[i]);

	// 	starClassList.push(newStar);
	// }

	// console.log(Stars as Star[]);

	// console.log(starGraph);

	// onNewNode(new Node<Star>((Stars as Star[])[0], () => 0));
	// if (starGraph != null) {
	// 	graphToJson(starGraph);
	// }

	useFrame(() => {
		// Zoom to selected star
		if (props.selectedStar === props.currentStar && props.currentStar) {
			// props.cameraControlsRef.current.enabled = true;
			const target = new THREE.Vector3(
				props.currentStar.x * POSITION_MULTIPLIER,
				props.currentStar.y * POSITION_MULTIPLIER,
				props.currentStar.z * POSITION_MULTIPLIER
			);
			console.log("Selected star now null");
			props.setSelectedStar(null);
			moveCameraToStar(target, true);
		}

		if (props.selectedStar != null) {
			const tempVector = new THREE.Vector3(
				props.selectedStar.x * POSITION_MULTIPLIER,
				props.selectedStar.y * POSITION_MULTIPLIER,
				props.selectedStar.z * POSITION_MULTIPLIER
			);
			const screenPosition = vectorToScreenPosition(
				tempVector,
				camera,
				gl
			);
			props.setHighlightPosition(screenPosition);
		}
	});

	function onStarClick(e: ThreeEvent<MouseEvent>): void {
		// Check if we clicked a point or a star mesh
		// If we clicked a point
		//      Check if selectedIndex matches highlightIndex
		//      if yes, hide starmap
		//      else, set selectedIndex to highlight index
		// If we clicked a star mesh
		//      show starmap

		const points = pointsRef.current;
		// const starLabel = selectedStarLabelRef.current;
		if (points === null || highlightIndex === null) {
			return;
		}

		const positions = points.geometry.attributes.position.array;
		const x = positions[highlightIndex * 3];
		const y = positions[highlightIndex * 3 + 1];
		const z = positions[highlightIndex * 3 + 2];

		// Tween to new target
		const target = new THREE.Vector3(x, y, z);
		moveCameraToStar(target, false);

		// Update the selected star

		if (highlightIndex === selectedIndex) {
			// Self explanatory...
			props.setShowStarMap(false);
			props.setOverlayState(OverlayState.SolarSystem);
		}
		const newStar = props.stars[highlightIndex] as Star;
		if (props.currentStar === null) {
			props.setCurrentStar(newStar);
		}
		props.setSelectedStar(newStar);
		setSelectedIndex(highlightIndex);

		// Get nearest neighbours and show trade routes
		// const lineDestinations = testStars.getNearestNeighbours(
		// 	highlightIndex,
		// 	10,
		// 	true
		// );
		// if (lineDestinations) {
		// 	tradeDestinations.push(...lineDestinations);
		// }
	}

	function moveCameraToStar(target: THREE.Vector3, zoom: boolean): void {
		updateCameraPosition(
			target,
			props.cameraControlsRef.current,
			camera,
			10,
			2000,
			zoom
		);
	}

	const starsBuffer = useMemo(() => {
		const starNames: string[] = [];
		const starVertices = [];
		const colours: number[] = [];
		const sizes: number[] = [];
		const colour = new THREE.Color();
		const starIndex: number[] = [];

		for (var i = 0; i < props.stars.length; i++) {
			// Set name
			const name = props.stars[i].n;
			name ? starNames.push(name) : starNames.push("");

			// Push Star index
			starIndex.push(i);

			// Set position
			// Work out what to do with the stars of unknown position
			// as 0, 0, 0 should be where sol is
			const x = props.stars[i].x || 0;
			const y = props.stars[i].y || 0;
			const z = props.stars[i].z || 0;
			starVertices.push(
				x * POSITION_MULTIPLIER,
				y * POSITION_MULTIPLIER,
				z * POSITION_MULTIPLIER
			);

			// Set colour
			const tempColour = props.stars[i].K;
			if (tempColour != null) {
				colour.setRGB(tempColour.r, tempColour.g, tempColour.b);
			} else {
				colour.setRGB(1, 1, 1);
			}
			colour.toArray(colours, i * 3);

			// Set sizes
			sizes.push(1);
		}

		// Create buffer attributes
		const bufferVertices = new THREE.BufferAttribute(
			new Float32Array(starVertices),
			3
		);
		const bufferColours = new THREE.BufferAttribute(
			new Float32Array(colours),
			3
		);
		const bufferSizes = new THREE.BufferAttribute(
			new Float32Array(sizes),
			1
		);
		const bufferIndex = new THREE.BufferAttribute(
			new Float32Array(starIndex),
			1
		);
		return {
			names: starNames,
			positions: bufferVertices,
			colours: bufferColours,
			sizes: bufferSizes,
			index: bufferIndex,
		};
	}, [props.stars]);

	if (props.stars.length <= 0) {
		return <>Loading</>;
	}

	return (
		<Suspense fallback={null}>
			{!props.showStarMap && props.currentStar != null ? (
				<SolarSystem
					starData={props.currentStar}
					setShowStarMap={props.setShowStarMap}
					cameraControls={props.cameraControlsRef.current}
					// updateCameraPosition={updateCameraPosition}
				/>
			) : (
				<>
					<StarPoints
						starsBuffer={starsBuffer}
						pointerPos={props.pointerPos}
						highlightIndex={highlightIndex}
						setHighlightIndex={setHighlightIndex}
						setHighlightPosition={props.setHighlightPosition}
						cameraControlsRef={props.cameraControlsRef}
						setShowStarMap={props.setShowStarMap}
						selectedIndex={selectedIndex}
						setSelectedIndex={setSelectedIndex}
						onClickEvent={onStarClick}
						pointsRef={pointsRef}
					/>
					<TradeRoutes
						startPos={
							props.selectedStar
								? new THREE.Vector3(
										props.selectedStar.x || 0,
										props.selectedStar.y || 0,
										props.selectedStar.z || 0
								  )
								: new THREE.Vector3(0, 0, 0)
						}
						selectedStar={props.selectedStar}
						neighbours={[]}
						endPos={tradeDestinations}
					/>
				</>
			)}
		</Suspense>
	);
};

// Grid for reference
const Ground = () => {
	const gridConfig = {
		cellSize: 0.5,
		cellThickness: 0.5,
		cellColor: "#6f6f6f",
		sectionSize: 3,
		sectionThickness: 1,
		sectionColor: "#9d4b4b",
		fadeDistance: 80,
		fadeStrength: 1,
		followCamera: false,
		infiniteGrid: true,
	};
	return (
		<Grid position={[0, -0.01, 0]} args={[10.5, 10.5]} {...gridConfig} />
	);
};

export const StarMapCanvas = () => {
	// Variables

	const [loading, setLoading] = useState<boolean>(true);

	const pointerPos = new THREE.Vector2();
	const [
		highlightedObjectScreenPosition,
		setHighlightedObjectScreenPosition,
	] = useState<{ x: number; y: number } | null>(null);

	// Star map states
	const [stars, setStars] = useState<Star[]>([]);
	const [selectedStar, setSelectedStar] = useState<Star | null>(null);
	const [currentStar, setCurrentStar] = useState<Star | null>(null);
	const [showStarMap, setShowStarMap] = useState<boolean>(true);
	const [overlayState, setOverlayState] = useState<OverlayState>(
		OverlayState.StarMap
	);

	// Load Stars
	useEffect(() => {
		// Load base star list
		const promise = getStars();
		promise.then((response) => {
			if (response == null) return;
			// Stars = response;
			setLoading(false);
			setTimeout(() => {
				setStars(response);
				setCurrentStar(response[0]);
			}, 3000);
		});
	}, []);

	// Node states
	const [currentNode, setCurrentNode] = useState<Node<Star> | null>(null);

	const cameraControlsRef = useRef<any>(null);

	function Tween() {
		useFrame(() => {
			TWEEN.update();
		});
		return <></>;
	}

	function onMouseMoveEvent(e: React.MouseEvent<HTMLDivElement>): void {
		var bounds = e.currentTarget.getBoundingClientRect();

		pointerPos.x =
			((e.clientX - bounds.left) / (window.innerWidth - bounds.left)) *
				2 -
			1;
		pointerPos.y =
			(-(e.clientY - bounds.top) / (window.innerHeight - bounds.top)) *
				2 +
			1;
	}

	// updateOverlayState
	//      Called from star menu options
	//      Should also be used by starMap instead of setOverlayState
	function updateOverlayState(
		e: React.MouseEvent<HTMLElement>,
		state: OverlayState
	) {
		e.preventDefault();
		switch (state) {
			case OverlayState.SolarSystem:
				// Get the selected node
				if (!currentStar) return;
				const nodePromise = getNodeById(currentStar._id);
				nodePromise.then((response) => {
					if (!response) {
						// Open new node form
						updateOverlayState(e, OverlayState.CreateNode);
						return;
					}
					setCurrentNode(response);
					setShowStarMap(false);
					setOverlayState(state);
				});
				return;
			case OverlayState.CreateNode:
				setOverlayState(state);
				return;
			case OverlayState.StarMap:
				setShowStarMap(true);
				setOverlayState(state);
				return;
			case OverlayState.CreateCB:
				if (currentStar != null) {
					setOverlayState(state);
				} else {
					alert("Navigate to a system to start creating.");
				}
				return;
			case OverlayState.Story:
			default:
				alert(
					"Missing case for OverlayState: " + state + " in StarMap."
				);
		}
	}

	if (!stars || !currentStar || loading) {
		return <Loader loading={loading} />;
	}

	return (
		<>
			<StarMapOverlay
				position={highlightedObjectScreenPosition}
				selectedStar={selectedStar}
				setSelectedStar={setSelectedStar}
				currentStar={currentStar}
				setCurrentStar={setCurrentStar}
				showStarMap={showStarMap}
				setShowStarMap={setShowStarMap}
				overlayState={overlayState}
				setOverlayState={setOverlayState}
				updateOverlayState={updateOverlayState}
			/>
			<Canvas
				onMouseMove={(e) => {
					onMouseMoveEvent(e);
				}}
				camera={{ near: 0.1, far: 10000.0 }}
			>
				<ambientLight intensity={1} />
				<color attach={"background"} args={["black"]} />
				<Ground />
				<OrbitControls
					ref={cameraControlsRef}
					makeDefault
					enablePan={true}
					enableZoom={true}
					enableRotate={true}
					position={[0, 0, 0]}
					minPolarAngle={0}
					maxPolarAngle={Math.PI / 1.75}
				/>
				<Tween />
				<StarMap
					stars={stars}
					selectedStar={selectedStar}
					setSelectedStar={setSelectedStar}
					currentStar={currentStar}
					setCurrentStar={setCurrentStar}
					pointerPos={pointerPos}
					setHighlightPosition={setHighlightedObjectScreenPosition}
					cameraControlsRef={cameraControlsRef}
					showStarMap={showStarMap}
					setShowStarMap={setShowStarMap}
					setOverlayState={setOverlayState}
				/>
			</Canvas>
		</>
	);
};
