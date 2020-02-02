import React, { Component } from "react";
import { connect } from "react-redux";

class Categories extends Component {

    render() {
        return (
            <div>
               categories
            </div>
        );
    }
}


const mapStateToProps = state => ({
    // categories: state.simpleReducer.editedFile.categories
});

const mapDispatchToProps = dispatch => ({
});
export default connect(mapStateToProps, mapDispatchToProps)(Categories);
