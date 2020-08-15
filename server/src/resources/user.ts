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
        .cookie("x-refresh-token", refreshToken, { httpOnly: true })
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
        .cookie("x-refresh-token", refreshToken, { httpOnly: true })
        .json({ accessToken });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  }
);

/**
 * Get all users
 * @name GET/all
 */
userRouter.get("/all", async (req: Request, res: Response) => {
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
userRouter.get("/id/:userId", async (req: Request, res: Response) => {
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

/**
 * Get logged in user data
 * @name GET/me
 */
userRouter.get("/me", auth, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.body.user).select("-password");

    if (!user) {
      return res.status(400).json({
        error: { msg: `Couldn't find logged in user data` },
      });
    }

    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: { msg: `Couldn't find logged in user data` },
    });
  }
});

/**
 * Updates user data
 * PUT/edit
 */
userRouter.put("/edit", auth, async (req: Request, res: Response) => {
  try {
    // Grab user
    let user = await User.findById(req.body.user).select("-password");

    if (!user) {
      return res.status(400).json({
        error: { msg: "The user you are trying to update doesn't exist" },
      });
    }

    // Deconstruct request
    const { username, name, steam64Id, discordId } = req.body;

    // Create updated user object containing the fields that are not undefined
    const updatedUser: any = {};

    !!username && (updatedUser.username = username);
    !!name && (updatedUser.name = name);
    !!steam64Id && (updatedUser.steam64Id = steam64Id);
    !!discordId && (updatedUser.discordId = discordId);

    // Update user
    user = await User.findByIdAndUpdate(
      req.body.user,
      { $set: updatedUser },
      { new: true }
    ).select("-password");

    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error while trying to update user");
  }
});

export default userRouter;
