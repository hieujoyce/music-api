import mongoose from "mongoose";

export interface ISong {
  id: number;
  title: string;
  titleShort: string;
  time: number;
  src: string;
  image: string;
  rank: number;
  artistId: number;
  albumId: number;
  artist?: any;
}

const Schema = mongoose.Schema;

const songSchema = new Schema<ISong>({
  id: { type: Number, require: true, unique: true },
  title: { type: String, required: true },
  titleShort: { type: String, required: true },
  time: { type: Number, required: true },
  src: { type: String, required: true },
  image: { type: String, required: true },
  rank: { type: Number, required: true },
  artistId: { type: Number, required: true },
  albumId: { type: Number, required: true, ref: "albums" },
});

songSchema.virtual("artist", {
  ref: "artists",
  localField: "artistId",
  foreignField: "id",
  justOne: true,
});

export default mongoose.model<ISong>("songs", songSchema);
