import express, {Request, Response} from "express";
// import { ObjectId } from "mongodb";
 
// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
export const starRoutes = express.Router();
 
// This will help us connect to the database
import dbo from "../db/conn";
import { collections } from "../db/conn";
 
// This help convert the id from string to ObjectId for the _id.
// import { ObjectId } from "mongodb";
const ObjectId = require("mongodb").ObjectId;
 
// Route Functions

// GET

async function getStars(req: Request, res: Response) {
    if (!collections.stars) {
        res.sendStatus(503);
    };
    try {
        const stars = await collections.stars.find({}).toArray();
        res.status(200).send(stars);
        // res.json(stars);
    } catch (error) {
        console.log(error);
    }
}

async function getStarById(req: Request, res: Response) {
    let db_connect = dbo.getDb();
 let myquery = { _id: ObjectId(req.params.id) };
 db_connect
   .collection("stars")
   .findOne(myquery, function (err, result) {
     if (err) throw err;
     res.json(result);
   });
}

// POST

// Add initial list of default stars
async function addStarList(request: Request, response: Response) {
    let db = dbo.getDb();

    db.collection("stars").insertMany(request.body, function (err, res) {
        if (err) throw err;
        response.json(res);
    })
}

async function addStar(req: Request, response: Response) {
    let db_connect = dbo.getDb();
 let myobj = {
   data: req.body.data,
   adjacent: req.body.adjacent,
   children: req.body.children,
   comparator: req.body.comparator,
 };
 db_connect.collection("stars").insertOne(myobj, function (err, res) {
   if (err) throw err;
   response.json(res);
 });
}

async function updateStar(req: Request, response: Response) {
    let db_connect = dbo.getDb();
 let myquery = { _id: ObjectId(req.params.id) };
 let newvalues = {
   $set: {
     name: req.body.name,
     position: req.body.position,
     level: req.body.level,
   },
 };
 db_connect
   .collection("stars")
   .updateOne(myquery, newvalues, function (err, res) {
     if (err) throw err;
     console.log("1 document updated");
     response.json(res);
   });
}

// DELETE

async function deleteStar(req: Request, res: Response) {
    let db_connect = dbo.getDb();
 let myquery = { _id: ObjectId(req.params.id) };
 db_connect.collection("stars").deleteOne(myquery, function (err, obj) {
   if (err) throw err;
   console.log("1 document deleted");
   res.json(obj);
 });
}


// Add routes
starRoutes.route("/star").get(getStars);
starRoutes.route("/star/:id").get(getStarById);

starRoutes.route("/star/addList").post(addStarList);
starRoutes.route("/star/add").post(addStar);
starRoutes.route("/update/:id").post(updateStar);

starRoutes.route("/:id").delete(deleteStar);