import { Request, Response } from "express";
// import songModel from "../song/song.model";
import albumModel from "./album.model";

//[62869222, 153280322, 363410117, 147221692, 108710042, 234168882]
export async function getAllAblums(req: Request, res: Response) {
  try {
    const [albums, total] = await Promise.all([
      albumModel.find().select("-songs").lean(),
      albumModel.countDocuments(),
    ]);

    return res.json({
      status: "success",
      data: albums,
      total,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      error: (error as any).message,
    });
  }
}

export async function getDetailAblum(req: Request, res: Response) {
  try {
    const { idAlbum } = req.params;
    const findAlbum = await albumModel
      .findOne({ _id: idAlbum })
      .populate("songsAlbum")
      .select("-__v")
      .lean();
    if (!findAlbum) {
      return res.status(400).json({
        status: "fail",
        error: "Id album không chính xác",
      });
    }

    return res.json({
      status: "success",
      album: findAlbum,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      error: (error as any).message,
    });
  }
}

// async function createDataAlbum(idAlbum: number) {
//   const songs = await songModel.find({ albumId: idAlbum }).lean();
//   const data = await getDataAlbum(idAlbum);
//   if (!data) return null;
//   const dataAlbum = {
//     ...data,
//     songsAmount: songs.length,
//     time: songs.reduce((a, b) => a + b.time, 0),
//     songs: songs.map((el) => el.id),
//   };
//   return dataAlbum;
// }

// async function getDataAlbum(idAlbum: number) {
//   const response = await (
//     await fetch(`https://deezerdevs-deezer.p.rapidapi.com/album/${idAlbum}`, {
//       headers: {
//         "X-RapidAPI-Key": "31c960e190msh53eac10e2323889p18e501jsn42f213ff05fe",
//         "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com",
//       },
//     })
//   ).json();
//   if (response.error) {
//     console.log("Loi roi");
//     return null;
//   } else {
//     let dataAblum = {
//       id: response.id,
//       title: response.title,
//       label: response.label,
//       image: response.cover_big,
//       artistId: response.artist.id,
//       releaseDate: response.release_date,
//     };
//     return dataAblum;
//   }
// }

// const data = await createDataAlbum(234168882);
//     if (!data)
//       return res.json({
//         status: "Loi roi",
//       });
//     await albumModel.create(data);
