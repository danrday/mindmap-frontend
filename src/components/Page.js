import React, { Component } from "react";
import NavAndHeader from "./NavAndHeader";

import Header from "./Header";
import Nav from "./Nav";
import NavItems from "./NavItems";
import styled from "styled-components";
import theme from "./styles/theme";

import navLinks from "./NavLinks";

class Page extends Component {
  state = {
    navIsOpen: true,
    navIsHovered: false
  };

  handleToggleNav = () => {
    this.setState({ navIsOpen: !this.state.navIsOpen });
  };

  handleHoverNav = bool => {
    this.setState({ navIsHovered: bool });
  };

  render() {
    return (
      <StyledPage>
        <Header
          navIsOpen={this.state.navIsOpen}
          navIsHovered={this.state.navIsHovered}
          toggle={this.handleToggleNav}
          hover={this.handleHoverNav}
          channel={this.props.channel}
        ></Header>

        <NavBar
          onMouseEnter={() => this.handleHoverNav(true)}
          onMouseLeave={() => this.handleHoverNav(false)}
          openNav={this.state.navIsOpen}
          hoverNav={this.state.navIsHovered}
        >
          <NavItems
            navIsOpen={this.state.navIsOpen}
            navIsHovered={this.state.navIsHovered}
            toggle={this.handleToggleNav}
            hover={this.handleHoverNav}
            channel={this.props.channel}
          ></NavItems>
        </NavBar>

        <PageView openNav={this.state.navIsOpen || this.state.navIsHovered}>
          {this.props.children}
        </PageView>
      </StyledPage>
    );
  }
}

const NavBar = styled.div`
  @media (max-width: 768px) {
    width: 100%;
  }
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

// <NavAndHeader
//     navIsOpen={this.state.navIsOpen}
//     navIsHovered={this.state.navIsHovered}
//     toggle={this.handleToggleNav}
//     hover={this.handleHoverNav}
//     channel={this.props.channel}
// />

const StyledPage = styled.div``;

const PageView = styled.div`
  @media (max-width: 768px) {
    margin-top: 240px;
    margin-left: 0px;
  }
  margin-top: 60px;
  margin-left: 60px;

  transition: all 0.2s ease-in-out;
  letter-spacing: 0.2px;
  font-family: "Roboto", "Helvetica Neue", Arial, sans-serif;
  font-size: 14px;
  ${({ openNav }) =>
    openNav &&
    `
        margin-left: 260px;
    `}
`;

// injectGlobal`
//
// `;

// html {
//     box-sizing: border-box;
//     font-size: 10px;
// }
// *, *:before, *:after {
//     box-sizing: inherit;
// }
// body {
//     padding: 0;
//     //margin: 0;
//     font-size: 1.5rem;
//     color: #474747;
// }
// .node circle {
//     fill: #fff;
//     stroke: steelblue;
//     stroke-width: 3px;
// }
//
// .node text { font: 12px sans-serif; }
//
// .node--internal text {
//     text-shadow: 0 1px 0 #fff, 0 -1px 0 #fff, 1px 0 0 #fff, -1px 0 0 #fff;
// }
//
// .link {
//     fill: none;
//     stroke: #ccc;
//     stroke-width: 2px;
// }

export default Page;
