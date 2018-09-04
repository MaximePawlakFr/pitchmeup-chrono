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
      <div>
        <h2>Network Chronos</h2>
        {this.state.status !== "DISCONNECTED" ? (
          <button onClick={this.handleDisconnect}>Disconnect</button>
        ) : (
          <div>
            <form onSubmit={this.handleConnect}>
              <h4>Connect to a chrono</h4>
              <input
                type="text"
                ref={this.chronoNameInput}
                placeholder="name..."
              />
              <button type="submit">Connect</button>
            </form>
            <form onSubmit={this.handleSetupMaster}>
              <h4>Setup a master chrono</h4>
              <input
                type="number"
                name="minutes"
                placeholder="minutes"
                min="0"
                max="59"
                ref={this.minutesInput}
              />
              :
              <input
                type="number"
                name="seconds"
                placeholder="seconds"
                min="0"
                max="59"
                ref={this.secondsInput}
              />
              <input
                type="text"
                placeholder="name..."
                ref={this.masterNameInput}
              />
              <input
                type="password"
                placeholder="master password..."
                ref={this.masterPasswordInput}
              />
              <button type="submit">Setup</button>
            </form>
          </div>
        )}
      </div>
    );
  }
}
