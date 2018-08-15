import React, { Component } from "react";
import "./DigitForm.css";

class DigitForm extends Component {
  constructor() {
    super();
    this.state = {
      minutes: 5,
      seconds: 0
    };

    this.handleMinutesChange = this.handleMinutesChange.bind(this);
    this.handleSecondsChange = this.handleSecondsChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  componentWillUnmount() {
    clearInterval(this.countdown);
  }

  handleFormSubmit(event) {
    event.preventDefault();
    const duration = this.state.minutes * 60 + this.state.seconds;
    this.props.onSubmit(duration);
  }

  handleMinutesChange(event) {
    const minutes = parseInt(event.target.value, 10);
    this.setState({ minutes });
    this.props.onDigitsChange({ minutes, seconds: this.state.seconds });
  }

  handleSecondsChange(event) {
    const seconds = parseInt(event.target.value, 10);
    this.setState({ seconds });
    this.props.onDigitsChange({
      minutes: this.state.minutes,
      seconds
    });
  }

  render() {
    return (
      <form className="flexbox-form" onSubmit={this.handleFormSubmit}>
        <div className="flexbox-pack">
          <input
            className="w-4"
            type="number"
            name="minutes"
            placeholder="minutes"
            min="0"
            max="59"
            value={this.state.minutes}
            onChange={this.handleMinutesChange}
          />
          :
          <input
            className="w-4"
            type="number"
            name="seconds"
            placeholder="seconds"
            min="0"
            max="59"
            value={this.state.seconds}
            onChange={this.handleSecondsChange}
          />
        </div>
        <div className="flex-auto flexbox-pack">
          <button type="submit" className="flex-auto min-w-15wh min-h-15vh">
            Start
          </button>
          <button
            type="button"
            onClick={this.props.onStop}
            className="flex-auto min-w-15wh min-h-15vh"
          >
            Stop
          </button>
        </div>
      </form>
    );
  }
}

export default DigitForm;
