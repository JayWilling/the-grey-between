import * as THREE from "three";
import { CBProps, CBType, JSONStar } from "./interfaces";
import { UniverseGraph } from "./assets/data/UniverseGraph";
import { Star } from "./assets/data/Star";

export function objectToScreenPosition(
	object: THREE.Object3D,
	camera: THREE.Camera,
	renderer: THREE.WebGLRenderer
): { x: number; y: number } {
	var tempVector = new THREE.Vector3();
	var widthHalf = 0.5 * renderer.getContext().canvas.width;
	var heightHalf = 0.5 * renderer.getContext().canvas.height;

	object.updateMatrixWorld();
	tempVector.setFromMatrixPosition(object.matrixWorld);
	tempVector.project(camera);

	tempVector.x = tempVector.x * widthHalf + widthHalf;
	tempVector.y = -(tempVector.y * heightHalf) + heightHalf;

	return {
		x: tempVector.x,
		y: tempVector.y,
	};
}

export function vectorToScreenPosition(
	vector: THREE.Vector3,
	camera: THREE.Camera,
	renderer: THREE.WebGLRenderer
): { x: number; y: number } {
	vector.project(camera);

	// console.log(renderer.getContext().canvas.width, window.innerWidth);
	// console.log(renderer.getContext().canvas.height, window.innerHeight);

	const width = window.innerWidth;
	const height = window.innerHeight;
	// var widthHalf = 0.5 * renderer.getContext().canvas.width;
	// var heightHalf = 0.5 * renderer.getContext().canvas.height;
	// vector.x = (vector.x + 1) * widthHalf;
	// vector.y = -(vector.y - 1) * heightHalf;
	vector.x = ((vector.x + 1) * width) / 2;
	vector.y = -((vector.y - 1) * height) / 2;
	vector.z = 0;

	return { x: vector.x, y: vector.y };
}

type UniverseObject = JSONStar | CBProps;

function nodeComparator(a: UniverseObject, b: UniverseObject): number {
	return 0;
}

export function jsonToGraph(stars: Star[]): UniverseGraph<Star> {
	const newGraph = new UniverseGraph<Star>(starComparator);
	for (let i = 0; i < stars.length; i++) {
		const name = stars[i].n;
		if (name) {
			newGraph.addNode(
				name,
				stars[i],
				stars[i]._id,
				name,
				"",
				CBType.Star
			);
		}
	}

	// Ensuring the graph can be queried by index/identifier

	return newGraph;
}

export function graphToJson(graph: UniverseGraph<Star>) {
	const graphJson = JSON.stringify(graph);

	console.log(graphJson);
}

export function starComparator(a: Star, b: Star): number {
	// Celestial body has the same name
	if (a.n === b.n) {
		return 1;
	}
	// No match
	return 0;
}

export function cbPropsComparator(a: CBProps, b: CBProps): number {
	// Celestial body has the same name
	if (a.name === b.name) {
		return 1;
	}
	// Celestial bodies have the same parent
	if (a.starParent === b.starParent) {
		return 2;
	}
	// No match
	return 0;
}
