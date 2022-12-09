import express from "express";
import { isUser } from "../auth/auth.middleware";
import playlistsRoute from "./playList/playList.router";
import * as userCtrl from "./user.controller";

const userRouter = express.Router();

userRouter.post("/favorite/:idSong", isUser, userCtrl.addFavorite);
userRouter.delete("/favorite/:idSong", isUser, userCtrl.deleteFavorite);
userRouter.use("/playList", playlistsRoute);

export default userRouter;
