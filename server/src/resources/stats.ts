import axios from "axios";
import express, { Request, Response } from "express";
import * as dotenv from "dotenv";

dotenv.config();

// Config headers for ballchasing api
const config = {
  headers: {
    Authorization: process.env.BC_API_KEY,
    "Content-Type": "application/json",
  },
};

const statsRouter = express.Router();

/**
 * Testing route with axios
 * GET/
 */
statsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const result = await axios.get(
      "https://ballchasing.com/api/replays/0777cfe0-886b-48eb-be70-00294b1fb242",
      config
    );
    res.json(result.data);
  } catch (err) {
    console.error(err);
  }
});

export default statsRouter;
