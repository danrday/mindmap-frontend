import React from "react";
import { connect } from "react-redux";
import Graph from "./graph";
import { Menu, Item } from "react-contexify";
import "react-contexify/dist/ReactContexify.min.css";
import {
  saveAction,
  linkNode,
  handleZoom,
  dragNode,
  addNodeAtCoords
} from "../../redux/actions/document";
import {
  populateCurrentNodeValues,
  selectNode
} from "../../redux/actions/liveNodeEdit";
import {
  selectPage,
  handleMouseMove,
  showAlertMessage
} from "../../redux/actions/ui";

class App extends React.Component {
  render() {
    /*
   On each render we write all the tempCustomAttrs(selected live node edits)
   and also tempCategoryAttrs(selected category edits temporarily apply to all members of a category)*/

    if (this.props.file && Object.keys(this.props.globalEdit).length > 0) {
      // if file is loaded AND globalEdit populated (populateInitialValues)

      const liveNodeEdit = this.props.liveNodeEdit;
      let modData = this.props.file;
      const categoryEdit = this.props.categoryEdit;
      const lockedNodes = this.props.lockedNodes;

      modData.nodes.forEach(node => {
        //remove temp attrs on each redraw to remove outdated ones.
        delete node.tempCategoryAttrs;
        delete node.tempCustomAttrs;
        delete node.globalSettings;

        // add global settings for default values
        node.globalSettings = this.props.globalEdit.node;

        /*if you are currently editing a categories' properties,
        apply those temp changes onto member node's tempCategoryAttrs*/
        if (node.category === categoryEdit.category) {
          node.tempCategoryAttrs = {};
          categoryEdit.checkedAttrs.forEach(attr => {
            node.tempCategoryAttrs[attr] = categoryEdit[attr];
          });
        }

        if (lockedNodes[node.id]) {
          let modNode = lockedNodes[node.id];
          // node.name = modNode.name;
          if (modNode.checkedAttrs.includes("category")) {
            node.category = modNode.category;
          }
          // populate the temporary custom attributes being edited live
          node.tempCustomAttrs = node.tempCustomAttrs || {};
          modNode.checkedAttrs.forEach(attr => {
            node.tempCustomAttrs[attr] = modNode[attr];
          });
        }
      });

      // overwrite currently selected node with temp editing values to show live update
      if (this.props.currentNode && liveNodeEdit.selNodeId) {
        let node = modData.nodes.findIndex(n => {
          return n.id === liveNodeEdit.selNodeId;
        });

        // if the node hasn't been deleted'
        if (node !== -1) {
          // TODO: Should be reset to previous name, restructure this
          // modData.nodes[node].name = liveNodeEdit.name;
          if (liveNodeEdit.checkedAttrs.includes("category")) {
            modData.nodes[node].category = liveNodeEdit.category;
          }

          // populate the temporary custom attributes being edited live
          modData.nodes[node].tempCustomAttrs =
            modData.nodes[node].tempCustomAttrs || {};
          liveNodeEdit.checkedAttrs.forEach(attr => {
            modData.nodes[node].tempCustomAttrs[attr] = liveNodeEdit[attr];
          });
        }
      }

      return (
        <div>
          <div
            className="graphContainer"
            // TODO: ADD INLINE STYLES TO A CLASS
            style={{
              width: "100%",
              height: "100%",
              position: "fixed",
              zIndex: 3000
            }}
          >
            <Graph
              data={modData}
              globalSettings={this.props.globalEdit}
              lastClickedNode={this.props.currentNode}
              lockedNodes={this.props.lockedNodes}
              handleClick={this.handleClick}
              handleZoom={this.props.handleZoom}
              selectPage={this.props.selectPage}
              initialZoom={this.props.file.globalSettings.zoom || null}
              handleMouseMove={this.props.handleMouseMove}
              dragNode={this.props.dragNode}
              selectNode={this.props.selectNode}
              addNodeAtCoords={this.props.addNodeAtCoords}
              mouse={this.props.mouse || { coords: { x: 0, y: 0 } }}
              mouseCoords={this.props.mouseCoords}
              user={this.props.user}
              showAlertMessage={this.props.showAlertMessage}
            />
          </div>
          <ContextMenu />
        </div>
      );
    } else {
      return <div></div>;
    }
  }

  handleClick = currentClickedNodeId => {
    const lastClickedNode = this.props.currentNode;
    const currentNode = this.props.file.nodes.find(e => {
      return e.id === currentClickedNodeId;
    });

    if (lastClickedNode) {
      if (lastClickedNode === currentClickedNodeId) {
        //compare node ids
        this.props.selectNode(currentClickedNodeId);
      } else {
        this.props.linkNode({ currentClickedNodeId, lastClickedNode });
        this.props.selectNode(lastClickedNode);
      }
    } else {
      this.props.selectNode(currentClickedNodeId);
      this.props.populateCurrentNodeValues(currentNode);
    }
  };
}

const ContextMenu = props => {
  return (
    <Menu id="contextMenu" style={{ zIndex: "99999" }}>
      <Item
        onClick={e => {
          if (e.props.currSelNode) {
            e.props.selectNode(e.props.currSelNode);
          }
          e.props.addNodeAtCoords(e.props.coords);
          e.props.selectPage(1);
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

const mapStateToProps = (state, props) => ({
  file: state.document.present.editedFile,
  currentNode: state.liveNodeEdit.selNodeId,
  lockedNodes: state.liveNodeEdit.lockedNodes,
  liveNodeEdit: state.liveNodeEdit,
  categoryEdit: state.categoryEdit,
  globalEdit: state.globalEdit,
  mouse: state.ui.mouse,
  mouseCoords: state.ui.mouseCoords,
  user: state.user.user
});

const mapDispatchToProps = dispatch => ({
  addNodeAtCoords: coords => dispatch(addNodeAtCoords(coords)),
  saveAction: file => dispatch(saveAction(file)),
  selectNode: node => dispatch(selectNode(node)),
  linkNode: node => dispatch(linkNode(node)),
  populateCurrentNodeValues: node => dispatch(populateCurrentNodeValues(node)),
  handleZoom: zoomAttrs => dispatch(handleZoom(zoomAttrs)),
  handleMouseMove: (coords, username) =>
    dispatch(handleMouseMove(coords, username)),
  selectPage: i => dispatch(selectPage(i)),
  dragNode: (id, fx, fy, sticky) => dispatch(dragNode({ id, fx, fy, sticky })),
  showAlertMessage: (msg, type) => dispatch(showAlertMessage(msg, type))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
