const express = require('express');

const nodeRoutes = express.Router();

const dbo = require('../db/conn');

const ObjectId = require('mongodb').ObjectId;

// Return all nodes
nodeRoutes.route("/nodes").get(function(req, res) {
    let db_connect = dbo.getDb('the-grey-between');
    db_connect
        .collection("nodes")
        .find({})
        .toArray()
        .then((data) => {
            res.json(data);
        });
});

// Get node by parent ID
nodeRoutes.route("/nodes/:id").get(function(req, res) {
    let db_connect = dbo.getDb('the-grey-between');
    let query = { parentId: new ObjectId(req.params.id)};
    db_connect
        .collection("nodes")
        .findOne(query, function(error, data) {
            if (error) throw error;
            res.json(data);
        });
});

// Add new node
nodeRoutes.route("/nodes/add").post(function(request, response) {
    let db_connect = dbo.getDb("the-grey-between");
    let nodeObject = {
        parentId: request.body.parentId,
        data: request.body.data,
        adjacent: request.body.adjacent,
        children: request.body.children,
    };
    db_connect
        .collection("nodes")
        .insertOne(nodeObject, function(error, result) {
            if (error) throw error;
            response.json(result);
        });
});

module.exports = nodeRoutes;