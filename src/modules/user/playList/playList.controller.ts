import { Response } from "express";
import songModel from "../../song/song.model";
import { IUserRequest } from "../../auth/auth.middleware";
import userModel from "../user.model";
import playListModel from "./playList.model";

export async function createPlayList(req: IUserRequest, res: Response) {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        status: "fail",
        error: "Tên không được để trống",
      });
    }
    const findPlayList = await playListModel.findOne({ name });
    if (findPlayList) {
      return res.status(400).json({
        status: "fail",
        error: "Đã có playlist này tồn tại",
      });
    }

    const newPl = new playListModel({
      name,
    });

    await newPl.save();
    const updateUser = await userModel
      .findOneAndUpdate(
        { _id: req.user },
        {
          $push: {
            playlists: newPl._id,
          },
        },
        {
          returnDocument: "after",
        }
      )
      .populate("favorites")
      .populate("playlists", "name count")
      .select("-password")
      .lean();

    return res.status(500).json({
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

export async function deletePlayList(req: IUserRequest, res: Response) {
  try {
    const { idPlayList } = req.params;
    const findPlayList = await playListModel.findOne({ _id: idPlayList });
    if (!findPlayList) {
      return res.status(400).json({
        status: "fail",
        error: "Id playlist không chính xác",
      });
    }
    const findUser = await userModel.findOne({ _id: req.user });
    if (!findUser?.playlists.includes(idPlayList as any)) {
      return res.status(400).json({
        status: "fail",
        error: "Id playlist này không tồn tại",
      });
    }
    const updateUser = await userModel
      .findOneAndUpdate(
        { _id: req.user },
        {
          $pull: {
            playlists: idPlayList,
          },
        },
        {
          returnDocument: "after",
        }
      )
      .populate("favorites")
      .populate("playlists", "name count")
      .select("-password")
      .lean();
    await playListModel.deleteOne({ _id: idPlayList });

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

export async function getDetailPlayList(req: IUserRequest, res: Response) {
  try {
    const { idPlayList } = req.params;
    const findPlayList = await playListModel
      .findOne({ _id: idPlayList })
      .populate("songList")
      .lean();
    if (!findPlayList) {
      return res.status(400).json({
        status: "fail",
        error: "Id playlist không chính xác",
      });
    }
    return res.json({
      status: "success",
      playList: findPlayList,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      error: (error as any).message,
    });
  }
}

export async function updatePlayList(req: IUserRequest, res: Response) {
  try {
    const { idPlayList } = req.params;
    const findPlayList = await playListModel.findOne({ _id: idPlayList });
    if (!findPlayList) {
      return res.status(400).json({
        status: "fail",
        error: "Id playlist không chính xác",
      });
    }
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        status: "fail",
        error: "Tên không được để trống",
      });
    }
    const findPlayList1 = await playListModel.findOne({ name });
    if (findPlayList1) {
      return res.status(400).json({
        status: "fail",
        error: "Đã có playlist này tồn tại",
      });
    }
    const updatePlayList = await playListModel
      .findOneAndUpdate(
        { _id: idPlayList },
        {
          name,
        },
        {
          returnDocument: "after",
        }
      )
      .populate("songList")
      .lean();
    return res.json({
      status: "success",
      playList: updatePlayList,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      error: (error as any).message,
    });
  }
}

export async function addSongPlayList(req: IUserRequest, res: Response) {
  try {
    const { idPlayList, idSong } = req.params;
    const findPlayList = await playListModel.findOne({ _id: idPlayList });
    if (!findPlayList) {
      return res.status(400).json({
        status: "fail",
        error: "Id playlist không chính xác",
      });
    }
    const findSong = await songModel.findOne({ _id: idSong });
    if (!findSong) {
      return res.status(400).json({
        status: "fail",
        error: "Id song không chính xác",
      });
    }
    if (findPlayList.songList.includes(idSong as any)) {
      return res.status(400).json({
        status: "fail",
        error: `Bài hát này đã có trong playlist ${findPlayList.name}`,
      });
    }
    const updatePlayList = await playListModel
      .findOneAndUpdate(
        {
          _id: idPlayList,
        },
        {
          $push: {
            songList: idSong,
          },
        },
        {
          returnDocument: "after",
        }
      )
      .populate("songList")
      .lean();
    return res.json({
      status: "success",
      playList: updatePlayList,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      error: (error as any).message,
    });
  }
}

export async function removeSongPlayList(req: IUserRequest, res: Response) {
  try {
    const { idPlayList, idSong } = req.params;
    const findPlayList = await playListModel.findOne({ _id: idPlayList });
    if (!findPlayList) {
      return res.status(400).json({
        status: "fail",
        error: "Id playlist không chính xác",
      });
    }
    const findSong = await songModel.findOne({ _id: idSong });
    if (!findSong) {
      return res.status(400).json({
        status: "fail",
        error: "Id song không chính xác",
      });
    }
    if (!findPlayList.songList.includes(idSong as any)) {
      return res.status(400).json({
        status: "fail",
        error: `Bài hát này không có trong playlist ${findPlayList.name}`,
      });
    }
    const updatePlayList = await playListModel
      .findOneAndUpdate(
        {
          _id: idPlayList,
        },
        {
          $pull: {
            songList: idSong,
          },
        },
        {
          returnDocument: "after",
        }
      )
      .populate("songList")
      .lean();
    return res.json({
      status: "success",
      playList: updatePlayList,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      error: (error as any).message,
    });
  }
}
