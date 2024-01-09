import { ThreeElements, useThree } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";

export const Star = (props: ThreeElements["mesh"]) => {
	const ref = useRef<THREE.Mesh>(null!);
	const [clicked, setClicked] = useState<boolean>(false);
	const [hovered, setHovered] = useState<boolean>(false);

	const camera = useThree((state) => state.camera);
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
			<sphereGeometry args={[100, 16, 16]} />
			{/* <circleGeometry args={[3, 4]} /> */}
			<meshStandardMaterial
				emissive="red"
				emissiveIntensity={20}
				color={hovered ? "hotpink" : "orange"}
			/>
		</mesh>
	);
};
