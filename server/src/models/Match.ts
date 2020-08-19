import { IMatch } from "../../../common/interfaces/Match.Interface";
import mongoose, { Schema, Document } from "mongoose";
import * as dotenv from "dotenv";

export interface IMatchDocument extends Document, IMatch {}

// Work-around for HMR OverrideModelError
dotenv.config();

const isDev = process.env.IS_DEV;

if (isDev) {
  delete mongoose.connection.models["Match"];
}

const MatchSchema: Schema = new Schema({
  tournamentId: { type: String, required: true },
  replayId: { type: String, required: true },
  blue: { type: {}, required: true },
  orange: { type: {}, required: true },
});

export default mongoose.model<IMatchDocument>("Match", MatchSchema);
