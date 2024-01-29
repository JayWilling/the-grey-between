import { MeshProps, ThreeElements, useFrame } from "@react-three/fiber";
import React, { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Object3D } from "three";
import { JSONStar } from "./data/Stars";
import { Line, Trail } from "@react-three/drei";
import { POSITION_MULTIPLIER } from "./StarMap";

type CelestialBodyType = "Planet" | "Moon" | "Asteroid" | "AsteroidBelt";

export interface CelestialBodyI {
	name: string;
	description: string;
	radius: number;
	orbitRadius: number;
	colour: string;
}

export interface CBProps extends MeshProps {
	name: string;
	description: string;
	starParent: JSONStar;
	radius: number;
	orbitRadius: number;
	orbitVelocity: number;
	colour: string;
}

export interface CBState {
	name: string;
	description: string;
	parent: JSONStar;
	radius: number;
	orbitRadius: number;
	colour: string;
	hovered: boolean;
	selected: boolean;
	position: [number, number, number];
}

export class CelestialBody extends React.Component<CBProps, CBState> {
	constructor(props: CBProps) {
		super(props);

		// Set the state
		this.state = {
			name: this.props.name,
			description: this.props.description,
			parent: this.props.starParent,
			radius: this.props.radius,
			orbitRadius: this.props.orbitRadius,
			colour: this.props.colour,
			hovered: false,
			selected: false,
			// @ts-ignore
			position: this.props.position,
		};
	}

	updatePosition(time: number) {
		const x = this.state.parent.x + this.state.orbitRadius * Math.cos(time);
		const z = this.state.parent.z + this.state.orbitRadius * Math.sin(time);
		console.log(x);
		this.setState({
			...this.state,
			position: [x, this.state.parent.y, z],
		});
	}

	render() {
		// useFrame((state, delta) => {
		// 	const x = Math.sqrt(
		// 		this.state.orbitRadius -
		// 			Math.pow(this.state.parent.y + delta, 2)
		// 	);
		// 	const y = Math.sqrt(
		// 		this.state.orbitRadius - Math.pow(this.state.parent.x, 2)
		// 	);
		// 	const z = Math.sqrt(this.state.parent.z);
		// 	this.setState({ ...this.state, position: [x, y, z] });
		// });

		return (
			<mesh position={this.props.position}>
				<sphereGeometry args={[1, 16, 16]} />
				<meshStandardMaterial
					color={this.state.hovered ? "hotpink" : "green"}
				/>
				{/* <CelestialBodyFrameLogic
					state={this.state}
					setState={this.setState}
				/> */}
			</mesh>
		);
	}

	toJSON() {
		return {
			name: this.state.name,
			description: this.state.description,
			radius: this.state.radius,
			orbitRadius: this.state.orbitRadius,
			colour: this.state.colour,
		};
	}
}

// interface LogicProps {
// 	state: CBState;
// 	setState: ({}) => void;
//     // name: string;
// }

export function getPlanetPosition(
	cx: number,
	cz: number,
	radius: number,
	velocity: number,
	time: number
): { x: number; z: number } {
	const t = (time * velocity) / 2;

	const x = cx + radius * Math.sin(t);
	const z = cz + radius * Math.cos(t);
	return { x, z };
}

export const FunctionalCelestialBody = (props: CBProps) => {
	// const [name, setName] = useState<string>(props.name);
	// const [description, setDescription] = useState<string>(props.description);
	// const [radius, setRadius] = useState<number>(props.radius);
	// const [orbitRadius, setOrbitRadius] = useState<number>(props.orbitRadius);
	// const [colour, setColour] = useState<string>(props.colour);
	const [hovered, setHovered] = useState<boolean>(false);
	// const [position, setPosition] = useState<[number, number, number]>([
	// 	0, 0, 0,
	// ]);

	const meshRef = useRef<THREE.Mesh | null>(null);

	const orbitPoints = useMemo(
		() =>
			new THREE.EllipseCurve(
				// props.starParent.x * POSITION_MULTIPLIER,
				// props.starParent.y * POSITION_MULTIPLIER,
				0,
				0,
				props.orbitRadius,
				props.orbitRadius,
				0,
				2 * Math.PI,
				false,
				0.5 * Math.PI
			).getPoints(100),
		[]
	);

	// const celestialBodyBuffer = useMemo(() => {
	// 	const pos = [];

	// 	pos.push(0);
	// 	pos.push(0);
	// 	pos.push(0);

	// 	const positionBuffer = new THREE.BufferAttribute(
	// 		new Float32Array(pos),
	// 		1
	// 	);
	// 	return {
	// 		position: positionBuffer,
	// 	};
	// }, []);

	let position: [number, number, number] = [0, 0, 0];
	let t = 0;

	useFrame((state, delta) => {
		// const x = Math.sqrt(
		// 	props.orbitRadius - Math.pow(props.starParent.y + delta, 2)
		// );
		// const y = Math.sqrt(
		// 	props.orbitRadius - Math.pow(props.starParent.x, 2)
		// );

		// const t = (state.clock.getElapsedTime() * props.orbitVelocity) / 2;

		// const x = props.starParent.x + props.orbitRadius * Math.sin(t);
		// const z = props.starParent.z + props.orbitRadius * Math.cos(t);
		const { x, z } = getPlanetPosition(
			props.starParent.x * POSITION_MULTIPLIER,
			props.starParent.z * POSITION_MULTIPLIER,
			props.orbitRadius,
			props.orbitVelocity,
			state.clock.getElapsedTime()
		);
		t = state.clock.getElapsedTime();
		const y = props.starParent.y * POSITION_MULTIPLIER;
		// setPosition([x, y, z]);
		if (meshRef.current) {
			meshRef.current.position.set(x, y, z);
		}
	});

	return (
		<group>
			<Trail
				local
				width={2}
				length={6}
				color={new THREE.Color(2, 1, 10)}
				attenuation={(t) => t * t * 4}
			>
				<mesh ref={meshRef} position={position}>
					<sphereGeometry args={[1, 16, 16]}>
						{/* <bufferAttribute
					attach={"position"}
					{...celestialBodyBuffer.position}
				/> */}
					</sphereGeometry>
					<meshStandardMaterial
						color={hovered ? "hotpink" : "green"}
					/>
				</mesh>
			</Trail>
			<Line
				worldUnits
				points={orbitPoints}
				color="turquoise"
				lineWidth={0.1}
				rotation={new THREE.Euler(0.5 * Math.PI, 0, 0)}
				position={[
					props.starParent.x * POSITION_MULTIPLIER,
					props.starParent.y * POSITION_MULTIPLIER,
					props.starParent.z * POSITION_MULTIPLIER,
				]}
			/>
		</group>
	);
};
