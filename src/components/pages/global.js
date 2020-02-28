import React, { Component } from "react";
import { connect } from "react-redux";
import {editValue, handleCheckboxChange, populateInitialValues} from "../../redux/actions/globalEdit";
import {saveDefaultsEdit} from "../../redux/actions/simpleAction";

class GlobalSettings extends Component {

    componentDidMount() {
        // this.props.populateInitialValues(this.props.globalSettings)
    }

    handleCheckboxChange(event) {
        const target = event.target;
        let attrs = this.props.globalEdit.checkedAttrs

        if (attrs.includes(target.name) && !target.checked) {
            attrs = attrs.filter(e => e !== target.name)
        } else if (!attrs.includes(target.name) && target.checked) {
            attrs.push(target.name)
        }

        this.props.handleCheckboxChange(attrs)
    }

    save() {

        let edits = this.props.globalEdit

        this.props.saveDefaultsEdit(edits);
    }

    render() {
        return (
            <div class="column is-vcentered">
                 <button className="button is-success is-rounded is-light" onClick={this.save.bind(this)}>save</button>
<br/>
<br/>
                <label className="switch">
                <input
                    name="chargeStrength"
                    type="checkbox"
                    checked={this.props.globalEdit.checkedAttrs.includes('chargeStrength')}
                    onChange={this.handleCheckboxChange.bind(this)} />
                        <span className="slider round"></span>
                </label>

                <div>charge strength</div>
                <input
                    disabled={!this.props.globalEdit.checkedAttrs.includes('chargeStrength')}
                    type="number"
                    className="input"
                    value={this.props.globalEdit.chargeStrength || ""}
                    onChange={event => this.props.editValue({key: 'chargeStrength', value: event.target.value})}
                />
                <br/>
                <br/>
                <label className="switch">
                <input
                    name="linkDistance"
                    type="checkbox"

                    checked={this.props.globalEdit.checkedAttrs.includes('linkDistance')}
                    onChange={this.handleCheckboxChange.bind(this)} />
                    <span className="slider round"></span>
                </label>
                <div>link distance</div>
                <input
                    disabled={!this.props.globalEdit.checkedAttrs.includes('linkDistance')}
                    type="number"
                    className="input"
                    value={this.props.globalEdit.linkDistance || ""}
                    onChange={event => this.props.editValue({key: 'linkDistance', value: event.target.value})}
                />
            </div>
        );
    }
}


const mapStateToProps = state => ({
    globalEdit: state.globalEdit,
    globalSettings: state.simpleReducer.editedFile.globalSettings
});

const mapDispatchToProps = dispatch => ({
    editValue: keyAndValue => dispatch(editValue(keyAndValue)),
    handleCheckboxChange: checkedAttrs => dispatch(handleCheckboxChange(checkedAttrs)),
    populateInitialValues: (defaults) => dispatch(populateInitialValues(defaults)),
    saveDefaultsEdit: edits => dispatch(saveDefaultsEdit(edits))

});
export default connect(mapStateToProps, mapDispatchToProps)(GlobalSettings);
