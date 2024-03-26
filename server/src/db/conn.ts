// const { MongoClient } = require("mongodb");
// import { MongoClient } from "mongodb";
import * as mongodb from "mongodb";
import MongoStore from "connect-mongo";
import * as dotenv from "dotenv";
// const Db = process.env.ATLAS_URI;
const uri = `mongodb+srv://Cluster68807:eGlHRVxDfkN5@cluster68807.kswq8yj.mongodb.net/the-grey-between?retryWrites=true&w=majority`;
const client = new mongodb.MongoClient(uri);
 
var _db;

export const collections : {stars?: mongodb.Collection, nodes?: mongodb.Collection} = {};

export async function connectToServer(callback : (err: any) => void) {

    const client = new mongodb.MongoClient(process.env.DB_CONN_STRING);

    await client.connect();

    const db: mongodb.Db = client.db(process.env.DB_NAME);

    const starsCollection: mongodb.Collection = db.collection(process.env.STARS_COLLECTION_NAME);
    const nodesCollection: mongodb.Collection = db.collection(process.env.NODES_COLLECTION_NAME);

    collections.stars = starsCollection;
    collections.nodes = nodesCollection;

    console.log(`Successfully connected to database: ${process.env.DB_NAME}`);

}

const dbo = {
    connectToServer: async function (dbName: string, callback) {

        try {
            await client.connect();
        } catch(e) {
            return callback(e);
            console.log(e);
        }
    
        _db = client.db(dbName);
        return (_db === undefined ? false : true);
    
        // client.connect(function (err, db) {
        //   // Verify we got a good "db" object
        //   if (db)
        //   {
        //     _db = db.db("the-grey-between");
        //     console.log("Successfully connected to MongoDB."); 
        //   }
        //   return callback(err);
        //      });
      },
     
      getDb: function () {
        return _db;
      },
};

export default dbo;
 
// module.exports = {
//   connectToServer: async function (callback) {

//     try {
//         await client.connect();
//     } catch(e) {
//         return callback(e);
//         console.log(e);
//     }

//     _db = client.db("the-grey-between");
//     return (_db === undefined ? false : true);

//     // client.connect(function (err, db) {
//     //   // Verify we got a good "db" object
//     //   if (db)
//     //   {
//     //     _db = db.db("the-grey-between");
//     //     console.log("Successfully connected to MongoDB."); 
//     //   }
//     //   return callback(err);
//     //      });
//   },
 
//   getDb: function () {
//     return _db;
//   },
// };