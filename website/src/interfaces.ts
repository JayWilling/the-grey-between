import { MeshProps } from "@react-three/fiber";
import { Star } from "./models/Star";

export interface tempInterface {
    test: string;
}

export enum OverlayState {
    StarMap,
    SolarSystem,
    CreateCB,
    CreateNode,
    Story,
}

// Core Data Structures

// export interface Node {
//     parent: Node | null;
//     children: Node[];
// }

// export interface Graph {
//     node: 
// }

export interface CelestialBodyNode {

}


// An intermediary interface for converting JSON data into corresponding classes
export interface JSONStar extends SharedArrayBuffer {
	i: number;
	n: string;
	x: number;
	y: number;
	z: number;
	p: number | null;
	N: number | null;
	K?: undefined | RGBColours;
}

export interface RGBColours {
	r: number;
	g: number;
	b: number;
}

export enum CBType {
    Star,
    Planet,
    Asteroid,
    Belt,
    Ship
}

export interface CelestialBodyI {
	name: string;
	description: string;
	radius: number;
	orbitRadius: number;
	colour: string;
}

// Rename to CBState
export enum CBCondition {
    Static = "static",
    Animated = "animated",
    Edit = "edit",
}

export interface CBProps extends MeshProps {
	name: string;
	description: string;
	starParent: Star | null;
	radius: number;
	orbitRadius: number;
	orbitVelocity: number;
	colour: string;
}

export interface CBState extends CBProps {
    pointerPos: THREE.Vector2;
    cameraControls: any;
}