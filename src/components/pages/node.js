import React, { Component } from "react";
import { connect } from "react-redux";
import ReactSlider from "react-slider";
import Slider from "../reusable/slider";
import Button from "../reusable/button";
import Switch from "../reusable/switch";
import "../styles/slider.css";
import Dropdown from "../reusable/dropdown";

import {
  editName,
  editRadius,
  editFontSize,
  handleCheckboxChange,
  editNewCategoryName,
  clearTempCustomAttrs,
  changeSelectedCategory
} from "../../redux/actions/liveNodeEdit";
import { deleteAction, saveEdits } from "../../redux/actions/document";
import {
  editValue,
  handleCheckboxChange as handleGlobalAttrCheckbox
} from "../../redux/actions/globalEdit";

class Node extends Component {
  save() {
    this.props.saveEdits({
      customAttrs: this.props.liveNodeEdit.checkedAttrs,
      liveNodeEdit: this.props.liveNodeEdit,
      globalEdit: this.props.globalEdit
    });
    // this.props.clearTempCustomAttrs()
  }

  handleCheckboxChange(event) {
    const target = event.target;
    let attrs = this.props.liveNodeEdit.checkedAttrs;

    if (attrs.includes(target.name) && !target.checked) {
      attrs = attrs.filter(e => e !== target.name);
    } else if (!attrs.includes(target.name) && target.checked) {
      attrs.push(target.name);
    }

    // this.setState({
    //     customAttrs: attrs
    // });

    this.props.handleCheckboxChange(attrs, this.props.selNodeId);
    // this.props.handleGlobalAttrCheckbox(attrs)
  }

  cancel() {}

  repeat() {
    console.log("this", this);
    if (this.state.testMax === this.state.testSliderVal) {
      this.setState({
        testMax: this.state.testMax + 1,
        testSliderVal: this.state.testSliderVal + 1
      });
      this.props.editRadius(this.state.testSliderVal + 1);
    }

    let x = setTimeout(
      function() {
        this.repeat();
      }.bind(this),
      10
    );
    this.setState({ timeout: x });
  }

  render() {
    return (
      <div className="column is-vcentered">
        <div>
          {/*{this.props.liveNodeEdit.selNodeId ? "Edit Node" : "Add new node"}*/}
        </div>
        <Button click={this.save.bind(this)}>Apply</Button>
        {/*<Button click={this.save.bind(this)}>save and unselect</Button>*/}
        {/*<Button click={this.cancel.bind(this)}>Cancel</Button>*/}
        <Button click={() => this.props.deleteAction(this.props.selNodeId)}>
          Delete Node
        </Button>
        <hr />
        <div>heading</div>
        <input
          className="input"
          type="text"
          value={
            this.props.liveNodeEdit.name ||
            this.props.globalEdit.node.name.defaultValue
          }
          onChange={event =>
            this.props.editName(event.target.value, this.props.selNodeId)
          }
        />
        <br /> <br />
        <hr />
        <div>custom attributes</div>
        <br />
        <Switch
          name="radius"
          checked={this.props.liveNodeEdit.checkedAttrs.includes("radius")}
          onChange={this.handleCheckboxChange.bind(this)}
        />
        <div>radius</div>
        <input
          className="input"
          disabled={!this.props.liveNodeEdit.checkedAttrs.includes("radius")}
          type="number"
          value={this.props.liveNodeEdit.radius || ""}
          onChange={event =>
            this.props.editRadius(event.target.value, this.props.selNodeId)
          }
        />
        <Slider
          sliderVal={this.props.liveNodeEdit.radius}
          sliderMin={0}
          sliderMax={
            this.props.globalEdit.controls.radiusRangeMax.customValue ||
            this.props.globalEdit.controls.radiusRangeMax.defaultValue
          }
          selNodeId={this.props.selNodeId}
          editRadius={this.props.editRadius}
          updateSliderRangeMax={v =>
            this.props.editValue({
              section: "controls",
              key: "radiusRangeMax",
              value: v
            })
          }
          disabled={!this.props.liveNodeEdit.checkedAttrs.includes("radius")}
        />
        <br />
        <Switch
          name="fontSize"
          checked={this.props.liveNodeEdit.checkedAttrs.includes("fontSize")}
          onChange={this.handleCheckboxChange.bind(this)}
        />
        <div>font size</div>
        <input
          className="input"
          disabled={!this.props.liveNodeEdit.checkedAttrs.includes("fontSize")}
          type="number"
          value={this.props.liveNodeEdit.fontSize || ""}
          onChange={event => this.props.editFontSize(event.target.value)}
        />
        <hr />
        <br />
        <div>category</div>
        <Switch
          name="category"
          checked={this.props.liveNodeEdit.checkedAttrs.includes("category")}
          onChange={this.handleCheckboxChange.bind(this)}
        />
        <br />
        <Dropdown
          onChange={cat => this.props.changeSelectedCategory(cat)}
          value={this.props.liveNodeEdit.category || "none"}
          categories={this.props.categories}
        />
        <br />`
        <br />
        <Switch
          name="newCategoryName"
          checked={this.props.liveNodeEdit.checkedAttrs.includes(
            "newCategoryName"
          )}
          onChange={this.handleCheckboxChange.bind(this)}
        />
        <div>save custom attrs as new category</div>
        <input
          className="input"
          disabled={
            !this.props.liveNodeEdit.checkedAttrs.includes("newCategoryName")
          }
          type="string"
          value={this.props.liveNodeEdit.newCategoryName || ""}
          onChange={event => this.props.editNewCategoryName(event.target.value)}
        />
        <br />
        <br />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  liveNodeEdit: state.liveNodeEdit,
  selNodeId: state.liveNodeEdit.selNodeId,
  categories: state.document.present.editedFile.categories,
  globalEdit: state.globalEdit
});

const mapDispatchToProps = dispatch => ({
  // handleGlobalAttrCheckbox: checked => dispatch(handleGlobalAttrCheckbox(checked)),
  editName: (name, selNodeId) => dispatch(editName(name, selNodeId)),
  editRadius: (r, selNodeId) => dispatch(editRadius(r, selNodeId)),
  editFontSize: f => dispatch(editFontSize(f)),
  saveEdits: edits => dispatch(saveEdits(edits)),
  handleCheckboxChange: (checkedAttrs, selNodeId) =>
    dispatch(handleCheckboxChange(checkedAttrs, selNodeId)),
  editNewCategoryName: name => dispatch(editNewCategoryName(name)),
  clearTempCustomAttrs: () => dispatch(clearTempCustomAttrs()),
  changeSelectedCategory: cat => dispatch(changeSelectedCategory(cat)),
  deleteAction: nodeId => dispatch(deleteAction(nodeId)),
  editValue: keyAndValue => dispatch(editValue(keyAndValue))
});
export default connect(mapStateToProps, mapDispatchToProps)(Node);
