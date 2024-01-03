const { MongoClient } = require("mongodb");
const Db = process.env.ATLAS_URI;
const client = new MongoClient(Db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
 
var _db;
 
module.exports = {
  connectToServer: async function (callback) {

    try {
        client.connect();
    } catch(e) {
        return callback(e);
        console.log(e);
    }

    _db = client.db("flash_card_db");
    return (_db === undefined ? false : true);

    // client.connect(function (err, db) {
    //   // Verify we got a good "db" object
    //   if (db)
    //   {
    //     _db = db.db("flash_card_db");
    //     console.log("Successfully connected to MongoDB."); 
    //   }
    //   return callback(err);
    //      });
  },
 
  getDb: function () {
    return _db;
  },
};