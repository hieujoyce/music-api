import express from "express";
import { isUser } from "../auth/auth.middleware";
import * as songCtrl from "./song.controller";

const songsRoute = express.Router();

songsRoute.get("/", isUser, songCtrl.getAllSong);

export default songsRoute;
