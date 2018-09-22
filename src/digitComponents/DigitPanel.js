import React from "react";

import Digits from "./Digits";
import DigitForm from "./DigitForm";

import config from "../config";

class DigitPanel extends React.Component {
  render() {
    return (
      <span>
        <Digits minutes={this.props.minutes} seconds={this.props.seconds} />
        {this.props.showForms ? (
          <div>
            <DigitForm
              onSubmit={this.props.onStart}
              minutes={config.chrono.default[0].minutes}
              onStop={this.props.onStop}
              seconds={config.chrono.default[0].seconds}
              title="Chrono 1"
            />
            <DigitForm
              onSubmit={this.props.onStart}
              onStop={this.props.onStop}
              minutes={config.chrono.default[1].minutes}
              seconds={config.chrono.default[1].seconds}
              title="Chrono 2"
            />
          </div>
        ) : (
          ""
        )}
      </span>
    );
  }
}

export default DigitPanel;
