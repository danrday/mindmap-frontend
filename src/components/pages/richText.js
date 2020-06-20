import React, { Component } from "react";
import { connect } from "react-redux";
import ReactQuill from "react-quill";
import styled from "styled-components";
import Button from "../reusable/button"; // ES6
import {
  saveTextFile,
  saveEdits,
  deleteAction
} from "../../redux/actions/document";
import { editNodeValue } from "../../redux/actions/liveNodeEdit";

class RichText extends Component {
  state = {
    text: ""
  };

  handleChange(value) {
    this.setState({ text: value });
  }

  componentDidMount() {
    const currId = this.props.selNodeId ? this.props.selNodeId : "main";
    const currText = this.props.texts[currId] ? this.props.texts[currId] : "";
    this.setState({ text: currText });
  }

  componentDidUpdate(prevProps) {
    const currId = this.props.selNodeId ? this.props.selNodeId : "main";
    const currText = this.props.texts[currId] ? this.props.texts[currId] : "";

    if (prevProps.selNodeId !== this.props.selNodeId) {
      this.setState({ text: currText });
    } else if (prevProps.texts[currId] !== this.props.texts[currId]) {
      // this is for the case of undo action
      this.setState({ text: currText });
    }

    if (this.nameInput.value === this.props.globalEdit.node.name.defaultValue) {
      this.nameInput.focus();
      this.nameInput.setSelectionRange(0, this.nameInput.value.length);
    }
  }

  save() {
    let text = this.state.text;
    let selNodeId = this.props.selNodeId;
    let payload = { text, selNodeId };
    this.props.saveTextFile(payload);
    this.props.saveEdits({
      customAttrs: this.props.liveNodeEdit.checkedAttrs,
      liveNodeEdit: this.props.liveNodeEdit,
      globalEdit: this.props.globalEdit
    });
  }

  render() {
    return (
      <div>
        <Button click={this.save.bind(this)}>Apply</Button>
        <Button click={() => this.props.deleteAction(this.props.selNodeId)}>
          Delete
        </Button>
        <div>heading</div>
        <input
          ref={input => {
            this.nameInput = input;
          }}
          className="input"
          type="text"
          value={
            this.props.liveNodeEdit.name ||
            this.props.globalEdit.node.name.defaultValue
          }
          onChange={event =>
            this.props.editNodeValue(
              { key: "name", value: event.target.value },
              this.props.selNodeId
            )
          }
        />
        <ReactQuill
          value={this.state.text}
          onChange={this.handleChange.bind(this)}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  liveNodeEdit: state.liveNodeEdit,
  globalEdit: state.globalEdit,
  selNodeId: state.liveNodeEdit.selNodeId,
  texts: state.document.present.editedFile.text
});

const mapDispatchToProps = dispatch => ({
  editNodeValue: (keyAndValue, selNodeId) =>
    dispatch(editNodeValue(keyAndValue, selNodeId)),
  saveEdits: edits => dispatch(saveEdits(edits)),
  saveTextFile: textAndNodeId => dispatch(saveTextFile(textAndNodeId)),
  deleteAction: nodeId => dispatch(deleteAction(nodeId))
});
export default connect(mapStateToProps, mapDispatchToProps)(RichText);
