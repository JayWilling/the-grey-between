import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json({ limit : '20mb'}));
app.use(express.urlencoded({ limit : '20mb'}));
app.use(require("./routes/star"));
app.use(require("./routes/nodes"));
app.use(require("./models/graph"));

export default app;