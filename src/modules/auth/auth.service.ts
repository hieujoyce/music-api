import { UserRegister, UserLogin } from "./auth.type";
import Joi from "joi";
import { Response } from "express";
import User from "../user/user.model";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { Types } from "mongoose";
dotenv.config();

export function validateBodyRegiter(data: UserRegister) {
  const { name, email, password, cfPassword } = data;
  const schema = Joi.object({
    name: Joi.string().min(6).max(30).required().messages({
      "string.min": "Name không được nhỏ hơn 6 kí tự",
      "string.max": "Name không được lớn hơn 30 kí tự",
      "string.empty": "Name không được để trống",
    }),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required()
      .messages({
        "string.email": "Email không đúng định dạng",
        "string.empty": "Email không được để trống",
      }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password không được nhỏ hơn 6 kí tự",
      "string.empty": "Password không được để trống",
    }),
    cfPassword: Joi.string().valid(password).messages({
      "string.empty": "Confirm password không được để trống",
      "any.only": "Confirm password không chính xác",
    }),
  });

  const { error } = schema.validate(
    { name, email, password, cfPassword },
    { abortEarly: false }
  );
  if (error) {
    return error.details.reduce((el1: Record<string, any>, el2) => {
      const obj = { ...el1 };
      if (el2.context && el2.context.key) {
        obj[el2.context.key] = el2.message;
      }
      return obj;
    }, {});
  } else return null;
}

export async function saveUser(res: Response, data: UserRegister) {
  const { email, name, password } = data;
  try {
    const findUser = await User.findOne({ email });
    if (findUser)
      return res.status(400).json({
        status: "fail",
        error: "Email đã có người đăng kí.",
      });
    const newUser = new User({
      email,
      name,
      password: hassPw(password),
    });

    await newUser.save();

    return res.json({
      status: "success",
      user: {
        ...(newUser as any)._doc,
        password: undefined,
      },
      accessToken: genAccessToken(newUser._id),
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      error,
    });
  }
}

export async function login(res: Response, data: UserLogin) {
  try {
    const findUser = await User.findOne({ email: data.email })
      .populate("favorites")
      .populate("playlists", "name count")
      .lean();
    if (!findUser)
      return res.status(400).json({
        status: "fail",
        error: "Tài khoản hoặc mật khẩu không chính xác",
      });
    const match = await bcrypt.compare(data.password, findUser.password);
    if (!match)
      return res.status(400).json({
        status: "fail",
        error: "Tài khoản hoặc mật khẩu không chính xác",
      });
    return res.json({
      status: "success",
      user: {
        ...findUser,
        password: undefined,
      },
      accessToken: genAccessToken(findUser._id),
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      error,
    });
  }
}

export function genAccessToken(id: Types.ObjectId) {
  const acToken = jwt.sign({ id }, process.env.TOKEN_SECRET as string, {
    expiresIn: "30d",
  });
  return acToken;
}

export function hassPw(password: string) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}
