import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import savePdf from "d3-save-pdf";
import * as d3 from "d3";

import {
  saveAction,
  selectNode,
  selectAndLinkNode,
  handleZoom,
  handleMouseMove
} from "../../redux/actions/document";
import { populateCurrentNodeValues } from "../../redux/actions/liveNodeEdit";
import { selectPage } from "../../redux/actions/ui";
import { emitDrag } from "../../redux/actions/channel";

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
      console.log("this.props.globalEdit", this.props.globalEdit);
      console.log(
        "Object.keys(this.props.globalEdit).length",
        Object.keys(this.props.globalEdit).length
      );

      const liveNodeEdit = this.props.liveNodeEdit;
      let modData = this.props.file;
      const categoryEdit = this.props.categoryEdit;

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
      });

      // overwrite currently selected node with temp editing values to show live update
      if (this.props.currentNode && liveNodeEdit.selNodeId) {
        let node = modData.nodes.findIndex(n => {
          return n.id === liveNodeEdit.selNodeId;
        });

        // if the node hasn't been deleted'
        if (node !== -1) {
          // TODO: Should be reset to previous name, restructure this
          modData.nodes[node].name = liveNodeEdit.name;
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
              handleClick={this.handleClick}
              handleZoom={this.props.handleZoom}
              selectPage={this.props.selectPage}
              initialZoom={this.props.file.globalSettings.zoom || null}
              handleMouseMove={this.props.handleMouseMove}
              emitDrag={this.props.emitDrag}
              mouse={this.props.mouse || { coords: { x: 0, y: 0 } }}
            />
          </div>
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
        this.props.selectNode(null);
      } else {
        this.props.selectAndLinkNode({ currentClickedNodeId, lastClickedNode });
        this.props.selectNode(null);
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
/////// Graph component. Holds Link and Node components

class Graph extends React.Component {
  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log("COMPONENT DID UPDATE", this.props);
    const charge = returnGlobalSetting(
      "chargeStrength",
      "general",
      this.props.globalSettings
    );
    const dist = this.props.globalSettings.linkDistance;
    window.force
      .force("charge", d3.forceManyBody().strength(charge || -60))
      .force(
        "link",
        d3
          .forceLink(this.props.data.links)
          .id(function(d) {
            return d.id;
          })
          .distance(function(d) {
            return dist || 900;
          })
      )
      .alphaTarget(0.5)
      .velocityDecay(0.7)
      .restart();
    setTimeout(function() {
      window.force.alphaTarget(0);
    }, 3000);

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
    } else {
      d3.selectAll("circle")
        .style("fill", function(d) {
          return color(d.name);
        })
        .style("stroke-width", function(d) {
          return "1";
        })
        .style("stroke-dasharray", function(d) {
          return "0,0";
        });
    }

    // d3 force related

    let force = window.force;

    let dragStarted = d => {
      if (!d3.event.active) force.alphaTarget(0.3).restart();
      if (d.fx) {
        d.sticky = true;
      }
      d.fx = d.x;
      d.fy = d.y;
    };

    let dragging = (d, self) => {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
      console.log("drag node", d);
      if (d.sticky && this.props.lastClickedNode === d.id) {
        // console.log('select Sticky node, then start to drag it: Unstick and Unselect node.', )
        this.props.handleClick(d.id);
        d.sticky = false;
      }

      this.props.emitDrag(d.id, d.fx, d.fy);
    };

    let dragEnded = d => {
      if (!d3.event.active) force.alphaTarget(0);
      if (this.props.lastClickedNode && this.props.lastClickedNode === d.id) {
        // console.log('select an unsticky node and drag it, make it stick there', )
        d.sticky = false;
      } else {
        if (!d.sticky) {
          // console.log(' finish drag a selected sticky node, Unstick', )
          d.fx = null;
          d.fy = null;
        } else {
          // console.log('finish drag an unselected node', )
        }
      }
    };

    d3.selectAll("g.node").call(
      d3
        .drag()
        .on("start", dragStarted)
        .on("drag", dragging)
        .on("end", dragEnded)
    );

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

    // d3.select(".frameForZoom").on("mousemove", () => {
    //
    //
    //   this.props.handleMouseMove({x: d3.event.pageX, y: d3.event.pageY})
    // });

    // after initial render, this sets up d3 to do its thing outside of react

    // React doesn't know much about d3's event system firing off. We can add custom dispatch methods onto d3 events.
    // otherwise, we aren't aware of updates being performed by d3.
    // Now I'm curious about displaying a  node's coordinates through react to see how it updates

    this.d3Graph = d3.select(ReactDOM.findDOMNode(this)).on("mousemove", () => {
      let transform = d3.zoomTransform(d3.select(".frameForZoom").node());

      console.log("TRANSFORM", transform);

      let xy = [d3.event.pageX - 270, d3.event.pageY - 60];

      var xy1 = transform.invert(xy); // relative to zoom

      this.props.handleMouseMove({ x: xy1[0], y: xy1[1], k: transform.k });
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
    console.log("re render nodes and links?");
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
    return (
      <svg
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
        <rect
          width="20px"
          height="20px"
          x={this.props.mouse.coords.x - 270}
          y={this.props.mouse.coords.y - 60}
          fill="black"
        />
        {/*<text x={this.props.mouse.coords.x -270} y={this.props.mouse.coords.y -60} >*/}
        {/*  {this.props.mouse.coords.x -270} + ', ' + {this.props.mouse.coords.y -60}*/}
        {/*</text>*/}
        <g className="frameForZoom">
          <text
            x={this.props.mouse.coords.x}
            y={this.props.mouse.coords.y}
            font-size={16 / this.props.mouse.coords.k}
          >
            {this.props.mouse.coords.x} + ', ' + {this.props.mouse.coords.y}
          </text>
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
    console.log("node update", this.props.data);
    d3.select(ReactDOM.findDOMNode(this))
      // won't update bg if uncommented
      // .selectAll(".node")
      .datum(this.props.data)
      .call(enterNode(this.props.displayAttr));
  }
  render() {
    return (
      <g className="node">
        <circle
          name={this.props.data.id}
          ref="dragMe"
          onClick={e => {
            this.props.handleClick(this.props.data.id);
            this.props.selectPage(2);
          }}
        />
        <g>
          <rect />
          <text>{this.props.data.name}</text>
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
  file: state.document.editedFile,
  currentNode: state.document.currentNode,
  liveNodeEdit: state.liveNodeEdit,
  categoryEdit: state.categoryEdit,
  globalEdit: state.globalEdit,
  mouse: state.document.mouse
});

const mapDispatchToProps = dispatch => ({
  saveAction: file => dispatch(saveAction(file)),
  selectNode: node => dispatch(selectNode(node)),
  selectAndLinkNode: node => dispatch(selectAndLinkNode(node)),
  populateCurrentNodeValues: node => dispatch(populateCurrentNodeValues(node)),
  handleZoom: zoomAttrs => dispatch(handleZoom(zoomAttrs)),
  handleMouseMove: coords => dispatch(handleMouseMove(coords)),
  selectPage: i => dispatch(selectPage(i)),
  emitDrag: (id, fx, fy) => dispatch(emitDrag({ id, fx, fy }))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
