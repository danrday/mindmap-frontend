import React, { Component } from "react";
import { connect } from "react-redux";
import {addTodo, completeTodo, subscribeTodos} from "../../redux/actions/toDo";

import {saveDefaultsEdit} from "../../redux/actions/document";
import ReactQuill from 'react-quill';
import styled from "styled-components"; // ES6


class ChannelTest extends Component {
    componentDidMount() {
        this.props.subscribeTodos()
    }

    render() {
        return (
            <div>
                <button onClick={this.props.addTodo('testing123')}></button>
            </div>
        )
    }
}


const mapStateToProps = state => ({
    // globalEdit: state.globalEdit,
    // globalSettings: state.document.editedFile.globalSettings
});

const mapDispatchToProps = dispatch => ({
    addTodo: text => dispatch(addTodo(text)),
    subscribeTodos: () => dispatch(subscribeTodos()),
    // handleCheckboxChange: checkedAttrs => dispatch(handleCheckboxChange(checkedAttrs)),
    // populateInitialValues: (defaults) => dispatch(populateInitialValues(defaults)),
    // saveDefaultsEdit: edits => dispatch(saveDefaultsEdit(edits))

});
export default connect(mapStateToProps, mapDispatchToProps)(ChannelTest);
