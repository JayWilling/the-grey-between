import { ThreeElements, useThree } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import { JSONStar } from "./StarMap";

interface StarProps {
	// meshProps: ThreeElements["mesh"];
	onClick: () => void;
	position: number[];
	data: JSONStar;
}

export const Star = (props: StarProps) => {
	const ref = useRef<THREE.Mesh>(null!);
	const [clicked, setClicked] = useState<boolean>(false);
	const [hovered, setHovered] = useState<boolean>(false);

	let starPos = { x: 0, y: 0, z: 0 };
	if (props.data.x != null && props.data.y != null && props.data.z != null) {
		starPos = { x: props.data.x, y: props.data.y, z: props.data.z };
	}

	return (
		<mesh
			ref={ref}
			// scale={clicked ? 1.5 : 1}
			onClick={(event: any) => props.onClick()}
			onPointerOver={(event) => setHovered(true)}
			onPointerOut={(event) => setHovered(false)}
		>
			<pointLight
				position={new THREE.Vector3(starPos.x, starPos.y, starPos.z)}
				intensity={1000}
			/>
			<sphereGeometry args={[5, 16, 16]} />
			{/* <circleGeometry args={[3, 4]} /> */}
			<meshStandardMaterial
				emissive="red"
				emissiveIntensity={500}
				color={hovered ? "hotpink" : "orange"}
			/>
		</mesh>
	);
};
