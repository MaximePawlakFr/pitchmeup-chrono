import React, { Component } from "react";
import "./App.css";

import Digits from "./digitComponents/Digits";
import DigitForm from "./digitComponents/DigitForm";

import NetworkPanel from "./networkComponents/NetworkPanel";

import FirebaseHelper from "./utils/FirebaseHelper";
import Time from "./utils/Time";
import types from "./utils/types";

import Version from "./version/Version";

class App extends Component {
  constructor() {
    super();
    this.state = {
      startAt: 0,
      minutes: 5,
      seconds: 0,
      statusText: "disconnected",
      status: types.NETWORK_STATUS.DISCONNECTED,
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
    this.handleChronoSnapshot = this.handleChronoSnapshot.bind(this);

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

  start({ duration, startAt, diffTime }) {
    console.log("start", duration, startAt, diffTime);

    this.countdown = setInterval(() => {
      this.timer(duration);
    }, 200);

    this.setState({ startAt, diffTime });
  }

  handleStop() {
    console.log("App handleStop", this.state);

    if (this.state.master && this.state.master.isActive) {
      console.log("Stopping chrono");

      FirebaseHelper.stopChrono(
        this.state.master.name,
        this.state.master.password
      );
    }

    this.countdown = clearInterval(this.countdown);
  }

  handleStart({ document, duration, startAt, diffTime, error, name }) {
    console.log("App handleStart", document, diffTime);

    let newDuration = duration;
    let newStartAt = startAt;

    if (error) {
      this.setState({ statusText: `no chrono found '${name}'` });
      return;
    } else if (document && document.public && document.public.startAt) {
      newStartAt =
        document.public.startAt.seconds * 1000 +
        document.public.startAt.nanoseconds / 1000;
      newDuration = document.public.duration;
    }

    // if (data.action === "START") {
    this.handleStop();

    if (this.state.master && this.state.master.isActive) {
      this.handleSetupMaster(
        this.state.master.name,
        newDuration,
        this.state.master.password
      );
    }

    this.start({ duration: newDuration, startAt: newStartAt, diffTime });
    // } else if (data.action === "STOP") {
    // this.handleStop();
    // }
  }

  async handleFormSubmit(duration) {
    const now = await Time.getUTCTime();
    const localNow = Date.now();
    const diffTime = localNow - now;
    const startAt = now;

    this.handleStart({ duration, startAt, diffTime });
  }

  handleStatusChange(data) {
    console.log("App handleStatusChange");

    this.setState({ status: data && data.status });
  }

  async handleConnect(name) {
    console.log("App handleConnect", name);

    this.reset();

    const now = await Time.getUTCTime();
    const localNow = Date.now();
    const diffTime = localNow - now;

    this.unsubscribe = FirebaseHelper.setChronoOnSnapshot(
      name,
      this.handleChronoSnapshot,
      { diffTime }
    );

    this.setState({ statusText: `connected to '${name}'` });
  }

  async handleSetupMaster(name, duration, password) {
    console.log("App handleSetupMaster", name);

    this.reset();

    const now = await Time.getUTCTime();
    const localNow = Date.now();
    const diffTime = localNow - now;
    const startAt = now;

    FirebaseHelper.setupChrono(name, startAt, duration, password)
      .then(() => {
        return FirebaseHelper.findChrono(name, this.handleStart, { diffTime });
      })
      .then(() => {
        return FirebaseHelper.startChrono(name, password);
      })
      .then(() => {
        this.setState({
          statusText: `mastering '${name}'`,
          master: { isActive: true, name, duration, password }
        });

        this.unsubscribe = FirebaseHelper.setChronoOnSnapshot(
          name,
          this.handleChronoSnapshot,
          { diffTime }
        );
      });
  }

  handleChronoSnapshot({ document, diffTime }) {
    console.log("handleChronoSnapshot", document, diffTime);
    if (
      !document.error &&
      this.state.status === types.NETWORK_STATUS.CONNECTED
    ) {
      if (document.public.status === types.CHRONO_STATUS.STOPPED) {
        this.handleStop();
      } else {
        this.handleStart({ document, diffTime });
      }
    }
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
          {this.state.status !== types.NETWORK_STATUS.CONNECTED ? (
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
          <span className="bold">Status:</span> {this.state.statusText}
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
