import { IUser } from "../../../common/interfaces/User.Interface";
import mongoose, { Schema, Document } from "mongoose";
import * as dotenv from "dotenv";

interface IUserDocument extends Document, IUser {}

// Work-around for HMR OverrideModelError
dotenv.config();

const isDev = process.env.IS_DEV;

if (isDev) {
  delete mongoose.connection.models["User"];
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  steam64Id: { type: String, required: true, unique: true },
  discordId: { type: String, required: true, unique: true },
  role: { type: String, required: true },
});

export default mongoose.model<IUserDocument>("User", UserSchema);
