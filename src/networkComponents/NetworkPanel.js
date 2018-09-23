import React, { Component } from "react";
import Utils from "../utils/Utils";
import types from "../utils/types";

export default class NetworkPanel extends Component {
  constructor() {
    super();

    this.handleConnect = this.handleConnect.bind(this);
    this.handleDisconnect = this.handleDisconnect.bind(this);
    this.handleSetupMaster = this.handleSetupMaster.bind(this);

    this.chronoNameInput = React.createRef();
    this.masterNameInput = React.createRef();
    this.masterPasswordInput = React.createRef();
    this.minutesInput = React.createRef();
    this.secondsInput = React.createRef();
  }

  handleConnect(event) {
    event.preventDefault();

    const name = this.chronoNameInput.current.value;
    const cleanName = Utils.cleanName(name);

    this.props.onConnect(cleanName);
  }

  handleSetupMaster(event) {
    event.preventDefault();

    const name = this.masterNameInput.current.value;
    const cleanName = Utils.cleanName(name);

    const password = this.masterPasswordInput.current.value;
    const minutes = parseInt(this.minutesInput.current.value || 0, 10);
    const seconds = parseInt(this.secondsInput.current.value || 0, 10);
    const duration = minutes * 60 + seconds;

    this.props.onSetupMaster(cleanName, duration, password);
  }

  handleDisconnect() {
    this.props.onDisconnect();
  }

  render() {
    const showDisconnectButton =
      this.props.status === types.NETWORK_STATUS.MASTERING ||
      this.props.status === types.NETWORK_STATUS.CONNECTED;
    return (
      <div className="network-panel">
        <h2>
          <span role="img" aria-label="antena">
            📡
          </span>
          &nbsp;Network Chronos&nbsp;
          <span role="img" aria-label="antena">
            📡
          </span>
        </h2>
        {this.props.errorMessage ? (
          <p className="message-error">{this.props.errorMessage}</p>
        ) : (
          ""
        )}
        {showDisconnectButton ? (
          <div className="pure-g center">
            <div className="pure-u-1">
              <button
                onClick={this.handleDisconnect}
                className="pure-button button-warning pure-u-23-24"
              >
                Disconnect
              </button>
            </div>
          </div>
        ) : (
          <div>
            <form
              onSubmit={this.handleConnect}
              className="pure-form pure-form-stacked"
            >
              <legend>
                <h3>
                  <span role="img" aria-label="chnoro">
                    ⏱
                  </span>
                  &nbsp;Connect to a chrono
                </h3>
              </legend>
              <fieldset>
                <div className="pure-g">
                  <div className="pure-u-1-2">
                    <label htmlFor="chronoName">Name</label>
                    <input
                      type="text"
                      name="chronoName"
                      ref={this.chronoNameInput}
                      placeholder="Like myEvent ..."
                      className="pure-u-23-24 "
                    />
                  </div>
                  <div className="pure-u-1-2">
                    <label>&nbsp;</label>
                    <button
                      type="submit"
                      className="pure-u-23-24 pure-button button-secondary"
                    >
                      Connect
                    </button>
                  </div>
                </div>
              </fieldset>
            </form>

            <form
              onSubmit={this.handleSetupMaster}
              className="pure-form pure-form-stacked master-chrono-form"
            >
              <fieldset>
                <legend>
                  <h3>
                    <span role="img" aria-label="chnoro">
                      ⏱
                    </span>
                    &nbsp;Setup a master chrono
                  </h3>
                </legend>
                <div className="pure-g">
                  <div className="pure-u-1-2">
                    <label htmlFor="minutes">Minutes</label>
                    <input
                      type="number"
                      name="minutes"
                      placeholder="0"
                      min="0"
                      max="59"
                      ref={this.minutesInput}
                      className="pure-u-23-24"
                    />
                  </div>

                  <div className="pure-u-1-2">
                    <label htmlFor="seconds">Seconds</label>
                    <input
                      type="number"
                      name="seconds"
                      placeholder="0"
                      min="0"
                      max="59"
                      ref={this.secondsInput}
                      className="pure-u-23-24"
                    />
                  </div>

                  <div className="pure-u-1-2">
                    <label htmlFor="masterName">Name</label>
                    <input
                      type="text"
                      placeholder="Like myEvent ..."
                      name="masterName"
                      ref={this.masterNameInput}
                      className="pure-u-23-24"
                    />
                  </div>

                  <div className="pure-u-1-2">
                    <label htmlFor="masterPassword">Password</label>
                    <input
                      type="password"
                      placeholder="Like psss123 ..."
                      name="masterPassword"
                      ref={this.masterPasswordInput}
                      className="pure-u-23-24"
                    />
                  </div>
                  <div className="pure-u-1">
                    <label>&nbsp;</label>
                    <button
                      type="submit"
                      className="pure-u-23-24 pure-button button-secondary"
                    >
                      Setup
                    </button>
                  </div>
                </div>
              </fieldset>
            </form>
          </div>
        )}
      </div>
    );
  }
}
