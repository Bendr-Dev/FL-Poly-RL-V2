import React, { useEffect, useState } from "react";
import { getData } from "../utils/http";
import { IMatch } from "../../../common/interfaces/Match.Interface";
import { useHistory } from "react-router-dom";

export default (props: any) => {
  const [matches, setMatches] = useState<IMatch[]>([]);
  const history = useHistory();

  const goBack = () => {
    history.goBack();
  };

  /**
   * Routes user to spccific match page
   * @param match: match user is viewing 
   */
  const onClickReroute = (match: any) => {
    history.push(
      `/tournaments/${props.location.state.eventId}/match/${match._id}`,
      match
    );
  };

  useEffect(() => {
    const getMatches = async () => {
      const [error, matches]: any = await getData(
        `/api/tournaments/${props.location.state._id}/matches`
      );

      if (error) {
        console.log(error);
      }

      !!matches && setMatches(matches);
    };
    getMatches();
  });

  return (
    <div className="tournament-match">
      <div className="tm-header">
        <div>
          <i className="fas fa-arrow-left" onClick={() => goBack()}></i>
        </div>
        <h1>{props.location.state.name}</h1>
      </div>
      <div className="tm-content">
        <div className="tm-subheader">
          <h2>Matches</h2>
          <h2>Total played: {props.location.state.numberOfMatches}</h2>
        </div>
        <div className="line-break-primary"></div>
        {matches.map((match: IMatch) => {
          return (
            <div
              className="tm-match"
              key={match.replayId}
              onClick={() => onClickReroute(match)}
            >
              <div className="tm-match-orange">
                <div>
                  <p>{match.orange.name}</p>
                </div>
                <div>
                  <p>{match.orange.goals}</p>
                </div>
              </div>
              {"-"}
              <div className="tm-match-blue">
                <div>
                  <p>{match.blue.goals}</p>
                </div>
                <div>
                  <p>{match.blue.name}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
