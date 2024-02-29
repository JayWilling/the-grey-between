// Imports
import * as THREE from "three";
import { JSONStar, RGBColours } from "../../interfaces";

// Interfaces & Types

export class Star {
	index: number;
	name: string;
	x: number;
	y: number;
	z: number;
	colour: RGBColours;

	constructor(starData: JSONStar) {
		this.index = starData.i;
		this.name = starData.n ? starData.n : "";
		this.x = starData.x;
		this.y = starData.y;
		this.z = starData.z;
		if (starData.K) {
			this.colour = { r: starData.K.r, g: starData.K.g, b: starData.K.b };
		} else {
			this.colour = { r: 1, g: 1, b: 1 };
		}
	}
}

// export class StarsClass {
// 	private _starList: JSONStar[];

// 	constructor(starList: JSONStar[]) {
// 		this._starList = starList;
// 	}

// 	getNearestNeighbours(
// 		index: number,
// 		maxDistance: number,
// 		returnPositions: boolean = true
// 	): THREE.Vector3[] | null {
// 		// Declaration
// 		const neighbourList: THREE.Vector3[] = [];

// 		// Get origin position
// 		const givenStar = this._starList[index];
// 		if (
// 			givenStar.x === null ||
// 			givenStar.y === null ||
// 			givenStar.z === null
// 		) {
// 			return null;
// 		}
// 		const givenPosition = new THREE.Vector3(
// 			givenStar.x,
// 			givenStar.y,
// 			givenStar.z
// 		);
// 		for (let i: number = 0; i < this._starList.length; i++) {
// 			// Get neighbour position
// 			const neighbouringStar = this._starList[i];
// 			if (
// 				neighbouringStar.x === null ||
// 				neighbouringStar.y === null ||
// 				neighbouringStar.z === null
// 			) {
// 				continue;
// 			}
// 			const neighbouringPosition = new THREE.Vector3(
// 				neighbouringStar.x,
// 				neighbouringStar.y,
// 				neighbouringStar.z
// 			);

// 			// Calculate distance between two points
// 			const neighbourDistance = this.getDistanceBetweenTwoPoints(
// 				givenPosition,
// 				neighbouringPosition
// 			);
// 			// If distance is greater than prop distance discard
// 			if (neighbourDistance < maxDistance) {
// 				neighbourList.push(neighbouringPosition);
// 			}
// 		}
// 		return neighbourList;
// 	}

// 	getDistanceBetweenTwoPoints(
// 		origin: THREE.Vector3,
// 		destination: THREE.Vector3
// 	): number {
// 		return origin.distanceTo(destination);
// 	}
// }
