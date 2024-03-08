const express = require("express");
 
// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();
 
// This will help us connect to the database
const dbo = require("../db/conn");
 
// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;
 
 
// Retrieve the full list of stars
recordRoutes.route("/star").get(function (req, res) {
 let db_connect = dbo.getDb("the-grey-between");
 db_connect
   .collection("stars")
   .find({})
   .toArray()
   .then((data) => {
        res.json(data);
   });
});
 
// This section will help you get a single record by id
recordRoutes.route("/star/:id").get(function (req, res) {
 let db_connect = dbo.getDb();
 let myquery = { _id: ObjectId(req.params.id) };
 db_connect
   .collection("stars")
   .findOne(myquery, function (err, result) {
     if (err) throw err;
     res.json(result);
   });
});

// Add initial list of default stars
recordRoutes.route("/star/addList").post(async function (request, response) {
    let db = dbo.getDb();

    db.collection("stars").insertMany(request.body, function (err, res) {
        if (err) throw err;
        response.json(res);
    })
});
 
// This section will help you create a new record.
recordRoutes.route("/star/add").post(async function (req, response) {
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
});
 
// This section will help you update a record by id.
recordRoutes.route("/update/:id").post(function (req, response) {
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
});
 
// This section will help you delete a record
recordRoutes.route("/:id").delete((req, response) => {
 let db_connect = dbo.getDb();
 let myquery = { _id: ObjectId(req.params.id) };
 db_connect.collection("stars").deleteOne(myquery, function (err, obj) {
   if (err) throw err;
   console.log("1 document deleted");
   response.json(obj);
 });
});
 
module.exports = recordRoutes;