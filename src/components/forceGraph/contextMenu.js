import { Item, Menu } from "react-contexify";
import React from "react";
import "react-contexify/dist/ReactContexify.min.css";

const ContextMenu = props => {
  return (
    <Menu id="contextMenu" style={{ zIndex: "99999" }}>
      <Item
        onClick={e => {
          if (e.props.currSelNode) {
            e.props.selectNode(e.props.currSelNode);
          }
          e.props.addNodeAtCoords(e.props.coords);
          e.props.selectPage("/node");
        }}
      >
        <span>🔵</span>
        Add new node
      </Item>
      <Item onClick={() => {}}>
        <span>🚫</span>
        Cancel/Close
      </Item>
    </Menu>
  );
};
export default ContextMenu;
