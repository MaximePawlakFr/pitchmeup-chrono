import React, { Component } from "react";

class DigitForm extends Component {
  constructor() {
    super();
    this.state = {
      minutes: 2,
      seconds: 1
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
      <form onSubmit={this.handleFormSubmit}>
        <input
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
          type="number"
          name="seconds"
          placeholder="seconds"
          min="0"
          max="59"
          value={this.state.seconds}
          onChange={this.handleSecondsChange}
        />
        <button type="submit">Start</button>
        <button type="button" onClick={this.props.onStop}>
          Stop
        </button>
      </form>
    );
  }
}

export default DigitForm;
