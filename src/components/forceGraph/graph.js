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
const color = d3.scaleOrdinal(d3.schemeCategory10);

class Graph extends React.Component {
  handleContextMenu(e) {
    // always prevent default behavior
    e.preventDefault();

    // Don't forget to pass the id and the event and voila!
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

  componentDidUpdate(prevProps, prevState, snapshot) {
    const charge = returnGlobalSetting(
      "chargeStrength",
      "general",
      this.props.globalSettings
    );
    const dist = returnGlobalSetting(
      "linkDistance",
      "general",
      this.props.globalSettings
    );

    console.log("DIST", dist);

    window.force
      .nodes(this.props.data.nodes) //if a node is updated, we need it to point to the new object
      .force("charge", d3.forceManyBody().strength(charge || -60))
      .force("link", d3.forceLink(this.props.data.links).distance(dist))
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

      // if (mobile_phone or  single_user?) {
      //   d3.select(self)
      //       .attr("cx", (d.x = d3.event.x))
      //       .attr("cy", (d.y = d3.event.y));
      //   d.fx = d.x;
      //   d.fy = d.y;
      // } else

      if (d.sticky && this.props.lastClickedNode === d.id) {
        // console.log('select Sticky node, then start to drag it: Unstick and Unselect node.', )
        this.props.handleClick(d.id);
        d.sticky = false;
      }
      this.props.dragNode(d.id, d3.event.x, d3.event.y, d.sticky); //EMIT TO OTHER USERS
    };

    let dragEnded = (d, self) => {
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

    // d3.selectAll("g.node").call(
    //   d3
    //     .drag()
    //     .on("start", dragStarted)
    //     .on("drag", dragging)
    //     .on("end", dragEnded)
    // );

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
    console.log("DISPLAY ATTR", d, value);
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
      <Link
        key={i}
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
