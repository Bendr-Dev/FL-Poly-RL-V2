import express, { Request, Response } from "express";
import User from "../models/User";
import { check, validationResult } from "express-validator";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import auth from "../utils/middleware/auth";
import { IUser } from "../../../common/interfaces/User.Interface";

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

/**
 * Route logging in an existing user
 * @name POST/login
 */
userRouter.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").not().isEmpty(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }

    try {
      // Deconstruct request
      const { email, password } = req.body;

      // Check if user exists
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ error: { msg: "Invalid Credentials" } });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password as string);

      if (!isMatch) {
        return res.status(400).json({ error: { msg: "Invalid Credentials" } });
      }

      // Return webtoken
      const payload = {
        id: user.id,
      };

      jwt.sign(payload, JWTSecret as string, { expiresIn }, (err, token) => {
        if (err) throw err;
        res.status(200).json({ token });
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  }
);

/**
 * Get all users
 * @name GET/
 */
userRouter.get("/", async (res: Response) => {
  try {
    // Grabs all users from database
    const users = await User.find().select("-password");

    res.status(200).json(users);
  } catch (err) {
    console.error(err);
  }
});

/**
 * Get a user by id
 * @name GET/:id
 */
userRouter.get("/:userId", async (req: Request, res: Response) => {
  try {
    // Get user by id
    const user = await User.findById(req.params.userId).select("-password");

    // Check if user exists
    if (!user) {
      return res.status(400).json({
        error: { msg: `Couldn't find user with Id: ${req.params.userId} ` },
      });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(400).json({
      error: { msg: `Couldn't find user with Id: ${req.params.userId} ` },
    });
  }
});

export default userRouter;
