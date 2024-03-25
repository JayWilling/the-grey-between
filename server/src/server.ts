import {config} from "dotenv";
// get driver connection
import dbo from "./db/conn";
import app from "./app";

config({ path: "./config.env" });
const port = process.env.PORT || 5000;

const server = app.listen(port, async () => {
  // perform a database connection when server starts
  await dbo.connectToServer("the-grey-between",function (err) {
    if (err) console.error(err);
   });
  console.log(`Server is running on port: ${port}`);
});

export default server;