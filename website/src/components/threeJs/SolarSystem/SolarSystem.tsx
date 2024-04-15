import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import { TJSStar } from "../Objects/Star";
import { Planet } from "../Planet";
import { ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { POSITION_MULTIPLIER } from "../../../pages/StarMap";
import { updateCameraPosition } from "../../../threeJsUtils";
import { FunctionalCelestialBody } from "../Objects/CelestialBody";
import { CBProps, OverlayState } from "../../../interfaces";
import { Star } from "../../../models/Star";
import { GravityWarp } from "./GravityWarp";
import { Node } from "../../../models/UniverseGraph";
import CameraControls from "camera-controls";
// import { Points } from "@react-three/drei";

interface SolarSystemProps {
	setShowStarMap: React.Dispatch<React.SetStateAction<boolean>>;
	overlayState: OverlayState;
	pointerPos: THREE.Vector2;
	node: Node<Star>;
	cameraControls: any;
}

export const SolarSystem = (props: SolarSystemProps) => {
	const { camera } = useThree();
	const newCBRef = useRef<THREE.Mesh | null>(null);

	const [newCB, setNewCB] = useState<CBProps | null>(null);

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

	// Add celestial body selected
	useEffect(() => {
		if (props.overlayState === OverlayState.CreateCB) {
			setNewCB({
				name: "New celestial body",
				description: "",
				starParent: props.node.data,
				radius: 1,
				orbitRadius: 25,
				orbitVelocity: Math.random(),
				colour: "green",
			});

			// TODO:
			// Add gsap animation for camera offset
			camera.setViewOffset(
				window.innerWidth,
				window.innerHeight,
				window.innerWidth / 4,
				0,
				window.innerWidth,
				window.innerHeight
			);
		} else {
			// Reset the camera offset
			camera.clearViewOffset();
		}
	}, [props.overlayState]);

	// Setup a fake list of planets for the star
	//      This will later be fetched from the back-end
	//      Start with 5 planets

	const planetList: CBProps[] = useMemo(() => {
		// Get planets from node
		const children = props.node.children;
		for (let i = 0; i < props.node.children.length; i++) {
			const currentCB = children[i];
			const position = new THREE.Vector3(
				props.node.data.x * POSITION_MULTIPLIER + currentCB.orbitRadius,
				props.node.data.y * POSITION_MULTIPLIER,
				props.node.data.z * POSITION_MULTIPLIER
			);
			const tempCBProps = {};
		}

		return children;

		// const tempPlanetList = [];
		// for (let i = 0; i < 5; i++) {
		// 	const position = new THREE.Vector3(
		// 		props.node.data.x * POSITION_MULTIPLIER + (i + 5) * 5,
		// 		props.node.data.y * POSITION_MULTIPLIER,
		// 		props.node.data.z * POSITION_MULTIPLIER
		// 	);
		// 	const tempProps = {
		// 		name: i + " Name",
		// 		description: i + " Name",
		// 		starParent: props.node.data,
		// 		radius: 1,
		// 		orbitRadius: (i + 5) * 5,
		// 		orbitVelocity: Math.random(),
		// 		colour: "green",
		// 		position: position,
		// 	};

		// 	tempPlanetList.push(tempProps);
		// }
		// return tempPlanetList;
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
			<TJSStar
				onClick={() => {
					props.setShowStarMap(true);
				}}
				data={props.node.data}
			/>
			<Planet
				onClick={(e) => {
					onCelestialBodyClick(e);
				}}
				position={[
					props.node.data.x * POSITION_MULTIPLIER - 30,
					props.node.data.y * POSITION_MULTIPLIER,
					props.node.data.z * POSITION_MULTIPLIER,
				]}
			/>
			{planetList.map((body, index) => {
				return (
					<FunctionalCelestialBody
						key={index}
						{...{
							...body,
							pointerPos: props.pointerPos,
							cameraControls: props.cameraControls,
						}}
					/>
				);
			})}
			{props.overlayState === OverlayState.CreateCB && newCB ? (
				<FunctionalCelestialBody
					{...{
						...newCB,
						pointerPos: props.pointerPos,
						cameraControls: props.cameraControls,
					}}
				/>
			) : (
				<></>
			)}
			<GravityWarp
				centre={{
					x: props.node.data.x * POSITION_MULTIPLIER,
					y: props.node.data.y * POSITION_MULTIPLIER,
					z: props.node.data.z * POSITION_MULTIPLIER,
				}}
				celestialBodies={planetList}
				depth={10}
			/>
		</group>
	);
};
