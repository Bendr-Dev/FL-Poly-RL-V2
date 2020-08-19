import { ITournament } from "../../../common/interfaces/Tournament.Interface";
import mongoose, { Schema, Document } from "mongoose";
import * as dotenv from "dotenv";

export interface ITournamentDocument extends Document, ITournament {}

// Work-around for HMR OverrideModelError
dotenv.config();

const isDev = process.env.IS_DEV;

if (isDev) {
  delete mongoose.connection.models["Tournament"];
}

const TournamentSchema: Schema = new Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  name: { type: String, required: true },
  numberOfMatches: { type: Number, required: true },
  numberOfWins: { type: Number, required: true },
  numberOfLosses: { type: Number, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
});

export default mongoose.model<ITournamentDocument>(
  "Tournament",
  TournamentSchema
);
