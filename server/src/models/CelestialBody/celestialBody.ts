import { ObjectId } from "mongodb";
import { Schema, Model } from "mongoose";
import { Star } from "./../../../../website/src/models/Star";

export const celestialBodySchema = new Schema({
    _id: {
        type: ObjectId,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    starParent: {
        type: Star,
        required: true,
    },
    radius: {
        type: Number,
        required: true,
    },
    orbitRadius: {
        type: Number,
        required: true,
    },
    orbitVelocity: {
        type: Number,
        required: true,
    },
    colour: {
        type: String,
        required: true,
    },
});

export const CelestialBody = new Model("CelestialBody", celestialBodySchema);