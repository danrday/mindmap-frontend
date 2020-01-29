import React, { Component } from "react";
// import Link from "next/link";
import styled from "styled-components";
import navLinks from "./NavLinks";

import { connect } from "react-redux";
import {
  simpleAction,
  postAction,
  addAction,
  deleteAction,
  saveNameChangeAction
} from "../redux/actions/simpleAction";

class NavAndHeader extends Component {
  state = {
    selected: null,
    selectedSubItem: null,
    nameValue: "null"
  };
  handleSelected(i) {
    this.setState({ selected: i });
  }
  handleSelectedSubItem(i) {
    console.log("firing?", this);
    this.setState({ selectedSubItem: i });
  }

  handleNameChange(event) {
        console.log("H>", this);
        this.setState({ nameValue: event.target.value });
    }

  handleSaveNameChange() {
    this.saveNameChangeAction(this.state.nameValue);
  }





  render() {
      console.log('RENDER', )

      const SelectedMenu = this.state.selected ? navLinks[this.state.selected].component() : () => <div><button onClick={this.simpleAction}>open</button>
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
          <button onClick={this.deleteAction}>delete</button></div>

    return (
      <StyledHeader openNav={this.props.navIsOpen}>
        <div className="hamburgerFrame" onClick={this.props.toggle}>
          <div className="iconFrame">
            <i className="hamburger icon ion-navicon-round" />
            <i className="close icon ion-close" />
          </div>
        </div>

        <input
          type="text"
          value={this.state.nameValue}
          onChange={this.handleNameChange.bind(this)}
        />

        <button onClick={this.handleSaveNameChange.bind(this)}>
          save to {this.props.currSelNode}
        </button>

        <div className="projectTitle">
          <h4 style={{ color: "#d1e8e3" }}>Force Mapper</h4>
        </div>

        <NavBar
          onMouseEnter={() => this.props.hover(true)}
          onMouseLeave={() => this.props.hover(false)}
          openNav={this.props.navIsOpen}
          hoverNav={this.props.navIsHovered}
        >

            <Hmm openNav={this.props.navIsOpen}
                 hoverNav={this.props.navIsHovered}><SelectedMenu/></Hmm>


            {/*<Hmm openNav={this.props.navIsOpen}*/}
            {/*     hoverNav={this.props.navIsHovered}><button onClick={this.simpleAction}>open</button>*/}
            {/*    <br />*/}
            {/*    <button*/}
            {/*        onClick={() => {*/}
            {/*            console.log("simpleReducer.file", this.props.simpleReducer.file);*/}
            {/*            this.postAction(this.props.simpleReducer.editedFile);*/}
            {/*        }}*/}
            {/*    >*/}
            {/*        save*/}
            {/*    </button>*/}
            {/*    <br />*/}
            {/*    <button onClick={this.addAction}>add</button>*/}
            {/*    <br />*/}
            {/*    <button onClick={this.deleteAction}>delete</button></Hmm>*/}

          {navLinks.map((item, i) => {
            const isSelected = i === this.state.selected;
            const subItems = item.subItems;

              const isNodeItem = item.link === "/node"

              // if (isNodeItem && this.props.currSelNode && this.state.selected !== i) {
              //     this.setState({selected: i})
              // }

            return (
              <div key={item.link}>
                {/*<Link href={item.link}>*/}
                <NavItem
                  onClick={() => {
                    this.handleSelected(i);
                  }}
                  isSelected={isSelected}
                >
                  <div className="navIconFrame">
                    <div className="navIcon">
                      <i className={isNodeItem && this.props.currSelNode ?  item.altClassName : item.className } />
                    </div>
                  </div>
                    <div className="navItemText">{isNodeItem && this.props.currSelNode ?  item.altNavItemText: item.navItemText}</div>
                </NavItem>
                {/*</Link>*/}

                {isSelected &&
                  subItems &&
                  subItems.map((item, i) => {
                    const isSelectedSubItem = i === this.state.selectedSubItem;

                    const isNodeItem = item.link === "/node"
                      console.log('refiring?', item.link)
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
                            <i className={!isNodeItem ? item.className : item.altClassName} />
                          </div>
                        </div>
                        <div className="navItemText">{!isNodeItem ? item.navItemText : item.altNavItemText}</div>
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
    this.props.addAction();
  };
}

const StyledHeader = styled.div`
  height: 60px;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1030;
  background-color: #fff;
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
            margin-left: 120px;
            background-color: #fff6f5;

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
  background-color: #00e8e3;
   ${({ openNav, hoverNav }) =>
    (openNav || hoverNav) &&
    `
        left: 60px;
        width: 180px;
        background: #00ebf2;
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
        background: #d6ebf2;
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
  currSelNode: state.simpleReducer.currentNode
});
const mapDispatchToProps = dispatch => ({
  simpleAction: () => dispatch(simpleAction()),
  postAction: file => dispatch(postAction(file)),
  addAction: file => dispatch(addAction(file)),
  deleteAction: file => dispatch(deleteAction(file)),
  saveNameChangeAction: text => dispatch(saveNameChangeAction(text))
});
export default connect(mapStateToProps, mapDispatchToProps)(NavAndHeader);
