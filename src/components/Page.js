import React, { Component } from "react";
import NavAndHeader from "./NavAndHeader";
// import Meta from "../components/Meta";
import styled from "styled-components";

import theme from "./styles/theme";

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
        {/*<Meta />*/}
        <NavAndHeader
          navIsOpen={this.state.navIsOpen}
          navIsHovered={this.state.navIsHovered}
          toggle={this.handleToggleNav}
          hover={this.handleHoverNav}
        />
        <Inner openNav={this.state.navIsOpen || this.state.navIsHovered}>
          {this.props.children}
        </Inner>
      </StyledPage>
    );
  }
}

const StyledPage = styled.div``;
// margin-left: 80px;
// margin-top: 80px;
const Inner = styled.div`
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
//     html {
//       box-sizing: border-box;
//       font-size: 10px;
//     }
//     *, *:before, *:after {
//       box-sizing: inherit;
//     }
//     body {
//       padding: 0;
//       //margin: 0;
//       font-size: 1.5rem;
//       color: #474747;
//     }
//     .node circle {
//       fill: #fff;
//       stroke: steelblue;
//       stroke-width: 3px;
//     }
//
//     .node text { font: 12px sans-serif; }
//
//     .node--internal text {
//       text-shadow: 0 1px 0 #fff, 0 -1px 0 #fff, 1px 0 0 #fff, -1px 0 0 #fff;
//     }
//
//     .link {
//       fill: none;
//       stroke: #ccc;
//       stroke-width: 2px;
//     }
// `;

export default Page;
