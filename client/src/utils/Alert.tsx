import React, { useContext, useEffect, Fragment } from "react";
import { AlertContext } from "../App";

export interface IAlert {
  type?: "warn" | "success";
  message: string;
  duration: number;
}

export interface IAlertState {
  alerts: IAlert[];
}

/**
 * Creates an alert object to be entered into the alert state
 * @param message - the message string to be displayed
 * @param duration - how long the message will be displayed in ms
 * @param type - whether the alert is a success, warn, or neutral alert
 */
export const createAlert = (
  message: string,
  duration: number = 3000,
  type?: "warn" | "success"
): IAlert => {
  return {
    message,
    type,
    duration,
  };
};

export default () => {
  const [alertState, setAlertStart] = useContext(AlertContext);

  const getClass = (alert: any): string => {
    const classes = ["alert"];
    alert.type && classes.push(alert.type);
    return classes.join(" ");
  };

  useEffect(() => {
    if (alertState.alerts[0]) {
      const timer = setTimeout(() => {
        setAlertStart((currentState: IAlertState) => {
          return {
            alerts: currentState.alerts.slice(1),
          };
        });
      }, alertState.alerts[0].duration);
      return () => clearTimeout(timer);
    }
  }, [alertState.alerts, setAlertStart]);

  return (
    <Fragment>
      {alertState.alerts[0] ? (
        <div className={getClass(alertState.alerts[0])}>
          <span>{alertState.alerts[0].message}</span>
        </div>
      ) : null}
    </Fragment>
  );
};
