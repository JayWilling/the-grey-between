import { MeshProps } from "@react-three/fiber";
import React from "react";
import * as THREE from "three";
import { Object3D } from "three";

type CelestialBodyType = "Planet" | "Moon" | "Asteroid" | "AsteroidBelt";

interface CBProps extends MeshProps {}

interface CBState {
	hovered: boolean;
	selected: boolean;
	position: THREE.Vector3;
}

export class CelestialBody extends React.Component<CBProps, CBState> {
	constructor(props: CBProps) {
		super(props);

		// Set the state
		this.state = {
			hovered: false,
			selected: false,
			// @ts-ignore
			position: this.props.position,
		};
	}

	render() {
		return (
			<mesh {...this.props}>
				<sphereGeometry args={[1, 16, 16]} />
				<meshStandardMaterial
					color={this.state.hovered ? "hotpink" : "green"}
				/>
			</mesh>
		);
	}
}
