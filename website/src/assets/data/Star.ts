import { JSONStar, RGBColours } from "../../interfaces";

export class Star {
    _id: string;
    i: number;
	n: string;
	x: number;
	y: number;
	z: number;
	p: number | null;
	N: number | null;
	K?: undefined | RGBColours;

    constructor(data: JSONStar) {
        this._id = ""
        this.i = data.i
        this.n = data.n
        this.x = data.x
        this.y = data.y
        this.z = data.z
        this.p = data.p
        this.N = data.N
        this.K = data.K
    }
}