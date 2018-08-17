import React, { Component } from "react";
import "./App.css";
import Digits from "./Digits";
import DigitForm from "./DigitForm";
import Time from "./Time";
import FirebaseHelper from "./FirebaseHelper";
import NetworkPanel from "./NetworkPanel";

class App extends Component {
  constructor() {
    super();
    this.state = {
      startAt: 0,
      minutes: 5,
      seconds: 0,
      status: "disconnected",
      master: null
    };
    this.timer = this.timer.bind(this);
    this.start = this.start.bind(this);
    this.reset = this.reset.bind(this);
    this.disconnect = this.disconnect.bind(this);


    this.handleStart = this.handleStart.bind(this);
    this.handleStop = this.handleStop.bind(this);

    this.handleConnect = this.handleConnect.bind(this);
    this.handleDisconnect = this.handleDisconnect.bind(this);
    this.handleSetupMaster = this.handleSetupMaster.bind(this);

    this.unsubscribe = null;
  }

  componentDidMount() {
    this.reset();
  }

  componentWillUnmount() {
    this.reset();
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

  handleFormSubmit(duration) {
    this.handleStart({ duration });
  }

  async start({ duration, startAt }) {
    const now = await Time.getUTCTime();
    const localNow = Date.now();
    const diffTime = localNow - now;

    if (this.state.master && this.state.master.isActive) {
      FirebaseHelper.createChrono(this.state.master.name, startAt || now, duration, this.state.master.password)
    }

    this.countdown = setInterval(() => {
      this.timer(duration);
    }, 200);

    this.setState({ startAt: startAt || now, diffTime });
  }

  handleStart(data) {
    let duration = data.duration;
    let startAt = null;
    if (data && data.error) {
      this.setState({ status: `no chrono found '${data.name}'` });
      return;
    } else if (data && data.public) {
      startAt =
        data.public.startAt.seconds * 1000 +
        data.public.startAt.nanoseconds / 1000;
      duration = data.public.duration;
    }
    this.handleStop();
    this.start({ duration, startAt });
  }

  handleStop() {
    this.countdown = clearInterval(this.countdown);
  }

  handleDisconnect() {
    this.reset();
  }

  handleConnect(name) {
    this.reset();

    this.unsubscribe = FirebaseHelper.findChrono(name, this.handleStart);
    this.setState({ status: `connected to '${name}'` });
  }

  async handleSetupMaster(name, duration, password) {
    this.reset();

    const startAt = await Time.getUTCTime();
    FirebaseHelper.createChrono(name, startAt, duration, password);
    this.unsubscribe = FirebaseHelper.findChrono(name, this.handleStart);
    this.setState({ status: `mastering '${name}'`, master: { isActive: true, name, duration, password } });
  }


  disconnect() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.setState({ status: "disconnected", master: null });
    }
  }

  reset() {
    this.handleStop();
    this.disconnect();
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

        Status: {this.state.status}

        <NetworkPanel onConnect={this.handleConnect} onDisconnect={this.handleDisconnect} onSetupMaster={this.handleSetupMaster} />

      </div>
    );
  }
}

export default App;
