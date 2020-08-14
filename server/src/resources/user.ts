import express, { Request, Response } from "express";
import User from "../models/User";

const userRouter = express.Router();

/**
 * Route registering a single user
 * @name POST/register
 */
userRouter.post("/register", async (req: Request, res: Response) => {
  try {
    // Deconstruct request
    const {
      username,
      name,
      email,
      password,
      discordId,
      steam64Id,
      role,
    } = req.body;

    // Create a new User object
    const newUser = new User({
      username,
      name,
      email,
      password,
      discordId,
      steam64Id,
      role,
    });

    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
  }
});

export default userRouter;
