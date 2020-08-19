import { IEvent } from "../../../common/interfaces/Event.Interface";
import mongoose, { Schema, Document } from "mongoose";
import * as dotenv from "dotenv";

export interface IEventDocument extends Document, IEvent {}

// Work-around for HMR OverrideModelError
dotenv.config();

const isDev = process.env.IS_DEV;

if (isDev) {
  delete mongoose.connection.models["Event"];
}

const EventSchema: Schema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  format: { type: String, required: true },
  attending: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  link: { type: String, required: true },
  time: { type: Date, required: true },
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  isCompleted: { type: Boolean, required: true },
});

export default mongoose.model<IEventDocument>("Event", EventSchema);
