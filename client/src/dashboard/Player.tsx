import React, { useState, useEffect, useCallback } from "react";
import { getData } from "../utils/http";

const initPlayerData = (players: any) => {
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
  const [players, setPlayers] = useState<any>([]);
  const [carouselState, setCarouselState] = useState<number>(0);
  const initialize = useCallback(initPlayerData, [players]);
  // Grabs averages stat data
  const data = async () => {
    const [error, stats]: any[] = await getData("/api/summary/");

    if (error) {
      console.error(error);
    }

    !!stats && setPlayers(initialize(stats[0]));
  };

  useEffect(() => {
    data();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselState < players.length - 1) {
        setCarouselState((currentState: number) => {
          return currentState + 1;
        });
      } else if (carouselState === players.length - 1) {
        setCarouselState(() => {
          return 0;
        });
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [players, carouselState]);

  return (
    <div className="player-carousel">
      <div
        className="player-container"
        style={{
          width: `${players.length * 100}%`,
          transform: `translateX(-${(carouselState * 100) / players.length}%)`,
        }}
      >
        {players.map((player: any) => {
          return (
            <div
              className="player-stats"
              style={{
                width: `${100 / players.length}%`,
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
