import express from "express";
import * as authController from "./auth.controller";

const authRoute = express.Router();

authRoute.post("/login", authController.login);
authRoute.post("/register", authController.register);

export default authRoute;
