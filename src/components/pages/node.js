import React, { Component } from "react";
import { connect } from "react-redux";

import {
  editName,
  editRadius,
  editFontSize
} from "../../redux/actions/liveNodeEdit";
import { saveEdits } from "../../redux/actions/simpleAction";

class Node extends Component {
  state = {
    selNodeId: this.props.selNodeId || "",
    name: this.props.selNodeName || ""
  };

  componentDidMount() {
    // console.log("MOUNTED");
  }

  componentDidUpdate() {
    // console.log("hmmm");
  }

  handleNameChange(event) {
    this.props.editName(event.target.value);
  }

  handleRadiusChange(event) {
    this.props.editRadius(event.target.value);
  }

  handleFontSizeChange(event) {
    this.props.editFontSize(event.target.value);
  }

  save() {
    this.props.saveEdits({
      id: this.props.selNodeId,
      name: this.props.selNodeName,
      radius: this.props.selNodeRadius,
      fontSize: this.props.selNodeFontSize
    });
  }

  cancel() {}

  render() {
    return (
      <div>
        <div>{this.props.selNodeId ? "Edit Node" : "Add new node"}</div>
        <button onClick={this.save.bind(this)}>save</button>
        <button onClick={this.cancel.bind(this)}>cancel</button>
        <div className="navIconFrame">
          <div className="navIcon">
            <i className="icon ion-android-add-circle" />
          </div>
        </div>
        <br />
        <div>heading</div>
        <input
          type="text"
          value={this.props.selNodeName || ""}
          onChange={this.handleNameChange.bind(this)}
        />
        <br /> <br />
        <div>radius</div>
        <input
          type="number"
          value={this.props.selNodeRadius || ""}
          onChange={this.handleRadiusChange.bind(this)}
        />
        <div>font size</div>
        <input
          type="number"
          value={this.props.selNodeFontSize || ""}
          onChange={this.handleFontSizeChange.bind(this)}
        />
      </div>
    );
  }
}

// const AssetMenuContainer = styled.div`
//     display: flex;
//     flex-direction: column;
//     background-color: floralwhite;
//     height: 100%;
//     width: 100%;
// `

const mapStateToProps = state => ({
  selNodeId: state.liveNodeEdit.selNodeId,
  selNodeName: state.liveNodeEdit.name,
  selNodeRadius: state.liveNodeEdit.radius,
  selNodeFontSize: state.liveNodeEdit.fontSize
});
const mapDispatchToProps = dispatch => ({
  editName: name => dispatch(editName(name)),
  editRadius: r => dispatch(editRadius(r)),
  editFontSize: f => dispatch(editFontSize(f)),
  saveEdits: edits => dispatch(saveEdits(edits))
});
export default connect(mapStateToProps, mapDispatchToProps)(Node);
