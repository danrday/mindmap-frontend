import React from "react";
import { connect } from "react-redux";
import Graph from "./graph";
import ContextMenu from "./contextMenu";
import {
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
  populateCurrentLinkValues,
  selectLink
} from "../../redux/actions/liveLinkEdit";
import {
  selectPage,
  handleMouseMove,
  showAlertMessage
} from "../../redux/actions/ui";

class App extends React.Component {
  render() {
    /*On each render we write all the tempCustomAttrs(selected live node edits)
    and also tempCategoryAttrs(selected category edits temporarily apply to all members of a category)*/

    // (if file is loaded AND globalEdit populated (populateInitialValues))
    if (this.props.loaded && this.props.globalEdit.loaded) {
      const liveLinkEdit = this.props.liveLinkEdit;
      const lockedLinks = this.props.lockedLinks;

      let modData = this.props.file;
      const categoryEdit = this.props.categoryEdit;

      // begin link stuff
      modData.links.forEach(link => {
        //remove temp attrs on each redraw to remove outdated ones.
        delete link.tempCategoryAttrs;
        delete link.tempCustomAttrs;
        delete link.globalSettings;

        // add global settings for default values
        link.globalSettings = this.props.globalEdit.link;

        let lockedLink = lockedLinks[link.id];
        if (lockedLink) {
          if (lockedLink.checkedAttrs.includes("category")) {
            link.category = lockedLink.category;
          }
          // populate the temporary custom attributes being edited live
          link.tempCustomAttrs = {};
          lockedLink.checkedAttrs.forEach(attr => {
            link.tempCustomAttrs[attr] = lockedLink[attr];
          });
        }
      });

      // overwrite currently selected node with temp editing values to show live update
      if (this.props.currentLink) {
        let link = modData.links.findIndex(l => {
          return l.id === this.props.currentLink;
        });

        // if the node hasn't been deleted
        if (link !== -1) {
          if (liveLinkEdit.checkedAttrs.includes("category")) {
            modData.links[link].category = liveLinkEdit.category;
          }
          // populate the temporary custom attributes being edited live
          modData.links[link].tempCustomAttrs =
            modData.links[link].tempCustomAttrs || {};
          liveLinkEdit.checkedAttrs.forEach(attr => {
            modData.links[link].tempCustomAttrs[attr] = liveLinkEdit[attr];
          });
        }
      }

      // end link stuff, begin node stuff//////
      const liveNodeEdit = this.props.liveNodeEdit;
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

        let lockedNode = lockedNodes[node.id];
        if (lockedNode) {
          if (lockedNode.checkedAttrs.includes("category")) {
            node.category = lockedNode.category;
          }
          // populate the temporary custom attributes being edited live
          node.tempCustomAttrs = node.tempCustomAttrs || {};
          lockedNode.checkedAttrs.forEach(attr => {
            node.tempCustomAttrs[attr] = lockedNode[attr];
          });
        }
      });

      // overwrite currently selected node with temp editing values to show live update
      if (this.props.currentNode) {
        let node = modData.nodes.findIndex(n => {
          return n.id === this.props.currentNode;
        });

        // if the node hasn't been deleted
        if (node !== -1) {
          if (liveNodeEdit.checkedAttrs.includes("category")) {
            modData.nodes[node].category = liveNodeEdit.category;
          }
          // populate the temporary custom attributes being edited live
          modData.nodes[node].tempCustomAttrs = {};
          liveNodeEdit.checkedAttrs.forEach(attr => {
            modData.nodes[node].tempCustomAttrs[attr] = liveNodeEdit[attr];
          });
        }
      }

      return (
        <div>
          <div
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
              lastClickedLink={this.props.currentLink}
              lockedNodes={this.props.lockedNodes}
              lockedLinks={this.props.lockedLinks}
              selectLink={this.props.selectLink}
              handleClick={this.handleNodeClick}
              handleLinkClick={this.handleLinkClick}
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

  handleLinkClick = currentClickedLinkId => {
    const lastClickedLink = this.props.currentLink;
    const currentLink = this.props.file.links.find(e => {
      return e.id === currentClickedLinkId;
    });

    if (lastClickedLink) {
      if (lastClickedLink === currentClickedLinkId) {
        //compare link ids
        this.props.selectLink(currentClickedLinkId);
      } else {
        this.props.selectLink({ currentClickedLinkId, lastClickedLink });
        this.props.selectLink(lastClickedLink);
      }
    } else {
      this.props.selectLink(currentClickedLinkId);
      this.props.populateCurrentLinkValues(currentLink);
    }
  };

  handleNodeClick = currentClickedNodeId => {
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

const mapStateToProps = state => ({
  loaded: state.document.present.loaded,
  file: state.document.present.editedFile,
  currentNode: state.liveNodeEdit.selNodeId,
  lockedNodes: state.liveNodeEdit.lockedNodes,
  liveNodeEdit: state.liveNodeEdit,
  categoryEdit: state.categoryEdit,
  globalEdit: state.globalEdit,
  mouse: state.ui.mouse,
  mouseCoords: state.ui.mouseCoords,
  user: state.user.user,
  lockedLinks: state.liveLinkEdit.lockedLinks,
  liveLinkEdit: state.liveLinkEdit,
  currentLink: state.liveLinkEdit.selLinkId
});

const mapDispatchToProps = dispatch => ({
  addNodeAtCoords: coords => dispatch(addNodeAtCoords(coords)),
  selectNode: node => dispatch(selectNode(node)),
  linkNode: node => dispatch(linkNode(node)),
  populateCurrentNodeValues: node => dispatch(populateCurrentNodeValues(node)),
  handleZoom: zoomAttrs => dispatch(handleZoom(zoomAttrs)),
  handleMouseMove: (coords, username) =>
    dispatch(handleMouseMove(coords, username)),
  selectPage: i => dispatch(selectPage(i)),
  dragNode: (id, fx, fy, sticky) => dispatch(dragNode({ id, fx, fy, sticky })),
  showAlertMessage: (msg, type) => dispatch(showAlertMessage(msg, type)),
  selectLink: link => dispatch(selectLink(link)),
  populateCurrentLinkValues: link => dispatch(populateCurrentLinkValues(link))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
