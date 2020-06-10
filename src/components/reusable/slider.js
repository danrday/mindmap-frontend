import React, { Component } from "react";
import ReactSlider from "react-slider";
import "../styles/slider.css";
import styled from "styled-components";

const UpdateRange = props => {
  if (props.open) {
    return (
      <div>
        Update {props.valueType}
        <input
          onFocus={() => {
            props.setState();
          }}
          onBlur={() => {
            props.setStateOff();
          }}
          disabled={false}
          type="number"
          className="input"
          value={props.value}
          onChange={e => {
            // seems to pass negative numbers as strings, so using parseInt
            props.updateValue(parseInt(e.target.value));
          }}
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
    timeout: undefined,
    minRangeEditOpen: false,
    maxRangeEditOpen: false
  };

  repeat() {
    const sliderMin = this.props.sliderMin;
    const sliderMax = this.props.sliderMax;
    const sliderVal = this.props.sliderVal;

    if (sliderMax === sliderVal && this.props.updateMaxRange) {
      this.props.editValue(sliderVal + 1);
      this.props.updateSliderRangeMax(sliderMax + 1);
    } else if (sliderMin === sliderVal && this.props.updateMinRange) {
      this.props.editValue(sliderVal - 1);
      this.props.updateSliderRangeMin(sliderMin - 1);
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
    return (
      <Shell
        style={{ margin: "10px" }}
        disabled={this.props.disabled}
        onPointerOut={this.pointerUp.bind(this)}
        onPointerUp={this.pointerUp.bind(this)}
        onPointerDown={this.repeat.bind(this)}
      >
        <div style={{ display: this.props.disabled ? "none" : "block" }}>
          <ReactSlider
            disabled={this.props.disabled}
            className="horizontal-slider"
            thumbClassName="example-thumb"
            trackClassName="example-track"
            renderThumb={(props, state) => (
              <div {...props}>{state.valueNow}</div>
            )}
            onChange={val => this.props.editValue(val)}
            value={this.props.sliderVal}
            min={this.props.sliderMin}
            max={this.props.sliderMax}
          />
          <UpdateRange
            setState={() => this.setState({ maxRangeEditOpen: true })}
            setStateOff={() => this.setState({ maxRangeEditOpen: false })}
            value={this.props.sliderMax}
            updateValue={this.props.updateSliderRangeMax}
            open={
              this.props.updateMaxRange &&
              (this.state.maxRangeEditOpen === true ||
                this.props.sliderMax <= this.props.sliderVal + 2)
            }
            valueType={"range max"}
          />
          <UpdateRange
            setState={() => this.setState({ minRangeEditOpen: true })}
            setStateOff={() => this.setState({ minRangeEditOpen: false })}
            value={this.props.sliderMin}
            updateValue={this.props.updateSliderRangeMin}
            open={
              this.props.updateMinRange &&
              (this.state.minRangeEditOpen === true ||
                this.props.sliderMin >= this.props.sliderVal - 2)
            }
            valueType={"range min"}
          />
        </div>
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
