import React, { useEffect, useState } from "react";
import { IStat } from "../../../common/interfaces/Stat.Interface";
import { getData } from "../utils/http";
import { useHistory } from "react-router-dom";
import { Bar } from "react-chartjs-2";

export default (props: any) => {
  const [stats, setStats] = useState<IStat>();
  const history = useHistory();

  const goBack = () => {
    history.goBack();
  };

  useEffect(() => {
    const getMatchStats = async () => {
      const [error, stats]: any = await getData( `/api/tournaments/match/${props.location.state._id}`);

      if (error) {
        console.error(error);
      }

      !!stats && setStats(stats);
    }
    getMatchStats();
    console.log(props);
  }, [])
  
  const data= {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [{
    label: "My First dataset",
    backgroundColor: 'rgb(255, 99, 132)',
    borderColor: 'rgb(255, 99, 132)',
    data: [0, 10, 5, 2, 20, 30, 45],
    }]
}

if(stats) {
  return (
    <div className="ms-container">
      <div className="ms-header">
        <div>
          <i className="fas fa-arrow-left" onClick={() => goBack()}></i>
        </div>
        <div>
          <div>
            <h1>{props.location.state.orange.name}</h1>
          </div>
          <div>
            <h1 className="ms-home-color">{props.location.state.orange.goals}</h1>
          </div>
        </div>
        <div>
          <div>
            <h1>{props.location.state.blue.name}</h1>
          </div>
          <div>
            <h1 className="ms-away-color">{props.location.state.blue.goals}</h1>
          </div>
        </div>
      </div>
      <div className="ms-players">
        <table className="ms-orange">
          <tr>
            <td>Name</td>
            <td>Score</td>
            <td>Goals</td>
            <td>Assists</td>
            <td>Saves</td>
            <td>Shots</td>
          </tr>
          {stats.orange.players.map((player: any) => {
            return (<tr className="ms-player" key={player.name}>
                <td>{player.name}</td>
                <td>{player.stats.core.score}</td>
                <td>{player.stats.core.goals}</td>
                <td>{player.stats.core.assists}</td>
                <td>{player.stats.core.saves}</td>
                <td>{player.stats.core.shots}</td>
              </tr>);
          })}
        </table>
        <table className="ms-blue">
          <tr>
            <td>Name</td>
            <td>Score</td>
            <td>Goals</td>
            <td>Assists</td>
            <td>Saves</td>
            <td>Shots</td>
          </tr>
          {stats.blue.players.map((player: any) => {
            return (<tr className="ms-player" key={player.name}>
                <td>{player.name}</td>
                <td>{player.stats.core.score}</td>
                <td>{player.stats.core.goals}</td>
                <td>{player.stats.core.assists}</td>
                <td>{player.stats.core.saves}</td>
                <td>{player.stats.core.shots}</td>
              </tr>);
          })}
        </table>
      </div>
    </div> );
} else {
  return <div className="loading-spinner"></div>
}

};
