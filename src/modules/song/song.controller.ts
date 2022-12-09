import { Request, Response } from "express";
import songModel from "./song.model";

export async function getAllSong(req: Request, res: Response) {
  try {
    const [songs, total] = await Promise.all([
      songModel.find().populate("artist", "id name image").lean(),
      songModel.countDocuments(),
    ]);

    return res.json({
      status: "success",
      data: songs,
      total,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      status: "fail",
      error,
    });
  }
}
