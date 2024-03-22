const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

// Node

const nodeSchema = new mongoose.Schema();
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

const graphSchema = new mongoose.Schema({
    nodes: {
        type: [nodeSchema],
        required: true,
    },
    comparator: {
        type: Object,
        required: false,
    }
});

const Node = new mongoose.model("Node", nodeSchema);
const Graph = new mongoose.model("Graph", graphSchema);

module.exports = Node, Graph;