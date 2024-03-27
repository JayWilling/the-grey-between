import { CelestialBody } from "./../../../../website/src/models/CelestialBody";
import { Document } from "mongodb";

export default interface CelestialBodyDocument extends CelestialBody, Document {}