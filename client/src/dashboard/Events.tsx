import React, { useContext } from "react";
import { DateContext } from "./Dashboard";

export default () => {
  const [dateState, setDateState] = useContext(DateContext);
  return (
    <div className="weekly-events">
      <span>
        {dateState.startDate?.toLocaleDateString()} -{" "}
        {dateState.endDate?.toLocaleDateString()}
      </span>
    </div>
  );
};
