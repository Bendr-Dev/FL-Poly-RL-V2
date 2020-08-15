import express, { Request, Response } from "express";
import User from "../models/User";
import { check, validationResult } from "express-validator";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import auth from "../utils/middleware/auth";

const userRouter = express.Router();

dotenv.config();

const JWTSecret = process.env.JWT_SECRET;
const isDev = process.env.IS_DEV;
const JWTRefresh = process.env.JWT_REFRESH_SECRET;

const accessExpiresIn = isDev
  ? 360000
  : parseInt(process.env.JWT_EXPIRES as string, 10);
const refreshExpiresIn = isDev
  ? 360000
  : parseInt(process.env.JWT_REFRESH_EXPIRES as string, 10);

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

      const accessToken = jwt.sign(payload, JWTSecret as string, {
        expiresIn: accessExpiresIn,
      });

      const refreshToken = jwt.sign(payload, JWTRefresh as string, {
        expiresIn: refreshExpiresIn,
      });

      res
        .status(201)
        .cookie("x-refresh-token", refreshToken)
        .json({ accessToken });
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

      const accessToken = jwt.sign(payload, JWTSecret as string, {
        expiresIn: accessExpiresIn,
      });

      const refreshToken = jwt.sign(payload, JWTRefresh as string, {
        expiresIn: refreshExpiresIn,
      });

      res
        .status(200)
        .cookie("x-refresh-token", refreshToken)
        .json({ accessToken });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  }
);

/**
 * Refresh the access token if refresh token is valid
 */
userRouter.post("/refresh", (req: Request, res: Response) => {
  const refreshToken = req.cookies["x-refresh-token"];

  // Check token's existence
  if (!refreshToken) {
    return res
      .status(401)
      .json({ error: { msg: "No token found, authorization denied" } });
  }
  try {
    const decoded = jwt.verify(refreshToken, JWTRefresh as string) as any;

    // Return webtoken
    const payload = {
      id: decoded.id,
    };

    const accessToken = jwt.sign(payload, JWTSecret as string, {
      expiresIn: accessExpiresIn,
    });

    res.status(200).json({ accessToken });
  } catch (err) {
    res.status(401).json({ error: { msg: "Token is not valid" } });
  }
});

userRouter.get("/test", auth, (req, res) => {
  res.send("test");
});

export default userRouter;
