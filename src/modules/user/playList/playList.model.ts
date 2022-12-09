import mongoose, { Types } from "mongoose";

export interface IPlayList {
  name: string;
  songList: Types.Array<Types.ObjectId>;
  count: number;
}

const Schema = mongoose.Schema;

const playListSchema = new Schema<IPlayList>(
  {
    name: { type: String, require: true, unique: true },
    songList: [
      {
        type: Schema.Types.ObjectId,
        default: [],
        ref: "songs",
      },
    ],
    count: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IPlayList>("playlists", playListSchema);
