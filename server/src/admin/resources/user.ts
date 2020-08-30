import express, { Request, Response } from "express";
import User from "../../models/User";
import { check, validationResult } from "express-validator";
import auth from "../../utils/middleware/auth";
import roles from "../../utils/middleware/roles";

const userRouter = express.Router();

/**
 * Updates user data
 * PUT/edit
 */
userRouter.put(
  "/edit/:userId",
  [
    auth,
    roles(["Admin"]),
    check("email", "Valid email is required").isEmail().optional(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json(errors);
    }

    try {
      // Grab user
      let user = await User.findById(req.params.userId).select("-password");

      if (!user) {
        return res.status(400).json({
          error: { msg: "The user you are trying to update doesn't exist" },
        });
      }

      // Deconstruct request
      const { email, username, name, steam64Id, discordId, role } = req.body;

      // Create updated user object containing the fields that are not undefined
      const updatedUser: any = {};

      !!username && (updatedUser.username = username);
      !!name && (updatedUser.name = name);
      !!steam64Id && (updatedUser.steam64Id = steam64Id);
      !!discordId && (updatedUser.discordId = discordId);
      !!role && (updatedUser.role = role);
      !!email && (updatedUser.email = email);

      // Update user
      user = await User.findByIdAndUpdate(
        req.params.userId,
        { $set: updatedUser },
        { new: true }
      ).select("-password");

      res.status(200).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error while trying to update user");
    }
  }
);

export default userRouter;
