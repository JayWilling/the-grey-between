import { ThreeElements, useThree } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import { JSONStar } from "../../../assets/data/Stars";
import { Selection } from "@react-three/postprocessing";
import { TestBloom } from "../../../effects/BloomEffect";
import { POSITION_MULTIPLIER } from "../../../pages/StarMap";

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
			props.data.x * POSITION_MULTIPLIER,
			props.data.y * POSITION_MULTIPLIER,
			props.data.z * POSITION_MULTIPLIER
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
				<pointLight intensity={5000} />
				<sphereGeometry args={[5, 16, 16]} />
				{/* <circleGeometry args={[3, 4]} /> */}
				<meshStandardMaterial
					emissive="red"
					emissiveIntensity={10}
					color={hovered ? "hotpink" : "orange"}
				/>
			</mesh>
			<TestBloom />
		</Selection>
	);
};
