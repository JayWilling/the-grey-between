import {
	MeshProps,
	ThreeElements,
	ThreeEvent,
	useFrame,
	useThree,
} from "@react-three/fiber";
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Object3D } from "three";
import {
	Circle,
	Line,
	Plane,
	Point,
	Ring,
	Sphere,
	Trail,
} from "@react-three/drei";
import { POSITION_MULTIPLIER } from "../../../pages/StarMap";
import { CBCondition, CBProps, CBState, JSONStar } from "../../../interfaces";
import { DragControls } from "three/examples/jsm/Addons";

// Celestial body's can be generated either from the base data (in the format of JSONStar)
// or from CBProps themselves (Submitted through the form).
// However, we are unable to have dynamic type checks at runtime for interfaces thanks
// to JavaScript. As such we need some ugly member checks before using any of the data
// within the constructor.

export class CelestialBody {
	// name: String;
	// description: String;
	constructor(props: CBProps | JSONStar) {
		// Rules:
		//
		//      If parent is null, position is relative
		//
		// if (typeof props === "CBProps") {
		// }
		// this.name = props.name;
		// this.description = props.description;
	}

	updatePosition(time: number) {
		// if (this.state.parent == null) {
		// 	return;
		// }
		// const x = this.state.parent.x + this.state.orbitRadius * Math.cos(time);
		// const z = this.state.parent.z + this.state.orbitRadius * Math.sin(time);
		// console.log(x);
		// this.setState({
		// 	...this.state,
		// 	position: [x, this.state.parent.y, z],
		// });
	}

	// render() {
	// 	// useFrame((state, delta) => {
	// 	// 	const x = Math.sqrt(
	// 	// 		this.state.orbitRadius -
	// 	// 			Math.pow(this.state.parent.y + delta, 2)
	// 	// 	);
	// 	// 	const y = Math.sqrt(
	// 	// 		this.state.orbitRadius - Math.pow(this.state.parent.x, 2)
	// 	// 	);
	// 	// 	const z = Math.sqrt(this.state.parent.z);
	// 	// 	this.setState({ ...this.state, position: [x, y, z] });
	// 	// });

	// 	return (
	// 		<mesh position={this.props.position}>
	// 			<sphereGeometry args={[1, 16, 16]} />
	// 			<meshStandardMaterial
	// 				color={this.state.hovered ? "hotpink" : "green"}
	// 			/>
	// 			{/* <CelestialBodyFrameLogic
	// 				state={this.state}
	// 				setState={this.setState}
	// 			/> */}
	// 		</mesh>
	// 	);
	// }

