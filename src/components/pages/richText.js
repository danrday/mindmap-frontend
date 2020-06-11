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
    const currId = this.props.selNodeId ? this.props.selNodeId : "main";
    const currText = this.props.texts[currId] ? this.props.texts[currId] : "";
    this.setState({ text: currText });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selNodeId !== this.props.selNodeId) {
      const currId = this.props.selNodeId ? this.props.selNodeId : "main";
      const currText = this.props.texts[currId] ? this.props.texts[currId] : "";
      this.setState({ text: currText });
    }
  }

  save() {
    let text = this.state.text;
    let selNodeId = this.props.selNodeId;
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
});

const mapDispatchToProps = dispatch => ({
  saveTextFile: textAndNodeId => dispatch(saveTextFile(textAndNodeId))
});
export default connect(mapStateToProps, mapDispatchToProps)(RichText);
