import React, { Suspense, useMemo, useRef, useState } from "react";
import "./StarMap.css";

import * as THREE from "three";
import { Canvas, ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import {
	Grid,
	OrbitControls,
	PerspectiveCamera,
	useBounds,
} from "@react-three/drei";
import TWEEN from "@tweenjs/tween.js";
import Stars from "./data/bsc5p_3d.json";
import { StarPoints } from "./StarPoints";
import { SolarSystem } from "./SolarSystem";

// Interfaces & Types

export interface JSONStar extends SharedArrayBuffer {
	i: number;
	n: string | null;
	x: number | null;
	y: number | null;
	z: number | null;
	p: number | null;
	N: number | null;
	K?: undefined | RGBColours;
}

interface RGBColours {
	r: number;
	g: number;
	b: number;
}

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
}

interface StarMapProps {
	pointerPos: THREE.Vector2;
	cameraControlsRef: React.MutableRefObject<any>;
}

// Main canvas
export const StarMap = (props: StarMapProps) => {
	const { gl, scene, raycaster, camera } = useThree();

	// Refs
	const pointsRef = useRef<THREE.Points>(null);

	// States
	const [showStarMap, setShowStarMap] = useState<boolean>(false);

	// Raycasting for Point Selection
	const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
	const [selectedStar, setSelectedStar] = useState<JSONStar | null>(null);

	// const raycaster = new THREE.Raycaster();
	// const camera = new THREE.PerspectiveCamera(0, 16 / 9, 0, 2000);
	// const { raycaster, camera } = useThree();

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

		console.log(x, y, z);

		// Tween to new target
		updateCameraPosition(x, y, z);

		// Update the selected star
		setSelectedIndex(highlightIndex);

		// Move the text object and type out the selected star name
		//@ts-ignore
		// starName = props.starsBuffer.names[props.highlightIndex];
		// console.log(starName);
		// const newNameLabel = new CSS2
		// starLabel.position.set(targetPos.x + 1, targetPos.y - 1, targetPos.z);
	}

	function updateCameraPosition(x: number, y: number, z: number): void {
		const orbitControls = props.cameraControlsRef.current;
		const oldPos = camera.position;
		const targetPos = new THREE.Vector3(x, y, z);

		if (orbitControls === null) return;

		if (highlightIndex != selectedIndex) {
			new TWEEN.Tween(orbitControls.target)
				.to(targetPos, 2000)
				.easing(TWEEN.Easing.Cubic.Out)
				.start();

			// Tween to new camera location
			//   -  Point in-between old and new position
			//
			// Get unit vector
			const unitVector = new THREE.Vector3();
			unitVector.subVectors(oldPos, targetPos).normalize();
			const newPos = new THREE.Vector3(
				targetPos.x + unitVector.x * 10,
				targetPos.y + unitVector.y * 10,
				targetPos.z + unitVector.z * 10
			);

			new TWEEN.Tween(camera.position)
				.to(newPos, 2500)
				.easing(TWEEN.Easing.Cubic.Out)
				.start();
		} else {
			setShowStarMap(false);
		}
	}

	const starsBuffer = useMemo(() => {
		const starNames: string[] = [];
		const starVertices = [];
		const colours: number[] = [];
		const sizes: number[] = [];
		const colour = new THREE.Color();

		const mult = 3;
		for (var i = 0; i < Stars.length; i++) {
			// Set name
			starNames.push(Stars[i].n);

			// Set position
			const x = Stars[i].x;
			const y = Stars[i].y;
			const z = Stars[i].z;
			if (x != null && y != null && z != null) {
				starVertices.push(x * mult, y * mult, z * mult);
			}

			// Set colour
			const tempColour = Stars[i].K;
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
		return {
			names: starNames,
			positions: bufferVertices,
			colours: bufferColours,
			sizes: bufferSizes,
		};
		// return new THREE.BufferAttribute(new Float32Array(starVertices), 3);
	}, [Stars]);

	return (
		// <Canvas
		// 	onMouseMove={(e) => {
		// 		onMouseMoveEvent(e);
		// 	}}
		// >
		<Suspense fallback={null}>
			{showStarMap || selectedIndex === null || selectedStar === null ? (
				<StarPoints
					starsBuffer={starsBuffer}
					pointerPos={props.pointerPos}
					highlightIndex={highlightIndex}
					setHighlightIndex={setHighlightIndex}
					cameraControlsRef={props.cameraControlsRef}
					setShowStarMap={setShowStarMap}
					selectedIndex={selectedIndex}
					setSelectedIndex={setSelectedIndex}
					onClickEvent={onStarClick}
					pointsRef={pointsRef}
				/>
			) : (
				<SolarSystem
					starData={selectedStar}
					setShowStarMap={setShowStarMap}
				/>
			)}
		</Suspense>

		// </Canvas>
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
	const pointerPos = new THREE.Vector2();

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

	const newCam = new THREE.PerspectiveCamera(
		40,
		window.innerWidth / window.innerHeight,
		5000
	);

	return (
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
				pointerPos={pointerPos}
				cameraControlsRef={cameraControlsRef}
			/>
		</Canvas>
	);
};
