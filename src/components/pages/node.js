import React, { Component } from 'react'
import { connect } from 'react-redux'

// libraries
import styled from 'styled-components'
import {
    addAction,
    deleteAction,
    postAction,
    saveNameChangeAction,
    simpleAction
} from "../../redux/actions/simpleAction";


class Node extends Component {

    state = {
        editedNode: this.props.currSelNode,
        name: ''
    };

    componentDidMount(){
        console.log('MOUNTED', )
        this.setState({name: this.props.currSelNode.name})
    }

    componentDidUpdate() {
        console.log('hmmm', )
    }


    handleNameChange(event) {
        this.setState({ name: event.target.value });
    }

    render() {

        return (
            <div>
                <div>{this.props.currSelNode ? 'Edit Node' : 'Add new node'}</div>
                <div className="navIconFrame">
                    <div className="navIcon">
                        <i className='icon ion-android-add-circle' />
                    </div>
                </div>
                <br/>

                <div>heading</div>
                <input type="text" value={this.state.name} onChange={this.handleNameChange.bind(this)}/>
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
    currSelNode: state.simpleReducer.currentNode? state.simpleReducer.editedFile.nodes.find(e => {
        console.log('hmmmmmm', )
        return e.id === state.simpleReducer.currentNode
    }) : {name: 'new node'},
});
const mapDispatchToProps = dispatch => ({
});
export default connect(mapStateToProps, mapDispatchToProps)(Node);

