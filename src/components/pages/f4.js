import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import savePdf from "d3-save-pdf";
import * as d3 from "d3";
import {
  Menu,
  Item,
  Separator,
  Submenu,
  MenuProvider,
  contextMenu
} from "react-contexify";
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

const color = d3.scaleOrdinal(d3.schemeCategory10);

/*
App component holds graph data in state and renders Graph component.
Graph component in turn renders Link and Node components.
*/

class App extends React.Component {
  render() {
    /*        Important: zooming does not cause a re-render at this level,
   only clicking nodes, saving, deleting, and editing any temporary attributes that will reflect in the display.
   On each render we write all the tempCustomAttrs(selected node edits)
   and also tempCategoryAttrs(selected category edits temporarily apply to all members of a category)*/
    // console.log("RENDER UPDATE: this.props:", this.props);

    if (this.props.file && Object.keys(this.props.globalEdit).length > 0) {
      // if file is loaded AND globalEdit populated (populateInitialValues)

      // console.log("this.props.globalEdit", this.props.globalEdit);
      // console.log(
      //   "Object.keys(this.props.globalEdit).length",
      //   Object.keys(this.props.globalEdit).length
      // );

      const liveNodeEdit = this.props.liveNodeEdit;
      let modData = this.props.file;
      const categoryEdit = this.props.categoryEdit;

      const lockedNodes = this.props.lockedNodes;

      modData.nodes.forEach(node => {
        // first erase any 'temporary category attributes' --
        // (in process edits to a category's properties) applied earlier but not saved
        // also delete 'temporary custom attributes'
        // this way we ensure a fresh update on all nodes

        if (node.tempCategoryAttrs) {
          delete node.tempCategoryAttrs;
        }
        if (node.tempCustomAttrs) {
          delete node.tempCustomAttrs;
        }
        if (node.globalSettings) {
          delete node.globalSettings;
        }

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

function returnGlobalSetting(setting, section, globalSettings) {
  return globalSettings.checkedAttrs.includes(setting)
    ? globalSettings[section].chargeStrength.customValue
    : globalSettings[section].chargeStrength.defaultValue;
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
          e.props.selectPage(2);
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

/////// Graph component. Holds Link and Node components

class Graph extends React.Component {
  handleContextMenu(e) {
    // always prevent default behavior
    e.preventDefault();

    // Don't forget to pass the id and the event and voila!
    contextMenu.show({
      id: "contextMenu",
      event: e,
      props: {
        coords: this.props.mouse.coords,
        currSelNode: this.props.lastClickedNode,
        selectNode: this.props.selectNode,
        selectPage: this.props.selectPage,
        addNodeAtCoords: this.props.addNodeAtCoords
      }
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log("LNK", this.props.data.links[0]);
    const charge = returnGlobalSetting(
      "chargeStrength",
      "general",
      this.props.globalSettings
    );
    const dist = this.props.globalSettings.linkDistance;
    window.force
      .nodes(this.props.data.nodes) //if a node is updated, we need it to point to the new object
      .force("charge", d3.forceManyBody().strength(charge || -60))
      .force("link", d3.forceLink(this.props.data.links))
      .alphaTarget(0.5)
      .velocityDecay(0.7)
      .restart();

    // setTimeout(function() {
    //   window.force.alphaTarget(0);
    // }, 3000);

    /*put this first since it will repaint prev selected node
    if you click 'new node' more than once*/
    d3.selectAll("circle")
      .style("fill", function(d) {
        console.log("d", d);
        return color(d.id);
      })
      .style("stroke-width", function(d) {
        return "1";
      })
      .style("stroke-dasharray", function(d) {
        return "0,0";
      });

    const lastClicked = this.props.lastClickedNode;
    if (lastClicked) {
      let self = this;
      d3.selectAll("circle")
        .filter(function(d, i) {
          return d.id === self.props.lastClickedNode;
        })
        .style("stroke-width", function(d) {
          // return getAttributeValue(d, attr)
          return "30";
        })
        .style("stroke", function(d) {
          return "red";
        });
    }

    // d3 force related

    let force = window.force;

    let dragStarted = (d, self) => {
      console.log("self", self);
      // (fires on any mousedown)
      if (!d3.event.active) force.alphaTarget(0.3).restart();
      if (d.fx) {
        d.sticky = true;
      }
    };

    let dragging = (d, self) => {
      console.log("self", self);
      d3.select(self)
        .attr("cx", (d.x = d3.event.x))
        .attr("cy", (d.y = d3.event.y));

      d.fx = d.x;
      d.fy = d.y;

      if (d.sticky && this.props.lastClickedNode === d.id) {
        // console.log('select Sticky node, then start to drag it: Unstick and Unselect node.', )
        this.props.handleClick(d.id);
        d.sticky = false;
      }
      this.props.dragNode(d.id, d3.event.x, d3.event.y, d.sticky); //EMIT TO OTHER USERS
    };

    let dragEnded = (d, self) => {
      console.log("dragging", d);

      d.color = color(d);
      d.name = "blah";
      // this.props.showAlertMessage("dragging...", "info");

      // (fires on any mouseup)
      if (!d3.event.active) force.alphaTarget(0);
      if (this.props.lastClickedNode && this.props.lastClickedNode === d.id) {
        // console.log('select an unsticky node and drag it, make it stick there', )
      } else {
        if (!d.sticky) {
          // console.log(' finish drag a selected sticky node, Unstick', )
          this.props.dragNode(d.id, null, null, false); //EMIT TO OTHER USERS
        } else {
          // console.log('finish drag an unselected node', )
        }
      }
    };

    d3.selectAll("g.node").each(function(d) {
      d3.select(this).call(
        d3
          .drag()
          .on("start", function(d) {
            dragStarted(d, this);
          })
          .on("drag", function(d) {
            dragging(d, this);
          })
          .on("end", function(d) {
            dragEnded(d, this);
          })
      );
    });

    let canvas = d3.select("svg").node();
    let config = { filename: "testing" };
    // savePdf.save(canvas, config)
  }

  componentDidMount() {
    const updateGraph = selection => {
      selection.selectAll(".node").call(updateNode);
      selection.selectAll(".link").call(updateLink);
    };

    const updateLink = selection => {
      selection
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
    };

    const updateNode = selection => {
      selection.attr("transform", d => {
        return "translate(" + d.x + "," + d.y + ")";
      });
    };

    // set initial zoom frame from saved value
    d3.select(".frameForZoom").attr(
      "transform",
      `translate(${this.props.initialZoom.x}, ${this.props.initialZoom.y})scale(${this.props.initialZoom.k})`
    );

    // React doesn't know much about d3's event system firing off. We can add custom dispatch methods onto d3 events.
    // otherwise, we aren't aware of updates being performed by d3.

    const domNode = ReactDOM.findDOMNode(this);
    this.d3Graph = d3.select(domNode).on("mousemove", e => {
      const transform = d3.zoomTransform(d3.select(".frameForZoom").node());
      const xy = d3.mouse(domNode);
      const xyTransform = transform.invert(xy); // relative to zoom

      console.log("username", this.props.user);

      this.props.handleMouseMove({
        coords: {
          x: xyTransform[0],
          y: xyTransform[1],
          k: transform.k
        },
        username: this.props.user.username
      });
    });

    // view / zoom related:

    this.d3Graph.call(
      d3.zoom().transform,
      d3.zoomIdentity
        // set 'zoom identity' so d3 knows what zoom level you are at from the initialized value
        .translate(this.props.initialZoom.x, this.props.initialZoom.y)
        .scale(this.props.initialZoom.k)
    );

    this.d3Graph
      .call(d3.zoom().on("zoom", () => handleZoom(this)))
      .on("dblclick.zoom", () => {
        return null; /*disable zoom on double click by default*/
      });

    function handleZoom(self) {
      // console.log('Zoom:', {x, y, k})
      let { x, y, k } = d3.event.transform;
      d3.select(".frameForZoom").attr("transform", d3.event.transform);
      self.props.handleZoom(d3.event.transform);
    }

    // force directed graph:
    let force = d3
      .forceSimulation(this.props.data.nodes)
      .force(
        "charge",
        d3
          .forceManyBody()
          .strength(
            returnGlobalSetting(
              "chargeStrength",
              "general",
              this.props.globalSettings
            )
          )
      )
      .force(
        "link",
        d3
          .forceLink(this.props.data.links)
          .id(function(d) {
            /*reference by id, not index */ return d.id;
          })
          .distance(this.props.globalSettings.linkDistance || 900)
      )
      .force("collide", d3.forceCollide([65]).iterations([60]))
      .on("tick", () => {
        this.d3Graph.call(updateGraph);
      });

    // set force function on window object to easily access it from React's update lifecyle method
    window.force = force;
  }

  getCategory(cat) {
    return this.props.data.categories[cat];
  }

  displayAttr(d, value) {
    console.log("DISPLAY ATTR", d);
    const {
      tempCustomAttrs,
      customAttrs,
      tempCategoryAttrs,
      categoryAttrs,
      globalSettings
    } = d;
    // display in the following priority order
    // 1. temp custom
    if (tempCustomAttrs && tempCustomAttrs[value]) {
      return tempCustomAttrs[value];
    } // 2. custom
    else if (customAttrs && customAttrs[value]) {
      return customAttrs[value];
    } // 3. temp category
    else if (tempCategoryAttrs && tempCategoryAttrs[value]) {
      return d.tempCategoryAttrs[value];
    } // 4. category
    else if (categoryAttrs && categoryAttrs[value]) {
      return categoryAttrs[value];
    } // 5. custom set global settings
    else if (globalSettings.checkedAttrs[value]) {
      return globalSettings[value].customValue;
    } // 6. default global settings
    else {
      return globalSettings[value].defaultValue;
    }
  }

  render() {
    const nodes = this.props.data.nodes.map(node => {
      if (node.category) {
        let cat = this.getCategory(node.category);
        if (cat) {
          /*check if it exists*/
          node.categoryAttrs = cat;
        }
      }
      return (
        <Node
          data={node}
          name={node.name}
          displayAttr={this.displayAttr}
          lockedNodes={this.props.lockedNodes}
          key={node.id}
          handleClick={this.props.handleClick}
          selectPage={
            this.props.selectPage
          } /*when node is clicked, auto select edit nodes page*/
        />
      );
    });
    const links = this.props.data.links.map((link, i) => (
      <Link key={i} data={link} />
    ));
    const mice = (
      <text
        x={this.props.mouse.coords.x}
        y={this.props.mouse.coords.y}
        fontSize={
          this.props.mouse.coords.k ? 16 / this.props.mouse.coords.k : 16
        }
      >
        🖌 {this.props.mouse.username}
      </text>
    );

    return (
      <svg
        onClick={e => this.handleContextMenu(e)}
        className="graph"
        width="100%"
        height="100%"
        style={{ border: "1px solid black" }}
      >
        <defs>
          <filter id="dropshadow" width="150%" height="180%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
            <feOffset in="blur" dx="6" dy="6" result="offsetBlur" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="dropshadowtext" width="150%" height="180%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
            <feOffset in="blur" dx="3" dy="3" result="offsetBlur" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="dropshadowunanchored" width="150%" height="180%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
            <feOffset in="blur" dx="20" dy="20" result="offsetBlur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope=".2" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect width="100%" height="100%" fill="powderblue" />
        <g className="frameForZoom">
          <g>{mice}</g>
          <g>{nodes}</g>
          <g>{links}</g>
        </g>
      </svg>
    );
  }
}

///////

class Link extends React.Component {
  componentDidMount() {
    d3.select(ReactDOM.findDOMNode(this))
      .datum(this.props.data)
      .call(enterLink);
  }
  componentDidUpdate() {
    d3.select(ReactDOM.findDOMNode(this))
      // won't update bg if uncommented
      // .selectAll(".node")
      .datum(this.props.data)
      .call(enterLink);
  }
  render() {
    return <line className="link" />;
  }
}
const enterLink = selection => {
  selection
    .attr("stroke-width", 2)
    .style("stroke", "brown")
    .style("opacity", ".2");
};

///////

class Node extends React.Component {
  componentDidMount() {
    d3.select(ReactDOM.findDOMNode(this))
      .datum(this.props.data)
      .call(enterNode(this.props.displayAttr));
  }
  componentDidUpdate() {
    d3.select(ReactDOM.findDOMNode(this))
      // won't update bg if uncommented
      // .selectAll(".node")
      .datum(this.props.data)
      .call(enterNode(this.props.displayAttr));
  }
  render() {
    let lockedNode = this.props.lockedNodes[this.props.data.id];
    return (
      <g className="node" onClick={e => e.stopPropagation()}>
        <circle
          name={this.props.data.id}
          ref="dragMe"
          opacity={lockedNode ? ".2" : "1"}
          cursor={lockedNode ? "not-allowed" : "pointer"}
          onClick={e => {
            if (lockedNode) {
              alert("This node is being edited by another user...");
              d3.event.preventDefault();
            } else {
              this.props.handleClick(this.props.data.id);
              this.props.selectPage(2);
            }
          }}
        />
        <g>
          <rect />
          <text />
        </g>
      </g>
    );
  }
}

const enterNode = displayAttr => {
  return selection => {
    selection
      .select("circle")
      .attr("r", function(d) {
        return displayAttr(d, "radius", "px");
      })
      .attr("stroke", function(d) {
        if (d.fx) {
          return "black";
        } else {
          return "purple";
        }
      })
      .attr("filter", "url(#dropshadowunanchored)")
      .style("fill", function(d) {
        return color(d.name);
      });
    // .attr("cursor", function(d) {
    //   if (this.props.lockedNodes.includes(d.id)) {
    //     return "wait";
    //   } else {
    //     return "pointer";
    //   }
    // });
    //     .on('mouseover', function(d, i) {
    //   d3.select(this)
    //       .transition().duration(200)
    //       // .style("fill", function(d) {
    //       //   return 'purple';
    //       // })
    //       .style("stroke-width", '10')
    //       .style("stroke", "black")
    // }).on('mouseout', function(d, i) {
    //   d3.select(this)
    //       .transition().duration(200)
    //       .style("fill", function(d) {
    //         if (d.tempCustomAttrs) {
    //           // return 'red';
    //
    //           return color(d.name);
    //
    //         } else {
    //           return color(d.name);
    //         }
    //       })
    //       .style("stroke-width", function(d) {
    //         if (d.tempCustomAttrs) {
    //           return '10'
    //
    //         } else {
    //           return '1'
    //         }
    //       })
    //       .style("stroke", function(d) {
    //         if (d.tempCustomAttrs) {
    //           return 'red'
    //
    //         } else {
    //           return "black"
    //         }
    //       })
    // })

    selection
      .select("text")
      .text(d => displayAttr(d, "name"))
      .style("font-size", function(d) {
        return displayAttr(d, "fontSize", "px");
      })
      .attr("dy", ".95em")
      .call(selection =>
        selection.each(function(d) {
          d.bbox = this.getBBox();
        })
      );

    selection
      .select("rect")
      .attr("filter", "url(#dropshadowunanchored)")
      .style("fill", function(d) {
        return "yellow";
      })
      .attr("width", function(d) {
        return d.bbox.width;
      })
      .attr("height", function(d) {
        return d.bbox.height;
      });
  };
};

////////

const mapStateToProps = (state, props) => ({
  file: state.document.present.editedFile,
  currentNode: state.liveNodeEdit.selNodeId,
  lockedNodes: state.liveNodeEdit.lockedNodes,
  liveNodeEdit: state.liveNodeEdit,
  categoryEdit: state.categoryEdit,
  globalEdit: state.globalEdit,
  mouse: state.ui.mouse,
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
