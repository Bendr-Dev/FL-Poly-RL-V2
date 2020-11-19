import React, { useEffect, useState } from "react";
import { IModalComponentProps } from "../App";
import { IUser } from "../common/User.Interface";
import Autocomplete from "../utils/Autocomplete";
import { DATE_MAP } from "../utils/date";
import Datepicker, { IDatePickerState } from "../utils/Datepicker";
import { getData } from "../utils/http";

export default (props: IModalComponentProps) => {
  const { onSubmit, onCancel, onModalCleanup } = props;

  const [formData, setFormData] = useState({
    attending: [] as any[],
    users: [] as any[],
  });

  const getUsers = async () => {
    const [errors, users] = await getData<IUser[]>("/api/users/all");

    if (errors) {
      console.error(errors);
    }

    const userNames: any[] = [];
    !!users && users.forEach((user: IUser) => {
      userNames.push(user.username);
    })

    !!userNames && setFormData({ attending: [], users: userNames});
    console.log(userNames);
  }

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

  const onSelectChange = (selection: any[]) => {
    console.log(selection);
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
              itemKey="name"
              items={formData.users}
              onSelectChange={onSelectChange}
            ></Autocomplete>
          </div>
        </div>
        <div className="form-column">
          <div className="form-group">
            <label htmlFor="link">Link</label>
            <input type="text" name="link" />
          </div>
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
        </div>
      </form>
    </div>
  );
};