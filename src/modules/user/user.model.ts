import mongoose, { Types } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  favorites: Types.Array<Types.ObjectId>;
  playlists: Types.Array<Types.ObjectId>;
}

const Schema = mongoose.Schema;

const userSchema = new Schema<IUser>(
  {
    name: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    favorites: [
      {
        type: Schema.Types.ObjectId,
        default: [],
        ref: "songs",
      },
    ],
    playlists: [
      {
        type: Schema.Types.ObjectId,
        default: [],
        ref: "playlists",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>("users", userSchema);
