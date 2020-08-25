import React, { useState, useContext, useCallback, useEffect } from "react";
import { DATE_MAP, DAYS_OF_WEEK } from "../utils/date";
import { DateContext } from "./Dashboard";
import { start } from "repl";

interface ICalendarState {
  calendar: Date[];
  monthOffset: number;
}

const dateComparison = (
  first: Date | undefined,
  second: Date | undefined
): boolean => {
  return (
    (first &&
      second &&
      first.toLocaleDateString() === second.toLocaleDateString()) ||
    false
  );
};

export default () => {
  const [dateState, setDateState] = useContext(DateContext);
  const [calendarState, setCalendarState] = useState<ICalendarState>({
    calendar: [],
    monthOffset: 0,
  });

  const initializeCalendar = (): void => {
    // Takes the index of the day

    let tempDate = new Date();
    let date = new Date(
      tempDate.getFullYear(),
      tempDate.getMonth() + calendarState.monthOffset
    );

    if (dateState.init && dateState.startDate) {
      date = new Date(
        dateState.startDate.getFullYear(),
        dateState.startDate.getMonth() + calendarState.monthOffset
      );
    }

    let startOfMonth = new Date(date.getFullYear(), date.getMonth()).getDay();

    console.log(startOfMonth);
    console.log(
      new Date(date.getFullYear(), date.getMonth() + calendarState.monthOffset)
    );

    const newCalendar: Date[] = [];

    for (let i = 0; i < 7 * 6; i++) {
      newCalendar.push(
        new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate() - startOfMonth + i
        )
      );
    }

    setCalendarState((previousState) => {
      return {
        ...previousState,
        calendar: newCalendar,
      };
    });
  };

  const initalize = useCallback(initializeCalendar, [
    calendarState.monthOffset,
  ]);
  const getDate = useCallback(() => {
    const tempDate = new Date();
    const date = new Date(
      tempDate.getFullYear(),
      tempDate.getMonth() + calendarState.monthOffset
    );

    return `${DATE_MAP[date.getMonth()]["long"]} - ${date.getFullYear()}`;
  }, [calendarState.monthOffset]);
  useEffect(initalize, [calendarState.monthOffset]);

  /**
   * Get the class of the given day's div based on start
   * and end date from state
   * @param day - the given day to be checked
   */
  const getCalendarClass = (
    day: Date,
    type: "calendar-day" | "calendar-cell"
  ) => {
    const classes: string[] = [type];
    if (
      dateComparison(day, dateState.startDate) ||
      dateComparison(day, dateState.endDate)
    ) {
      if (type === "calendar-cell") {
        classes.push("week");
        if (dateComparison(day, dateState.startDate)) {
          classes.push("week-start");
        }
        if (dateComparison(day, dateState.endDate)) {
          classes.push("week-end");
        }
        return classes.join(" ");
      }
      classes.push("active");
    } else if (
      dateState.startDate &&
      day > dateState.startDate &&
      dateState.endDate &&
      day < dateState.endDate
    ) {
      classes.push("week");
    }

    const tempDate = new Date();
    const date = new Date(
      tempDate.getFullYear(),
      tempDate.getMonth() + calendarState.monthOffset
    );

    if (
      day.getFullYear() === date.getFullYear() &&
      day.getMonth() !== date.getMonth()
    ) {
      classes.push("not-in-month");
    }

    return classes.join(" ");
  };
  /**
   * On click, ensure that the new selection is saved and that
   * there is atleast a 7 day difference between the start and end
   * @param day - the day of the given month
   */
  const onDayClick = (day: Date, index: number) => {
    let startDate: Date | undefined = undefined;
    let endDate: Date | undefined = undefined;

    if ((dateState.endDate && day <= dateState.endDate) || index + 6 < 42) {
      startDate = day;
      endDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate() + 6
      );
    } else if (
      (dateState.startDate && day <= dateState.startDate) ||
      index - 6 >= 0
    ) {
      endDate = day;
      startDate = new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate() - 6
      );
    } else {
      startDate = undefined;
      endDate = undefined;
    }

    setDateState({
      startDate,
      endDate,
    });
  };

  const onMonthChange = (direction: -1 | 1) => {
    setDateState(() => {
      return {
        startDate: undefined,
        endDate: undefined,
      };
    });

    setCalendarState((previousState) => {
      return {
        ...calendarState,
        monthOffset: previousState.monthOffset + direction,
      };
    });
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        {calendarState.monthOffset <= -24 ? (
          <div>
            <i className="fas fa-arrow-left"></i>
          </div>
        ) : (
          <div onClick={() => onMonthChange(-1)}>
            <i className="fas fa-arrow-left" style={{ color: "white" }}></i>
          </div>
        )}
        <div>
          <h2>{getDate()}</h2>
        </div>
        {calendarState.monthOffset >= 24 ? (
          <div>
            <i className="fas fa-arrow-right"></i>
          </div>
        ) : (
          <div onClick={() => onMonthChange(1)}>
            <i className="fas fa-arrow-right" style={{ color: "white" }}></i>
          </div>
        )}
      </div>
      <div className="line-break-primary"></div>
      <div className="calendar-body">
        {Object.values(DAYS_OF_WEEK).map((day: any) => {
          return (
            <div className="calendar-cell" key={day["short"]}>
              {day["short"]}
            </div>
          );
        })}
        {calendarState.calendar.map((day, i) => {
          return (
            <div
              key={i}
              onClick={() => onDayClick(day, i)}
              className={getCalendarClass(day, "calendar-cell")}
            >
              <div className={getCalendarClass(day, "calendar-day")}>
                {day.getDate()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
