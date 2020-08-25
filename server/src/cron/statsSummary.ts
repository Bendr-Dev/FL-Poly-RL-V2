import cron from "node-cron";
import User from "../models/User";
import Stat from "../models/Stat";
import Match from "../models/Match";
import Tournament from "../models/Tournament";

const TEAM_NAME = "FLORIDA POLY";

// Goals, Assists, Saves, Shots

export default async () => {
  //   cron.schedule("* * * * *", () => {
  //     console.log("test");
  //   });

  const playersSummary: any = {};

  const matchStats: any = await Stat.find().populate({
    path: "matchId",
    populate: {
      path: "tournamentId",
      select: "startTime",
      model: Tournament,
    },
  });

  matchStats.forEach((match: any) => {
    const teamColor: string =
      match["matchId"]["blue"]["name"] === TEAM_NAME ? "blue" : "orange";
    const teamPlayers = match[teamColor]["players"];

    teamPlayers.forEach((player: any) => {
      if (!playersSummary[player.name]) {
        playersSummary[player.name] = {
          goals: [player["stats"]["core"]["goals"]],
          shots: [player["stats"]["core"]["shots"]],
          assists: [player["stats"]["core"]["assists"]],
          saves: [player["stats"]["core"]["saves"]],
        };
      } else {
        playersSummary[player.name]["goals"].push(
          player["stats"]["core"]["goals"]
        );
        playersSummary[player.name]["shots"].push(
          player["stats"]["core"]["shots"]
        );
        playersSummary[player.name]["assists"].push(
          player["stats"]["core"]["assists"]
        );
        playersSummary[player.name]["saves"].push(
          player["stats"]["core"]["saves"]
        );
      }
    });
  });

  Object.keys(playersSummary).forEach((playerName: string) => {
    Object.keys(playersSummary[playerName]).forEach((stat: string) => {
      playersSummary[playerName][`${stat}_avg`] =
        playersSummary[playerName][stat].reduce((a: any, b: any) => a + b) /
        playersSummary[playerName][stat].length;
    });
  });

  console.log(playersSummary);
  return playersSummary;
};
