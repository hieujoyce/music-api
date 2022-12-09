import { IUser } from "../user/user.model";

export type UserRegister = Pick<IUser, "email" | "name" | "password"> & {
  cfPassword: string;
};

export type UserLogin = Pick<IUser, "email" | "password">;
