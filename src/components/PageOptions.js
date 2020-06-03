import React, { Component } from "react";
import styled from "styled-components";
import navLinks from "./NavLinks";

import { connect } from "react-redux";
import {
  document,
  postAction,
  addAction,
  deleteAction,
  selectNode
} from "../redux/actions/document";

class PageOptions extends Component {
  selectedMenu() {
    if (this.props.selectedPage) {
      return navLinks[this.props.selectedPage].component();
    } else {
      return (
        <div>
          <button onClick={this.props.openDocument}>open</button>
          <br />
          <button
            onClick={() => {
              console.log("document.file", this.props.document.file);
              this.props.postAction(this.props.document.editedFile);
            }}
          >
            save
          </button>
          <br />
          <button onClick={this.addAction}>add</button>
          <br />
          <button
            onClick={() => this.props.deleteAction(this.props.currSelNode)}
          >
            delete
          </button>
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
    height: 120px;
    width: 100%;
  }
  display: relative;
  height: calc(100vh - 60px);
  overflow-y: scroll;
  background-color: purple;

  ${({ openNav, hoverNav }) =>
    (openNav || hoverNav) &&
    `
        
      `};
`;

const SelectedMenuFrame = styled.div`
  @media (max-width: 768px) {
    width: 100%;
  }
  display: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  text-align: center;
  padding-top: 15px;
  transition: all 0.2s ease-in-out;

  z-index: 50;
  background-color: purple;
  ${({ openNav, hoverNav }) =>
    (openNav || hoverNav) &&
    `
        width: 200px;
        background-color: #9bccff;
         box-shadow: inset -4px 0px 2px -2px purple;
      `}
`;

const mapStateToProps = state => ({
  ...state,
  currSelNode: state.document.currentNode,
  currZoomLevel: state.document.editedFile
    ? state.document.editedFile.globalSettings.zoom
    : { x: 0, y: 0 },
  selectedPage: state.ui.selectedPage
});
const mapDispatchToProps = (dispatch, props) => ({
  openDocument: () => dispatch(document(props.channel)),
  postAction: file => dispatch(postAction(file, props.channel)),
  addAction: zoomLevel => dispatch(addAction(zoomLevel)),
  selectNode: node => dispatch(selectNode(node)),
  deleteAction: nodeId => dispatch(deleteAction(nodeId))
});
export default connect(mapStateToProps, mapDispatchToProps)(PageOptions);
