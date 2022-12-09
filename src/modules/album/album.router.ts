import express from "express";
import { isUser } from "../auth/auth.middleware";
import * as albumCtrl from "./album.controller";
const albumRouter = express.Router();

albumRouter.get("/", isUser, albumCtrl.getAllAblums);
albumRouter.get("/:idAlbum", isUser, albumCtrl.getDetailAblum);

export default albumRouter;
