import React, { Suspense, useMemo, useRef, useState } from "react";
import "./StarMap.css";

import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
	Grid,
	OrbitControls,
	PerspectiveCamera,
	useBounds,
} from "@react-three/drei";
import TWEEN from "@tweenjs/tween.js";
import Stars from "./data/bsc5p_3d.json";
import { StarPoints } from "./StarPoints";

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

// Grid for reference
const Ground = () => {
	const gridConfig = {
		cellSize: 0.5,
		cellThickness: 0.5,
		cellColor: "#6f6f6f",
		sectionSize: 3,
		sectionThickness: 1,
		sectionColor: "#9d4b4b",
		fadeDistance: 20,
		fadeStrength: 1,
		followCamera: false,
		infiniteGrid: true,
	};
	return (
		<Grid position={[0, -0.01, 0]} args={[10.5, 10.5]} {...gridConfig} />
	);
};

// Main canvas
export const StarMap = () => {
	// Refs
	const cameraControlsRef = useRef<any>(null);

	// Raycasting for Point Selection
	const pointerPos = new THREE.Vector2();
	const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

	// const raycaster = new THREE.Raycaster();
	// const camera = new THREE.PerspectiveCamera(0, 16 / 9, 0, 2000);
	// const { raycaster, camera } = useThree();

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

		// pointerPos.x =
		// 	((e.clientX - bounds.left) / (window.innerWidth - bounds.left)) *
		// 		2 -
		// 	1;
		// pointerPos.y =
		// 	(((e.clientY - bounds.top) / (window.innerHeight - bounds.top)) *
		// 		2 -
		// 		1) *
		// 	-1;
	}

	function Tween() {
		useFrame(() => {
			TWEEN.update();
		});
		return <></>;
	}

	// const [colourStates, setColourStates] = useState();

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
			// colour.setHSL(0.01 + 0.1 * (i / Stars.length), 1.0, 0.5);
			colour.toArray(colours, i * 3);
			// const colour = new THREE.Color("#f0f");
			// colours.push(colour);

			// Set sizes
			sizes.push(1);
		}

		// Create buffer attributes
		// const bufferNames = new THREE.BufferAttribute(
		// 	//@ts-ignore
		// 	new Float32Array(starNames),
		// 	1
		// );
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

	const starPointMaterials = new THREE.PointsMaterial({
		color: "white",
		size: 0.1,
		sizeAttenuation: true,
	});

	return (
		<Canvas
			onMouseMove={(e) => {
				onMouseMoveEvent(e);
			}}
		>
			<ambientLight intensity={1} />
			<color attach={"background"} args={["black"]} />
			<Ground />
			<Suspense fallback={null}>
				<StarPoints
					starsBuffer={starsBuffer}
					pointerPos={pointerPos}
					highlightIndex={highlightIndex}
					setHighlightIndex={setHighlightIndex}
					cameraControlsRef={cameraControlsRef}
				/>
			</Suspense>
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
			<PerspectiveCamera />
			<Tween />
			{/* <Star position={[0, 0, 0]} />
			<Planet position={[5, 0, 0]} />
			<Planet position={[-5, 0, 0]} /> */}
		</Canvas>
	);
};
