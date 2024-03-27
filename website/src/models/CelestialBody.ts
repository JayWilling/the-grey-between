import { Star } from "./Star";

export class CelestialBody {
    name: string;
    description: string;
    starParent: Star | null;
    radius: number;
    orbitRadius: number;
    orbitVelocity: number;
    colour: string;

    constructor(name: string, description: string, starParent: Star | null, radius: number, orbitRadius: number, orbitVelocity: number, colour: string) {
        this.name = name;
        this.description = description;
        this.starParent = starParent
        this.radius = radius;
        this.orbitRadius = orbitRadius;
        this.orbitVelocity = orbitVelocity
        this.colour = colour;
    }

}