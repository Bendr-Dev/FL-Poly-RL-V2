import React, { useEffect, useState } from "react";
import { isConstructorDeclaration } from "typescript";
import { IModalComponentProps } from "../App";
import Autocomplete from "../utils/Autocomplete";
import { DATE_MAP } from "../utils/date";
import Datepicker, { IDatePickerState } from "../utils/Datepicker";

export default (props: IModalComponentProps) => {
  const { onSubmit, onCancel, onModalCleanup } = props;
  const [formData, setFormData] = useState({
    test: ["test", "asdf", "tesfaafafaft"],
  });

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

  const _onSubmit = () => {
    !!onSubmit && onSubmit();
    onModalCleanup();
  };

  const _onCancel = () => {
    !!onCancel && onCancel();
    onModalCleanup();
  };

  return (
    <div className="event-form">
      <div className="form-header">
        <h1>Create Event</h1>
      </div>
      <div className="line-break-primary"></div>
      <form action="_onSubmit">
        <div className="form-column">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" name="name" />
          </div>
          <div className="form-group">
            <label htmlFor="type">Type</label>
            <input type="text" name="type" />
          </div>
          <div className="form-group">
            <label htmlFor="format">Format</label>
            <input type="text" name="format" />
          </div>
          <div className="form-group">
            <Autocomplete
              name="attending"
              label="Attending"
              items={formData.test}
            ></Autocomplete>
          </div>
          <div className="form-group">
            <label htmlFor="link">Link</label>
            <input type="text" name="link" />
          </div>
        </div>
        <div className="form-column">
          <div className="form-group">
            <label htmlFor="time">Start Time</label>
            <input name="time" value={selectedDateString} onChange={() => {}} />
            <Datepicker
              datePickerData={datePickerData}
              setDatePickerData={setDatePickerData}
            ></Datepicker>
          </div>
          <div className="form-group">
            <label htmlFor="uploader">Uploader</label>
            <input type="text" name="uploader" />
          </div>
          <div className="form-group">
            <label htmlFor="complete">Complete</label>
            <input type="text" name="complete" />
          </div>
        </div>
      </form>
    </div>
  );
};
