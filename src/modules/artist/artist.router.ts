import express from "express";
import { isUser } from "../auth/auth.middleware";
import * as artistCtrl from "./artist.controller";
const artistRouter = express.Router();

artistRouter.get("/", isUser, artistCtrl.getAllArtists);
artistRouter.get("/:idArtist", isUser, artistCtrl.getDetailArtist);

export default artistRouter;
