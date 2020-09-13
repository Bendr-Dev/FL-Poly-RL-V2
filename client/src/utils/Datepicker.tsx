import React, { Fragment } from "react";
import { DATE_MAP } from "../utils/date";

export interface IDatePickerState {
  month: string;
  day: string;
  year: string;
  hour: string;
  minute: string;
}

export default (props: any) => {
  const onChange = (e: any) => {
    if (e.target.name === "month") {
      props.setDatePickerData({
        [e.target.name]: e.target.value,
        day: "1",
        year: props.datePickerData.year,
        hour: "12",
        minute: "00",
      });
    } else {
      props.setDatePickerData({
        ...props.datePickerData,
        [e.target.name]: e.target.value,
      });
    }
  };

  /**
   * Loops through date util object and returns array of option elements
   * with values being each month
   */
  const monthOptions = () => {
    const monthArray = [];

    for (const month in DATE_MAP) {
      monthArray.push(
        <option key={month} value={DATE_MAP[month].long}>
          {DATE_MAP[month].long}
        </option>
      );
    }

    return monthArray;
  };

  /**
   * Calculates and returns array of option elements with day as value
   * based off of year and month given
   * @param year (string)
   * @param month (string)
   */
  const dayOptions = (year: string, month: string) => {
    const dayArray = [];
    const monthNum = new Date(Date.parse(month + " 1, " + year)).getMonth() + 1;
    const numDaysInMonth = new Date(parseInt(year), monthNum, 0).getDate();

    for (let index = 1; index <= numDaysInMonth; index++) {
      dayArray.push(
        <option key={index.toString()} value={index.toString()}>
          {index.toString()}
        </option>
      );
    }

    return dayArray;
  };

  /**
   * Calculates and returns array of 3 option elements (-1, 0, +1) years with values
   * based off of current year
   */
  const yearOptions = () => {
    const yearArray = [];
    const yearNum =
      new Date(
        Date.parse(
          props.datePickerData.month + "1, " + props.datePickerData.year
        )
      ).getFullYear() - 1;

    for (let index = 0; index < 3; index++) {
      yearArray.push(
        <option
          key={(yearNum + index).toString()}
          value={(yearNum + index).toString()}
        >
          {(yearNum + index).toString()}
        </option>
      );
    }

    return yearArray;
  };

  return (
    <div className="datepicker">
      <select
        name="month"
        value={props.datePickerData.month}
        onChange={onChange}
      >
        {monthOptions()}
      </select>
      <select name="day" value={props.datePickerData.day} onChange={onChange}>
        {dayOptions(props.datePickerData.year, props.datePickerData.month)}
      </select>
      <select name="year" value={props.datePickerData.year} onChange={onChange}>
        {yearOptions()}
      </select>
      <select>
        <option>Hour 1</option>
        <option>Hour 2</option>
        <option>Hour 3</option>
      </select>
      <select>
        <option>Minute 1</option>
        <option>Minute 2</option>
        <option>Minute 3</option>
      </select>
    </div>
  );
};
