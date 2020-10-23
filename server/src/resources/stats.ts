import axios from "axios";
import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import Event from "../models/Event";
import * as dotenv from "dotenv";
import auth from "../utils/middleware/auth";
import roles from "../utils/middleware/roles";
import Tournament from "../models/Tournament";
import Match from "../models/Match";
import Stat from "../models/Stat";
import { IEventDocument } from "../models/Event";
import { ITournamentDocument } from "../models/Tournament";
import { IMatchDocument } from "../models/Match";
import { IStatDocument } from "../models/Stat";

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
  "/bc/:eventId/:endTime",
  [
    auth,
    roles(["Player", "Manager", "Coach", "Admin"]),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }

    const { eventId, endTime } = req.params;

    try {
      const event = await getEvent(eventId);

      // Check event existence
      if (!event) {
        return res.status(404).json({
          error: {
            msg: `Event with id ${eventId} could not be found`,
          },
        });
      }

      // Grab event time-frame
      const [startTimeConverted, endTimeConverted] = getStartEndTimes(
        event,
        endTime
      );

      // Grabs all matches between start and end time in ballchasing with other parameters
      const tournamentResult = await axios.get(
        `https://ballchasing.com/api/replays?uploader=${event.uploader.steam64Id}&playlist=private&replay-date-after=${startTimeConverted}&replay-date-before=${endTimeConverted}&sort-by=replay-date`,
        config
      );

      // Process tournament result and pull data from it
      const [tournamentMatches, numOfWins, numOfMatches] = processTournament(
        tournamentResult,
        event
      );

      // Checks if tournament data exists already in db
      if((await Tournament.find({ eventId: eventId})).length > 0) {
        return res.status(409).json({
          error: {
            msg: `Tournament data already found for event with id ${eventId}`,
          }
        })
      }

      // Format Tournament metadata into Document and save
      const tournamentMetadata: ITournamentDocument = await saveTournamentMetadata(
        startTimeConverted,
        endTimeConverted,
        event,
        numOfWins,
        numOfMatches
      );

      // Process matches from tournament
      const matchMetaData: IMatchDocument[] = processMatchMetadata(
        tournamentMatches,
        tournamentMetadata._id
      );

      // Process stat data from matches
      for (let i = 0; i < numOfMatches; i++) {
        const [
          processedMatchMetadata,
          processedStatMetaData,
        ] = await processStatMetaData(matchMetaData[i]);

        if( processedMatchMetadata !== "Failed" && processedStatMetaData !== "Failed") {
          await processedMatchMetadata.save();
          await processedStatMetaData.save();
        } else {
          // Delete all the saved data associated with event so user can retry to collect all data
          Stat.deleteMany({ matchId: matchMetaData[0]._id });
          Match.deleteMany({ tournamentId: tournamentMetadata._id });
          Tournament.findByIdAndDelete(tournamentMetadata._id);

          return res.status(409).json({ error: {
              msg: `Processing tournament data for event ${eventId} has failed, please try again later` 
            }
          })
        }
      }

      res.status(200).json({ msg: "Successfully parsed tournament data!"});
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: {
          msg: `Server error while trying to grab stats for event with id ${eventId}`,
        },
      });
    }
  }
);

/**
 * Grabs event from database
 * @param eventId (string): Event ID in database
 */
const getEvent = async (eventId: string): Promise<IEventDocument | null> => {
  // Grab event from DB
  const event = await Event.findById(eventId)
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

  return event;
};

/**
 * Converts times to RFC3339 format
 * @param event (IEventDocument): Event from database
 * @param endTime (string): Event end time
 */
const getStartEndTimes = (
  event: IEventDocument,
  endTime: string
): [string, string] => {
  event.time.setHours(
    event.time.getHours() - event.time.getTimezoneOffset() / 60
  );
  const startTimeConverted = new Date(event.time)
    .toISOString()
    .replace("+", "%2B");

  const endTimeUTC = new Date(endTime);
  endTimeUTC.setHours(
    endTimeUTC.getHours() - endTimeUTC.getTimezoneOffset() / 60
  );
  const endTimeConverted = endTimeUTC.toISOString().trim().replace("+", "%2B");

  return [startTimeConverted, endTimeConverted];
};

