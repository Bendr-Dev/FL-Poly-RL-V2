import React, { useState, useContext } from "react";
import { DATE_MAP, DAYS_OF_WEEK } from "../utils/date";
import { DateContext } from "./Dashboard";

interface ICalendarState {
  calendar: { [key: number]: Date }[];
  date: Date;
  start: number;
  end: number;
}

export default () => {
  const [dateState, setDateState] = useContext(DateContext);
  const initializeCalendar = (date: Date): { [key: number]: Date }[] => {
    // Takes the index of the day
    let startOfMonth = new Date(date.getFullYear(), date.getMonth()).getDay();
    // Hack to get days in current month
    let daysInMonth =
      32 - new Date(date.getFullYear(), date.getMonth(), 32).getDate();
    let daysInLastMonth =
      32 - new Date(date.getFullYear(), date.getMonth() + 1, 32).getDate();

    const newCalendar = [];

    for (let i = 0; i < 7 * 6; i++) {
      if (i < startOfMonth - 1) {
        newCalendar.push({
          [i]: new Date(
            date.getFullYear(),
            date.getMonth() - 1,
            daysInLastMonth - startOfMonth + (i + 1)
          ),
        });
      } else if (i > startOfMonth + daysInMonth - 1) {
        newCalendar.push({
          [i]: new Date(
            date.getFullYear(),
            date.getMonth() + 1,
            (i % daysInMonth) - startOfMonth + 1
          ),
        });
      } else {
        newCalendar.push({
          [i]: new Date(
            date.getFullYear(),
            date.getMonth(),
            i - startOfMonth + 1
          ),
        });
      }
    }

    return newCalendar;
  };

  const [calendarState, setCalendarState] = useState({
    date: new Date(),
    start: 999,
    end: 999,
    calendar: initializeCalendar(new Date()),
  });

  /**
   * Get the class of the given day's div based on start
   * and end date from state
   * @param day - the given day to be checked
   */
  const getCalendarClass = (
    day: number,
    type: "calendar-day" | "calendar-cell"
  ) => {
    const classes: string[] = [type];
    if (day === calendarState.start || day === calendarState.end) {
      if (type === "calendar-cell") {
        classes.push("week");
        if (day === calendarState.start) {
          classes.push("week-start");
        }
        if (day === calendarState.end) {
          classes.push("week-end");
        }
        return classes.join(" ");
      }
      classes.push("active");
    } else if (day > calendarState.start && day < calendarState.end) {
      classes.push("week");
    }

    let startOfMonth = new Date(
      calendarState.date.getFullYear(),
      calendarState.date.getMonth()
    ).getDay();

    // Hack to get days in current month
    let daysInMonth =
      32 -
      new Date(
        calendarState.date.getFullYear(),
        calendarState.date.getMonth(),
        32
      ).getDate();

    if (day < startOfMonth || day > startOfMonth + daysInMonth - 1) {
      classes.push("not-in-month");
    }

    return classes.join(" ");
  };
  /**
   * On click, ensure that the new selection is saved and that
   * there is atleast a 7 day difference between the start and end
   * @param day - the day of the given month
   */
  const onDayClick = (day: number) => {
    let start = calendarState.start;
    let end = calendarState.end;

    if (day <= end && day + 6 < 42) {
      start = day;
      end = start + 6;
    } else if (day >= end && day - 6 >= 0) {
      end = day;
      start = end - 6;
    } else {
      start = 999;
      end = 999;
    }

    console.log(calendarState.calendar[start]);
    setDateState({
      startDate: calendarState.calendar[start][start],
      endDate: calendarState.calendar[end][end],
    });

    setCalendarState({
      ...calendarState,
      start,
      end,
    });
  };

  const onMonthChange = (direction: -1 | 1) => {
    let month = calendarState.date.getMonth();
    let year = calendarState.date.getFullYear();

    if (month === 0 && direction === -1) {
      year -= 1;
      month = 11;
    } else if (month === 11 && direction === 1) {
      year += 1;
      month = 0;
    } else {
      month += direction;
    }

    setCalendarState({
      ...calendarState,
      calendar: initializeCalendar(new Date(year, month)),
      date: new Date(year, month),
    });
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        {calendarState.date.getMonth() === 0 &&
        calendarState.date.getFullYear() === 2015 ? (
          <div>
            <i className="fas fa-arrow-left"></i>
          </div>
        ) : (
          <div onClick={() => onMonthChange(-1)}>
            <i className="fas fa-arrow-left" style={{ color: "white" }}></i>
          </div>
        )}
        <div>
          <h2>
            {`${
              DATE_MAP[calendarState.date.getMonth()]["long"]
            } - ${calendarState.date.getFullYear()}`}
          </h2>
        </div>
        {calendarState.date.getMonth() === 11 &&
        calendarState.date.getFullYear() === 2025 ? (
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
              onClick={() => onDayClick(i)}
              className={getCalendarClass(i, "calendar-cell")}
            >
              <div className={getCalendarClass(i, "calendar-day")}>
                {day[i].getDate()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
