import React, { useContext, useEffect, useState, Fragment } from "react";
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

  const formatTime = (time: Date): string => {
    let hours = new Date(time).getHours();
    const minutes = new Date(time).getMinutes();
    let dayStatus: "PM" | "AM";

    if (hours >= 12 && hours !== 24) {
      dayStatus = "PM";
    } else {
      dayStatus = "AM";
    }

    if (hours > 12) {
      hours = hours - 12;
    }

    return `${hours}:${minutes} ${dayStatus}`;
  };

  return (
    <div className="weekly-events">
      <div className="weekly-header">
        <h2>Weekly Events</h2>
        {dateState.startDate || dateState.endDate ? (
          <span>
            {dateState.startDate?.toLocaleDateString()} to{" "}
            {dateState.endDate?.toLocaleDateString()}
          </span>
        ) : (
          <span></span>
        )}

        <div className="btn-small">+ Create Event</div>
      </div>
      <div className="line-break-primary"></div>
      <div className="weekly-body">
        {dateState.startDate &&
          !!events &&
          events.map((eventDay: any, index: number) => {
            const date = Object.keys(eventDay)[0];
            const day = new Date(date);
            day.setHours(25);
            let items: any;
            !!Object.values(eventDay)[0] &&
              (items = Object.values(eventDay)[0]);
            return (
              <Fragment key={date}>
                <div className="weekly-day">
                  <div className="day-header">
                    {DAYS_OF_WEEK[day.getDay()]["long"]}
                  </div>
                  {!!Object.values(eventDay)[0] &&
                    items.map((item: any, j: number) => {
                      return (
                        <div className="weekly-event" key={j}>
                          <span>{formatTime(item.time)}</span>{" "}
                          <div>{item.type}</div>
                        </div>
                      );
                    })}
                </div>
                {index !== 6 ? <div className="vertical-divider"></div> : ""}
              </Fragment>
            );
          })}
      </div>
    </div>
  );
};
