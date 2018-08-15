import React, { Component } from "react";
import "./App.css";
import Digits from "./Digits";
import DigitForm from "./DigitForm";

class App extends Component {
  constructor() {
    super();
    this.state = {
      startAt: 0,
      minutes: 5,
      seconds: 0
    };
    this.timer = this.timer.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleStart = this.handleStart.bind(this);
    this.handleDigitsChange = this.handleDigitsChange.bind(this);
    this.handleStop = this.handleStop.bind(this);
    this.reset = this.reset.bind(this);
  }

  timer(duration) {
    const now = Date.now();
    const elapsed = (now - this.state.startAt) / 1000;
    const diff = Math.round(duration - elapsed);
    if (diff >= 0) {
      const seconds = diff % 60;
      const minutes = Math.floor(diff / 60);
      this.setState({ minutes, seconds });
    } else {
      this.handleStop();
    }
  }

  componentDidMount() {
    this.reset();
  }

  componentWillUnmount() {
    this.reset();
  }

  handleDigitsChange(digits) {
    // TODO
  }

  handleFormSubmit(duration) {
    this.handleStart(duration);
  }

  handleStart(duration) {
    this.reset();
    this.setState({ startAt: Date.now() });
    this.countdown = setInterval(() => {
      this.timer(duration);
    }, 200);
  }

  handleStop() {
    this.countdown = clearInterval(this.countdown);
  }

  reset() {
    this.handleStop();
  }

  render() {
    return (
      <div className="flexbox-container">
        <Digits minutes={this.state.minutes} seconds={this.state.seconds} />
        <DigitForm
          onSubmit={this.handleFormSubmit}
          onStop={this.handleStop}
          onDigitsChange={this.handleDigitsChange}
        />
      </div>
    );
  }
}

export default App;
