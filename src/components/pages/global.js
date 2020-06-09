import React, { Component } from "react";
import { connect } from "react-redux";
import {
  editValue,
  handleCheckboxChange,
  populateInitialValues
} from "../../redux/actions/globalEdit";
import { saveDefaultsEdit } from "../../redux/actions/document";
import Button from "../reusable/button.js";
import Switch from "../reusable/switch";
import Slider from "../reusable/slider";
import Dropdown from "../reusable/dropdown";

class GlobalSettings extends Component {
  componentDidMount() {
    // this.props.populateInitialValues(this.props.globalSettings)
  }

  handleCheckboxChange(event) {
    const target = event.target;
    let attrs = this.props.globalEdit.checkedAttrs;

    if (attrs.includes(target.name) && !target.checked) {
      attrs = attrs.filter(e => e !== target.name);
    } else if (!attrs.includes(target.name) && target.checked) {
      attrs.push(target.name);
    }

    this.props.handleCheckboxChange(attrs);
  }

  save() {
    let edits = this.props.globalEdit;

    this.props.saveDefaultsEdit(edits);
  }

  editValue(section, key) {
    return value => {
      console.log("skv", { section, key, value });
      this.props.editValue({
        section: section,
        key: key,
        value: value
      });
    };
  }

  render() {
    let chargeStrength = this.props.globalEdit.checkedAttrs.includes(
      "chargeStrength"
    )
      ? this.props.globalEdit.general.chargeStrength.customValue
      : this.props.globalEdit.general.chargeStrength.defaultValue;

    return (
      <div className="column is-vcentered">
        <Button click={this.save.bind(this)}>Apply changes</Button>
        <br />
        <br />
        <Switch
          name="chargeStrength"
          checked={this.props.globalEdit.checkedAttrs.includes(
            "chargeStrength"
          )}
          onChange={this.handleCheckboxChange.bind(this)}
        />
        <div>charge strength</div>
        <input
          disabled={
            !this.props.globalEdit.checkedAttrs.includes("chargeStrength")
          }
          type="number"
          className="input"
          value={chargeStrength}
          onChange={event =>
            this.props.editValue({
              section: "general",
              key: "chargeStrength",
              value: event.target.value
            })
          }
        />
        <Slider
          sliderVal={chargeStrength}
          sliderMin={-9000000}
          sliderMax={
            this.props.globalEdit.controls.chargeStrengthRangeMax.customValue ||
            this.props.globalEdit.controls.chargeStrengthRangeMax.defaultValue
          }
          selNodeId={null}
          editRadius={this.editValue("general", "chargeStrength")}
          updateSliderRangeMax={v =>
            this.props.editValue({
              section: "general",
              key: "chargeStrengthRangeMax",
              value: v
            })
          }
          disabled={
            !this.props.globalEdit.checkedAttrs.includes("chargeStrength")
          }
        />
        <br />
        <br />
        <Switch
          name="linkDistance"
          checked={this.props.globalEdit.checkedAttrs.includes("linkDistance")}
          onChange={this.handleCheckboxChange.bind(this)}
        />
        <div>link distance</div>
        <input
          disabled={
            !this.props.globalEdit.checkedAttrs.includes("linkDistance")
          }
          type="number"
          className="input"
          value={this.props.globalEdit.linkDistance || ""}
          onChange={event =>
            this.props.editValue({
              section: "general",
              key: "linkDistance",
              value: event.target.value
            })
          }
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  globalEdit: state.globalEdit,
  globalSettings: state.document.present.editedFile.globalSettings
});

const mapDispatchToProps = dispatch => ({
  editValue: sectionKeyAndValue => dispatch(editValue(sectionKeyAndValue)),
  handleCheckboxChange: checkedAttrs =>
    dispatch(handleCheckboxChange(checkedAttrs)),
  populateInitialValues: defaults => dispatch(populateInitialValues(defaults)),
  saveDefaultsEdit: edits => dispatch(saveDefaultsEdit(edits))
});
export default connect(mapStateToProps, mapDispatchToProps)(GlobalSettings);
