const express = require('express');

const nodeRoutes = express.Router();

const dbo = require('../db/conn');

const BSON = require('bson');

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
nodeRoutes.route("/nodes/:id").get(async function(req, res) {

    try {
        const db_connect = await dbo.getDb('the-grey-between');
        const id = req.params.id;
        const query = { parentId: new BSON.ObjectId(id)};
        const result = await db_connect.collection("nodes").findOne(query);
        res.json(result);
    } catch (err) {
        throw err;
    }

    // let db_connect = dbo.getDb('the-grey-between');
    // db_connect
    //     .collection("nodes")
    //     .findOne(query, function(error, data) {
    //         if (error) throw error;
    //         res.json(data);
    //     });
});

// Add new node
nodeRoutes.route("/nodes/add").post(async function(request, response) {

    try {
        const db_connect = await dbo.getDb("the-grey-between");
        const nodeObject = {
            parentId: new BSON.ObjectId(request.body.parentId),
            data: request.body.data,
            adjacent: request.body.adjacent,
            children: request.body.children,
        }
        const result = await db_connect.collection("nodes").insertOne(nodeObject);
        response.json(result);
    } catch (err) {
        throw err;
    }
    // let db_connect = dbo.getDb("the-grey-between");
    // let nodeObject = {
    //     parentId: request.body.parentId,
    //     data: request.body.data,
    //     adjacent: request.body.adjacent,
    //     children: request.body.children,
    // };
    // db_connect
    //     .collection("nodes")
    //     .insertOne(nodeObject, function(error, result) {
    //         if (error) throw error;
    //         response.json(result);
    //     });
});

module.exports = nodeRoutes;