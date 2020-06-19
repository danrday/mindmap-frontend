import React from "react";
import { contextMenu } from "react-contexify";
import * as d3 from "d3";
import ReactDOM from "react-dom";
import Node from "./node";
import Link from "./link";

function returnGlobalSetting(setting, section, globalSettings) {
  return globalSettings.checkedAttrs.includes(setting)
    ? globalSettings[section][setting].customValue
    : globalSettings[section][setting].defaultValue;
}

class Graph extends React.Component {
  state = {};

  handleContextMenu(e) {
    e.preventDefault();
    contextMenu.show({
      id: "contextMenu",
      event: e,
      props: {
        coords: this.props.mouseCoords.self.coords,
        currSelNode: this.props.lastClickedNode,
        selectNode: this.props.selectNode,
        selectPage: this.props.selectPage,
        addNodeAtCoords: this.props.addNodeAtCoords
      }
    });
  }

  componentDidMount() {
    let globalSettings = this.props.globalSettings;

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
    let initialZoom = this.props.initialZoom;
    d3.select(".frameForZoom").attr(
      "transform",
      `translate(${initialZoom.x}, ${initialZoom.y})scale(${initialZoom.k})`
    );

    // transmit mouse coords to other users
    const domNode = ReactDOM.findDOMNode(this);
    this.d3Graph = d3.select(domNode).on("mousemove", e => {
      const transform = d3.zoomTransform(d3.select(".frameForZoom").node());
      const xy = d3.mouse(domNode);
      const xyTransform = transform.invert(xy); // relative to zoom
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
        .translate(initialZoom.x, initialZoom.y)
        .scale(initialZoom.k)
    );

    this.d3Graph
      .call(d3.zoom().on("zoom", () => handleZoom(this)))
      .on("dblclick.zoom", () => {
        return null; /*disable zoom on double click by default*/
      });

    function handleZoom(self) {
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
            returnGlobalSetting("chargeStrength", "general", globalSettings)
          )
      )
      .force(
        "link",
        d3
          .forceLink(this.props.data.links)
          .id(function(d) {
            /*reference by id, not index */ return d.id;
          })
          .distance(globalSettings.linkDistance || 900)
      )
      .force("collide", d3.forceCollide([65]).iterations([60]))
      .on("tick", () => {
        this.d3Graph.call(updateGraph);
      });

    // set force function on window object to easily access it from React's update lifecyle method
    this.setState({ ...this.state, force: force });
    // window.force = force;

    let self = this;
    // experiment for fixing phone issue with drag
    // d3.selectAll("g.node").each(function(d) {
    //   d3.select(this).call(
    //     d3
    //       .drag()
    //       .on("start", function(d) {
    //         self.dragStarted(d, this);
    //       })
    //       .on("drag", function(d) {
    //         self.dragging(d, this);
    //       })
    //       .on("end", function(d) {
    //         self.dragEnded(d, this);
    //       })
    //   );
    // });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    let globalSettings = this.props.globalSettings;
    const charge = returnGlobalSetting(
      "chargeStrength",
      "general",
      globalSettings
    );
    const dist = returnGlobalSetting("linkDistance", "general", globalSettings);

    // let force = window.force;
    let force = this.state.force;
    force
      .nodes(this.props.data.nodes) //if a node is updated, we need it to point to the new object
      .force("charge", d3.forceManyBody().strength(charge || -60))
      .force("link", d3.forceLink(this.props.data.links).distance(dist))
      .alphaTarget(0.5)
      .velocityDecay(0.7)
      .restart();

    // setTimeout(function() {
    //   window.force.alphaTarget(0);
    // }, 3000);

    // const lastClicked = this.props.lastClickedNode;
    // if (lastClicked) {
    //   let self = this;
    //   d3.selectAll("circle")
    //     .filter(function(d, i) {
    //       return d.id === self.props.lastClickedNode;
    //     })
    //     .style("stroke-width", function(d) {
    //       // return getAttributeValue(d, attr)
    //       // TO DO: MAKE THIS GOOD
    //       let test = 0.05 * d.tempCustomAttrs.radius;
    //       return test;
    //     })
    //     .style("stroke", function(d) {
    //       return "red";
    //     });
    // }

    const lastClickedLink = this.props.lastClickedLink;
    if (lastClickedLink) {
      let self = this;
      d3.selectAll("line")
        .filter(function(d, i) {
          if (d) {
            return d.id === self.props.lastClickedLink;
          } else {
            return false;
          }
        })
        .style("stroke", function(d) {
          return "purple";
        });
    }

    // PDF EXPERIMENT
    let canvas = d3.select("svg").node();
    let config = { filename: "testing" };
    // savePdf.save(canvas, config)
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
    const nodes = this.props.data.nodes.map(node => {
      if (node.category) {
        let category = this.getCategory(node.category);
        if (category) {
          // check if it exists
          node.categoryAttrs = category;
        }
      }
      return (
        <Node
          force={this.state.force}
          lastClickedNode={this.props.lastClickedNode}
          dragNode={this.props.dragNode}
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
      <Link
        key={link.id}
        data={link}
        displayAttr={this.displayAttr}
        lockedLinks={this.props.lockedLinks}
        handleClick={this.props.handleLinkClick}
        selectPage={
          this.props.selectPage
        } /*when link is clicked, auto select edit links page*/
      />
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

export default Graph;
