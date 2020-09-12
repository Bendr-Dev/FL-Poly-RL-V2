import React, { Fragment } from "react";
import { DATE_MAP } from "../utils/date";

export interface IDatePickerState {
  month: number;
  day: number;
  year: number;
  hour: number;
  minute: number;
}

/**
 *  For each select, loop through date map util for options
 */
export default (props: any) => {
  console.log(props);
  const onChange = (e: any) => {
    console.log(e.target.value);
    props.setDatePickerData({
      ...props.datePickerData,
      [e.target.name]: e.target.value,
    });
  };

  const monthOptions = () => {
    let monthArray = [];

    for (const month in DATE_MAP) {
      monthArray.push(
        <option key={month} value={month}>
          {DATE_MAP[month].long}
        </option>
      );
    }

    return monthArray;
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
      <select>
        <option>Day 1</option>
        <option>Day 2</option>
        <option>Day 3</option>
      </select>
      <select>
        <option>Year 1</option>
        <option>Year 2</option>
        <option>Year 3</option>
      </select>
      <select>
        <option>Time 1</option>
        <option>Time 2</option>
        <option>Time 3</option>
      </select>
    </div>
  );
};
