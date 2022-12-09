import mongoose from "mongoose";

export interface IArtist {
  id: number;
  name: string;
  image: string;
  songsAmount: number;
  ablumsAmount: number;
}

const Schema = mongoose.Schema;

const artistSchema = new Schema<IArtist>({
  id: { type: Number, require: true, unique: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  songsAmount: { type: Number, require: true },
  ablumsAmount: { type: Number, require: true },
});

export default mongoose.model<IArtist>("artists", artistSchema);
