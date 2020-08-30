import React, { useState, createContext } from "react";
import Events from "./Events";
import Calendar from "./Calendar";
import Recent from "./Recent";
import Player from "./Player";

export interface IDateState {
  startDate?: Date;
  endDate?: Date;
  init: boolean;
}

export const DateContext = createContext<
  [IDateState, React.Dispatch<React.SetStateAction<IDateState>>]
>([
  {
    init: false,
  },
  () => {},
]);

// Initializes the date state
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
  const [dateState, setDateState] = useState<IDateState>(initDate());

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
