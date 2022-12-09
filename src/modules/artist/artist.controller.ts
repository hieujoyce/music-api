import { Request, Response } from "express";
import songModel from "../song/song.model";
import artistModel from "./artist.model";

export async function getAllArtists(req: Request, res: Response) {
  try {
    const [songs, total] = await Promise.all([
      artistModel.find().lean(),
      artistModel.countDocuments(),
    ]);

    return res.json({
      status: "success",
      data: songs,
      total,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      error,
    });
  }
}

export async function getDetailArtist(req: Request, res: Response) {
  try {
    const { idArtist } = req.params;
    const findArtist = await artistModel.findOne({ _id: idArtist }).lean();
    if (!findArtist) {
      return res.status(400).json({
        status: "fail",
        error: "Id artist không chính xác",
      });
    }
    const songs = await songModel
      .find({ artistId: findArtist.id })
      .populate("artist", "name image -_id -id")
      .lean();

    return res.json({
      status: "success",
      artist: {
        ...findArtist,
        time: songs.reduce((a, b) => {
          return a + b.time;
        }, 0),
        songs,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      error,
    });
  }
}
