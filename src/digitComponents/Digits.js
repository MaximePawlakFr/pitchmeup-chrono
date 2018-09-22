import React, { Component } from "react";
import "./Digits.css";

class Digits extends Component {
  show2DigitsNumber(number) {
    const prefix = number <= 9 ? "0" : "";
    return prefix + number;
  }

  render() {
    return (
      <div className="full-width">
        {this.show2DigitsNumber(this.props.minutes)}:
        {this.show2DigitsNumber(this.props.seconds)}
      </div>
    );
  }
}

export default Digits;
