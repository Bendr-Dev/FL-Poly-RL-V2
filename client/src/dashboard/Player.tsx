import React, { useState, useEffect, useCallback } from "react";
import { getData } from "../utils/http";

interface IPlayer {
  name: string;
  goalsAvg: number;
  assistsAvg: number;
  shotsAvg: number;
  savesAvg: number;
}

interface IStatSummary {
  stats: {
    [key: string]: IPlayer;
  };
}

const initPlayerData = (players: IStatSummary): IPlayer[] => {
  return Object.keys(players.stats).map((key: string) => {
    return {
      name: key,
      goalsAvg: players.stats[key].goalsAvg,
      assistsAvg: players.stats[key].assistsAvg,
      shotsAvg: players.stats[key].shotsAvg,
      savesAvg: players.stats[key].savesAvg,
    };
  });
};

export default () => {
  const [players, setPlayers] = useState<IPlayer[]>([]);
  const [carouselState, setCarouselState] = useState<number>(0);
  const initialize = useCallback(initPlayerData, [players]);
  // Grabs averages stat data
  const data = async () => {
    const [error, stats] = await getData<IStatSummary[]>("/api/summary/");

    if (error) {
      console.error(error);
    }

    !!stats && setPlayers(initialize(stats[0]));
  };

  useEffect(() => {
    data();
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselState === 0) {
        setCarouselState(1);
      } else if (carouselState === 1) {
        setCarouselState(0);
        setPlayers((currentState) => {
          return [...currentState.slice(1), ...currentState.slice(0, 1)];
        });
      }
    }, 2500);
    return () => clearInterval(interval);
  }, [players, carouselState]);

  return (
    <div className="player-carousel">
      <div
        className="player-container"
        style={
          carouselState === 1
            ? {
                width: `${100 * players.length}%`,
                transform: `translateX(-${
                  (carouselState * 100) / players.length
                }%)`,
              }
            : {
                width: `${100 * players.length}%`,
                transform: `translateX(-${
                  (carouselState * 100) / players.length
                }%)`,
                transition: "none",
              }
        }
      >
        {players.map((player: any) => {
          return (
            <div
              className="player-stats"
              style={{
                width: `100%`,
              }}
              key={player.name}
            >
              <div>
                <h1>{`${player.name}`}</h1>
              </div>
              <div className="line-break-vertical"></div>
              <div>
                {" "}
                <span>Goals:</span> {`${player.goalsAvg}`}
              </div>
              <div className="line-break-vertical"></div>
              <div>
                {" "}
                <span>Assists:</span> {`${player.assistsAvg}`}
              </div>{" "}
              <div className="line-break-vertical"></div>
              <div>
                {" "}
                <span>Shots:</span> {`${player.shotsAvg}`}
              </div>
              <div className="line-break-vertical"></div>
              <div>
                {" "}
                <span>Saves:</span> {`${player.savesAvg}`}
              </div>{" "}
            </div>
          );
        })}
      </div>
    </div>
  );
};
