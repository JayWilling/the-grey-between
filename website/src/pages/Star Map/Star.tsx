import { ThreeElements, useThree } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import { JSONStar } from "./data/Stars";
import { Selection } from "@react-three/postprocessing";
import { TestBloom } from "./BloomEffect";

interface StarProps {
	// meshProps: ThreeElements["mesh"];
	onClick: () => void;
	data: JSONStar | null;
}

export const Star = (props: StarProps) => {
	const ref = useRef<THREE.Mesh>(null!);
	const [clicked, setClicked] = useState<boolean>(false);
	const [hovered, setHovered] = useState<boolean>(false);
	let starPos = new THREE.Vector3(0, 0, 0);
	if (props.data && props.data.x && props.data.y && props.data.z) {
		starPos = new THREE.Vector3(
			props.data.x * 3,
			props.data.y * 3,
			props.data.z * 3
		);
	}

	return (
		<Selection enabled>
			<mesh
				ref={ref}
				// scale={clicked ? 1.5 : 1}
				onClick={(event: any) => props.onClick()}
				onPointerOver={(event) => setHovered(true)}
				onPointerOut={(event) => setHovered(false)}
				position={starPos}
			>
				<pointLight position={starPos} intensity={1000} />
				<sphereGeometry args={[5, 16, 16]} />
				{/* <circleGeometry args={[3, 4]} /> */}
				<meshStandardMaterial
					emissive="red"
					emissiveIntensity={5}
					color={hovered ? "hotpink" : "orange"}
				/>
			</mesh>
			<TestBloom />
		</Selection>
	);
};
