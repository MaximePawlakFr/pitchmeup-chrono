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
      seconds: 0,
      status: "disconnected",
      master:null
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
    this.start = this.start.bind(this);
    this.handleDisconnect = this.handleDisconnect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.startFromStore = this.startFromStore.bind(this);
    this.handleConnectMaster = this.handleConnectMaster.bind(this);
    this.unsubscribe = null;
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
    console.log(duration);
    
    this.handleStart({duration});
  }

  async start({duration, startAt}){
    console.log(duration,startAt);
    
    const now = await Time.getUTCTime();
    const localNow = Date.now();
    const diffTime = localNow - now;

    if(this.state.master && this.state.master.isActive){
      FirebaseHelper.createChrono(this.state.master.name, startAt || now , duration, this.state.master.password)
    }

    this.countdown = setInterval(() => {
      this.timer(duration);
    }, 200);

    this.setState({ startAt: startAt || now, diffTime });
  }

  handleStart(duration) {
    this.handleStop()
    this.start(duration);
  }

  handleStop() {
    this.countdown = clearInterval(this.countdown);
  }

   startFromStore(data) {
    console.log("startFromStore", data);
    if (data && data.error) {
      this.setState({ status: `no chrono found '${data.name}'` });
      return;
    }
    const startAt =
      data.public.startAt.seconds * 1000 +
      data.public.startAt.nanoseconds / 1000;
    const duration = data.public.duration;
    this.handleStop();
    this.start({duration, startAt});
  }

  handleConnect(event) {
    event.preventDefault();
    this.reset();

    const name = this.chronoNameInput.current.value;
    console.log("Connect: ", name);
    this.unsubscribe = FirebaseHelper.findChrono(name, this.startFromStore);
    this.setState({ status: `connected to '${name}'` });

  }

  handleConnectMaster(event) {
    event.preventDefault();
    this.reset();

    const name = this.masterNameInput.current.value;
    const password = this.masterPasswordInput.current.value;

    FirebaseHelper.createChrono(name, Date.now(), 3600, password);
    this.unsubscribe = FirebaseHelper.findChrono(name, this.startFromStore);

    this.setState({ status: `mastering '${name}'`, master:{isActive:true, name, password} });
  }


  handleDisconnect() {
    this.reset();
   
  }

  disconnect(){
    if (this.unsubscribe) {
      this.unsubscribe();
      this.setState({ status: "disconnected", master:null });
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
        <h2>Status : {this.state.status}</h2>
        <button role="button" onClick={this.handleDisconnect}>Disconnect</button>
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
