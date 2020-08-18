import axios from "axios";
import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import Event from "../models/Event";
import * as dotenv from "dotenv";
import auth from "../utils/middleware/auth";
import roles from "../utils/middleware/roles";

dotenv.config();

// Config headers for ballchasing api
const config = {
  headers: {
    Authorization: process.env.BC_API_KEY,
    "Content-Type": "application/json",
  },
};

const statsRouter = express.Router();

/**
 * Grabs tournament stats from ballchasing.com
 * GET/bc/:eventId
 */
statsRouter.get(
  "/bc/:eventId",
  [
    auth,
    roles(["Player", "Manager", "Coach", "Admin"]),
    check("endTime", "Event end time is required").not().isEmpty(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }

    try {
      // Deconstruct request
      const endTime = new Date(req.body.endTime)
        .toISOString()
        .trim()
        .replace("+", "%2B");

      // Grab event from DB
      const event = await Event.findById(req.params.eventId)
        .populate("attending", [
          "email",
          "steam64Id",
          "username",
          "discordId",
          "name",
        ])
        .populate("uploader", [
          "email",
          "steam64Id",
          "name",
          "discordId",
          "username",
        ]);

      // Check event existence
      if (!event) {
        return res.status(404).json({
          error: {
            msg: `Event with id ${req.params.eventId} could not be found`,
          },
        });
      }

      // Convert to RFC 3339 Format
      const startTime = event.time.toISOString().replace("+", "%2B");

      // Grabs all matches between start and end time in ballchasing with other parameters
      const tournamentResult = await axios.get(
        `https://ballchasing.com/api/replays?uploader=${event.uploader.steam64Id}&playlist=private&replay-date-after=${startTime}&replay-date-before=${endTime}&sort-by=replay-date`,
        config
      );

      let numWins: number = 0;
      let initTournamentMatches: {}[] = [];

      // Create initial object for each match, and calculate team wins
      tournamentResult.data.list.forEach((match: any) => {
        if (
          match.blue.players.filter(
            (user: any) => user.id.id === event.uploader.steam64Id
          ).length > 0
        ) {
          initTournamentMatches.push({
            blue: {
              id: match.id,
              name: "Florida Poly",
              goals: !!match.blue.goals ? match.blue.goals : 0,
            },
            orange: {
              name: "Opponent",
              goals: !!match.orange.goals ? match.orange.goals : 0,
            },
          });
          if (
            (!!match.orange.goals ? match.orange.goals : 0) >
            (!!match.blue.goals ? match.blue.goals : 0)
          ) {
            numWins++;
          }
        } else {
          initTournamentMatches.push({
            id: match.id,
            blue: {
              name: "Opponent",
              goals: !!match.blue.goals ? match.blue.goals : 0,
            },
            orange: {
              name: "Florida Poly",
              goals: !!match.orange.goals ? match.orange.goals : 0,
            },
          });

          if (
            (!!match.orange.goals ? match.orange.goals : 0) >
            (!!match.blue.goals ? match.blue.goals : 0)
          ) {
            numWins++;
          }
        }
      });

      // Make get request to get advanced stats for each match
      await Promise.all(
        initTournamentMatches.map(async (match: any) => {
          try {
            const matchResult = await axios.get(
              `https://ballchasing.com/api/replays/${match.id}`,
              config
            );

            // Gives opponent team name if it exists
            match.orange.name === "Florida Poly" &&
              !!matchResult.data.blue.name &&
              (match.blue.name = matchResult.data.blue.name);
            match.blue.name === "Florida Poly" &&
              !!matchResult.data.orange.name &&
              (match.orange.name = matchResult.data.orange.name);

            // Attach advanced stats to match
            match.orange.players = matchResult.data.orange.players;
            match.orange.stats = matchResult.data.orange.stats;
            match.blue.players = matchResult.data.blue.players;
            match.blue.stats = matchResult.data.blue.stats;

            setTimeout(() => 500); // Timeout so we don't abuse endpoint
          } catch (err) {
            console.error(err);
            res.status(500).json({
              error: {
                msg: `Server error while trying to grab stats for event with id ${req.params.eventId}`,
              },
            });
          }
        })
      );

      // Format gathered stats data into object
      const newTournament = {
        name: event.name,
        numberOfMatches: tournamentResult.data.count,
        numberOfWins: numWins,
        numberOfLosses: Math.abs(tournamentResult.data.count - numWins),
        matches: initTournamentMatches,
      };

      res.status(200).json(newTournament);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: {
          msg: `Server error while trying to grab stats for event with id ${req.params.eventId}`,
        },
      });
    }
  }
);

export default statsRouter;
