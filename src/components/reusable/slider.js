import React, { Component } from "react";
import ReactSlider from "react-slider";
import "../styles/slider.css";
import styled from "styled-components";

const Test = props => {
  if (props.open) {
    return (
      <div>
        Update {props.valueType}
        <input
          disabled={false}
          type="number"
          className="input"
          value={4}
          onChange={() => {}}
        />
      </div>
    );
  } else {
    return <div style={{ display: "none" }} />;
  }
};

class Slider extends Component {
  state = {
    sliderVal: 20,
    sliderMax: 100,
    sliderMin: 0,
    timeout: undefined
  };

  repeat() {
    const sliderMax = this.props.sliderMax;
    const sliderVal = this.props.sliderVal;

    if (sliderMax === sliderVal && this.props.updateMaxRange) {
      this.props.editRadius(sliderVal + 1);
      this.props.updateSliderRangeMax(sliderMax + 1);
    }

    let x = setTimeout(
      function() {
        this.repeat();
      }.bind(this),
      10
    );
    this.setState({ timeout: x });
  }

  pointerUp() {
    clearTimeout(this.state.timeout);
  }

  render() {
    console.log("SLIDER PROPS", this.props);
    return (
      <Shell
        style={{ margin: "10px" }}
        disabled={this.props.disabled}
        onPointerOut={this.pointerUp.bind(this)}
        onPointerUp={this.pointerUp.bind(this)}
        onPointerDown={this.repeat.bind(this)}
      >
        <ReactSlider
          disabled={this.props.disabled}
          className="horizontal-slider"
          thumbClassName="example-thumb"
          trackClassName="example-track"
          renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
          onChange={val => this.props.editRadius(val, this.props.selNodeId)}
          value={this.props.sliderVal}
          min={this.props.sliderMin}
          max={this.props.sliderMax}
        />
        <Test
          open={this.props.sliderMax <= this.props.sliderVal + 2}
          valueType={"range max"}
        />
      </Shell>
    );
  }
}

export default Slider;

const Shell = styled.div`
  margin-left: 10px;
  ${({ disabled }) =>
    disabled &&
    `
        opacity: .5
      `}
`;
