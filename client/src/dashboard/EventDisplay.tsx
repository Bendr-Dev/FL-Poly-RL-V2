import React, { useContext, useEffect, useState } from "react";
import { AlertContext, IModalComponentProps } from "../App";
import { IUser } from "../common/User.Interface";
import { Link } from "react-router-dom";
import { getData, updateData } from "../utils/http";
import Datepicker, { IDatePickerState } from "../utils/Datepicker";
import { DATE_MAP } from "../utils/date";
import { createAlert } from "../utils/Alert";
import { IEvent } from "../common/Event.Interface";
import { IStat } from "../../../common/interfaces/Stat.Interface";

export default (props: IModalComponentProps) => {
  const { componentState, onModalCleanup } = props;
  const [alertState] = useContext(AlertContext);

  const formatDate = (datePickerValue: IDatePickerState): string => {
    for (const [key, value] of Object.entries(datePickerValue)) {
      if (value.length === 1) {
        value.replace(/^/, "0");
      }
    }
    return (
      datePickerData.month +
      " " +
      datePickerData.day +
      ", " +
      datePickerData.year +
      " " +
      datePickerData.hour +
      ":" +
      datePickerData.minute
    );
  };

  let selectedDate: Date = new Date();
  let selectedDateString: string = "";
  const [datePickerData, setDatePickerData] = useState<IDatePickerState>({
    month: DATE_MAP[selectedDate.getMonth()].long,
    day: selectedDate.getDate().toString(),
    year: selectedDate.getFullYear().toString(),
    hour: selectedDate.getHours().toString(),
    minute: selectedDate.getMinutes().toString(),
  });
  selectedDateString = formatDate(datePickerData);

  const event = componentState.event;

  const formatTime = componentState.formatTime;

  useEffect(() => {
    selectedDate = new Date(
      datePickerData.month +
        " " +
        datePickerData.day +
        ", " +
        datePickerData.hour +
        ":" +
        datePickerData.minute +
        ":00"
    );
    selectedDateString = formatDate(datePickerData);
    selectedDate = new Date(selectedDateString);
  }, [datePickerData]);

  /**
   * Grabs event data from ballchasing with user click
   * @param eventId: event id to pull stats from
   */
  const onClickGetData = async (eventId: string) => {
    try {
      const [error, response] = await getData<IStat>(`/api/stats/bc/${eventId}/${selectedDate}`);

      if(error !== null || undefined) {
        alertState.alerts.push(createAlert(error.msg, 5000, "warn"));
      }
      
      alertState.alerts.push(createAlert("Data was successfully obtained", 5000, "success"));
      
      onModalCleanup();
    } catch(error) {
      console.error(error);
    }
  }

  /**
   * Updates event on user click to be completed
   * @param eventId: event id to use to update event in db
   */
  const onClickCompleteEvent = async (eventId: string) => {
    try {
      const updatedEvent: IEvent = {
        ...event,
        isCompleted: true
      }

      const [error, response] = await updateData(`/api/events/edit/${eventId}`, updatedEvent);
      if(error !== null) {
        alertState.alerts.push(createAlert(error.msg, 5000, "warn"));
      }
      
      alertState.alerts.push(createAlert("Successfully updated Event", 5000, "success"));

      onModalCleanup();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="event-form">
      <div className="form-header">
        <h1>{event.name}</h1>
      </div>
      <div className="line-break-primary"></div>
      <div className="event-content">
        <div className="event-column">
          <div className="event-row">
            <div>Type:</div>
            <div>{event.type}</div>
          </div>
          <div className="event-row">
            <div>Format:</div>
            <div>{event.format}</div>
          </div>
          <div className="event-row">
            <div>Time:</div>
            <div>{formatTime(event.time)}</div>
          </div>
          <div className="event-row">
            <div>Attending:</div>
            {!!event.attending &&
              event.attending.map((user: IUser) => {
                return (
                  <div key={user.steam64Id} className="event-attending-user">
                    {user.username}
                  </div>
                );
              })}
          </div>
          {!!event.link && event.link !== "N/A" ? (
            <div className="event-row">
              <div>Link:</div>
              <div>
                <Link to={event.link}>Link</Link>
              </div>
            </div>
          ) : null}
          <div className="event-row">
            <div>Completed:</div>
            {event.isCompleted ? (
              <div>
                <i className="fa fa-check" />
              </div>
            ) : (
              <div>
                <i className="fa fa-times" />
              </div>
            )}
          </div>
          {!event.isCompleted ? (
            <input className="btn" type="submit" value="Complete Event" onClick={() => onClickCompleteEvent(event._id)} />
            ): null }
          {event.isCompleted && event.type === "Tournament" ? (
            <div className="event-submit">
              <div>End Time:</div>
              <Datepicker
                datePickerData={datePickerData}
                setDatePickerData={setDatePickerData}>
              </Datepicker>
              <input className="btn" type="submit" value="Get Data" onClick={() => onClickGetData(event._id)}/>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
