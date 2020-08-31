import React from "react";
import { IModalComponentProps } from "../App";
import { IUser } from "../common/User.Interface";
import { Link } from "react-router-dom";
import { link } from "fs";

export default (props: IModalComponentProps) => {
  const { componentState, onModalCleanup } = props;

  const event = componentState.event;

  const formatTime = componentState.formatTime;

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
          {event.isCompleted ? (
            <input className="btn" type="submit" value="Get Data" />
          ) : null}
        </div>
      </div>
    </div>
  );
};
