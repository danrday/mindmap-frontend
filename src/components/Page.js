import React, { Component } from "react";
import NavAndHeader from "./NavAndHeader";

import Header from "./Header";
import Nav from "./Nav";
import NavItems from "./NavItems";
import PageOptions from "./PageOptions";
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
          toggle={this.handleToggleNav}
          channel={this.props.channel}
        />

        <MainFrame>
          <NavItems
            navIsOpen={this.state.navIsOpen}
            navIsHovered={this.state.navIsHovered}
            toggle={this.handleToggleNav}
            hover={this.handleHoverNav}
            channel={this.props.channel}
          />

          <PageOptions
            navIsOpen={this.state.navIsOpen}
            navIsHovered={this.state.navIsHovered}
            toggle={this.handleToggleNav}
            hover={this.handleHoverNav}
            channel={this.props.channel}
          />

          {this.props.children}
        </MainFrame>
      </StyledPage>
    );
  }
}

const StyledPage = styled.div`
  display: flex;
  flex-direction: column;
`;

const MainFrame = styled.div`
  display: flex;
  flex-direction: row;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SelectedMenuFrame = styled.div`
  @media (max-width: 768px) {
    top: 120px;
    left: 0px;
    height: 120px;
    width: 100%;
  }
  position: fixed;
  top: 60px;
  left: 60px;
  bottom: 0;
  padding-top: 15px;
  transition: all 0.2s ease-in-out;
  overflow-x: hidden;
  z-index: 50;
  width: 0px;
  background-color: purple;
  ${({ openNav, hoverNav }) =>
    (openNav || hoverNav) &&
    `
        left: 60px;
        width: 200px;
        background-color: #9bccff;
         box-shadow: inset -4px 0px 2px -2px purple;
      `}
`;

export default Page;
