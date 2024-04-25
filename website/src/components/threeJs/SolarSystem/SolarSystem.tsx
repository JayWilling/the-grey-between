import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
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
import { IStarMapContext, StarMapContext } from "../../../pages/StarMapContext";
// import { Points } from "@react-three/drei";

interface SolarSystemProps {
	cameraControls: any;
}

export const SolarSystem = (props: SolarSystemProps) => {
	const { camera } = useThree();
	const newCBRef = useRef<THREE.Mesh | null>(null);

	const [newCB, setNewCB] = useState<CBProps | null>(null);

	const { states, formValues } = useContext(
		StarMapContext
	) as IStarMapContext;

	function onCelestialBodyClick(e: ThreeEvent<MouseEvent>) {
		// Move the camera
		const target = new THREE.Vector3(
			e.eventObject.position.x,
			e.eventObject.position.y,
			e.eventObject.position.z
		);
		updateCameraPosition(target, props.cameraControls, camera, 10, 2000);
	}

	// Add celestial body selected
	useEffect(() => {
		if (
			states.overlayState === OverlayState.CreateCB &&
			states.currentNode
		) {
			formValues.setCelestialBodyData({
				name: "New celestial body",
				description: "",
				starParent: states.currentNode.data,
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
	}, [states.overlayState]);

	// Setup a fake list of planets for the star
	//      This will later be fetched from the back-end
	//      Start with 5 planets

	const planetList: CBProps[] = useMemo(() => {
		// Get planets from node

		if (!states.currentNode) return [];

		const children = states.currentNode.children;
		for (let i = 0; i < states.currentNode.children.length; i++) {
			const currentCB = children[i];
			const position = new THREE.Vector3(
				states.currentNode.data.x * POSITION_MULTIPLIER +
					currentCB.orbitRadius,
				states.currentNode.data.y * POSITION_MULTIPLIER,
				states.currentNode.data.z * POSITION_MULTIPLIER
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

	if (!states.currentNode) return <group></group>;

	return (
		<group>
			{/* <Sphere ref={newCBRef} position={} /> */}
			<TJSStar
				onClick={() => {
					states.setShowStarMap(true);
				}}
				data={states.currentNode.data}
			/>
			<Planet
				onClick={(e) => {
					onCelestialBodyClick(e);
				}}
				position={[
					states.currentNode.data.x * POSITION_MULTIPLIER - 30,
					states.currentNode.data.y * POSITION_MULTIPLIER,
					states.currentNode.data.z * POSITION_MULTIPLIER,
				]}
			/>
			{planetList.map((body, index) => {
				return (
					<FunctionalCelestialBody
						key={index}
						{...{
							...body,
							pointerPos: states.pointerPos,
							cameraControls: props.cameraControls,
							celestialBodyData: formValues.celestialBodyData,
							setCelestialBodyData:
								formValues.setCelestialBodyData,
						}}
					/>
				);
			})}
			{states.overlayState === OverlayState.CreateCB &&
			formValues.celestialBodyData ? (
				<FunctionalCelestialBody
					{...{
						...formValues.celestialBodyData,
						pointerPos: states.pointerPos,
						cameraControls: props.cameraControls,
						celestialBodyData: formValues.celestialBodyData,
						setCelestialBodyData: formValues.setCelestialBodyData,
					}}
				/>
			) : (
				<></>
			)}
			<GravityWarp
				centre={{
					x: states.currentNode.data.x * POSITION_MULTIPLIER,
					y: states.currentNode.data.y * POSITION_MULTIPLIER,
					z: states.currentNode.data.z * POSITION_MULTIPLIER,
				}}
				celestialBodies={planetList}
				depth={10}
			/>
		</group>
	);
};
