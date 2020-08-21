import React, { useEffect, useState } from "react";
import { getData } from "../utils/http";

export default () => {
  const [tournaments, setTournaments] = useState<any>([]);

  useEffect(() => {
    const data = async () => {
      const tournaments: any[] = await getData("/api/tournaments/recent/5");

      !!tournaments && setTournaments(tournaments);
    };
    data();
  }, []);

  return (
    <div className="recent-tournaments">
      <div className="tournament-header">
        <h3>Recent Tournaments</h3>
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
