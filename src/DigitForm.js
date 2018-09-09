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
        onSubmit={this.handleFormSubmit}
        className="pure-form pure-form-stacked"
      >
        <fieldset>
          <legend>{this.props.title}</legend>

          <div className="pure-g">
            <div className="pure-u-1-4 ">
              <label htmlFor="minutes">Minutes</label>

              <input
                id="minutes"
                type="number"
                name="minutes"
                placeholder="minutes"
                min="0"
                max="59"
                ref={this.minutesInput}
                defaultValue={this.props.minutes}
                className="pure-u-23-24"
              />
            </div>
            <div className="pure-u-1-4 ">
              <label htmlFor="seconds">Seconds</label>
              <input
                id="seconds"
                type="number"
                name="seconds"
                placeholder="seconds"
                min="0"
                max="59"
                ref={this.secondsInput}
                defaultValue={this.props.seconds}
                className="pure-u-23-24"
              />
            </div>
            <div className="pure-u-1-4">
              <label>&nbsp;</label>

              <button
                type="submit"
                className="pure-u-23-24 pure-button button-success"
              >
                Start
              </button>
            </div>
            <div className="pure-u-1-4">
              <label>&nbsp;</label>

              <button
                type="button"
                onClick={this.props.onStop}
                className="pure-u-23-24 pure-button button-error"
              >
                Stop
              </button>
            </div>
          </div>
        </fieldset>
      </form>
    );
  }
}

export default DigitForm;
