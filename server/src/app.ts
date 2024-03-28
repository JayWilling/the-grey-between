import express from "express";
import cors from "cors";
import { starRoutes } from "./routes/star";
import { nodeRoutes } from "./routes/nodes";
import { Node, Graph } from "./models/Graph/graph";

const app = express();

const corsOptions = {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'HEAD', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    exposedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));
app.options('*', cors());
app.use(express.json({ limit : '20mb'}));
app.use(express.urlencoded({ limit : '20mb'}));
app.use(starRoutes);
app.use(nodeRoutes);
// app.use(Node);
// app.use(Graph);

export default app;