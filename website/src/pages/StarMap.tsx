import React, {
	Suspense,
	createContext,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
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
import { CBProps, JSONStar, OverlayState } from "../interfaces";
import { Star } from "../models/Star";
import { getStars, onUploadStarList } from "../api/starsApi";
import { UniverseGraph, Node } from "../models/UniverseGraph";
import { LoadingCanvas } from "../components/loadingScreen/LoadingCanvas";
import { LoadState, Loader } from "../components/loadingScreen/Loader";
import { getNodeById } from "../api/nodesApi";

import CameraControls from "camera-controls";
import {
	IStarMapContext,
	StarMapContext,
	StarMapProvider,
} from "./StarMapContext";
import { useQuery } from "@tanstack/react-query";

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

interface StarMapProps {}

type HtmlElementInterface =
	| HTMLDivElement
	| HTMLButtonElement
	| HTMLFormElement;

// Main canvas
export const StarMap = (props: StarMapProps) => {
	const { gl, scene, raycaster, camera } = useThree();

	const { states, handlers, formValues, refs } = useContext(
		StarMapContext
	) as IStarMapContext;

	// const testStars = new StarsClass(Stars as JSONStar[]);
	const tradeDestinations: THREE.Vector3[] = [];

	// Refs
	const pointsRef = useRef<THREE.Points>(null);

	// Raycasting for Point Selection
	const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

	// Would elevate to parent container
	//      However, needs to be within the canvas to access camera controls
	useFrame(() => {
		// Zoom to selected star
		if (states.selectedStar === states.currentStar && states.currentStar) {
			// props.cameraControlsRef.current.enabled = true;
			const target = new THREE.Vector3(
				states.currentStar.x * POSITION_MULTIPLIER,
				states.currentStar.y * POSITION_MULTIPLIER,
				states.currentStar.z * POSITION_MULTIPLIER
			);
			console.log("Selected star now null");
			states.setSelectedStar(null);
			moveCameraToStar(target, true);
		}

		if (states.selectedStar != null) {
			const tempVector = new THREE.Vector3(
				states.selectedStar.x * POSITION_MULTIPLIER,
				states.selectedStar.y * POSITION_MULTIPLIER,
				states.selectedStar.z * POSITION_MULTIPLIER
			);
			const screenPosition = vectorToScreenPosition(
				tempVector,
				camera,
				gl
			);

			if (refs.circleIdentifierRef.current === null) {
				return;
			}

			// Why 27?
			// height / width of identifier = 50px, border-width = 2px;
			// half plus the border gives 27 to centre the star
			refs.circleIdentifierRef.current.style.top =
				((screenPosition.y - 27) / window.innerHeight) * 100 + "%";
			refs.circleIdentifierRef.current.style.left =
				((screenPosition.x - 27) / window.innerWidth) * 100 + "%";

			// props.setHighlightPosition(screenPosition);
		}
	});

	const onStarClick = async (e: ThreeEvent<MouseEvent>): Promise<void> => {
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

		// TODO: Change how the solar system entry works. We should not have double-clicking on the stars anymore
		if (highlightIndex === selectedIndex) {
			// Self explanatory...
			states.setShowStarMap(false);
			states.setOverlayState(OverlayState.SolarSystem);
		}
		const newStar = states.stars[highlightIndex] as Star;
		if (states.currentStar === null) {
			states.setCurrentStar(newStar);
		}
		states.setSelectedStar(newStar);
		setSelectedIndex(highlightIndex);

		// Update the current node to match
		// Get the selected node
		const nodePromise = await getNodeById(newStar._id);
		if (!nodePromise) {
			states.setCurrentNode(null);
		} else {
			states.setCurrentNode(nodePromise);
		}

		// Get nearest neighbours and show trade routes
		// const lineDestinations = testStars.getNearestNeighbours(
		// 	highlightIndex,
		// 	10,
		// 	true
		// );
		// if (lineDestinations) {
		// 	tradeDestinations.push(...lineDestinations);
		// }
	};

	function moveCameraToStar(target: THREE.Vector3, zoom: boolean): void {
		updateCameraPosition(
			target,
			refs.cameraControlsRef.current,
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

		for (var i = 0; i < states.stars.length; i++) {
			// Set name
			const name = states.stars[i].n;
			name ? starNames.push(name) : starNames.push("");

			// Push Star index
			starIndex.push(i);

			// Set position
			// Work out what to do with the stars of unknown position
			// as 0, 0, 0 should be where sol is
			const x = states.stars[i].x || 0;
			const y = states.stars[i].y || 0;
			const z = states.stars[i].z || 0;
			starVertices.push(
				x * POSITION_MULTIPLIER,
				y * POSITION_MULTIPLIER,
				z * POSITION_MULTIPLIER
			);

			// Set colour
			const tempColour = states.stars[i].K;
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
	}, [states.stars]);

	if (states.stars.length <= 0) {
		return <>Loading</>;
	}

	return (
		<Suspense fallback={null}>
			{!states.showStarMap &&
			states.currentStar != null &&
			states.currentNode != null ? (
				<SolarSystem
					cameraControls={refs.cameraControlsRef.current}
					// updateCameraPosition={updateCameraPosition}
				/>
			) : (
				<>
					<StarPoints
						starsBuffer={starsBuffer}
						highlightIndex={highlightIndex}
						setHighlightIndex={setHighlightIndex}
						selectedIndex={selectedIndex}
						setSelectedIndex={setSelectedIndex}
						onClickEvent={onStarClick}
						pointsRef={pointsRef}
					/>
					<TradeRoutes
						startPos={
							states.selectedStar
								? new THREE.Vector3(
										states.selectedStar.x || 0,
										states.selectedStar.y || 0,
										states.selectedStar.z || 0
								  )
								: new THREE.Vector3(0, 0, 0)
						}
						selectedStar={states.selectedStar}
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

	const [loading, setLoading] = useState<LoadState>(LoadState.Loading);

	const { states, refs } = useContext(StarMapContext) as IStarMapContext;

	const { status, data, error, isFetching } = useQuery({
		queryKey: ["stars"],
		queryFn: getStars,
	});

	useEffect(() => {
		// Do nothing if our data has not yet loaded
		if (status !== "success" || !data) {
			setLoading(LoadState.Loading);
			return;
		}
		setLoading(LoadState.Transition);
		setTimeout(() => {
			states.setStars(data);
			states.setCurrentStar(data[0]);
			states.setSelectedStar(data[0]);
			setLoading(LoadState.Loaded);
		}, 5000);
	}, [status, data]);

	function Tween() {
		useFrame(() => {
			TWEEN.update();
		});
		return <></>;
	}

	function onMouseMoveEvent(e: React.MouseEvent<HTMLDivElement>): void {
		var bounds = e.currentTarget.getBoundingClientRect();

		states.pointerPos.x =
			((e.clientX - bounds.left) / (window.innerWidth - bounds.left)) *
				2 -
			1;
		states.pointerPos.y =
			(-(e.clientY - bounds.top) / (window.innerHeight - bounds.top)) *
				2 +
			1;
	}

	if (loading !== LoadState.Loaded) {
		return (
			<Loader
				loading={loading}
				colorFrom="white"
				colorTo="black"
				loadingText="LOADING"
				loadedText="THE GREY BETWEEN"
			/>
		);
	}

	return (
		<div className="starmapContainer">
			<StarMapOverlay />
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
					ref={refs.cameraControlsRef}
					makeDefault
					enablePan={true}
					enableZoom={true}
					enableRotate={true}
					position={[0, 0, 0]}
					minPolarAngle={0}
					maxPolarAngle={Math.PI / 1.75}
				/>
				<Tween />
				<StarMap />
			</Canvas>
		</div>
	);
};
