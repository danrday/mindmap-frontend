import React, { Component } from "react";
import { connect } from "react-redux";
import ReactQuill from "react-quill";
import styled from "styled-components";
import Button from "../reusable/button"; // ES6
import { saveTextFile } from "../../redux/actions/document";

class RichText extends Component {
  state = {
    text: ""
  };

  handleChange(value) {
    this.setState({ text: value });
  }

  componentDidMount() {
    console.log("MOUNTED RICH TEXT", this.props);
    const currId = this.props.selNodeId ? this.props.selNodeId : "main";
    const currText = this.props.texts[currId] ? this.props.texts[currId] : "";

    this.setState({ text: currText });
  }

  save() {
    let text = this.state.text;
    let selNodeId = this.props.selNodeId;
    console.log("HMMM", this.props);

    let payload = { text, selNodeId };

    this.props.saveTextFile(payload);
  }

  render() {
    return (
      <div>
        <Button click={this.save.bind(this)}>Apply changes</Button>
        <ReactQuill
          value={this.state.text}
          onChange={this.handleChange.bind(this)}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  selNodeId: state.liveNodeEdit.selNodeId,
  texts: state.document.present.editedFile.text
  // globalEdit: state.globalEdit,
  // globalSettings: state.document.editedFile.globalSettings
});

const mapDispatchToProps = dispatch => ({
  saveTextFile: textAndNodeId => dispatch(saveTextFile(textAndNodeId))
  // editValue: keyAndValue => dispatch(editValue(keyAndValue)),
  // handleCheckboxChange: checkedAttrs => dispatch(handleCheckboxChange(checkedAttrs)),
  // populateInitialValues: (defaults) => dispatch(populateInitialValues(defaults)),
  // saveDefaultsEdit: edits => dispatch(saveDefaultsEdit(edits))
});
export default connect(mapStateToProps, mapDispatchToProps)(RichText);
