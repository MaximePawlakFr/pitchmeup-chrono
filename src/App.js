import React, { Component } from "react";
import "./App.css";
import Digits from "./Digits";
import DigitForm from "./DigitForm";
import Time from "./Time";
import FirebaseHelper from "./FirebaseHelper";

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
    this.handleConnect = this.handleConnect.bind(this);
    this.chronoNameInput = React.createRef();
    this.masterNameInput = React.createRef();
    this.masterPasswordInput = React.createRef();
    this.reset = this.reset.bind(this);
    this.startFromStore = this.startFromStore.bind(this);
    this.handleConnectMaster = this.handleConnectMaster.bind(this);
    this.unsubscribe = null;
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

  async startFromStore(data) {
    console.log("startFromStore", data);
    this.reset();
    const now = await Time.getUTCTime();
    const localNow = Date.now();
    const diffTime = localNow - now;
    const fStartAt =
      data.public.startAt.seconds * 1000 +
      data.public.startAt.nanoseconds / 1000;
    console.log(fStartAt);
    console.log(localNow);

    this.setState({ startAt: fStartAt, diffTime });
    this.countdown = setInterval(() => {
      this.timer(data.public.duration);
    }, 200);
  }

  handleConnect(event) {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    event.preventDefault();
    const name = this.chronoNameInput.current.value;
    console.log("Connect: ", name);
    this.unsubscribe = FirebaseHelper.findChrono(name, this.startFromStore);
  }

  handleConnectMaster(event) {
    event.preventDefault();
    this.reset();
    const name = this.masterNameInput.current.value;
    const password = this.masterPasswordInput.current.value;

    FirebaseHelper.createChrono(name, Date.now(), 3600, password);
  }

  reset() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
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
        <div>
          <form onSubmit={this.handleConnect}>
            <input
              type="text"
              ref={this.chronoNameInput}
              placeholder="Chrono name..."
            />
            <button type="submit">Connect</button>
          </form>
          <form onSubmit={this.handleConnectMaster}>
            <input
              type="text"
              placeholder="Chrono name..."
              ref={this.masterNameInput}
            />
            <input
              type="password"
              placeholder="master password"
              ref={this.masterPasswordInput}
            />
            <button type="submit">Master a new chrono</button>
          </form>
        </div>
      </div>
    );
  }
}

export default App;
