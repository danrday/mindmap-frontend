import React, { Component } from 'react'
import { connect } from 'react-redux'

// libraries
import styled from 'styled-components'


class Node extends Component {
    render() {

        return (
            <div>
                <div>Add new node</div>
                <div className="navIconFrame">
                    <div className="navIcon">
                        <i className='icon ion-android-add-circle' />
                    </div>
                </div>
                <br/>

                <div>heading</div>
                <input type="text"/>
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


export default connect()(Node)
