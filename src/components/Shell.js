import React, { Component } from "react";

import Header from "./Header";
import NavMenu from "./NavMenu";
import PageOptions from "./PageOptions";
import styled from "styled-components";
import SplitPane from "react-split-pane";

class Shell extends Component {
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
          <NavMenu
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

const Test = styled.div``;

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

export default Shell;
