import React, { useContext, useEffect, useState } from "react";
import { DateContext } from "./Dashboard";
import { getData } from "../utils/http";
import { DAYS_OF_WEEK } from "../utils/date";

export default () => {
  const [dateState, setDateState] = useContext(DateContext);
  const [events, setEvents] = useState<any>([]);

  useEffect(() => {
    const data = async () => {
      if (dateState.startDate && dateState.endDate) {
        const [error, events]: any[] = await getData(
          `/api/events/weekly/${dateState.startDate
            ?.toISOString()
            .replace(/\//g, "-")}&${dateState.endDate
            ?.toISOString()
            .replace(/\//g, "-")}`
        );

        if (error) {
          console.error(error);
        }

        !!events && setEvents(events);
      }
    };
    data();
  }, [dateState]);

  return (
    <div className="weekly-events">
      <div className="weekly-header">
        <h2>Weekly Events</h2>
        <span>
          {dateState.startDate?.toLocaleDateString()} to{" "}
          {dateState.endDate?.toLocaleDateString()}
        </span>
        <div>Button here</div>
      </div>
      <div className="line-break-primary"></div>
      <div className="weekly-body">
        {!!events &&
          events.map((eventDay: any) => {
            const date = Object.keys(eventDay)[0];
            const day = new Date(date);
            day.setHours(25);
            let items: any;
            !!Object.values(eventDay)[0] &&
              (items = Object.values(eventDay)[0]);
            return (
              <div key={date} className="weekly-day">
                <div className="day-header">
                  {DAYS_OF_WEEK[day.getDay()]["long"]}
                </div>
                {!!Object.values(eventDay)[0] &&
                  items.map((item: any, index: number) => {
                    return (
                      <div className="weekly-event" key={index}>
                        {item.type}
                      </div>
                    );
                  })}
              </div>
            );
          })}
      </div>
    </div>
  );
};
