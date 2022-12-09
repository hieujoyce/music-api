import { Request, Response } from "express";
import { UserRegister, UserLogin } from "./auth.type";
import * as authService from "./auth.service";

export function login(req: Request<{}, {}, UserLogin>, res: Response) {
  const { email, password } = req.body;
  return authService.login(res, { email, password });
}

export async function register(
  req: Request<{}, {}, UserRegister>,
  res: Response
) {
  const { name, email, password, cfPassword } = req.body;
  const error = authService.validateBodyRegiter({
    name,
    email,
    password,
    cfPassword,
  });
  if (error) {
    return res.status(400).json({
      status: "fail",
      error,
    });
  }

  return authService.saveUser(res, req.body);
}
