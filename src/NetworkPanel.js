import React, { Component } from "react";

export default class NetworkPanel extends Component {
  constructor() {
    super();
    this.state = {
      status: "DISCONNECTED"
    };

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
    console.log("handleConnect");

    const name = this.chronoNameInput.current.value;
    const cleanName = name && name.length > 0 && name.trim().toLowerCase();

    this.setState({ status: "CONNECTED" });
    this.props.onStatusChange({ status: "CONNECTED" });
    this.props.onConnect(cleanName);
  }

  handleSetupMaster(event) {
    event.preventDefault();
    console.log("handleSetupMaster");

    const name = this.masterNameInput.current.value;
    const cleanName = name && name.length > 0 && name.trim().toLowerCase();

    const password = this.masterPasswordInput.current.value;
    const minutes = parseInt(this.minutesInput.current.value || 0, 10);
    const seconds = parseInt(this.secondsInput.current.value || 0, 10);
    const duration = minutes * 60 + seconds;
    this.setState({ status: "MASTERING" });
    this.props.onStatusChange({ status: "MASTERING" });

    this.props.onSetupMaster(cleanName, duration, password);
  }

  handleDisconnect() {
    console.log("handleDisconnect");

    this.setState({ status: "DISCONNECTED" });
    this.props.onStatusChange({ status: "DISCONNECTED" });
    this.props.onDisconnect();
  }

  render() {
    return (
      <div className="network-panel">
        <h2>Network Chronos</h2>
        {this.state.status !== "DISCONNECTED" ? (
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
                <h3>Connect to a chrono</h3>
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
                  <h3>Setup a master chrono</h3>
                </legend>
                <div className="pure-g">
                  <div className="pure-u-1-2">
                    <label htmlFor="masterMinutes">Minutes</label>
                    <input
                      type="number"
                      name="minutes"
                      placeholder="0"
                      name="masterMinutes"
                      min="0"
                      max="59"
                      ref={this.minutesInput}
                      className="pure-u-23-24"
                    />
                  </div>

                  <div className="pure-u-1-2">
                    <label htmlFor="masterSeconds">Seconds</label>
                    <input
                      type="number"
                      name="seconds"
                      placeholder="0"
                      name="masterSeconds"
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
