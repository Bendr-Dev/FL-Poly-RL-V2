import express, { Request, Response } from "express";
import auth from "../utils/middleware/auth";
import roles from "../utils/middleware/roles";
import Tournament from "../models/Tournament";

const tournamentRouter = express.Router();

/**
 * Get recent tournament results
 * GET/recent/:amount
 */
tournamentRouter.get(
  "/recent/:amount",
  [auth, roles(["Guest", "Coach", "Admin", "Player", "Manager"])],
  async (req: Request, res: Response) => {
    // Deconstruct request
    const amount = parseInt(req.params.amount, 10);

    console.log(amount);

    // Check validity of amount
    if (amount < 1 || isNaN(amount)) {
      return res.status(400).json({
        error: {
          msg: "Bad request: Amount needs to be a number greater than 0",
        },
      });
    }

    // Grab tournaments from DB based off of ascending order
    try {
      const tournaments = await Tournament.find()
        .sort({
          startDate: 1,
        })
        .limit(amount);

      res.status(200).json(tournaments);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: { msg: "Server error trying to grab recent tournaments" },
      });
    }
  }
);

export default tournamentRouter;
