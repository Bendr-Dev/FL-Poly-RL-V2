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

export const createAlerts = (
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
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [alertState.alerts]);

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
