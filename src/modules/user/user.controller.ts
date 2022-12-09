import { Response } from "express";
import { IUserRequest } from "../auth/auth.middleware";
import songModel from "../song/song.model";
import userModel from "./user.model";

export async function addFavorite(req: IUserRequest, res: Response) {
  try {
    const { idSong } = req.params;
    const findSong = await songModel.findOne({ _id: idSong });
    if (!findSong) {
      return res.status(400).json({
        status: "fail",
        error: "Id bài hát không chính xác",
      });
    }
    const findUser = await userModel.findOne({ _id: req.user });
    if (findUser?.favorites.includes(idSong as any)) {
      return res.status(400).json({
        status: "fail",
        error: "Bài hát đã có trong favorite",
      });
    }
    const updateUser = await userModel
      .findOneAndUpdate(
        { _id: req.user },
        {
          $push: {
            favorites: idSong,
          },
        },
        { returnDocument: "after" }
      )
      .populate("favorites")
      .lean();

    return res.json({
      status: "success",
      user: updateUser,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      error: (error as any).message,
    });
  }
}

export async function deleteFavorite(req: IUserRequest, res: Response) {
  try {
    const { idSong } = req.params;
    const findSong = await songModel.findOne({ _id: idSong });
    if (!findSong) {
      return res.status(400).json({
        status: "fail",
        error: "Id bài hát không chính xác",
      });
    }

    const findUser = await userModel.findOne({ _id: req.user });
    if (!findUser?.favorites.includes(idSong as any)) {
      return res.status(400).json({
        status: "fail",
        error: "Bài hát không có trong favorite",
      });
    }
    const updateUser = await userModel
      .findOneAndUpdate(
        { _id: req.user },
        {
          $pull: {
            favorites: idSong,
          },
        },
        { returnDocument: "after" }
      )
      .populate("favorites")
      .lean();

    return res.json({
      status: "success",
      user: updateUser,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      error: (error as any).message,
    });
  }
}
