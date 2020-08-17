import React from "react";
import Events from "./Events";
import Calendar from "./Calendar";
import Recent from "./Recent";
import Player from "./Player";

export default () => {
  return (
    <div className="dashboard">
      <Events></Events>
      <Calendar></Calendar>
      <Recent></Recent>
      <Player></Player>
    </div>
  );
};
