import React, { Component } from "react";

import Header from "./Header";
import NavMenu from "./NavMenu";
import PageOptions from "./PageOptions";
import styled from "styled-components";
import SplitterLayout from "./react-splitter-layout/SplitterLayout";
import "react-splitter-layout/lib/index.css";
import "./styles/splitPaneOverride.css";

import F4 from "./forceGraph/f4";

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
          <RelativeFrame>
            <SplitterLayout
              navIsOpen={this.state.navIsOpen}
              navIsHovered={this.state.navIsHovered}
              percentage={false}
              primaryIndex={1}
              secondaryMinSize={200}
              secondaryInitialSize={this.state.navIsOpen ? 200 : 0}
              vertical={this.state.mobileView}
            >
              <PageOptions
                navIsOpen={this.state.navIsOpen}
                navIsHovered={this.state.navIsHovered}
                toggle={this.handleToggleNav}
                hover={this.handleHoverNav}
                channel={this.props.channel}
              />

              <F4 />
            </SplitterLayout>
          </RelativeFrame>
        </MainFrame>
      </StyledPage>
    );
  }
}

// needed for resize panel positioning
const RelativeFrame = styled.div`
  display: relative;
`;

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
