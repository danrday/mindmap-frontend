import React, { Component } from "react";
import ReactSlider from 'react-slider'
import "../styles/slider.css";

class Slider extends Component {
    state = {
        sliderVal: 20,
        sliderMax: 100,
        sliderMin: 0,
        timeout: undefined
    }

    repeat() {
        const sliderMax = this.props.sliderMax
        const sliderVal = this.props.sliderVal

        if (sliderMax ===  sliderVal) {
            this.props.editRadius(sliderVal+1)
            this.props.updateSliderRangeMax(sliderMax + 1)
        }

        let x = setTimeout(
            function() {
                this.repeat()
            }
                .bind(this),
            10
        );
        this.setState({timeout: x})
    }

    pointerUp() {
        clearTimeout(this.state.timeout)
    }

    render() {
        return (
                <div onPointerOut={this.pointerUp.bind(this)} onPointerUp={this.pointerUp.bind(this)} onPointerDown={this.repeat.bind(this)}>
                    <ReactSlider
                        disabled={this.props.disabled}
                        className="horizontal-slider"
                        thumbClassName="example-thumb"
                        trackClassName="example-track"
                        renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                        onChange={val =>
                            this.props.editRadius(val)
                        }
                        value={this.props.sliderVal}
                        min={this.props.sliderMin}
                        max={this.props.sliderMax}
                    />
                </div>
        );
    }
}

export default (Slider);
