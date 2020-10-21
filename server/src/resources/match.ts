import express, { Request, Response } from "express";
import auth from "../utils/middleware/auth";
import roles from "../utils/middleware/roles";
import Match from "../models/Match";
import Stat, { IStatDocument } from "../models/Stat";

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

/**
 * GET match stats from db
 * /match/:matchId
 */
matchRouter.get("/match/:matchId", [auth, roles(["Admin", "Coach", "Guest", "Manager", "Player"])], async (req: Request, res: Response) => {
  // Deconstruct URI parameter
  const matchId = req.params.matchId;

  try {
    const stats: IStatDocument[] = await Stat.find({ matchId: matchId });

    if(!stats) {
      return res.status(404).json({ msg: `Error trying to find match stats with id ${matchId}`});
    }

    return res.status(200).json(stats[0]);
} catch (err) {
  console.error(err);
  return res.status(500).json({ msg: `Server error trying to find match stats with id ${matchId}`});
}
});

export default matchRouter;
