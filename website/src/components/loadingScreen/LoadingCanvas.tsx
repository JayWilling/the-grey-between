import { OrbitControls, Sphere } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import { CBProps, JSONStar } from "../../interfaces";
import * as THREE from "three";
import { FunctionalCelestialBody } from "../threeJs/Objects/CelestialBody";
import TWEEN from "@tweenjs/tween.js";
import { Star } from "../../models/Star";

export const LoadingCanvas = () => {
	const planetList: CBProps[] = useMemo(() => {
		const tempPlanetList = [];
		for (let i = 0; i < 5; i++) {
			const position = new THREE.Vector3(0 + (i + 5) * 5, 0, 0);
			const tempProps = {
				name: i + " Name",
				description: i + " Name",
				starParent: new Star({
					i: 0,
					n: "Star",
					x: 0,
					y: 0,
					z: 0,
					p: 0,
					N: 0,
				} as JSONStar),
				radius: 0.2,
				orbitRadius: i,
				orbitVelocity: Math.random(),
				colour: "green",
				position: position,
			};

			tempPlanetList.push(tempProps);
		}
		return tempPlanetList;
	}, []);

	function Tween() {
		useFrame(() => {
			TWEEN.update();
		});
		return <></>;
	}

	return (
		<Canvas>
			<Sphere />
			<Tween />
			<OrbitControls
				// ref={cameraControlsRef}
				makeDefault
				enablePan={true}
				enableZoom={true}
				enableRotate={true}
				position={[0, 0, 0]}
				minPolarAngle={0}
				maxPolarAngle={Math.PI / 1.75}
			/>
			{planetList.map((body, index) => {
				return <FunctionalCelestialBody key={index} {...body} />;
			})}
		</Canvas>
	);
};
