import React, { Component } from "react";
import { connect } from "react-redux";
import {editValue, handleCheckboxChange, populateInitialValues} from "../../redux/actions/globalEdit";
import {saveDefaultsEdit} from "../../redux/actions/document";
import ReactQuill from 'react-quill';
import styled from "styled-components"; // ES6


class RichText extends Component {
    constructor(props) {
        super(props)
        this.state = { text: '' } // You can also pass a Quill Delta here
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(value) {
        this.setState({ text: value })
    }

    render() {
        return (
                <ReactQuill value={this.state.text}
                            onChange={this.handleChange} />

        )
    }
}


const mapStateToProps = state => ({
    // globalEdit: state.globalEdit,
    // globalSettings: state.document.editedFile.globalSettings
});

const mapDispatchToProps = dispatch => ({
    // editValue: keyAndValue => dispatch(editValue(keyAndValue)),
    // handleCheckboxChange: checkedAttrs => dispatch(handleCheckboxChange(checkedAttrs)),
    // populateInitialValues: (defaults) => dispatch(populateInitialValues(defaults)),
    // saveDefaultsEdit: edits => dispatch(saveDefaultsEdit(edits))

});
export default connect(mapStateToProps, mapDispatchToProps)(RichText);
