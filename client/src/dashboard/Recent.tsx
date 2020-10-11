import React, { useEffect, useState } from "react";
import { ITournament } from "../common/Tournament.Interface";
import { getData } from "../utils/http";

export default () => {
  const [tournaments, setTournaments] = useState<ITournament[]>([]);

  useEffect(() => {
    const data = async () => {
      const [error, tournaments]: any[] = await getData(
        "/api/tournaments/recent/3"
      );

      if (error) {
        console.error(error);
      }

      !!tournaments && setTournaments(tournaments);
    };
    data();
  }, []);

  return (
    <div className="recent-tournaments">
      <div className="tournament-header">
        <h3>Recent Results</h3>
        <span>W - L</span>
      </div>
      <div className="line-break-primary"></div>
      <div className="tournament-body">
        {tournaments.map((tournament: any) => {
          return (
            <div key={tournament._id} className="tournament-row">
              <div className="tournament-name">{tournament.name}</div>
              <div className="tournament-record">
                {tournament.numberOfWins} - {tournament.numberOfLosses}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
