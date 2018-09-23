import React, { Component } from "react";
import "./App.css";

import DigitPanel from "./digitComponents/DigitPanel";

import NetworkPanel from "./networkComponents/NetworkPanel";

import FirebaseHelper from "./utils/FirebaseHelper";
import Time from "./utils/Time";
import types from "./utils/types";

import config from "./config";

import Version from "./version/Version";
import Loader from "./utils/Loader";

class App extends Component {
  constructor() {
    super();
    this.state = {
      startAt: 0,
      minutes: config.chrono.default[0].minutes,
      seconds: config.chrono.default[0].seconds,
      statusText: types.NETWORK_STATUS.DISCONNECTED,
      status: types.NETWORK_STATUS.DISCONNECTED,
      master: null,
      errorMessage: null
    };
    this.countdownId = null;
    this.computeTimer = this.computeTimer.bind(this);
    this.start = this.start.bind(this);
    this.reset = this.reset.bind(this);
    this.disconnect = this.disconnect.bind(this);

    this.handleStart = this.handleStart.bind(this);
    this.stop = this.stop.bind(this);

    this.handleStartClicked = this.handleStartClicked.bind(this);
    this.handleStopClicked = this.handleStopClicked.bind(this);
    this.handleConnect = this.handleConnect.bind(this);
    this.handleDisconnectClicked = this.handleDisconnectClicked.bind(this);
    this.handleSetupMaster = this.handleSetupMaster.bind(this);
    this.handleChronoSnapshot = this.handleChronoSnapshot.bind(this);

    this.unsubscribe = null;
  }

  componentDidMount() {
    this.reset();
  }

  componentWillUnmount() {
    this.reset();
  }

  computeTimer({ startAt, diffTime, duration }) {
    const now = Date.now();
    const elapsed = (now - startAt - diffTime) / 1000;
    const diff = Math.round(duration - elapsed);

    let minutes;
    let seconds;
    if (diff >= 0) {
      seconds = diff % 60;
      minutes = Math.floor(diff / 60);
    }
    return {
      minutes,
      seconds,
      diff
    };
  }

  start({ duration, startAt, diffTime }) {
    console.log("start", duration, startAt, diffTime);
    this.countdownId = setInterval(() => {
      const timer = this.computeTimer({ duration, startAt, diffTime });
      if (timer.diff >= 0) {
        this.setState({ minutes: timer.minutes, seconds: timer.seconds });
      } else {
        this.stop();
      }
    }, 200);

    this.setState({ startAt, diffTime });
  }

  stop(stopMasterChrono = false) {
    console.log("App stop", this.state);

    if (
      this.state.master &&
      this.state.status === types.NETWORK_STATUS.MASTERING &&
      stopMasterChrono
    ) {
      console.log("Stopping chrono");

      FirebaseHelper.stopChrono(
        this.state.master.name,
        this.state.master.password
      );
    }

    this.countdownId = clearInterval(this.countdownId);
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

    this.stop();

    if (this.state.master && this.state.master.isActive) {
      this.handleSetupMaster(
        this.state.master.name,
        newDuration,
        this.state.master.password
      );
    }

    this.start({ duration: newDuration, startAt: newStartAt, diffTime });
  }

  async handleStartClicked(duration) {
    const now = await Time.getUTCTime();
    const localNow = Date.now();
    const diffTime = localNow - now;
    const startAt = now;

    this.handleStart({ duration, startAt, diffTime });
  }

  handleStopClicked() {
    const stopMasterChrono = true;
    this.stop(stopMasterChrono);
  }

  async handleConnect(name) {
    this.reset();

    this.setState({ status: types.NETWORK_STATUS.CONNECTING });
    const now = await Time.getUTCTime();
    const localNow = Date.now();
    const diffTime = localNow - now;

    FirebaseHelper.findRunningChrono(name, now / 1000)
      .then(() => {
        this.unsubscribe = FirebaseHelper.setChronoOnSnapshot(
          name,
          document => {
            this.handleChronoSnapshot(document, diffTime);
          }
        );

        this.setState({
          status: types.NETWORK_STATUS.CONNECTED,
          statusText: `connected to '${name}'`
        });
      })
      .catch(e => {
        console.log(e.type);
        let newState = {
          errorMessage: e.message,
          status: types.CHRONO_STATUS.DISCONNECTED
        };
        if (e.type && e.type === types.ERRORS.CHRONO_EXPIRED) {
          newState.minutes = 0;
          newState.seconds = 0;
        }

        this.setState(newState);
      });
  }

  async handleSetupMaster(name, duration, password) {
    this.reset();
    this.setState({ status: types.NETWORK_STATUS.CONNECTING });

    const now = await Time.getUTCTime();
    const localNow = Date.now();
    const diffTime = localNow - now;
    const startAt = now;

    const chrono = {
      public: {
        name,
        startAt,
        duration,
        status: types.CHRONO_STATUS.CREATED
      },
      private: {
        password
      }
    };

    FirebaseHelper.setupChrono(chrono)
      .then(() => {
        this.handleStart({ document: chrono, diffTime });
        return FirebaseHelper.startChrono(name, password);
      })
      .then(() => {
        this.setState({
          status: types.NETWORK_STATUS.MASTERING,
          statusText: `mastering '${name}'`,
          master: { isActive: true, name, duration, password }
        });

        this.unsubscribe = FirebaseHelper.setChronoOnSnapshot(
          name,
          document => {
            this.handleChronoSnapshot(document, diffTime);
          }
        );
      })
      .catch(e => {
        console.error(e);
        console.log(e);

        this.setState({
          errorMessage: e.message,
          status: types.CHRONO_STATUS.DISCONNECTED
        });
      });
  }

  handleChronoSnapshot(document, diffTime) {
    console.log("handleChronoSnapshot", document, diffTime);
    if (
      !document.error &&
      this.state.status === types.NETWORK_STATUS.CONNECTED
    ) {
      if (document.public.status === types.CHRONO_STATUS.STOPPED) {
        this.stop();
      } else {
        this.handleStart({ document, diffTime });
      }
    }
  }

  reset() {
    console.log("App reset");

    this.stop();
    this.disconnect();
    this.setState({
      errorMessage: null
    });
  }

  handleDisconnectClicked() {
    this.reset();
  }

  disconnect() {
    if (
      this.state.status === types.NETWORK_STATUS.CONNECTED ||
      this.state.status === types.NETWORK_STATUS.MASTERING
    ) {
      this.unsubscribe();
    }
    this.setState({
      statusText: types.NETWORK_STATUS.DISCONNECTED,
      status: types.NETWORK_STATUS.DISCONNECTED,
      master: null
    });
  }

  render() {
    const showForms = this.state.status !== types.NETWORK_STATUS.CONNECTED;

    return (
      <div className="app">
        <div className="flexbox-container">
          <DigitPanel
            onStart={this.handleStartClicked}
            onStop={this.handleStopClicked}
            minutes={this.state.minutes}
            seconds={this.state.seconds}
            showForms={showForms}
          />
        </div>
        <div className="status-text center">
          <span className="bold">Status:</span> {this.state.statusText}
        </div>
        <Loader show={this.state.status === types.NETWORK_STATUS.CONNECTING} />
        {/* <div className="loader">
          <img src="/loader.gif" alt="Loading..." />
        </div> */}
        <NetworkPanel
          errorMessage={this.state.errorMessage}
          status={this.state.status}
          onConnect={this.handleConnect}
          onDisconnect={this.handleDisconnectClicked}
          onSetupMaster={this.handleSetupMaster}
        />
        <Version />
      </div>
    );
  }
}

export default App;
