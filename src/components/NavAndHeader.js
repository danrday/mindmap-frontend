import React, { Component } from "react";
import styled from "styled-components";
import navLinks from "./NavLinks";

import Node from "./pages/node";

import { connect } from "react-redux";
import {
  simpleAction,
  postAction,
  addAction,
  deleteAction,
  saveNameChangeAction
} from "../redux/actions/simpleAction";

import {
    selectPage
} from "../redux/actions/ui";

class NavAndHeader extends Component {
  state = {
    selectedSubItem: null,
    nameValue: "null",
    selectedMenu: null
  };
  handleSelected(i) {
      this.props.selectPage(i)
    // this.setState({ selected: i });
  }
  handleSelectedSubItem(i) {
    this.setState({ selectedSubItem: i });
  }

  handleNameChange(event) {
    this.setState({ nameValue: event.target.value });
  }

  handleSaveNameChange() {
    this.saveNameChangeAction(this.state.nameValue);
  }

  componentDidMount() {
    this.simpleAction();
  }

  selectedMenu() {
    if (this.props.selectedPage) {
      return navLinks[this.props.selectedPage].component();
    } else {
      return (
        <div>
          <button onClick={this.simpleAction}>open</button>
          <br />
          <button
            onClick={() => {
              console.log("simpleReducer.file", this.props.simpleReducer.file);
              this.postAction(this.props.simpleReducer.editedFile);
            }}
          >
            save
          </button>
          <br />
          <button onClick={this.addAction}>add</button>
          <br />
          <button onClick={this.props.deleteAction}>delete</button>
        </div>
      );
    }
  }
  render() {
    // console.log("RENDER");

    return (
      <StyledHeader openNav={this.props.navIsOpen}>
        <div className="hamburgerFrame" onClick={this.props.toggle}>
          <div className="iconFrame">
            <i className="hamburger icon ion-navicon-round" />
            <i className="close icon ion-close" />
          </div>
        </div>

        {/*<input*/}
        {/*  type="text"*/}
        {/*  value={this.state.nameValue}*/}
        {/*  onChange={this.handleNameChange.bind(this)}*/}
        {/*/>*/}

        {/*<button onClick={this.handleSaveNameChange.bind(this)}>*/}
        {/*  save to {this.props.currSelNode}*/}
        {/*</button>*/}

        <div className="projectTitle">
          <h4 style={{ color: "#d1e8e3" }}>Force Mapper</h4>
        </div>

        <NavBar
          onMouseEnter={() => this.props.hover(true)}
          onMouseLeave={() => this.props.hover(false)}
          openNav={this.props.navIsOpen}
          hoverNav={this.props.navIsHovered}
        >
          <Hmm
            openNav={this.props.navIsOpen}
            hoverNav={this.props.navIsHovered}
          >
              <div style={{"width": "180px"}}>{this.selectedMenu()}</div>

          </Hmm>

          {navLinks.map((item, i) => {
            const isSelected = i === this.props.selectedPage;
            const subItems = item.subItems;

            const isNodeItem = item.link === "/node";

            return (
              <div key={item.link}>
                <NavItem
                  onClick={() => {
                    this.handleSelected(i);
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

                {isSelected &&
                  subItems &&
                  subItems.map((item, i) => {
                    const isSelectedSubItem = i === this.state.selectedSubItem;

                    const isNodeItem = item.link === "/node";
                    console.log("refiring?", item.link);
                    return (
                      <NavItem
                        onClick={() => {
                          this.handleSelectedSubItem(i);
                        }}
                        isSelected={isSelectedSubItem}
                        isSubItem={true}
                      >
                        <div className="navIconFrame">
                          <div className="navIcon">
                            <i
                              className={
                                !isNodeItem ? item.className : item.altClassName
                              }
                            />
                          </div>
                        </div>
                        <div className="navItemText">
                          {!isNodeItem ? item.navItemText : item.altNavItemText}
                        </div>
                      </NavItem>
                    );
                  })}
              </div>
            );
          })}
        </NavBar>
      </StyledHeader>
    );
  }
  simpleAction = event => {
    this.props.simpleAction();
  };
  postAction = file => {
    this.props.postAction(file);
  };
  saveNameChangeAction = text => {
    this.props.saveNameChangeAction(text);
  };
  addAction = () => {
    this.props.addAction(this.props.currZoomLevel);
  };
}

const StyledHeader = styled.div`
  height: 60px;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1030;
  background-color: #312a48;
  box-shadow: 0 1px 4px 0px rgba(0, 0, 0, 0.16);
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s ease-in-out;
  ${({ openNav }) =>
    openNav &&
    `
        // left: 170px;
        // background: lightgrey;
      `}
  .projectTitle {
    font-family: "Poppins", "Helvetica Neue", Arial, sans-serif;
    font-size: 2rem;
    margin-right: 20px;
    margin-bottom: 0px;
    letter-spacing: -1px;
  }
  .iconFrame {
    .close {
      position: absolute;
      opacity: 0;
    }
    .hamburger {
      opacity: 1;
    }
    transition: all 0.2s ease-in-out;
    ${({ openNav }) =>
      openNav &&
      `       
              .close {
                  position: relative;
                  opacity: 1;
              }
              .hamburger {
                  opacity: 0;
                  position: absolute;
              }
            -webkit-transform: rotate(90deg);
            -moz-transform: rotate(90deg);
            -ms-transform: rotate(90deg);
            -o-transform: rotate(90deg);
            transform: rotate(90deg);
          `}
  }
  .hamburgerFrame {
    width: 60px;
    height: 60px;
    border-right: 1px solid rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #868e96;
    font-size: 20px;
    transition: all 0.2s ease-in-out;
    ${({ openNav }) =>
      openNav &&
      `
            margin-left: 200px;
            background-color: #584586;

          `}
    &:hover {
      background-color: #e5fdff;
    }
  }
`;

const Hmm = styled.div`
  position: fixed;
  top: 60px;
  left: 60px;
  bottom: 0;
  padding-top: 15px;
  transition: all 0.2s ease-in-out;
  overflow-x: hidden;
  z-index: 50;
  width: 0px;
  background-color: #00F8e3;
  ${({ openNav, hoverNav }) =>
    (openNav || hoverNav) &&
    `
        left: 60px;
        width: 200px;
        background-color: #9bccff;
         box-shadow: inset -4px 0px 2px -2px purple;
      `}
`;

const NavBar = styled.div`
  position: fixed;
  top: 60px;
  left: 0px;
  bottom: 0;
  z-index: 100;
  width: 60px;
  background-color: #d1e8e3;
  transition: all 0.2s ease-in-out;
  padding-top: 15px;
  ${({ openNav, hoverNav }) =>
    (openNav || hoverNav) &&
    `
        left: 0px;
        width: 180px;
        background: #65bbd8;
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
  currSelNode: state.simpleReducer.currentNode,
    currZoomLevel: state.simpleReducer.editedFile ? state.simpleReducer.editedFile.globalSettings.zoom: {x: 0, y: 0},
    selectedPage: state.ui.selectedPage
});
const mapDispatchToProps = dispatch => ({
  simpleAction: () => dispatch(simpleAction()),
  postAction: file => dispatch(postAction(file)),
  addAction: zoomLevel => dispatch(addAction(zoomLevel)),
  deleteAction: () => dispatch(deleteAction()),
  saveNameChangeAction: text => dispatch(saveNameChangeAction(text)),
    selectPage: pageName => dispatch(selectPage(pageName))
});
export default connect(mapStateToProps, mapDispatchToProps)(NavAndHeader);
