import React, { useState, createContext } from "react";
import Events from "./Events";
import Calendar from "./Calendar";
import Recent from "./Recent";
import Player from "./Player";
import { start } from "repl";
import Alert from "../utils/Alert";

export interface IDateContext {
  startDate?: Date;
  endDate?: Date;
  init: boolean;
}

export const DateContext = createContext([{}, () => {}] as [IDateContext, any]);

const initDate = () => {
  const startDate = new Date();
  const endDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate() + 6
  );

  return {
    startDate,
    endDate,
    init: false,
  };
};

export default () => {
  const [dateState, setDateState] = useState(initDate());

  return (
    <DateContext.Provider value={[dateState, setDateState]}>
      <div className="dashboard">
        <Events></Events>
        <Calendar></Calendar>
        <Recent></Recent>
        <Player></Player>
      </div>
    </DateContext.Provider>
  );
};
