import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export interface IUserRequest extends Request {
  user?: string;
}

export function isUser(req: IUserRequest, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization;
    if (!token)
      return res.status(400).json({
        status: "fail",
        error: "Xác thực thất bại",
      });
    const data = jwt.verify(token, process.env.TOKEN_SECRET as string) as {
      id: string;
      iat: number;
      exp: number;
    };
    req.user = data.id;

    next();
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      error: "Xác thực thất bại",
    });
  }
}
