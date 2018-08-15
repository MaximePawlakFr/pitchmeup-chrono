import React, { Component } from "react";
import "./App.css";
import Digits from "./Digits";
import DigitForm from "./DigitForm";
import Time from "./Time";

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
    const elapsed = (now - this.state.startAt - this.state.diffTime) / 1000;
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

  async handleStart(duration) {
    this.reset();
    const now = await Time.getUTCTime();
    const localNow = Date.now();
    const diffTime = localNow - now;

    this.setState({ startAt: now, diffTime });
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
        <div>
          <DigitForm
            onSubmit={this.handleFormSubmit}
            minutes={5}
            onStop={this.handleStop}
            seconds={0}
          />
          <DigitForm
            onSubmit={this.handleFormSubmit}
            onStop={this.handleStop}
            minutes={10}
            seconds={0}
          />
        </div>
      </div>
    );
  }
}

export default App;
