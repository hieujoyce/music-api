import songRoute from "../../modules/song/song.router";
import express from "express";
import authRoute from "../../modules/auth/auth.router";
import { IRoute } from "../../types";
import userRouter from "../../modules/user/user.router";
import artistRouter from "../../modules/artist/artist.router";
import albumRouter from "../../modules/album/album.router";

const defaultIRoute: IRoute[] = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/songs",
    route: songRoute,
  },
  {
    path: "/users",
    route: userRouter,
  },
  {
    path: "/artist",
    route: artistRouter,
  },
  {
    path: "/album",
    route: albumRouter,
  },
];

const rootRoute = express.Router();

defaultIRoute.forEach((route) => {
  rootRoute.use(route.path, route.route);
});

export default rootRoute;
