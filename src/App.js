import React, { Component } from "react";
import "./App.css";
import Digits from "./Digits";
import DigitForm from "./DigitForm";
import Time from "./Time";
import FirebaseHelper from "./FirebaseHelper";
import NetworkPanel from "./NetworkPanel";
import Version from "./Version";

class App extends Component {
  constructor() {
    super();
    this.state = {
      startAt: 0,
      minutes: 5,
      seconds: 0,
      statusText: "disconnected",
      status: "DISCONNECTED",
      master: null
    };
    this.timer = this.timer.bind(this);
    this.start = this.start.bind(this);
    this.reset = this.reset.bind(this);
    this.disconnect = this.disconnect.bind(this);

    this.handleStart = this.handleStart.bind(this);
    this.handleStop = this.handleStop.bind(this);

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleConnect = this.handleConnect.bind(this);
    this.handleDisconnect = this.handleDisconnect.bind(this);
    this.handleSetupMaster = this.handleSetupMaster.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);

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
      FirebaseHelper.setupChrono(
        this.state.master.name,
        startAt || now,
        duration,
        this.state.master.password
      );
    }

    this.countdown = setInterval(() => {
      this.timer(duration);
    }, 200);

    this.setState({ startAt: startAt || now, diffTime });
  }

  handleStart(data) {
    console.log("App handleStart");

    let duration = data.duration;
    let startAt = null;

    if (data && data.error) {
      this.setState({ statusText: `no chrono found '${data.name}'` });
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
    console.log("App handleStop");

    this.countdown = clearInterval(this.countdown);
  }

  handleStatusChange(data) {
    console.log("App handleStatusChange");

    this.setState({ status: data && data.status });
  }

  handleConnect(name) {
    console.log("App handleConnect");

    this.reset();

    this.unsubscribe = FirebaseHelper.findChrono(name, this.handleStart);
    this.setState({ statusText: `connected to '${name}'` });
  }

  async handleSetupMaster(name, duration, password) {
    console.log("App handleSetupMaster");

    this.reset();

    const startAt = await Time.getUTCTime();
    FirebaseHelper.setupChrono(name, startAt, duration, password);
    this.unsubscribe = FirebaseHelper.findChrono(name, this.handleStart);
    this.setState({
      statusText: `mastering '${name}'`,
      master: { isActive: true, name, duration, password }
    });
  }

  handleDisconnect() {
    this.reset();
  }

  disconnect() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.setState({ statusText: "disconnected", master: null });
    }
  }

  reset() {
    console.log("App reset");

    this.handleStop();
    this.disconnect();
  }

  render() {
    return (
      <div className="app">
        <div className="flexbox-container">
          <Digits minutes={this.state.minutes} seconds={this.state.seconds} />
          {this.state.status !== "CONNECTED" ? (
            <div>
              <DigitForm
                onSubmit={this.handleFormSubmit}
                minutes={5}
                onStop={this.handleStop}
                seconds={0}
                title="Chrono 1"
              />
              <DigitForm
                onSubmit={this.handleFormSubmit}
                onStop={this.handleStop}
                minutes={10}
                seconds={0}
                title="Chrono 2"
              />
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="status-text center">
          <span class="bold">Status:</span> {this.state.statusText}
        </div>
        <NetworkPanel
          onConnect={this.handleConnect}
          onDisconnect={this.handleDisconnect}
          onSetupMaster={this.handleSetupMaster}
          onStatusChange={this.handleStatusChange}
        />
        <Version />
      </div>
    );
  }
}

export default App;
