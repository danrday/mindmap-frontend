import React, { Component } from 'react'
import { connect } from 'react-redux'

import { editName } from "../../redux/actions/liveNodeEdit";


// libraries
import styled from 'styled-components'
import {
    addAction,
    deleteAction,
    postAction, saveAction,
    saveNameChangeAction,
    simpleAction
} from "../../redux/actions/simpleAction";


class Node extends Component {

    state = {
        selNodeId: this.props.selNodeId,
        name: this.props.selNodeName
    };

    componentDidMount(){
        console.log('MOUNTED', )
    }

    componentDidUpdate() {
        console.log('hmmm', )
    }


    handleNameChange(event) {
        this.props.editName(event.target.value)
    }

    render() {

        return (
            <div>
                <div>{this.props.selNodeId ? 'Edit Node' : 'Add new node'}</div>
                <div className="navIconFrame">
                    <div className="navIcon">
                        <i className='icon ion-android-add-circle' />
                    </div>
                </div>
                <br/>

                <div>heading</div>
                <input type="text" value={this.props.selNodeName} onChange={this.handleNameChange.bind(this)}/>
                <br/>                <br/>

                <div>sub-heading</div>
                <input type="text"/>
            </div>
        )
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
    selNodeName: state.liveNodeEdit.name
});
const mapDispatchToProps = dispatch => ({
    editName: name => dispatch(editName(name)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Node);

