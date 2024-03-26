import express from "express";
import cors from "cors";
import { starRoutes } from "./routes/star";

const app = express();

app.use(cors());
app.use(express.json({ limit : '20mb'}));
app.use(express.urlencoded({ limit : '20mb'}));
app.use(starRoutes);
app.use(require("./routes/nodes"));
app.use(require("./models/graph"));

export default app;