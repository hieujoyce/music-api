import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import rootRoute from "./routers/v1";
dotenv.config();

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", rootRoute);

export default app;
