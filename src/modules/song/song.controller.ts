import { Request, Response } from "express";
import songModel from "./song.model";

export async function getAllSong(
  req: Request<{}, {}, {}, { page: string; limit: string }>,
  res: Response
) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;

    const [songs, total] = await Promise.all([
      songModel
        .find()
        .skip(limit * (page - 1))
        .limit(limit)
        .populate("artist", "id name image")
        .lean(),
      songModel.countDocuments(),
    ]);

    return res.json({
      status: "success",
      data: songs,
      total,
      totalPage: Math.ceil(total / limit),
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      status: "fail",
      error,
    });
  }
}
