import express, { Request, Response } from "express";
import auth from "../utils/middleware/auth";
import roles from "../utils/middleware/roles";
import Summary from "../models/Summary";

const summaryRouter = express.Router();

/**
 * Get average player stats
 * GET/
 */
summaryRouter.get(
  "/",
  [auth, roles(["Guest", "Coach", "Admin", "Player", "Manager"])],
  async (req: Request, res: Response) => {
    try {
      const statsSummary = await Summary.find({});

      res.status(200).json(statsSummary);
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: { msg: "Server error trying to get all events" } });
    }
  }
);

export default summaryRouter;
