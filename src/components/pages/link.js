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
  editFontSize,
  handleCheckboxChange,
  editNewCategoryName,
  clearTempCustomAttrs,
  changeSelectedCategory,
  editLinkValue
} from "../../redux/actions/liveLinkEdit";
import {
  deleteAction,
  saveEdits,
  saveLinkEdits
} from "../../redux/actions/document";
import { editValue } from "../../redux/actions/globalEdit";

class Link extends Component {
  save() {
    this.props.saveLinkEdits({
      customAttrs: this.props.liveLinkEdit.checkedAttrs,
      liveLinkEdit: this.props.liveLinkEdit,
      globalEdit: this.props.globalEdit
    });
    // this.props.clearTempCustomAttrs()
  }

  handleCheckboxChange(event) {
    const target = event.target;
    let attrs = this.props.liveLinkEdit.checkedAttrs;

    if (attrs.includes(target.name) && !target.checked) {
      attrs = attrs.filter(e => e !== target.name);
    } else if (!attrs.includes(target.name) && target.checked) {
      attrs.push(target.name);
    }

    // this.setState({
    //     customAttrs: attrs
    // });

    this.props.handleCheckboxChange(attrs, this.props.selLinkId);
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
          {/*{this.props.liveLinkEdit.selLinkId ? "Edit Link" : "Add new link"}*/}
        </div>
        <Button click={this.save.bind(this)}>Apply</Button>
        {/*<Button click={this.save.bind(this)}>save and unselect</Button>*/}
        {/*<Button click={this.cancel.bind(this)}>Cancel</Button>*/}
        {/*<Button click={() => this.props.deleteAction(this.props.selLinkId)}>*/}
        {/*  Delete Link*/}
        {/*</Button>*/}
        <hr />
        {/*<div>heading</div>*/}
        {/*<input*/}
        {/*  className="input"*/}
        {/*  type="text"*/}
        {/*  value={*/}
        {/*    this.props.liveLinkEdit.name ||*/}
        {/*    this.props.globalEdit.link.name.defaultValue*/}
        {/*  }*/}
        {/*  onChange={event =>*/}
        {/*    this.props.editName(event.target.value, this.props.selLinkId)*/}
        {/*  }*/}
        {/*/>*/}
        {/*<br /> <br />*/}
        {/*<hr />*/}
        <div>custom attributes</div>
        <br />
        <div>stroke width</div>
        <Switch
          name="strokeWidth"
          checked={this.props.liveLinkEdit.checkedAttrs.includes("strokeWidth")}
          onChange={this.handleCheckboxChange.bind(this)}
        />
        <input
          style={{ display: "inline-block", width: "50%" }}
          className="input"
          disabled={
            !this.props.liveLinkEdit.checkedAttrs.includes("strokeWidth")
          }
          type="number"
          value={this.props.liveLinkEdit.strokeWidth || ""}
          onChange={event =>
            this.props.editLinkValue(
              { key: "strokeWidth", value: event.target.value },
              this.props.selLinkId
            )
          }
        />
        <Slider
          updateMaxRange={true}
          sliderVal={this.props.liveLinkEdit.strokeWidth}
          sliderMin={0}
          sliderMax={
            this.props.globalEdit.controls.linkStrokeWidthRangeMax
              .customValue ||
            this.props.globalEdit.controls.linkStrokeWidthRangeMax.defaultValue
          }
          editValue={val =>
            this.props.editLinkValue(
              { key: "strokeWidth", value: val },
              this.props.selLinkId
            )
          }
          updateSliderRangeMax={v =>
            this.props.editGlobalValue({
              section: "controls",
              key: "linkStrokeWidthRangeMax",
              value: v
            })
          }
          disabled={
            !this.props.liveLinkEdit.checkedAttrs.includes("strokeWidth")
          }
        />
        <hr />
        <br />
        <div>category</div>
        <Switch
          name="category"
          checked={this.props.liveLinkEdit.checkedAttrs.includes("category")}
          onChange={this.handleCheckboxChange.bind(this)}
        />
        <br />
        <Dropdown
          onChange={cat => this.props.changeSelectedCategory(cat)}
          value={this.props.liveLinkEdit.category || "none"}
          categories={this.props.categories}
        />
        <br />`
        <br />
        <Switch
          name="newCategoryName"
          checked={this.props.liveLinkEdit.checkedAttrs.includes(
            "newCategoryName"
          )}
          onChange={this.handleCheckboxChange.bind(this)}
        />
        <div>save custom attrs as new category</div>
        <input
          className="input"
          disabled={
            !this.props.liveLinkEdit.checkedAttrs.includes("newCategoryName")
          }
          type="string"
          value={this.props.liveLinkEdit.newCategoryName || ""}
          onChange={event => this.props.editNewCategoryName(event.target.value)}
        />
        <br />
        <br />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  liveLinkEdit: state.liveLinkEdit,
  selLinkId: state.liveLinkEdit.selLinkId,
  categories: state.document.present.editedFile.categories,
  globalEdit: state.globalEdit
});

const mapDispatchToProps = (dispatch, props) => ({
  editLinkValue: (keyAndValue, selLinkId) =>
    dispatch(editLinkValue(keyAndValue, selLinkId)),
  // handleGlobalAttrCheckbox: checked => dispatch(handleGlobalAttrCheckbox(checked)),
  saveEdits: edits => dispatch(saveEdits(edits)),
  saveLinkEdits: edits => dispatch(saveLinkEdits(edits)),
  handleCheckboxChange: (checkedAttrs, selLinkId) =>
    dispatch(handleCheckboxChange(checkedAttrs, selLinkId)),
  editNewCategoryName: name => dispatch(editNewCategoryName(name)),
  clearTempCustomAttrs: () => dispatch(clearTempCustomAttrs()),
  changeSelectedCategory: cat => dispatch(changeSelectedCategory(cat)),
  deleteAction: linkId => dispatch(deleteAction(linkId)),
  editGlobalValue: keyAndValue => dispatch(editValue(keyAndValue))
});
export default connect(mapStateToProps, mapDispatchToProps)(Link);
