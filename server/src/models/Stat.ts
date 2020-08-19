import { IStat } from "../../../common/interfaces/Stat.Interface";
import mongoose, { Schema, Document } from "mongoose";
import * as dotenv from "dotenv";

export interface IStatDocument extends Document, IStat {}

// Work-around for HMR OverrideModelError
dotenv.config();

const isDev = process.env.IS_DEV;

if (isDev) {
  delete mongoose.connection.models["Stat"];
}

const StatSchema: Schema = new Schema({
  matchId: { type: mongoose.Schema.Types.ObjectId, ref: "Match" },
  blue: { type: {}, required: true },
  orange: { type: {}, required: true },
});

export default mongoose.model<IStatDocument>("Stat", StatSchema);
