import { MeshProps } from "@react-three/fiber";
import { Star } from "./assets/data/Star";

export interface tempInterface {
    test: string;
}

export enum OverlayState {
    StarMap,
    SolarSystem,
    CreateCB,
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
	n: string | null;
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

export interface CBProps extends MeshProps {
	name: string;
	description: string;
	starParent: Star | null;
	radius: number;
	orbitRadius: number;
	orbitVelocity: number;
	colour: string;
}

export interface CBState {
	name: string;
	description: string;
	parent: JSONStar | null;
	radius: number;
	orbitRadius: number;
	colour: string;
	hovered: boolean;
	selected: boolean;
	position: [number, number, number];
}