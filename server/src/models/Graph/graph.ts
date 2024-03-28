import { ObjectId } from "mongodb";
import { Schema, model } from "mongoose";

// Node

const nodeSchema = new Schema();
nodeSchema.add({
    _id: {
        type: ObjectId,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    parentId: {
        type: ObjectId,
        required: true,
    },
    data: {
        type: Object,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    type: {
        type: Number,
        required: true,
    },
    adjacent: {
        type: [nodeSchema],
        required: true,
    },
    children: {
        type: [nodeSchema],
        required: true,
    }
});

// Graph

const graphSchema = new Schema({
    nodes: {
        type: [nodeSchema],
        required: true,
    },
    comparator: {
        type: Object,
        required: false,
    }
});

export const Node = model("Node", nodeSchema);
export const Graph = model("Graph", graphSchema);