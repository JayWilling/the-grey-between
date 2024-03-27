import { ObjectId } from "mongodb";
import { Model, Schema } from "mongoose";

export const starSchema = new Schema();

starSchema.add({
    _id: {
        type: ObjectId,
        required: true,
    },
    i: {
        type: String,
        required: true
    },
    n: {
        type: String,
        required: true,
    },
    x: {
        type: Object,
        required: true,
    },
    y: {
        type: String,
        required: true,
    },
    z: {
        type: Number,
        required: true,
    },
    p: {
        type: Number,
        required: true,
    },
    N: {
        type: Number,
        required: true,
    },
    K: {
        type: String,
        required: true,
    }
});

const Star = new Model("Star", starSchema);