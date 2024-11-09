import express, { Request, Response } from "express";
import * as BSON from "bson";
import { INode } from "./../../../website/src/models/UniverseGraph";

import { collections } from "../db/conn";

// const express = require('express');

export const nodeRoutes = express.Router();

const ObjectId = require('mongodb').ObjectId;

// Route functions

// Return all nodes
async function getNodes(req: Request, res: Response) {
    if (!collections.nodes) {
        res.sendStatus(503);
    }

    try {
        const nodes = collections.nodes.find({}).toArray();
        res.status(200).send(nodes);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

// Get node by parent ID

async function getNodeByParentId(req: Request, res: Response) {
    if (!collections.nodes) {
        res.sendStatus(503);
        return;
    } else {
        try {
        const id = req.params.id;
            const query = {
                parentId: new BSON.ObjectId(id)
            };
            const node = await collections.nodes.findOne(query);
            if (!node) {
                res.status(503).send();
            } else {
                res.status(200).send(node);
            }
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }
}

// Add new node

async function addNode(req: Request, res: Response) {
    if (!collections.nodes) {
        res.sendStatus(503);
        return;
    } else {
        try {
            const node: INode = {
                parentId: new BSON.ObjectId(req.body.parentId),
                // parentId: req.body.parentId,
                data: req.body.data,
                name: req.body.name,
                description: req.body.description,
                collection: req.body.collection,
                adjacent: req.body.adjacent,
                children: req.body.children
            }
            const result = await collections.nodes.insertOne(node);
            res.status(202).send(result);
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }

}

// Add routes

nodeRoutes.route("/nodes").get(getNodes);
nodeRoutes.route("/nodes/:id").get(getNodeByParentId);

nodeRoutes.route("/nodes/add").post(addNode);

// module.exports = nodeRoutes;