import React, { Component } from "react";
import { connect } from "react-redux";
import "./App.css";
import { hideAlertMessage } from "./redux/actions/ui";
import { dispatchMsg } from "./redux/actions/channel";
import { getUser } from "./redux/actions/user";
import Page from "./components/Page";
import F4 from "./components/pages/f4";
import { withAlert } from "react-alert";

// import { Menu, Item, Separator, Submenu, MenuProvider } from "react-contexify";
// import "react-contexify/dist/ReactContexify.min.css";

// const onClick = ({ event, props }) => console.log(event, props);

// create your menu first
// const MyAwesomeMenu = () => (
//   <Menu id="menu_id">
//     <Item onClick={onClick}>Lorem</Item>
//     <Item onClick={onClick}>Ipsum</Item>
//     <Separator />
//     <Item disabled>Dolor</Item>
//     <Separator />
//     <Submenu label="Foobar">
//       <Item onClick={onClick}>Foo</Item>
//       <Item onClick={onClick}>Bar</Item>
//     </Submenu>
//   </Menu>
// );

class App extends Component {
  componentDidMount() {
    // TO DO
    // *****get user_info from channel on mount, set it in the store
    this.props.getUser(this.props.channel);

    // LISTEN FOR ACTIONS FROM THE PHOENIX SERVER
    this.props.channel.on("server_msg", msg => {
      // console.log("server msg", msg);
      this.props.dispatchMsg(msg);
    });
  }
  componentDidUpdate() {
    if (this.props.ui.alert.show && this.props.ui.alert.msg) {
      this.props.alert.show(this.props.ui.alert.msg, {
        type: this.props.ui.alert.type,
        timeout: 1750
      });
      this.props.hideAlertMessage();
    }
  }
  render() {
    return (
      <div className="App">
        <Page channel={this.props.channel}>
          <F4 />

          {/*<Menu id="menu_id" style={{ "z-index": "99999" }}>*/}
          {/*  <Item onClick={() => console.log("HI")}>Lorem</Item>*/}
          {/*  <Item onClick={() => console.log("HI")}>Ipsum</Item>*/}
          {/*  <Separator />*/}
          {/*  <Item disabled>Dolor</Item>*/}
          {/*  <Separator />*/}
          {/*  <Submenu label="Foobar">*/}
          {/*    <Item onClick={() => console.log("HI")}>Foo</Item>*/}
          {/*    <Item onClick={() => console.log("HI")}>Bar</Item>*/}
          {/*  </Submenu>*/}
          {/*</Menu>*/}
        </Page>
      </div>
    );
  }
}

const mapStateToProps = state => ({ ...state });
const mapDispatchToProps = dispatch => ({
  hideAlertMessage: () => dispatch(hideAlertMessage()),
  dispatchMsg: msg => dispatch(dispatchMsg(msg)),
  getUser: channel => dispatch(getUser(channel))
});

export default connect(mapStateToProps, mapDispatchToProps)(withAlert()(App));
