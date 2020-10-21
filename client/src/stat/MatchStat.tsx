import React, { useEffect, useState } from "react";
import { IStat } from "../../../common/interfaces/Stat.Interface";
import { getData } from "../utils/http";
import { useHistory } from "react-router-dom";
import { Bar, ChartData, Doughnut } from "react-chartjs-2";

export default (props: any) => {
  const [matchStats, setStats] = useState<IStat>();
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
  }, [])

if(matchStats) {
  /* Match statistics - formatted for ChartJS */
  const shootingPercentage: ChartData<any> = {
    labels: [props.location.state.orange.name, props.location.state.blue.name],
    options: {
      legend: {
        labels: {
          fontColor: "#fff"
        }
      },
      title: {
        display: true,
        text: "Shooting Percentage",
        fontColor: "#fff"
      },
      scales: {
        yAxes: [
          {
            ticks: {
              suggestedMin: 0,
              suggestedMax: 100,
              fontColor: "#fff"
            }
          }
        ],
        xAxes: [{
          ticks: {
            fontColor: "#fff"
          }
        }]
      },
    },
    datasets: [{
      label: "%",
      borderColor: ["rgb(255, 159, 0)", "rgb(12, 44, 252)"],
      backgroundColor: ["rgba(255, 159, 0, 0.2)", "rgba(12, 44, 252, 0.2)"],
      borderWidth: 1,
      data: [(matchStats.orange.stats.core.shooting_percentage as Number).toFixed(2), 
        (matchStats.blue.stats.core.shooting_percentage as Number).toFixed(2)]
    }]
  }
  const totalPossession: number = matchStats.orange.stats.ball.possession_time + matchStats.blue.stats.ball.possession_time;
  const possessionPercentage: ChartData<any> = {
    labels: [props.location.state.orange.name, props.location.state.blue.name],
    options: {
      legend: {
        labels: {
          fontColor: "#fff"
        }
      },
      title: {
        display: true,
        text: "Possession Percentage",
        fontColor: "#fff",
      }
    },
    datasets: [{
      borderColor: ["rgb(255, 159, 0)", "rgb(12, 44, 252)"],
      backgroundColor: ["rgba(255, 159, 0, 0.2)", "rgba(12, 44, 252, 0.2)"],
      borderWidth: 1,
      data: [(((matchStats.orange.stats.ball.possession_time / totalPossession) * 100 ) as Number).toFixed(2), 
        (((matchStats.blue.stats.ball.possession_time / totalPossession ) * 100) as Number).toFixed(2)]
    }]
  }

  const totalPressure: number =  matchStats.blue.stats.ball.time_in_side + matchStats.orange.stats.ball.time_in_side;
  const pressurePercentage: ChartData<any> = {
    labels: [props.location.state.orange.name, props.location.state.blue.name],
    options: {
      legend: {
        labels: {
          fontColor: "#fff"
        }
      },
      title: {
        display: true,
        text: "Pressure (Percentage ball was in opponents half)",
        fontColor: "#fff"
      },
    },
    datasets: [{
      label: "Pressure",
      borderColor: ["rgb(255, 159, 0)", "rgb(12, 44, 252)"],
      backgroundColor: ["rgba(255, 159, 0, 0.2)", "rgba(12, 44, 252, 0.2)"],
      borderWidth: 1,
      data: [(((matchStats.blue.stats.ball.time_in_side / totalPressure) * 100) as Number).toFixed(2), 
        (((matchStats.orange.stats.ball.time_in_side / totalPressure) * 100) as Number).toFixed(2)]
    }]
  }

  const demosInflicted: ChartData<any> = {
    labels: [props.location.state.orange.name, props.location.state.blue.name],
    options: {
      legend: {
        labels: {
          fontColor: "#fff"
        }
      },
      title: {
        display: true,
        text: "Demos Inflicted",
        fontColor: "#fff"
      },
      scales: {
        yAxes: [
          {
            ticks: {
              suggestedMin: 0,
              fontColor: "#fff",
            }
          }
        ],
        xAxes: [{
          ticks: {
            fontColor: "#fff"
          }
        }]
      },
    },
    datasets: [{
      label: "Number of Demos",
      borderColor: ["rgb(255, 159, 0)", "rgb(12, 44, 252)"],
      backgroundColor: ["rgba(255, 159, 0, 0.2)", "rgba(12, 44, 252, 0.2)"],
      borderWidth: 1,
      data: [(matchStats.orange.stats.demo.inflicted as Number).toFixed(2), 
        (matchStats.blue.stats.demo.inflicted as Number).toFixed(2)]
    }]
  }

  const zeroBoostTime: ChartData<any> = {
    labels: [props.location.state.orange.name, props.location.state.blue.name],
    options: {
      legend: {
        labels: {
          fontColor: "#fff"
        }
      },
      title: {
        display: true,
        text: "Time with Zero Boost",
        fontColor: "#fff"
      },
      scales: {
        yAxes: [
          {
            ticks: {
              suggestedMin: 0,
              fontColor: "#fff",
            }
          }
        ],
        xAxes: [{
          ticks: {
            fontColor: "#fff"
          }
        }]
      },
    },
    datasets: [{
      label: "Seconds",
      borderColor: ["rgb(255, 159, 0)", "rgb(12, 44, 252)"],
      backgroundColor: ["rgba(255, 159, 0, 0.2)", "rgba(12, 44, 252, 0.2)"],
      borderWidth: 1,
      data: [(matchStats.orange.stats.boost.time_zero_boost as Number).toFixed(2), 
        (matchStats.blue.stats.boost.time_zero_boost as Number).toFixed(2)]
    }]
  }

  const hundredBoostTime: ChartData<any> = {
    labels: [props.location.state.orange.name, props.location.state.blue.name],
    options: {
      legend: {
        labels: {
          fontColor: "#fff"
        }
      },
      title: {
        display: true,
        text: "Time with Full Boost",
        fontColor: "#fff"
      },
      scales: {
        yAxes: [
          {
            ticks: {
              suggestedMin: 0,
              fontColor: "#fff",
            }
          }
        ],
        xAxes: [{
          ticks: {
            fontColor: "#fff"
          }
        }]
      },
    },
    datasets: [{
      label: "Seconds",
      borderColor: ["rgb(255, 159, 0)", "rgb(12, 44, 252)"],
      backgroundColor: ["rgba(255, 159, 0, 0.2)", "rgba(12, 44, 252, 0.2)"],
      borderWidth: 1,
      data: [(matchStats.orange.stats.boost.time_full_boost as Number).toFixed(2), 
        (matchStats.blue.stats.boost.time_full_boost as Number).toFixed(2)]
    }]
  }

  const boostAmountWhileSuperSonic: ChartData<any> = {
    labels: [props.location.state.orange.name, props.location.state.blue.name],
    options: {
      legend: {
        labels: {
          fontColor: "#fff"
        }
      },
      title: {
        display: true,
        text: "Amount of Boost used while Supersonic",
        fontColor: "#fff"
      },
      scales: {
        yAxes: [
          {
            ticks: {
              suggestedMin: 0,
              fontColor: "#fff",
            }
          }
        ],
        xAxes: [{
          ticks: {
            fontColor: "#fff"
          }
        }]
      },
    },
    datasets: [{
      label: "Boost Amount",
      borderColor: ["rgb(255, 159, 0)", "rgb(12, 44, 252)"],
      backgroundColor: ["rgba(255, 159, 0, 0.2)", "rgba(12, 44, 252, 0.2)"],
      borderWidth: 1,
      data: [(matchStats.orange.stats.boost.amount_used_while_supersonic as Number).toFixed(2), 
        (matchStats.blue.stats.boost.amount_used_while_supersonic as Number).toFixed(2)]
    }]
  }
  
  let orangeSpeed: number = 0, blueSpeed: number = 0;
  matchStats.orange.players.forEach((player: any) => { orangeSpeed += player.stats.movement.avg_speed });
  matchStats.blue.players.forEach((player: any) => { blueSpeed += player.stats.movement.avg_speed });
  orangeSpeed = orangeSpeed / 3;
  blueSpeed = blueSpeed / 3;
  const averageSpeed: ChartData<any> = {
    labels: [props.location.state.orange.name, props.location.state.blue.name],
    options: {
      legend: {
        labels: {
          fontColor: "#fff"
        }
      },
      title: {
        display: true,
        text: "Average Speed (in unreal units per second)",
        fontColor: "#fff"
      },
      scales: {
        yAxes: [
          {
            ticks: {
              suggestedMin: 0,
              fontColor: "#fff",
            }
          }
        ],
        xAxes: [{
          ticks: {
            fontColor: "#fff"
          }
        }]
      },
    },
    datasets: [{
      label: "Speed (uu/s)",
      borderColor: ["rgb(255, 159, 0)", "rgb(12, 44, 252)"],
      backgroundColor: ["rgba(255, 159, 0, 0.2)", "rgba(12, 44, 252, 0.2)"],
      borderWidth: 1,
      data: [(orangeSpeed as Number).toFixed(2), 
        (blueSpeed as Number).toFixed(2)]
    }]
  }

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
          {matchStats.orange.players.map((player: any) => {
            return (<tr className="ms-player" key={player.name}>
                <td>{player.name}</td>
                <td>{player.stats.core.score}</td>
                <td>{player.stats.core.goals}</td>
                <td>{player.stats.core.assists}</td>
                <td>{player.stats.core.saves}</td>
                <td>{player.stats.core.shots}</td>
              </tr>);
          })}
          <tr>
            <td colSpan={2}>Total</td>
            <td>{matchStats.orange.stats.core.goals}</td>
            <td>{matchStats.orange.stats.core.assists}</td>
            <td>{matchStats.orange.stats.core.saves}</td>
            <td>{matchStats.orange.stats.core.shots}</td>
          </tr>
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
          {matchStats.blue.players.map((player: any) => {
            return (<tr className="ms-player" key={player.name}>
                <td>{player.name}</td>
                <td>{player.stats.core.score}</td>
                <td>{player.stats.core.goals}</td>
                <td>{player.stats.core.assists}</td>
                <td>{player.stats.core.saves}</td>
                <td>{player.stats.core.shots}</td>
              </tr>);
          })}
          <tr>
            <td colSpan={2}>Total</td>
            <td>{matchStats.blue.stats.core.goals}</td>
            <td>{matchStats.blue.stats.core.assists}</td>
            <td>{matchStats.blue.stats.core.saves}</td>
            <td>{matchStats.blue.stats.core.shots}</td>
          </tr>
        </table>
      </div>
      <div>
        <div className="ms-stat-box">
          <Bar data={shootingPercentage} options={shootingPercentage.options} />
          <Bar data={demosInflicted} options={demosInflicted.options} />
          <Doughnut data={possessionPercentage} options={possessionPercentage.options} />
          <Doughnut data={pressurePercentage} options={pressurePercentage.options} />
        </div>  
        
        <div className="ms-stat-box">
          <Bar data={zeroBoostTime} options={zeroBoostTime.options} />
          <Bar data={hundredBoostTime} options={hundredBoostTime.options} />
          <Bar data={boostAmountWhileSuperSonic} options={boostAmountWhileSuperSonic.options} />
          <Bar data={averageSpeed} options={averageSpeed.options} />
        </div>
      </div>
    </div> );
} else {
  return <div className="loading-spinner"></div>
}

};
