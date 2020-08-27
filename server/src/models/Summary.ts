import { ISummary } from "../../../common/interfaces/Summary.Interface";
import mongoose, { Schema, Document } from "mongoose";
import * as dotenv from "dotenv";

export interface ISummaryDocument extends Document, ISummary {}

// Work-around for HMR OverrideModelError
dotenv.config();

const isDev = process.env.IS_DEV;

if (isDev) {
  delete mongoose.connection.models["Summary"];
}

const SummarySchema: Schema = new Schema({
  stats: { type: Schema.Types.Mixed },
});

export default mongoose.model<ISummaryDocument>("Summary", SummarySchema);
