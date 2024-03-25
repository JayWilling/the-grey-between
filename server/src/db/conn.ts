// const { MongoClient } = require("mongodb");
import { MongoClient } from "mongodb";
// const Db = process.env.ATLAS_URI;
const uri = `mongodb+srv://Cluster68807:eGlHRVxDfkN5@cluster68807.kswq8yj.mongodb.net/the-grey-between?retryWrites=true&w=majority`;
const client = new MongoClient(uri);
 
var _db;

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