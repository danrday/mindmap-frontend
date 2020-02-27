import React, { Component } from "react";
import { connect } from "react-redux";
import ReactSlider from 'react-slider'
import "../styles/slider.css";


import {
  editName,
  editRadius,
  editFontSize,
    handleCheckboxChange,
    editNewCategoryName,
    clearTempCustomAttrs,
    changeSelectedCategory
} from "../../redux/actions/liveNodeEdit";
import {deleteAction, saveEdits} from "../../redux/actions/simpleAction";

class Node extends Component {
    state = {
        testSliderVal: 20,
        testMax: 100,
        testMin: 0,
        pointerUp: true,
        timeout: undefined
    }
  save() {
        this.props.saveEdits({
            customAttrs: this.props.liveNodeEdit.checkedAttrs,
            liveNodeEdit: this.props.liveNodeEdit,
        });
      // this.props.clearTempCustomAttrs()
  }

    handleCheckboxChange(event) {
        const target = event.target;
        let attrs = this.props.liveNodeEdit.checkedAttrs

        if (attrs.includes(target.name) && !target.checked) {
            attrs = attrs.filter(e => e !== target.name)
        } else if (!attrs.includes(target.name) && target.checked) {
            attrs.push(target.name)
        }

        // this.setState({
        //     customAttrs: attrs
        // });

        this.props.handleCheckboxChange(attrs)
    }

  cancel() {}

  repeat() {
        console.log('this', this)
      if (this.state.testMax ===  this.state.testSliderVal) {
          this.setState({testMax: this.state.testMax+ 1, testSliderVal: this.state.testSliderVal+1})
          this.props.editRadius(this.state.testSliderVal+1)
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

  pointerDown(e) {
      this.repeat()
  }

  pointerUp() {
        clearTimeout(this.state.timeout)
  }

  render() {
    return (
      <div>
        <div>{this.props.liveNodeEdit.selNodeId ? "Edit Node" : "Add new node"}</div>
        <button onClick={this.save.bind(this)}>save</button>
          <button onClick={this.save.bind(this)}>save and unselect</button>
          <button onClick={this.cancel.bind(this)}>cancel</button>
          <button onClick={this.props.deleteAction}>delete</button>

          <div className="navIconFrame">
          <div className="navIcon">
            <i className="icon ion-android-add-circle" />
          </div>
        </div>
        <br />
        <div>heading</div>
        <input
          type="text"
          value={this.props.liveNodeEdit.name || ""}
          onChange={event => this.props.editName(event.target.value)}
        />
        <br /> <br />

          <hr/>
          <div>custom attributes</div>
          <br />

          <input
              name="radius"
              type="checkbox"
              checked={this.props.liveNodeEdit.checkedAttrs.includes('radius')}
              onChange={this.handleCheckboxChange.bind(this)} />
        <div>radius</div>
        <input
            disabled={!this.props.liveNodeEdit.checkedAttrs.includes('radius')}
          type="number"
          value={this.props.liveNodeEdit.radius || ""}
          onChange={event => this.props.editRadius(event.target.value)}
        />
          <br />
          <input
              name="fontSize"
              type="checkbox"
              checked={this.props.liveNodeEdit.checkedAttrs.includes('fontSize')}
              onChange={this.handleCheckboxChange.bind(this)} />
        <div>font size</div>
        <input
            disabled={!this.props.liveNodeEdit.checkedAttrs.includes('fontSize')}
            type="number"
          value={this.props.liveNodeEdit.fontSize || ""}
          onChange={event => this.props.editFontSize(event.target.value)}
        />

        <hr/>
          <br />

          <div>category</div>
          <input
              name="category"
              type="checkbox"
              checked={this.props.liveNodeEdit.checkedAttrs.includes('category')}
              onChange={this.handleCheckboxChange.bind(this)} />
          <select  onChange={e => this.props.changeSelectedCategory(e.target.value)} value={this.props.liveNodeEdit.category || 'none'} >
              <option key='-1' default value='none'>(None)</option>
              {Object.keys(this.props.categories).map((cat, i) => {
                  return <option key={i} value={cat}>{cat}</option>
              })}
          </select>

          <br /><br />

          <input
              name="newCategoryName"
              type="checkbox"
              checked={this.props.liveNodeEdit.checkedAttrs.includes('newCategoryName')}
              onChange={this.handleCheckboxChange.bind(this)} />
          <div>save custom attrs as new category</div>
          <input
              disabled={!this.props.liveNodeEdit.checkedAttrs.includes('newCategoryName')}
              type="string"
              value={this.props.liveNodeEdit.newCategoryName || ""}
              onChange={event => this.props.editNewCategoryName(event.target.value)}
          />

          <br /><br />
          <div onPointerOut={this.pointerUp.bind(this)} onPointerUp={this.pointerUp.bind(this)} onPointerDown={this.pointerDown.bind(this)}>
          <ReactSlider
              className="horizontal-slider"
              thumbClassName="example-thumb"
              trackClassName="example-track"
              renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
              onChange={val => {
                  this.props.editRadius(val)
                  this.setState({testSliderVal: val})}
              }
              value={this.state.testSliderVal}
              min={this.state.testMin}
              max={this.state.testMax}

          />
          </div>

      </div>
    );
  }
}


const mapStateToProps = state => ({
    liveNodeEdit: state.liveNodeEdit,
    categories: state.simpleReducer.editedFile.categories
});

const mapDispatchToProps = dispatch => ({
  editName: name => dispatch(editName(name)),
  editRadius: r => dispatch(editRadius(r)),
  editFontSize: f => dispatch(editFontSize(f)),
  saveEdits: edits => dispatch(saveEdits(edits)),
    handleCheckboxChange: checkedAttrs => dispatch(handleCheckboxChange(checkedAttrs)),
    editNewCategoryName: name => dispatch(editNewCategoryName(name)),
    clearTempCustomAttrs: () => dispatch(clearTempCustomAttrs()),
    changeSelectedCategory: (cat) => dispatch(changeSelectedCategory(cat)),
    deleteAction: () => dispatch(deleteAction()),
});
export default connect(mapStateToProps, mapDispatchToProps)(Node);
