import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";

export function updateCameraPosition(
	targetPos: THREE.Vector3,
	cameraControls: any,
	camera: THREE.Camera,
	distanceFromTarget: number = 10,
	animationTime: number = 2000,
	moveTo: boolean = true
): void {
	// const orbitControls = props.cameraControlsRef.current;
	const oldPos = camera.position;

	if (cameraControls === null) return;

	new TWEEN.Tween(cameraControls.target)
		.to(targetPos, animationTime)
		.easing(TWEEN.Easing.Cubic.Out)
		// .onStart(() => (cameraControls.enabled = false))
		// .onComplete(() => (cameraControls.enabled = true))
		.start();

	if (moveTo) {
		// Tween to new camera location
		//   -  Point in-between old and new position
		//
		// Get unit vector
		const unitVector = new THREE.Vector3();
		unitVector.subVectors(oldPos, targetPos).normalize();
		const newPos = new THREE.Vector3(
			targetPos.x + unitVector.x * distanceFromTarget,
			targetPos.y + unitVector.y * distanceFromTarget,
			targetPos.z + unitVector.z * distanceFromTarget
		);

		new TWEEN.Tween(camera.position)
			.to(newPos, 2500)
			.easing(TWEEN.Easing.Cubic.Out)
			// .onStart(() => (cameraControls.enabled = false))
			// .onComplete(() => (cameraControls.enabled = true))
			.start();
	}
}
