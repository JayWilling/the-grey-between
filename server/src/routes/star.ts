import express, {Request, Response} from "express";
// import { ObjectId } from "mongodb";

import { collections } from "../db/conn";

// import { ObjectId } from "mongodb";
const ObjectId = require("mongodb").ObjectId;

// Route Functions

export const starRoutes = express.Router();

// GET

async function getStars(req: Request, res: Response) {
    if (!collections.stars) {
        res.sendStatus(503);
    } else {
        try {
            const stars = await collections.stars.find({}).toArray();
            res.status(200).send(stars);
            // res.json(stars);
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }
}

async function getStarById(req: Request, res: Response) {

    if (!collections.stars) {
        res.sendStatus(503);
    };

    try {
        const query = { _id: ObjectId(req.params.id)};
        const star = await collections.stars.findOne(query);
        res.status(200).send(star);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

// POST

// Add initial list of default stars
async function addStarList(request: Request, response: Response) {

    if (!collections.stars) {
        response.sendStatus(503);
    };

    try {
        const insertManyResult = await collections.stars.insertMany(request.body);
        response.status(200).send(insertManyResult);
    } catch (error) {
        console.log(error);
        response.sendStatus(500);
    }
}

async function addStar(req: Request, response: Response) {

    if (!collections.stars) {
        response.sendStatus(503);
    };

    try {
        const starObj = {
            data: req.body.data,
            adjacent: req.body.adjacent,
            children: req.body.children,
            comparator: req.body.comparator,
        };
        await collections.stars.insertOne(starObj);
        response.sendStatus(200);
    } catch (error) {
        console.log(error);
        response.sendStatus(500);
    }
}

async function updateStar(req: Request, response: Response) {

    if (!collections.stars) {
        response.sendStatus(503);
    };

    try {
        const query = {
            _id: ObjectId(req.params.id)
        };
        // TODO: Update to use star values
        const newValues = {
            $set: {
                name: req.body.name,
                position: req.body.position,
                level: req.body.level,
              },
        }
        await collections.stars.updateOne(query, newValues);
        response.sendStatus(200);
    } catch (error) {
        console.log(error);
        response.sendStatus(500);
    }
}

// DELETE

async function deleteStar(req: Request, res: Response) {

    if (!collections.stars) {
        res.sendStatus(503);
    };

    try {
        const query = {
            _id: ObjectId(req.params.id)
        };
        const deletedObject = await collections.stars.deleteOne(query);
        res.status(200).send(deletedObject);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}


// Add routes
starRoutes.route("/star").get(getStars);
starRoutes.route("/star/:id").get(getStarById);

starRoutes.route("/star/addList").post(addStarList);
starRoutes.route("/star/add").post(addStar);
starRoutes.route("/update/:id").post(updateStar);

starRoutes.route("/:id").delete(deleteStar);