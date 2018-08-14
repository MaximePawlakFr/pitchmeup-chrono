import React, { Component } from "react";

class Digits extends Component {
  constructor() {
    super();
    this.state = {
      minutes: 0,
      seconds: 0
    };
  }

  show2DigitsNumber(number) {
    const prefix = number <= 9 ? "0" : "";
    return prefix + number;
  }

  render() {
    return (
      <div>
        {this.show2DigitsNumber(this.props.minutes)}:{this.show2DigitsNumber(
          this.props.seconds
        )}
      </div>
    );
  }
}

export default Digits;
