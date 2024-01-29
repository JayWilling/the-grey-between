import * as THREE from "three";

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
