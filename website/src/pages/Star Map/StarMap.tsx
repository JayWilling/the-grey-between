import React, { useRef, useState } from "react";
import "./StarMap.css";

import * as THREE from "three";
import { Canvas, useFrame, useThree, ThreeElements } from "@react-three/fiber";
import { Bounds, OrbitControls, useBounds } from "@react-three/drei";

// Create a component
const Star = (props: ThreeElements["mesh"]) => {
	const ref = useRef<THREE.Mesh>(null!);
	const [clicked, setClicked] = useState<boolean>(false);
	const [hovered, setHovered] = useState<boolean>(false);
	// useFrame((state, delta) => (ref.current.rotation.x += delta));

	return (
		<mesh
			{...props}
			ref={ref}
			// scale={clicked ? 1.5 : 1}
			onClick={(event: any) => setClicked(!clicked)}
			onPointerOver={(event) => setHovered(true)}
			onPointerOut={(event) => setHovered(false)}
		>
			<pointLight position={props.position} intensity={100} />
			<sphereGeometry args={[1, 16, 16]} />
			<meshStandardMaterial
				emissive="red"
				emissiveIntensity={20}
				color={hovered ? "hotpink" : "orange"}
			/>
		</mesh>
	);
};

const Planet = (props: ThreeElements["mesh"]) => {
	const ref = useRef<THREE.Mesh>(null!);
	const [clicked, setClicked] = useState<boolean>(false);
	const [hovered, setHovered] = useState<boolean>(false);
	// useFrame((state, delta) => (ref.current.rotation.x += delta));

	return (
		<mesh
			{...props}
			ref={ref}
			// scale={clicked ? 1.5 : 1}
			onClick={(event: any) => setClicked(!clicked)}
			onPointerOver={(event) => setHovered(true)}
			onPointerOut={(event) => setHovered(false)}
		>
			<sphereGeometry args={[1, 16, 16]} />
			<meshStandardMaterial color={hovered ? "hotpink" : "green"} />
		</mesh>
	);
};

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

// Main canvas
export const StarMap = () => {
	return (
		<Canvas>
			<ambientLight intensity={0.4} />
			{/* <pointLight position={[10, 10, 10]} /> */}
			<color attach={"background"} args={["black"]} />
			<OrbitControls
				makeDefault
				enablePan={true}
				enableZoom={true}
				enableRotate={true}
				position={[-5, 0, 0]}
				minPolarAngle={0}
				maxPolarAngle={Math.PI / 1.75}
			/>
			<Bounds fit clip observe margin={5}>
				<SelectToZoom>
					<Star position={[0, 0, 0]} />
					<Planet position={[5, 0, 0]} />
					<Planet position={[-5, 0, 0]} />
				</SelectToZoom>
			</Bounds>
		</Canvas>
	);
};
