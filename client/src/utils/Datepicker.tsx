import React from "react";
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

  const hourOptions = () => {
    const hourArray = [];
    const tempDate = new Date();
    for (let index = 0; index < 24; index++) {
      tempDate.setHours(index);
      const hourString: string = tempDate
        .toLocaleTimeString()
        .replace(/:\d\d:\d\d/, "");
      hourArray.push(
        <option key={index.toString()} value={index.toString()}>
          {hourString}
        </option>
      );
    }

    return hourArray;
  };

  const minuteOptions = () => {
    const minuteArray = [];
    for (let index = 0; index < 60; index++) {
      if (index % 10 === index) {
        minuteArray.push(
          <option key={"0" + index.toString()} value={"0" + index.toString()}>
            {"0" + index.toString()}
          </option>
        );
      } else {
        minuteArray.push(
          <option key={index.toString()} value={index.toString()}>
            {index.toString()}
          </option>
        );
      }
    }

    return minuteArray;
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
      <select name="hour" value={props.datePickerData.hour} onChange={onChange}>
        {hourOptions()}
      </select>
      <select
        name="minute"
        value={props.datePickerData.minute}
        onChange={onChange}
      >
        {minuteOptions()}
      </select>
    </div>
  );
};
