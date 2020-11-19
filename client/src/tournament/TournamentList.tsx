import React, { useEffect, useState } from "react";
import { ITournament } from "../common/Tournament.Interface";
import { getData } from "../utils/http";
import { useHistory } from "react-router-dom";

export default () => {
  const [tournaments, setTournaments] = useState<ITournament[]>([]);
  const [isMoreTournaments, setIsMoreTournaments] = useState<Boolean>(false);
  const [numberOfTournaments, setNumberOfTournaments] = useState<number>(8);
  const history = useHistory();

  /**
   * Higher order function that grabs tournament data from backend
   */
  useEffect(() => {
    const getTournaments = async () => {
      const [error, tournaments]: any = await getData(
        `/api/tournaments/recent/${numberOfTournaments}`
      );

      if (error) {
        console.log(error);
      }

      // Check if there are more tournaments to possibly display
      if (tournaments.length < numberOfTournaments) {
        setIsMoreTournaments(false);
      } else {
        setIsMoreTournaments(true);
      }

      !!tournaments && setTournaments(tournaments);
    };
    getTournaments();
  }, [numberOfTournaments]);

  /**
   * Directs user to tournament component to view more data
   * @param tournament (ITournament): tournament to get more insights/stats
   */
  const onClickReroute = (tournament: ITournament) => {
    history.push(`/tournaments/${tournament.eventId}`, tournament);
  };

  const onClickPopulate = () => {
    setNumberOfTournaments(2 * numberOfTournaments);
  }
  
  return (
    <div className="tournament-list">
      <div className="tournament-header">
        <h2>Tournaments</h2>
      </div>
      {tournaments.map((tournament: ITournament) => {
        return (
          <div
            className="tournament-item"
            key={tournament.eventId}
            onClick={() => onClickReroute(tournament)}
          >
            <span>{tournament.startTime.toString().slice(0, 10)}</span>
            <span>{tournament.name}</span>
            <span>Total Matches: {tournament.numberOfMatches}</span>
          </div>
        );
      })}
      <div className="tournament-list-actions">
      {isMoreTournaments && 
        <input className="btn" type="submit" onClick={() => onClickPopulate()} value="Get more Tournaments"/>   
      }
      </div>
      
    </div>
  );
};
