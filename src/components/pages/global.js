import React, { Component } from "react";
import { connect } from "react-redux";

class GlobalSettings extends Component {

    render() {
        return (
            <div>
                global settings
            </div>
        );
    }
}


const mapStateToProps = state => ({
    // categories: state.simpleReducer.editedFile.categories
});

const mapDispatchToProps = dispatch => ({
});
export default connect(mapStateToProps, mapDispatchToProps)(GlobalSettings);
