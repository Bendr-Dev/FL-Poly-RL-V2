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
 * GET/:eventId
 */
statsRouter.get(
  "/:eventId",
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

      const startTime = event.time.toISOString().replace("+", "%2B");

      const result = await axios.get(
        `https://ballchasing.com/api/replays?uploader=${event.uploader.steam64Id}&playlist=private&replay-date-after=${startTime}&replay-date-before=${endTime}&sort-by=replay-date`,
        config
      );

      let numWins: number = 0;
      let tournamentMatches: {}[] = [];
      result.data.list.forEach((tournament: any) => {
        if (
          tournament.blue.players.filter(
            (user: any) => user.id.id === event.uploader.steam64Id
          ).length > 0
        ) {
          tournamentMatches.push({
            blue: {
              name: "Florida Poly",
              goals: !!tournament.blue.goals ? tournament.blue.goals : 0,
            },
            orange: {
              name: "Opponent",
              goals: !!tournament.orange.goals ? tournament.orange.goals : 0,
            },
          });
          if (
            (!!tournament.orange.goals ? tournament.orange.goals : 0) >
            (!!tournament.blue.goals ? tournament.blue.goals : 0)
          ) {
            numWins++;
          }
        } else {
          tournamentMatches.push({
            id: tournament.id,
            blue: {
              name: "Opponent",
              goals: !!tournament.blue.goals ? tournament.blue.goals : 0,
            },
            orange: {
              name: "Florida Poly",
              goals: !!tournament.orange.goals ? tournament.orange.goals : 0,
            },
          });

          if (
            (!!tournament.orange.goals ? tournament.orange.goals : 0) >
            (!!tournament.blue.goals ? tournament.blue.goals : 0)
          ) {
            numWins++;
          }
        }
      });

      tournamentMatches.forEach(async (tournament: any) => {
        console.log(tournament);
        const matchResult = await axios.get(
          `https://ballchasing.com/api/replays/${tournament.id}`,
          config
        );

        // FIX: tournament = {...tournament, : matchResult.data.orange.players}
        // tournament.orange.players = matchResult.data.orange.players;
        // tournament.orange.stats = matchResult.data.orange.stats;
        // tournament.blue.players = matchResult.data.blue.players;
        // tournament.blue.stats = matchResult.data.blue.stats;

        console.log(tournament);
        setTimeout(() => 500);
      });

      const newTournament = {
        name: event.name,
        numberOfMatches: result.data.count,
        numberOfWins: numWins,
        numberOfLosses: Math.abs(result.data.count - numWins),
        matches: tournamentMatches,
      };

      res.json(newTournament);
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
