import React, { useState } from "react";
import { IModalComponentProps } from "../App";

export default (props: IModalComponentProps) => {
  const { onSubmit, onCancel, onModalCleanup } = props;
  const [formData, setFormData] = useState({});

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
            <label htmlFor="attending">Attending</label>
            <input type="text" name="attending" />
          </div>
          <div className="form-group">
            <label htmlFor="link">Link</label>
            <input type="text" name="link" />
          </div>
        </div>
        <div className="form-column">
          <div className="form-group">
            <label htmlFor="time">Time</label>
            <input type="text" name="time" />
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
