import React, { Component } from "react";
import { connect } from "react-redux";
import ReactSlider from "react-slider";
import Slider from "../reusable/slider";
import Button from "../reusable/button";
import Switch from "../reusable/switch";
import "../styles/slider.css";
import Dropdown from "../reusable/dropdown";

import {
  handleCheckboxChange,
  editNewCategoryName,
  clearTempCustomAttrs,
  changeSelectedCategory,
  editNodeValue
} from "../../redux/actions/liveNodeEdit";
import { deleteAction, saveEdits } from "../../redux/actions/document";
import {
  editValue,
  handleCheckboxChange as handleGlobalAttrCheckbox
} from "../../redux/actions/globalEdit";
import { editLinkValue } from "../../redux/actions/liveLinkEdit";

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
        <div>custom attributes</div>
        <br />
        <div>radius</div>
        <Switch
          name="radius"
          checked={this.props.liveNodeEdit.checkedAttrs.includes("radius")}
          onChange={this.handleCheckboxChange.bind(this)}
        />
        <input
          style={{ display: "inline-block", width: "50%" }}
          className="input"
          disabled={!this.props.liveNodeEdit.checkedAttrs.includes("radius")}
          type="number"
          value={this.props.liveNodeEdit.radius || ""}
          onChange={event =>
            this.props.editNodeValue(
              { key: "radius", value: event.target.value },
              this.props.selNodeId
            )
          }
        />
        <Slider
          updateMaxRange={true}
          sliderVal={this.props.liveNodeEdit.radius}
          sliderMin={0}
          sliderMax={
            this.props.globalEdit.controls.radiusRangeMax.customValue ||
            this.props.globalEdit.controls.radiusRangeMax.defaultValue
          }
          editValue={arg => {
            this.props.editNodeValue(
              { key: "radius", value: arg },
              this.props.selNodeId
            );
          }}
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
        <div>font size</div>
        <Switch
          name="fontSize"
          checked={this.props.liveNodeEdit.checkedAttrs.includes("fontSize")}
          onChange={this.handleCheckboxChange.bind(this)}
        />
        <input
          style={{ display: "inline-block", width: "50%" }}
          className="input"
          disabled={!this.props.liveNodeEdit.checkedAttrs.includes("fontSize")}
          type="number"
          value={this.props.liveNodeEdit.fontSize || ""}
          onChange={event =>
            this.props.editNodeValue(
              { key: "fontSize", value: event.target.value },
              this.props.selNodeId
            )
          }
        />
        <Slider
          updateMaxRange={true}
          sliderVal={this.props.liveNodeEdit.fontSize}
          sliderMin={0}
          sliderMax={
            this.props.globalEdit.controls.fontSizeRangeMax.customValue ||
            this.props.globalEdit.controls.fontSizeRangeMax.defaultValue
          }
          editValue={arg =>
            this.props.editNodeValue(
              { key: "fontSize", value: arg },
              this.props.selNodeId
            )
          }
          updateSliderRangeMax={v =>
            this.props.editValue({
              section: "controls",
              key: "fontSizeRangeMax",
              value: v
            })
          }
          disabled={!this.props.liveNodeEdit.checkedAttrs.includes("fontSize")}
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

const mapDispatchToProps = (dispatch, props) => ({
  editNodeValue: (keyAndValue, selNodeId) =>
    dispatch(editNodeValue(keyAndValue, selNodeId)),
  // handleGlobalAttrCheckbox: checked => dispatch(handleGlobalAttrCheckbox(checked)),
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
