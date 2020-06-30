import React, { Component } from "react";
import styled from "styled-components";
import navLinks from "./NavLinks";
import Button from "./reusable/button.js";

import { connect } from "react-redux";
import {
  document,
  postAction,
  addAction,
  postSaveAsAction,
  deleteAction
} from "../redux/actions/document";
import { selectNode } from "../redux/actions/liveNodeEdit";
import { ActionCreators } from "redux-undo";

class PageOptions extends Component {
  selectedMenu() {
    if (this.props.selectedPage && this.props.selectedPage !== "/open") {
      let link = navLinks.find(navlink => {
        return navlink.link === this.props.selectedPage;
      });
      return link.component();
    } else {
      return (
        <div>
          <Button
            click={() =>
              this.props.postAction(this.props.document.present.editedFile)
            }
          >
            Save
          </Button>
          {/*<Button*/}
          {/*  click={() =>*/}
          {/*    this.props.postSaveAsAction(*/}
          {/*      this.props.document.present.editedFile*/}
          {/*    )*/}
          {/*  }*/}
          {/*>*/}
          {/*  Save a copy*/}
          {/*</Button>*/}
          {/*<Button click={this.addAction}>Add Node</Button>*/}
          <Button click={this.props.undo}>Undo</Button>
        </div>
      );
    }
  }

  render() {
    return (
      <Test openNav={this.props.navIsOpen} hoverNav={this.props.navIsHovered}>
        <SelectedMenuFrame
          openNav={this.props.navIsOpen}
          hoverNav={this.props.navIsHovered}
          onMouseEnter={() => this.props.hover(true)}
          onMouseLeave={() => this.props.hover(false)}
        >
          {this.selectedMenu()}
        </SelectedMenuFrame>
      </Test>
    );
  }

  addAction = () => {
    if (this.props.currSelNode) {
      this.props.selectNode(this.props.currSelNode);
    }
    this.props.addAction(this.props.currZoomLevel);
  };
}
const Test = styled.div`
  @media (max-width: 768px) {
  }
  // display: relative;
  // height: calc(100vh - 60px);
  overflow-y: scroll;
  background-color: brown;

  ${({ openNav, hoverNav }) =>
    (openNav || hoverNav) &&
    `
          
      `};
`;

const SelectedMenuFrame = styled.div`
  @media (max-width: 768px) {
    width: 100%;
  }
  // width: 0px;
  // display: absolute;
  // top: 0;
  // left: 0;
  // right: 0;
  // bottom: 0;

  text-align: center;
  padding-top: 15px;
  transition: all 0.2s ease-in-out;

  z-index: 50;
  background-color: purple;
  ${({ openNav, hoverNav }) =>
    (openNav || hoverNav) &&
    `
        width: 100%;
        background-color: #9bccff;
         box-shadow: inset -4px 0px 2px -2px purple;
      `}
`;

const mapStateToProps = state => ({
  ...state,
  currSelNode: state.liveNodeEdit.selNodeId,
  currZoomLevel: state.document.present.editedFile
    ? state.document.present.editedFile.globalSettings.zoom
    : { x: 0, y: 0 },
  selectedPage: state.ui.selectedPage
});
const mapDispatchToProps = (dispatch, props) => ({
  // openDocument: () => dispatch(document(props.channel)),
  postAction: file => dispatch(postAction(file, props.channel)),
  addAction: zoomLevel => dispatch(addAction(zoomLevel)),
  selectNode: node => dispatch(selectNode(node)),
  postSaveAsAction: file => dispatch(postSaveAsAction(file, props.channel)),
  // deleteAction: nodeId => dispatch(deleteAction(nodeId))
  undo: () => dispatch(ActionCreators.undo())
});
export default connect(mapStateToProps, mapDispatchToProps)(PageOptions);
