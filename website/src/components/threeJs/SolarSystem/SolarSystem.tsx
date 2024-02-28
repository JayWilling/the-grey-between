import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import { JSONStar } from "../../../assets/data/Stars";
import { Star } from "../Objects/Star";
import { Planet } from "../Planet";
import { ThreeEvent, useFrame, useLoader, useThree } from "@react-three/fiber";
import { POSITION_MULTIPLIER } from "../../../pages/StarMap";
import { updateCameraPosition } from "../../../threeJsUtils";
import { useParams } from "react-router-dom";
import {
	CBProps,
	CBState,
	CelestialBody,
	FunctionalCelestialBody,
	getPlanetPosition,
} from "../Objects/CelestialBody";
import { Sphere } from "@react-three/drei";
// import { Points } from "@react-three/drei";

interface SolarSystemProps {
	// starInfo: JSONStar;
	// planetList: string[];
	setShowStarMap: React.Dispatch<React.SetStateAction<boolean>>;
	starData: JSONStar;
	cameraControls: any;
	// updateCameraPosition: (
	// 	target: THREE.Vector3,
	// 	cameraControls: any,
	// 	camera: THREE.Camera,
	// 	distance: number,
	// 	animationTime: number
	// ) => void;
}

interface FabricProps {
	centre: { x: number; y: number; z: number };
	// celestialBodies: CelestialBody[];
	celestialBodies: CBProps[];
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

		for (let zValue = -100; zValue < 100; zValue += 2) {
			for (let xValue = -100; xValue < 100; xValue += 2) {
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
		isRippleCentre: boolean,
		time: number = 0
	): number {
		// Circle
		const x = (currentX - centreX) / 10;
		const z = (currentZ - centreZ) / 10;
		const t = x * x + z * z;

		// Exponential Fall-off
		const expZ = Math.pow(Math.E, -(z * z) / 1);
		const expX = Math.pow(Math.E, -(x * x) / 1);

		// depth provides the depth of the warping (at least the radius of the given celestial object)
		if (isRippleCentre) {
			let cbRipples = 0;
			for (let k = 0; k < props.celestialBodies.length; k++) {
				const planet = props.celestialBodies[k];
				if (planet.starParent == null) {
					return 0;
				}
				const { x, z } = getPlanetPosition(
					planet.starParent.x,
					planet.starParent.z,
					planet.orbitRadius,
					planet.orbitVelocity,
					time
				);
				cbRipples += graphRipple(
					//@ts-ignore
					// props.celestialBodies[k].state.position.x,
					// props.celestialBodies[k].state.position.z,
					// props.celestialBodies[k].state.position[0],
					// props.celestialBodies[k].state.position[2],
					// props.celestialBodies[k].position.x,
					//@ts-ignore
					// props.celestialBodies[k].position.z,
					x,
					z,
					currentX,
					currentZ,
					4,
					false,
					time
				);
				// console.log(props.celestialBodies[k].state.position);
				// cbRipples += graphRipple(30, 30, currentX, currentZ, 4, false);
			}
			return (
				(-flatness * Math.sin(t / 2 + phaseShift)) / waveAmplitude -
				depth * expX * expZ -
				// graphRipple(30, 30, currentX, currentZ, 4, false)
				cbRipples
			);
		}
		// Defines the 'dip' for other celestial bodies
		return (
			(flatness / 10) * Math.sin(t / 2 + phaseShift / 10) +
			depth * expX * expZ
		);
	}

	useFrame((state) => {
		if (warpPointsRef.current === null) {
			return;
		}
		phaseShift -= 0.2;
		if (flatness >= 0) {
			flatness -= 0.04;
		} else {
			// Early exit to avoid re-calculating the fabric
			return;
		}

		// Height ripple from main star
		let index = 0;
		for (let i = -100; i < 100; i += 2) {
			for (let j = -100; j < 100; j += 2) {
				let cbRipples = 0;
				// for (let k = 0; k < props.celestialBodies.length; k++) {
				// 	cbRipples += graphRipple(
				// 		j - props.celestialBodies[k].state.position[0],
				// 		i - props.celestialBodies[k].state.position[2],
				// 		j,
				// 		i,
				// 		props.depth / 2,
				// 		false
				// 	);
				// }

				const height =
					graphRipple(
						props.centre.x,
						props.centre.z,
						j,
						i,
						props.depth,
						true,
						state.clock.getElapsedTime()
					) +
					props.centre.y -
					cbRipples;
				warpPointsRef.current.geometry.attributes.position.array[
					index + 1
				] = height;
				index += 3;
			}
		}
		warpPointsRef.current.geometry.attributes.position.needsUpdate = true;
	});

	// useEffect(() => {
	// 	console.log(props.centre);
	// }, [props]);

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
	const { camera, raycaster } = useThree();
	const newCBRef = useRef<THREE.Mesh | null>(null);

	function onCelestialBodyClick(e: ThreeEvent<MouseEvent>) {
		// Move the camera
		const target = new THREE.Vector3(
			e.eventObject.position.x,
			e.eventObject.position.y,
			e.eventObject.position.z
		);
		updateCameraPosition(target, props.cameraControls, camera, 10, 2000);

		// Animate the Gravity fabric
	}

	// Setup a fake list of planets for the star
	//      This will later be fetched from the back-end
	//      Start with 5 planets

	const planetList: CBProps[] = useMemo(() => {
		const tempPlanetList = [];
		for (let i = 0; i < 5; i++) {
			const position = new THREE.Vector3(
				props.starData.x * POSITION_MULTIPLIER + (i + 5) * 5,
				props.starData.y * POSITION_MULTIPLIER,
				props.starData.z * POSITION_MULTIPLIER
			);
			const tempProps = {
				name: i + " Name",
				description: i + " Name",
				starParent: props.starData,
				radius: 1,
				orbitRadius: (i + 5) * 5,
				orbitVelocity: Math.random(),
				colour: "green",
				position: position,
			};

			tempPlanetList.push(tempProps);
		}
		return tempPlanetList;
	}, []);

	useFrame(() => {
		// Define a raycaster to determine where to place a new celestial body when clicking
		// raycaster.intersectObjects;
		// Cast from mouse screen pos
		// Intersect with plane at the height of star
	});

	// We will then map the planets to be displayed

	return (
		<group>
			{/* <Sphere ref={newCBRef} position={} /> */}
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
			{planetList.map((body, index) => {
				return <FunctionalCelestialBody key={index} {...body} />;
			})}
			<GravityWarp
				centre={{
					x: props.starData.x * POSITION_MULTIPLIER,
					y: props.starData.y * POSITION_MULTIPLIER,
					z: props.starData.z * POSITION_MULTIPLIER,
				}}
				celestialBodies={planetList}
				depth={10}
			/>
		</group>
	);
};
