import React, { Component } from "react";
import styled from "styled-components";

import { connect } from "react-redux";
import { document } from "../redux/actions/document";

class Header extends Component {
  componentDidMount() {
    this.props.openDocument();
  }
  render() {
    return (
      <StyledHeader openNav={this.props.navIsOpen}>
        <div className="hamburgerFrame" onClick={this.props.toggle}>
          <div className="iconFrame">
            <i className="hamburger icon ion-navicon-round" />
            <i className="close icon ion-close" />
          </div>
        </div>

        <div className="projectTitle">
          <h4 style={{ color: "#d1e8e3" }}>Plan Atlas</h4>
        </div>
      </StyledHeader>
    );
  }
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

const mapStateToProps = state => ({
  ...state
});
const mapDispatchToProps = (dispatch, props) => ({
  openDocument: () => dispatch(document(props.channel))
});
export default connect(mapStateToProps, mapDispatchToProps)(Header);
