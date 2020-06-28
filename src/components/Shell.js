import React, { Component } from "react";

import Header from "./Header";
import NavMenu from "./NavMenu";
import PageOptions from "./PageOptions";
import styled from "styled-components";
// import SplitPane from "react-split-pane";
import SplitterLayout from "react-splitter-layout";
import "react-splitter-layout/lib/index.css";

import F4 from "./forceGraph/f4";

import SplitWrapper from "./splitPane";

class Shell extends Component {
  state = {
    navIsOpen: true,
    navIsHovered: false,
    mobileView: false
  };

  handleToggleNav = () => {
    this.setState({ navIsOpen: !this.state.navIsOpen });
  };

  handleHoverNav = bool => {
    this.setState({ navIsHovered: bool });
  };

  componentDidMount() {
    this.updateView();
    window.addEventListener("resize", this.updateView.bind(this));
  }

  updateView() {
    console.log("UPDTE VIEW", window.innerWidth);
    this.setState({ mobileView: window.innerWidth < 768 });
  }

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
          <SplitterLayout primaryMinSize={60} vertical={this.state.mobileView}>
            <PageOptions
              navIsOpen={this.state.navIsOpen}
              navIsHovered={this.state.navIsHovered}
              toggle={this.handleToggleNav}
              hover={this.handleHoverNav}
              channel={this.props.channel}
            />

            <F4 />
          </SplitterLayout>
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
