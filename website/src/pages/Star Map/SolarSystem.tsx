import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import { JSONStar } from "./data/Stars";
import { Star } from "./Star";
import { Planet } from "./Planet";
import { ThreeEvent, useFrame, useLoader } from "@react-three/fiber";
import { POSITION_MULTIPLIER } from "./StarMap";
// import { Points } from "@react-three/drei";

interface SolarSystemProps {
	// starInfo: JSONStar;
	// planetList: string[];
	setShowStarMap: React.Dispatch<React.SetStateAction<boolean>>;
	starData: JSONStar;
	updateCameraPosition: (x: number, y: number, z: number) => void;
}

interface FabricProps {
	centre: { x: number; y: number; z: number };
	depth: number;
}

function onStarClick() {}

// Gravitational fabric
const GravityWarp = (props: FabricProps) => {
	// Material
	const discTexture = useLoader(THREE.TextureLoader, "bigDisc.png");

	// Define a set of *infinite* points
	const warpPointsRef = useRef<THREE.Points>(null);

	// Define variables for animation
	let waveAmplitude = 5;
	let phaseShift = 1;
	let flatness = 5;
	const warpPoints = useMemo(() => {
		const vertices: number[] = [];

		for (let zValue = -50; zValue < 50; zValue++) {
			for (let xValue = -50; xValue < 50; xValue++) {
				const newX = props.centre.x + xValue;
				const newZ = props.centre.z + zValue;

				const height = graphRipple(
					props.centre.x,
					props.centre.z,
					xValue,
					zValue,
					props.depth,
					true
				);

				vertices.push(newX);
				vertices.push(height + props.centre.y);
				vertices.push(newZ);
			}
		}
		const vertexBuffer = new THREE.BufferAttribute(
			new Float32Array(vertices),
			3
		);
		return { position: vertexBuffer };
	}, []);

	function graphRipple(
		centreX: number,
		centreZ: number,
		currentX: number,
		currentZ: number,
		depth: number,
		isRippleCentre: boolean
	): number {
		// Circle
		const x = currentX / 10;
		const z = currentZ / 10;
		const t = x * x + z * z;

		// Exponential Fall-off
		const expZ = Math.pow(Math.E, -(z * z) / 1);
		const expX = Math.pow(Math.E, -(x * x) / 1);

		// depth provides the depth of the warping (at least the radius of the given celestial object)
		if (isRippleCentre) {
			return (
				(-flatness * Math.sin(t / 2 + phaseShift)) / waveAmplitude -
				depth * expX * expZ -
				graphRipple(3, 3, currentX, currentZ, 4, false)
			);
		}
		// Defines the 'dip' for other celestial bodies
		return (
			(flatness / 10) * Math.sin(t / 2 + phaseShift / 10) +
			depth * expX * expZ
		);
	}

	useFrame(() => {
		if (warpPointsRef.current === null) {
			return;
		}
		phaseShift -= 0.2;
		if (flatness >= 0) {
			flatness -= 0.04;
		}

		// Height ripple from main star
		let index = 0;
		for (let i = -50; i < 50; i++) {
			for (let j = -50; j < 50; j++) {
				const height =
					graphRipple(
						props.centre.x,
						props.centre.z,
						j,
						i,
						props.depth,
						true
					) + props.centre.y;
				warpPointsRef.current.geometry.attributes.position.array[
					index + 1
				] = height;
				index += 3;
			}
		}
		warpPointsRef.current.geometry.attributes.position.needsUpdate = true;
	});

	useEffect(() => {
		console.log(props.centre);
	}, [props]);

	return (
		<points ref={warpPointsRef}>
			<bufferGeometry>
				<bufferAttribute
					attach={"attributes-position"}
					{...warpPoints.position}
				></bufferAttribute>
			</bufferGeometry>
			<pointsMaterial
				size={0.2}
				color={0x6fa8dc}
				sizeAttenuation={true}
				map={discTexture}
			/>
		</points>
	);
};

export const SolarSystem = (props: SolarSystemProps) => {
	// Planet list

	// let centre = {
	// 	x: 0,
	// 	y: 0,
	// 	z: 0,
	// };
	// if (props.starData) {
	// 	centre = {
	// 		x: props.starData.x || 0,
	// 		y: props.starData.y || 0,
	// 		z: props.starData.z || 0,
	// 	};
	// }

	// const [cameraTargetPosition, setCameraTargetPosition] = useState<{ x: number; y: number; z: number }>({
	// 				x: props.starData.x,
	// 				y: props.starData.y,
	// 				z: props.starData.z,
	// 			}
	// );

	function onCelestialBodyClick(e: ThreeEvent<MouseEvent>) {
		// Get the position of the object
		// Update the centre position
		// centre = {
		// 	x: e.eventObject.position.x,
		// 	y: e.eventObject.position.y,
		// 	z: e.eventObject.position.z,
		// };
		// setCameraTargetPosition({
		// 	x: e.eventObject.position.x,
		// 	y: e.eventObject.position.y,
		// 	z: e.eventObject.position.z,
		// });

		// Move the camera
		props.updateCameraPosition(
			e.eventObject.position.x,
			e.eventObject.position.y,
			e.eventObject.position.z
		);

		// Animate the Gravity fabric
	}

	console.log();

	return (
		<group>
			<Star
				onClick={() => {
					props.setShowStarMap(true);
				}}
				data={props.starData}
			/>
			<Planet
				onClick={(e) => {
					onCelestialBodyClick(e);
				}}
				position={[
					props.starData.x * POSITION_MULTIPLIER - 30,
					props.starData.y * POSITION_MULTIPLIER,
					props.starData.z * POSITION_MULTIPLIER,
				]}
			/>
			<GravityWarp
				centre={{
					x: props.starData.x * POSITION_MULTIPLIER,
					y: props.starData.y * POSITION_MULTIPLIER,
					z: props.starData.z * POSITION_MULTIPLIER,
				}}
				depth={10}
			/>
		</group>
	);
};