	// toJSON() {
	// 	return {
	// 		name: this.state.name,
	// 		description: this.state.description,
	// 		radius: this.state.radius,
	// 		orbitRadius: this.state.orbitRadius,
	// 		colour: this.state.colour,
	// 	};
	// }
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

export const FunctionalCelestialBody = (props: CBState) => {
	// const [name, setName] = useState<string>(props.name);
	// const [description, setDescription] = useState<string>(props.description);
	// const [radius, setRadius] = useState<number>(props.radius);
	// const [orbitRadius, setOrbitRadius] = useState<number>(props.orbitRadius);
	// const [colour, setColour] = useState<string>(props.colour);
	const [hovered, setHovered] = useState<boolean>(false);
	const [clicked, setClicked] = useState<boolean>(false);
	const [state, setState] = useState<CBCondition>(CBCondition.Animated);
	const [clickPoint, setClickPoint] = useState<THREE.Vector3>(
		new THREE.Vector3(0, 0, 0)
	);
	const [testRadius, setTestRadius] = useState(0);
	// const [position, setPosition] = useState<[number, number, number]>([
	// 	0, 0, 0,
	// ]);

	const celestialBodyRef = useRef<THREE.Object3D[]>(null);

	// Click and drag, what we're concerned with:
	//      Distance from centre (star.pos) to ring centre (orbitRadius)
	//      Initial distance from mouse click (props.mousePos) to ring centre
	//      Final distance of mouse pointer (props.mousePos)

	// 1. Get raycaster
	const { gl, raycaster, camera } = useThree();
	const groupRef = useRef<THREE.Group>(null);
	const ringRef = useRef<THREE.Mesh>(null);
	const planeRef = useRef<THREE.Mesh>(null);
	const planeMaterial = new THREE.MeshLambertMaterial({
		transparent: true,
		opacity: 0,
	});

	// 2. Cast a ray to get the object when clicked

	function onGroupClick(e: ThreeEvent<MouseEvent>) {
		if (!planeRef.current || !ringRef.current) return;

		// Only initiate click and drag on the ring
		const intersects = raycaster.intersectObject(ringRef.current);
		if (intersects.length === 0) return;
		setClicked(true);
		props.cameraControls.enabled = false;
	}

	function onGroupDrag(): void {
		// Call this within useFrame if celestial body is clicked
		// Change the orbit radius to be:
		//      distance from centre to mouse +- difference

		if (!planeRef.current || !ringRef.current) return;
		// 1. Calculate distance from mouse position to ring centre
		const intersects = raycaster.intersectObject(planeRef.current);
		if (intersects.length > 0) {
			// intersects[0].point returns the 3D position
			// console.log(intersects[0]);
			setClickPoint(intersects[0].point);
			const newOrbitRadius = intersects[0].point.distanceTo(
				new THREE.Vector3(
					props.starParent?.x,
					props.starParent?.y,
					props.starParent?.z
				)
			);
			setTestRadius(newOrbitRadius);
			// Update the orbitRadius
		}
	}

	function onGroupRelease() {
		// Reset clicked state and update new orbit radius
		setClicked(false);
		props.cameraControls.enabled = true;
		props.setCelestialBodyData({
			name: props.name,
			description: props.description,
			starParent: props.starParent,
			radius: props.radius,
			orbitRadius: testRadius,
			orbitVelocity: props.orbitVelocity,
			colour: props.colour,
		});
	}

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

		if (props.starParent == null) {
			return;
		}

		if (clicked) {
			onGroupDrag();
		} else {
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
		}
	});

	return (
		<group
			ref={groupRef}
			onPointerDown={(e) => onGroupClick(e)}
			onPointerUp={() => onGroupRelease()}
		>
			<Sphere args={[1, 8, 8]} position={clickPoint} />
			<Plane
				ref={planeRef}
				args={[props.orbitRadius * 3, props.orbitRadius * 3]}
				rotation={new THREE.Euler(-0.5 * Math.PI, 0, 0)}
				material={planeMaterial}
			/>
			<Trail
				local
				width={2}
				length={6}
				color={new THREE.Color(2, 1, 10)}
				attenuation={(t) => t * t * 4}
			>
				<mesh ref={meshRef} position={position}>
					<sphereGeometry
						args={[1, 16 * props.radius, 16 * props.radius]}
					>
						{/* <bufferAttribute
					attach={"position"}
					{...celestialBodyBuffer.position}
				/> */}
					</sphereGeometry>
					<meshStandardMaterial
						color={hovered ? "hotpink" : "green"}
					/>
				</mesh>
				<mesh
					ref={ringRef}
					onPointerEnter={() => setHovered(true)}
					onPointerLeave={() => setHovered(false)}
					rotation={new THREE.Euler(0.5 * Math.PI, 0, 0)}
					// onPointerEnter={() => setHovered(true)}
					// onPointerLeave={() => setHovered(false)}
				>
					<ringGeometry
						args={[
							props.orbitRadius - props.radius,
							props.orbitRadius + props.radius,
							64,
						]}
					></ringGeometry>
					<meshStandardMaterial
						color={"turqoise"}
						side={THREE.DoubleSide}
					/>
				</mesh>
				<mesh
					rotation={new THREE.Euler(0.5 * Math.PI, 0, 0)}
					// onPointerEnter={() => setHovered(true)}
					// onPointerLeave={() => setHovered(false)}
				>
					<ringGeometry
						args={[
							testRadius - props.radius,
							testRadius + props.radius,
							64,
						]}
					></ringGeometry>
					<meshStandardMaterial
						color={"red"}
						side={THREE.DoubleSide}
					/>
				</mesh>
			</Trail>
			{/* <Line
				onPointerEnter={() => setHovered(true)}
				onPointerLeave={() => setHovered(false)}
				points={orbitPoints}
				color="turquoise"
				lineWidth={1}
				rotation={new THREE.Euler(0.5 * Math.PI, 0, 0)}
				position={
					props.starParent != null
						? [
								props.starParent.x * POSITION_MULTIPLIER,
								props.starParent.y * POSITION_MULTIPLIER,
								props.starParent.z * POSITION_MULTIPLIER,
						  ]
						: [0, 0, 0]
				}
			/> */}
		</group>
	);
};
