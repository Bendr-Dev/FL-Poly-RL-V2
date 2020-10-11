import express, { Request, Response } from "express";
import auth from "../utils/middleware/auth";
import roles from "../utils/middleware/roles";
import Match from "../models/Match";

const matchRouter = express.Router();

/**
 * Grabs all matches based off of tournament ID
 */
matchRouter.get(
  "/:eventId/matches",
  [auth, roles(["Guest", "Coach", "Admin", "Player", "Manager"])],
  async (req: Request, res: Response) => {
    const eventId = req.params.eventId;
    try {
      const matches = await Match.find({ tournamentId: eventId });

      res.status(200).json(matches);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: {
          msg: `Server error trying to grab matches from tournament with id ${eventId}`,
        },
      });
    }
  }
);

export default matchRouter;