/**
 * Processes ballchasing response data
 * @param tournament: tournament data from bc (number of matches, matches, ...)
 * @param event: Event from database to grab uploader's steam64Id
 */
const processTournament = (
  tournament: any,
  event: IEventDocument
): [{}[], number, number] => {
  const numOfMatches = tournament.data.count;
  let numWins: number = 0;
  let initTournamentMatches: {}[] = [];

  // Create initial object for each match, and calculate team wins
  tournament.data.list.forEach((match: any) => {
    if (
      match.blue.players.filter(
        (user: any) => user.id.id === event.uploader.steam64Id
      ).length > 0
    ) {
      initTournamentMatches.push({
        id: match.id,
        blue: {
          name: "FLORIDA POLY",
          goals: !!match.blue.goals ? match.blue.goals : 0,
        },
        orange: {
          name: "Opponent",
          goals: !!match.orange.goals ? match.orange.goals : 0,
        },
      });
      if (
        (!!match.orange.goals ? match.orange.goals : 0) <
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
          name: "FLORIDA POLY",
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

  return [initTournamentMatches, numWins, numOfMatches];
};

/**
 * Saves tournament to database
 * @param startTime (string): tournament start time
 * @param endTime  (string): tournament end time for the team
 * @param event (IEventDocument): event tied to tournament
 * @param numOfWins (number): number of games team won
 * @param numOfMatches  (number): total number of matches played
 */
const saveTournamentMetadata = async (
  startTime: string,
  endTime: string,
  event: IEventDocument,
  numOfWins: number,
  numOfMatches: number
): Promise<ITournamentDocument> => {
  const tournamentMetadata = {
    eventId: event._id,
    name: event.name,
    numberOfMatches: numOfMatches,
    numberOfWins: numOfWins,
    numberOfLosses: numOfMatches - numOfWins,
    startTime: new Date(startTime),
    endTime: new Date(endTime),
  };

  const newTournament = new Tournament(tournamentMetadata);

  // Save to DB
  return await newTournament.save();
};

/**
 * Processes match data in a friendlier format
 * @param tournamentMatches: array of match data
 * @param tournamentId: tournament of id to associate match to
 */
const processMatchMetadata = (
  tournamentMatches: {}[],
  tournamentId: string
): IMatchDocument[] => {
  const processedMatchMetadata: IMatchDocument[] = [];
  let matchMetadata: IMatchDocument;
  tournamentMatches.forEach(async (match: any) => {
    matchMetadata = new Match({
      tournamentId: tournamentId,
      replayId: match.id,
      blue: {
        name: match.blue.name,
        goals: match.blue.goals,
      },
      orange: {
        name: match.orange.name,
        goals: match.orange.goals,
      },
    });
    processedMatchMetadata.push(matchMetadata);
  });

  return processedMatchMetadata;
};

/**
 * Grabs stats from ballchasing and formats it, also updates match metadata as necessary
 * @param matchMetadata (IMatchDocument): Match associated with stat data
 */
const processStatMetaData = async (
  matchMetadata: IMatchDocument
): Promise<[IMatchDocument, IStatDocument] | ["Failed", "Failed"]> => {
  const statResponse = await axios({
    method: "GET",
    url: `https://ballchasing.com/api/replays/${matchMetadata.replayId}`,
    timeout: 2000,
    ...config,
  });

  // Update match data
  matchMetadata.orange.name === "FLORIDA POLY" &&
    !!statResponse.data.blue.name &&
    (matchMetadata.blue.name = statResponse.data.blue.name);
  matchMetadata.blue.name === "FLORIDA POLY" &&
    !!statResponse.data.orange.name &&
    (matchMetadata.orange.name = statResponse.data.orange.name);

  if( statResponse.data.status === ("failed" || "pending")) {
    return ["Failed", "Failed"];
  }

  // Create stat document
  const statMetadata: IStatDocument = new Stat({
    matchId: matchMetadata._id,
    orange: {
      players: statResponse.data.orange.players,
      stats: statResponse.data.orange.stats,
    },
    blue: {
      players: statResponse.data.blue.players,
      stats: statResponse.data.blue.stats,
    },
  });

  return [matchMetadata, statMetadata];
};

export default statsRouter;
