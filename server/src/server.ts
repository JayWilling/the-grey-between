// import {config} from "dotenv";
import * as dotenv from "dotenv";
import path from "path";
// get driver connection
import dbo from "./db/conn";
import { connectToServer } from "./db/conn";
import app from "./app";

dotenv.config({ path: path.resolve("./config.env")});

console.log(path.resolve("./config.env").toString());

const port = process.env.PORT || 5000;

const server = app.listen(port, async () => {
  // perform a database connection when server starts
    connectToServer(function (err) {
        if (err) console.log(err);
    });
//   await dbo.connectToServer("the-grey-between",function (err) {
//     if (err) console.error(err);
//    });
  console.log(`Server is running on port: ${port}`);
});

export default server;