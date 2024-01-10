import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import "./StarMap.css";

import * as THREE from "three";
import { useFrame, useThree, useLoader, ThreeEvent } from "@react-three/fiber";
import TWEEN from "@tweenjs/tween.js";
import Stars from "./data/bsc5p_3d.json";
import {
	Selection,
	Select,
	EffectComposer,
	Bloom,
} from "@react-three/postprocessing";
import { Html, Text, Effects } from "@react-three/drei";
import { StarsBufferAttributes } from "./StarMap";
import { TestBloom } from "./BloomEffect";

interface StarPointProps {
	starsBuffer: StarsBufferAttributes;
	pointerPos: THREE.Vector2;
	highlightIndex: number | null;
	setHighlightIndex: React.Dispatch<React.SetStateAction<number | null>>;
	cameraControlsRef: any;
	setShowStarMap: React.Dispatch<React.SetStateAction<boolean>>;
	selectedIndex: number | null;
	setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
	onClickEvent: (e: ThreeEvent<MouseEvent>) => void;
	pointsRef: React.RefObject<THREE.Points>;
}

export const StarPoints = (props: StarPointProps) => {
	const { gl, scene, raycaster, camera } = useThree();
	// let intersectIndex: number | null = null;

	// Define Point Materials
	const vertexShaderText = `
    attribute float size;
    attribute vec3 customColor;

    varying vec3 vColor;
    varying vec2 vUv;

    void main() {

        vColor = customColor;

        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

        gl_PointSize = 3.0 + size * (300.0 / -mvPosition.z);

        gl_Position = projectionMatrix * mvPosition;

        vUv = uv;

    }`;

	const temp = "gl_PointSize = 0.1 + size * ( 300.0 / -mvPosition.z );";
	const fragmentShaderText = `
    uniform vec3 color;
    uniform sampler2D pointTexture;
    uniform sampler2D bloomTexture;
    uniform sampler2D baseTexture;
    uniform float alphaTest;

    varying vec3 vColor;
    varying vec2 vUv;

    void main() {

        gl_FragColor = vec4( color * vColor, 1.0 );

        gl_FragColor = gl_FragColor * ( texture2D( pointTexture, gl_PointCoord ) + vec4(0.5));

        if ( gl_FragColor.a < alphaTest ) discard;

    }`;
	const tempFrag = `gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );`;
	const discTexture = useLoader(THREE.TextureLoader, "bigDisc.png");
	const pointMaterial = useMemo(
		() => ({
			uniforms: {
				color: { value: new THREE.Color(0xffffff) },
				pointTexture: {
					value: discTexture,
				},
				alphaTest: { value: 0.9 },
			},
			vertexShader: vertexShaderText,
			fragmentShader: fragmentShaderText,
		}),
		[]
	);
	// const pointsRef = useRef<THREE.Points>(null);

	// Connecting lines
	const linesRef = useRef<THREE.LineSegments>(null);
	const lineMaterial = useMemo(
		() => ({
			vertexColors: true,
			blending: THREE.AdditiveBlending,
			transparent: true,
		}),
		[]
	);
	const linesBuffer = useMemo(() => {
		// Define arrays for line positions and colours

		const linePositions = new Float32Array(
			props.starsBuffer.positions.array.length
		);
		const lineColours = new Float32Array(
			props.starsBuffer.positions.array.length
		);

		// Loop over the known/near stars
		const minDistance = 50;
		const maxConnections = 8;
		let currentConnections = 0;
		let vertexPos = 0;
		let colourPos = 0;
		const nearStars = props.starsBuffer.positions.array;
		// for (let i = 0; i < nearStars.length; i++) {
		// 	// For each star, check for nearby stars
		// 	for (let j = 0; j < nearStars.length; j++) {
		// 		const dx = nearStars[i * 3] - nearStars[j * 3];
		// 		const dy = nearStars[i * 3 + 1] - nearStars[j * 3 + 1];
		// 		const dz = nearStars[i * 3 + 2] - nearStars[j * 3 + 2];
		// 		const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

		// 		if (
		// 			distance < minDistance &&
		// 			vertexPos < nearStars.length * 3 &&
		// 			currentConnections < maxConnections
		// 		) {
		// 			currentConnections++;
		// 			const alpha = 1.0 - distance / minDistance;
		// 			// Add the new line segment start
		// 			linePositions[vertexPos++] = nearStars[i * 3];
		// 			linePositions[vertexPos++] = nearStars[i * 3 + 1];
		// 			linePositions[vertexPos++] = nearStars[i * 3 + 2];
		// 			// Add the new line segment end
		// 			linePositions[vertexPos++] = nearStars[j * 3];
		// 			linePositions[vertexPos++] = nearStars[j * 3 + 1];
		// 			linePositions[vertexPos++] = nearStars[j * 3 + 2];
		// 			// Add the line segment colour
		// 			lineColours[colourPos++] = alpha;
		// 			lineColours[colourPos++] = alpha;
		// 			lineColours[colourPos++] = alpha;
		// 		}
		// 	}
		// 	currentConnections = 0;
		// }

		// Create the buffer attributes
		const linePositionsAttribute = new THREE.BufferAttribute(
			linePositions,
			3
		).setUsage(THREE.StaticDrawUsage);
		const lineColoursAttribute = new THREE.BufferAttribute(
			lineColours,
			3
		).setUsage(THREE.StaticDrawUsage);
		return {
			positions: linePositionsAttribute,
			colours: lineColoursAttribute,
		};
	}, []);

	// Highlight Sphere
	const sphereRef = useRef<THREE.Mesh>(null);
	const selectedStarLabelRef = useRef<THREE.Mesh>(null);
	let starName = "Sol";

	// Handle star select
	// function onClickEvent(e: ThreeEvent<MouseEvent>): void {
	// 	const points = pointsRef.current;
	// 	const starLabel = selectedStarLabelRef.current;
	// 	if (
	// 		points === null ||
	// 		props.highlightIndex === null ||
	// 		starLabel === null
	// 	) {
	// 		return;
	// 	}

	// 	const positions = points.geometry.attributes.position.array;
	// 	const x = positions[props.highlightIndex * 3];
	// 	const y = positions[props.highlightIndex * 3 + 1];
	// 	const z = positions[props.highlightIndex * 3 + 2];

	// 	// Tween to new target
	// 	updateCameraPosition(x, y, z);

	// 	// Update the selected star
	// 	props.setSelectedIndex(props.highlightIndex);

	// 	// Move the text object and type out the selected star name
	// 	//@ts-ignore
	// 	// starName = props.starsBuffer.names[props.highlightIndex];
	// 	// console.log(starName);
	// 	// const newNameLabel = new CSS2
	// 	// starLabel.position.set(targetPos.x + 1, targetPos.y - 1, targetPos.z);
	// }

	// function updateCameraPosition(x: number, y: number, z: number): void {
	// 	const orbitControls = props.cameraControlsRef.current;
	// 	const oldPos = camera.position;
	// 	const targetPos = new THREE.Vector3(x, y, z);

	// 	if (orbitControls === null) return;

	// 	if (props.highlightIndex != props.selectedIndex) {
	// 		new TWEEN.Tween(orbitControls.target)
	// 			.to(targetPos, 2000)
	// 			.easing(TWEEN.Easing.Cubic.Out)
	// 			.start();

	// 		// Tween to new camera location
	// 		//   -  Point in-between old and new position
	// 		//
	// 		// Get unit vector
	// 		const unitVector = new THREE.Vector3();
	// 		unitVector.subVectors(oldPos, targetPos).normalize();
	// 		const newPos = new THREE.Vector3(
	// 			targetPos.x + unitVector.x * 10,
	// 			targetPos.y + unitVector.y * 10,
	// 			targetPos.z + unitVector.z * 10
	// 		);

	// 		new TWEEN.Tween(camera.position)
	// 			.to(newPos, 2500)
	// 			.easing(TWEEN.Easing.Cubic.Out)
	// 			.start();
	// 	} else {
	// 		props.setShowStarMap(false);
	// 	}
	// }

	// Perform per-frame actions
	useFrame((state, delta, xrFrame) => {
		// Handle stars mouseover
		const points = props.pointsRef.current;
		const highlightSphere = sphereRef.current;
		let tempHighlightIndex = props.highlightIndex;

		if (points === null || highlightSphere === null) {
			return;
		}

		// Points geometry
		const geometry = points.geometry;
		const attributes = geometry.attributes;

		// Sphere geometry
		// highlightSphere.position;

		raycaster.setFromCamera(props.pointerPos, camera);
		const intersectedObjs = raycaster.intersectObject(points);

		if (intersectedObjs.length > 0) {
			if (
				tempHighlightIndex == null &&
				intersectedObjs[0].index &&
				tempHighlightIndex != intersectedObjs[0].index
			) {
				tempHighlightIndex = intersectedObjs[0].index;
				attributes.size.array[tempHighlightIndex] = 3;
				attributes.size.needsUpdate = true;

				// Show highlight sphere
				const x = attributes.position.array[tempHighlightIndex * 3];
				const y = attributes.position.array[tempHighlightIndex * 3 + 1];
				const z = attributes.position.array[tempHighlightIndex * 3 + 2];

				highlightSphere.position.set(x, y, z);

				// Move camera
				// camera.lookAt(x, y, z);
			}
		} else if (tempHighlightIndex !== null) {
			attributes.size.array[tempHighlightIndex] = 2;
			attributes.size.needsUpdate = true;
			tempHighlightIndex = null;
		}
		props.setHighlightIndex(tempHighlightIndex);
	});

	if (Stars == null) {
		return <></>;
	}
	return (
		<Selection enabled>
			<points
				ref={props.pointsRef}
				onClick={(e) => {
					props.onClickEvent(e);
				}}
			>
				<bufferGeometry>
					<bufferAttribute
						attach={"attributes-position"}
						{...props.starsBuffer.positions}
					/>
					<bufferAttribute
						attach={"attributes-customColor"}
						{...props.starsBuffer.colours}
					/>
					<bufferAttribute
						attach={"attributes-size"}
						{...props.starsBuffer.sizes}
					/>
					{/* <bufferAttribute attach={"attrbiutes-material"} /> */}
				</bufferGeometry>
				{/* <pointsMaterial
					size={0.5}
					color={0xff00ff}
					sizeAttenuation={true}
				/> */}
				<shaderMaterial attach={"material"} {...pointMaterial} />
			</points>
			{/* <Html
				as="span"
				style={{
					fontSize: "1.5em",
				}}
				transform
				occlude="blending"
				castShadow
				receiveShadow
				wrapperClass="starLabel"
			>
				Some star
				<h1
					style={{
						margin: 0,
						background: "red",
						borderRadius: "20px",
						color: "black",
					}}
				>
					Some star
				</h1>
			</Html> */}
			<Text anchorX={"left"} anchorY={"top"} ref={selectedStarLabelRef}>
				{starName}
			</Text>
			{/* <lineSegments>
				<bufferGeometry>
					<bufferAttribute
						attach={"attributes-position"}
						{...linesBuffer.positions}
					/>
					<bufferAttribute
						attach={"attributes-color"}
						{...linesBuffer.colours}
					/>
				</bufferGeometry>
				<lineBasicMaterial
					// attach={"material"}
					// {...lineMaterial}
					vertexColors={true}
					blending={THREE.AdditiveBlending}
					transparent={true}
				/>
			</lineSegments> */}
			<mesh ref={sphereRef}>
				<sphereGeometry args={[0.7, 16, 16]} />
				<meshStandardMaterial
					color={"red"}
					wireframe
					emissive={"red"}
					emissiveIntensity={4}
					toneMapped={false}
				/>
			</mesh>
			<TestBloom />
		</Selection>
	);
};
