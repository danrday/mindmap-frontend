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

export default Page;
