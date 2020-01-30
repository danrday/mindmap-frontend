import React, { Component } from "react";
import { connect } from "react-redux";

import {
  editName,
  editRadius,
  editFontSize,
    handleCheckboxChange,
    editNewCategoryName
} from "../../redux/actions/liveNodeEdit";
import { saveEdits } from "../../redux/actions/simpleAction";

class Node extends Component {
  state = {
    selNodeId: this.props.selNodeId || "",
    name: this.props.selNodeName || "",
  customAttrs: []
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

    handleCategoryNameChange(event) {
    this.props.editNewCategoryName(event.target.value);
  }

  save() {

    if (!this.state.customAttrs.includes('saveAsCategory')) {
        this.props.saveEdits({
            customAttrs: this.state.customAttrs,
            id: this.props.selNodeId,
            name: this.props.selNodeName,
            radius: this.props.selNodeRadius,
            fontSize: this.props.selNodeFontSize
        });
    }
  }

    handleCheckboxChange(event) {
        const target = event.target;
        // const value = target.type === 'checkbox' ? target.checked : target.value;
        // const name = target.name;

        let attrs = this.state.customAttrs

        if (attrs.includes(target.name) && !target.checked) {
            attrs = attrs.filter(e => e !== target.name)
        } else if (!attrs.includes(target.name) && target.checked) {
            attrs.push(target.name)
        }

        this.setState({
            customAttrs: attrs
        });

        this.props.handleCheckboxChange(attrs)
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

          <hr/>
          <div>custom attributes</div>
          <br />

          <input
              name="radius"
              type="checkbox"
              checked={this.state.customAttrs.includes('radius')}
              onChange={this.handleCheckboxChange.bind(this)} />
        <div>radius</div>
        <input
            disabled={!this.state.customAttrs.includes('radius')}
          type="number"
          value={this.props.selNodeRadius || ""}
          onChange={this.handleRadiusChange.bind(this)}
        />
          <br />
          <input
              name="fontSize"
              type="checkbox"
              checked={this.state.customAttrs.includes('fontSize')}
              onChange={this.handleCheckboxChange.bind(this)} />
        <div>font size</div>
        <input
            disabled={!this.state.customAttrs.includes('fontSize')}
            type="number"
          value={this.props.selNodeFontSize || ""}
          onChange={this.handleFontSizeChange.bind(this)}
        />


        <hr/>
          <br />


          <input
              name="saveAsCategory"
              type="checkbox"
              checked={this.state.customAttrs.includes('saveAsCategory')}
              onChange={this.handleCheckboxChange.bind(this)} />
          <div>save custom attrs as new category</div>
          <input
              disabled={!this.state.customAttrs.includes('saveAsCategory')}
              type="string"
              value={this.props.selCategory || ""}
              onChange={this.handleCategoryNameChange.bind(this)}
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
  selNodeFontSize: state.liveNodeEdit.fontSize,
    selCategory: state.liveNodeEdit.newCategoryName
});
const mapDispatchToProps = dispatch => ({
  editName: name => dispatch(editName(name)),
  editRadius: r => dispatch(editRadius(r)),
  editFontSize: f => dispatch(editFontSize(f)),
  saveEdits: edits => dispatch(saveEdits(edits)),
    handleCheckboxChange: checkedAttrs => dispatch(handleCheckboxChange(checkedAttrs)),
    editNewCategoryName: name => dispatch(editNewCategoryName(name))
});
export default connect(mapStateToProps, mapDispatchToProps)(Node);
