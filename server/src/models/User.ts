import { IUser } from "../../../common/interfaces/User.Interface";
import mongoose, { Schema, Document } from "mongoose";

interface IUserDocument extends Document, IUser {}

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
