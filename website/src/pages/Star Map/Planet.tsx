import {
	MeshProps,
	ThreeElements,
	ThreeEvent,
	useThree,
} from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";

interface PlanetProps extends MeshProps {
	onClick: (e: ThreeEvent<MouseEvent>) => void;
}

export const Planet = (props: PlanetProps) => {
	const ref = useRef<THREE.Mesh>(null!);
	const [clicked, setClicked] = useState<boolean>(false);
	const [hovered, setHovered] = useState<boolean>(false);
	// useFrame((state, delta) => (ref.current.rotation.x += delta));

	return (
		<mesh
			{...props}
			ref={ref}
			// scale={clicked ? 1.5 : 1}
			onClick={(event: any) => props.onClick(event)}
			onPointerOver={(event) => setHovered(true)}
			onPointerOut={(event) => setHovered(false)}
		>
			<sphereGeometry args={[1, 16, 16]} />
			<meshStandardMaterial color={hovered ? "hotpink" : "green"} />
		</mesh>
	);
};
