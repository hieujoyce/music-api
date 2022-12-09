import express from "express";
import { isUser } from "../../auth/auth.middleware";
import * as playListCtrl from "./playList.controller";
const playlistsRoute = express.Router();

playlistsRoute.post(
  "/:idPlayList/:idSong",
  isUser,
  playListCtrl.addSongPlayList
);

playlistsRoute.delete(
  "/:idPlayList/:idSong",
  isUser,
  playListCtrl.removeSongPlayList
);

playlistsRoute.post("/", isUser, playListCtrl.createPlayList);
playlistsRoute.delete("/:idPlayList", isUser, playListCtrl.deletePlayList);
playlistsRoute.put("/:idPlayList", isUser, playListCtrl.updatePlayList);
playlistsRoute.get("/:idPlayList", isUser, playListCtrl.getDetailPlayList);

export default playlistsRoute;
