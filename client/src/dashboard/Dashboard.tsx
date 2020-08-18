import React, { useState } from "react";
import Events from "./Events";
import Calendar from "./Calendar";
import Recent from "./Recent";
import Player from "./Player";

export interface IDateContext {
  startDate?: Date;
  endDate?: Date;
}

export const DateContext = React.createContext([{}, () => {}] as [
  IDateContext,
  any
]);

export default () => {
  const [dateState, setDateState] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
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
