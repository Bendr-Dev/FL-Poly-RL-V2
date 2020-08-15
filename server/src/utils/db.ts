import * as dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const pass = process.env.MONGO_PASS;
const user = process.env.MONGO_USERNAME;
const dbName = process.env.DB_NAME;
const isDev = process.env.IS_DEV;

export default async () => {
  try {
    console.log("Connecting to MongoDB...");

    if (isDev && mongoose.connection) {
      mongoose.connection.close();
    }

    await mongoose.connect(
      `mongodb+srv://${user}:${pass}@fl-poly-rl-dev.czctl.mongodb.net/${dbName}?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      }
    );

    console.log("Connected to MongoDB!");
  } catch (err) {
    console.log(err);
  }
};
