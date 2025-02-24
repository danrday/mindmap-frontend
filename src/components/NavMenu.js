import React, { Component } from "react";
import styled from "styled-components";
import navLinks from "./NavLinks";

import { connect } from "react-redux";
import {
  document,
  postAction,
  addAction,
  deleteAction
} from "../redux/actions/document";
import { selectNode } from "../redux/actions/liveNodeEdit";

import { selectPage } from "../redux/actions/ui";

class NavMenu extends Component {
  handleSelected(path) {
    this.props.selectPage(path, this.props.selectedPage);
  }
  render() {
    return (
      <NavItemsFrame
        openNav={this.props.navIsOpen}
        hoverNav={this.props.navIsHovered}
        onMouseEnter={() => this.props.hover(true)}
        onMouseLeave={() => this.props.hover(false)}
      >
        {navLinks.map((item, i) => {
          const isSelected = item.link === this.props.selectedPage;

          if (
            (item.link === "/node" && !this.props.currSelNode) ||
            (item.link === "/link" && !this.props.currSelLink)
          ) {
            return;
          }

          const subItems = item.subItems;

          const isNodeItem = item.link === "/node";

          const isRichText = item.link === "/richText";

          const isLocked = this.props.lockedPages.includes(i);

          return (
            <div key={item.link}>
              <NavItem
                disabled={isLocked}
                onClick={() => {
                  if (isLocked) {
                    alert("Another user is editing the global settings.");
                  } else if (item.link === "/save") {
                    this.props.postAction(
                      this.props.document.present.editedFile
                    );
                  } else {
                    this.handleSelected(item.link);
                  }
                }}
                isSelected={isSelected}
              >
                <div className="navIconFrame">
                  <div className="navIcon">
                    <i
                      className={
                        isNodeItem && this.props.currSelNode
                          ? item.altClassName
                          : item.className
                      }
                    />
                  </div>
                </div>
                <div className="navItemText">
                  {isNodeItem && this.props.currSelNode
                    ? item.altNavItemText
                    : item.navItemText}
                </div>
              </NavItem>
            </div>
          );
        })}
      </NavItemsFrame>
    );
  }

  addAction = () => {
    if (this.props.currSelNode) {
      this.props.selectNode(this.props.currSelNode);
    }
    this.props.addAction(this.props.currZoomLevel);
  };
}

const NavItemsFrame = styled.div`
  @media (max-width: 768px) {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    padding-bottom: 15px;
  }
  // top: 60px;
  // left: 0px;
  // bottom: 0;
  flex-direction: column;
  z-index: 100;
  width: 60px;
  background-color: #d1e8e3;
  transition: all 0.2s ease-in-out;
  padding-top: 15px;
  ${({ openNav, hoverNav }) =>
    (openNav || hoverNav) &&
    `
        background: darkorange;
      `}
`;

const NavItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow-x: hidden;
  height: 30px;
  transition: all 0.2s ease-in-out;
  &:hover {
    background-color: mintcream;
    cursor: pointer;
  }

  ${({ disabled }) =>
    disabled &&
    `
        opacity: .4;
        `}

  ${({ isSelected }) =>
    isSelected &&
    `
        background-color: white;
        `}

  .navIconFrame {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 60px;
    position: fixed;
  }
  .navIcon {
    font-size: 22px;
    transition: all 0.2s ease-in-out;
  }
  .navItemText {
    white-space: nowrap;
    margin-left: 65px;
    margin-right: auto;
    letter-spacing: 0.2px;
    font-family: "Roboto", "Helvetica Neue", Arial, sans-serif;
    font-size: 14px;
  }
`;

const mapStateToProps = state => ({
  ...state,
  currSelNode: state.liveNodeEdit.selNodeId,
  currSelLink: state.liveLinkEdit.selLinkId,
  currZoomLevel: state.document.editedFile
    ? state.document.editedFile.globalSettings.zoom
    : { x: 0, y: 0 },
  selectedPage: state.ui.selectedPage,
  lockedPages: state.ui.lockedPages
});
const mapDispatchToProps = (dispatch, props) => ({
  openDocument: () => dispatch(document(props.channel)),
  postAction: file => dispatch(postAction(file, props.channel)),
  addAction: zoomLevel => dispatch(addAction(zoomLevel)),
  selectNode: node => dispatch(selectNode(node)),
  deleteAction: nodeId => dispatch(deleteAction(nodeId)),
  selectPage: (pageName, currentPage) =>
    dispatch(selectPage(pageName, currentPage))
});
export default connect(mapStateToProps, mapDispatchToProps)(NavMenu);

// {isSelected &&
// subItems &&
// subItems.map((item, i) => {
//     const isSelectedSubItem = i === this.state.selectedSubItem;
//
//     const isNodeItem = item.link === "/node";
//     console.log("refiring?", item.link);
//     return (
//         <NavItem
//             onClick={() => {
//                 this.handleSelectedSubItem(i);
//             }}
//             isSelected={isSelectedSubItem}
//             isSubItem={true}
//         >
//             <div className="navIconFrame">
//                 <div className="navIcon">
//                     <i
//                         className={
//                             !isNodeItem ? item.className : item.altClassName
//                         }
//                     />
//                 </div>
//             </div>
//             <div className="navItemText">
//                 {!isNodeItem ? item.navItemText : item.altNavItemText}
//             </div>
//         </NavItem>
//     );
// })}

// handleSelectedSubItem(i) {
//     this.setState({ selectedSubItem: i });
// }
