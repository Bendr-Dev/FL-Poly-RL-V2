import express, { Request, Response } from "express";
import User from "../models/User";
import { check, validationResult } from "express-validator";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

const userRouter = express.Router();

dotenv.config();

const JWTSecret = process.env.JWT_SECRET;
const isDev = process.env.IS_DEV;

const expiresIn = isDev ? 360000 : 14400;

/**
 * Route registering a single user
 * @name POST/register
 */
userRouter.post(
  "/register",
  [
    check("username", "Username is required").not().isEmpty(),
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must contain atleast 6 characters").isLength({
      min: 6,
    }),
    check("discordId", "Discord ID is required").not().isEmpty(),
    check("steam64Id", "Steam64ID is required").not().isEmpty(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }

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

      // Check if email already exists
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

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

      // Encrypt password
      newUser.password = await bcrypt.hash(password, 10);

      // Save to DB
      await newUser.save();

      // Return webtoken
      const payload = {
        id: newUser.id,
      };

      jwt.sign(payload, JWTSecret as string, { expiresIn }, (err, token) => {
        if (err) throw err;
        res.status(201).json({ token });
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  }
);

export default userRouter;
