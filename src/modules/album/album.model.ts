import mongoose, { Types } from "mongoose";

export interface IAlbum {
  id: number;
  title: string;
  label: string;
  image: string;
  artistId: number;
  releaseDate: string;
  songsAmount: number;
  songs: Types.Array<number>;
}

const Schema = mongoose.Schema;

const albumSchema = new Schema<IAlbum>({
  id: { type: Number, require: true, unique: true },
  title: { type: String, required: true },
  label: { type: String, required: true },
  image: { type: String, required: true },
  artistId: { type: Number, required: true },
  releaseDate: { type: String, required: true },
  songsAmount: { type: Number, required: true },
  songs: [
    {
      type: Number,
      default: [],
    },
  ],
});

albumSchema.virtual("songsAlbum", {
  ref: "songs",
  localField: "songs",
  foreignField: "id",
});
export default mongoose.model<IAlbum>("albums", albumSchema);
