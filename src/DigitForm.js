import React, { Component } from "react";
import "./DigitForm.css";

class DigitForm extends Component {
  constructor() {
    super();
    this.minutesInput = React.createRef();
    this.secondsInput = React.createRef();
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  handleFormSubmit(event) {
    event.preventDefault();
    const minutes = parseInt(this.minutesInput.current.value * 60, 10);
    const seconds = parseInt(this.secondsInput.current.value, 10);
    const duration = minutes + seconds;
    this.props.onSubmit(duration);
  }

  render() {
    return (
      <form
        className="flexbox-form center-inputs"
        onSubmit={this.handleFormSubmit}
      >
        <div className="flexbox-pack">
          <input
            className="w-4 min-h-inputs"
            type="number"
            name="minutes"
            placeholder="minutes"
            min="0"
            max="59"
            ref={this.minutesInput}
            defaultValue={this.props.minutes}
          />
          :
          <input
            className="w-4 min-h-inputs"
            type="number"
            name="seconds"
            placeholder="seconds"
            min="0"
            max="59"
            ref={this.secondsInput}
            defaultValue={this.props.seconds}
          />
        </div>
        <div className="flex-auto flexbox-pack">
          <button type="submit" className="flex-auto min-w-15wh min-h-controls">
            Start
          </button>
          <button
            type="button"
            onClick={this.props.onStop}
            className="flex-auto min-w-15wh min-h-controls"
          >
            Stop
          </button>
        </div>
      </form>
    );
  }
}

export default DigitForm;
