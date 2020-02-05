import ReactDOM from "react-dom";
import { connect } from "react-redux";

import { saveAction, selectNode, handleZoom } from "../../redux/actions/simpleAction";
import { populateCurrentNodeValues } from "../../redux/actions/liveNodeEdit";

let d3 = require("d3");
let React = require("react");

const width = 1500;
const height = 1000;
const color = d3.scaleOrdinal(d3.schemeCategory10);

/////// App component holds graph data in state and renders Graph component.
/////// Graph component in turn renders Link and Node components.

class App extends React.Component {
  state = {
    data: this.props.file,
    lastClickedNode: null,
    fileLoaded: false
  };

  render() {
    // console.log("this.props", this.props);
    if (this.state.data) {

      const liveNodeEdit = this.props.liveNodeEdit

      let modData = this.state.data


      const categoryEdit = this.props.categoryEdit
      modData.nodes.forEach(node => {

        if (node.tempCategoryAttrs) {
          delete node.tempCategoryAttrs
        }

        if (node.category === categoryEdit.category) {
          node.tempCategoryAttrs = {}
          categoryEdit.checkedAttrs.forEach(attr => {
            node.tempCategoryAttrs[attr]= categoryEdit[attr]
          })
        }
            if (node.tempCustomAttrs) {
              delete node.tempCustomAttrs
            }

      })

      // overwrite currently selected node with temp editing values to show live update
      if (this.state.lastClickedNode && liveNodeEdit.selNodeId) {
        let node = modData.nodes.findIndex(n => {
          return n.id === liveNodeEdit.selNodeId
        })

        modData.nodes[node].name = liveNodeEdit.name

        if (liveNodeEdit.checkedAttrs.includes('category')) {
          modData.nodes[node].category = liveNodeEdit.category
        }


        // populate the temporary custom attributes being edited live
          modData.nodes[node].tempCustomAttrs = modData.nodes[node].tempCustomAttrs || {}

          liveNodeEdit.checkedAttrs.forEach(attr => {
            modData.nodes[node].tempCustomAttrs[attr]= liveNodeEdit[attr]
          })
      }






      return (
        <div>
          <div
            className="graphContainer"
            style={{ position: "fixed", zIndex: 3000 }}
          >
            <Graph
              data={modData}
              lastClickedNode={this.state.lastClickedNode}
              handleClick={this.handleClick}
              handleZoom={this.handleZoom}
              initialZoom={this.props.file.globalSettings.zoom || null}
            />
          </div>
        </div>
      );
    } else {
      return <div></div>;
    }
  }

  componentDidUpdate() {
    if (!this.state.fileLoaded) {
      this.setState({ data: this.props.file, fileLoaded: true });
    }
    // this.props.saveAction(this.props.file);
  }

  handleZoom = zoomAttrs => {
    // const gSettings = this.state.data.globalSettings || {}
    this.props.handleZoom(zoomAttrs);

  }

  handleClick = currentClickedNode => {
    const { lastClickedNode } = this.state;

    if (typeof lastClickedNode === "number") {
      if (lastClickedNode === currentClickedNode) {
        this.setState({ lastClickedNode: null });
        this.props.selectNode(null);
      } else {
        const newLink = {
          source: lastClickedNode,
          target: currentClickedNode
        };

        const linkAlreadyExists = this.state.data.links.find(function(
          currentClickedNode
        ) {
          return (
            // Check for target -> source AND source -> target
            (currentClickedNode.source.id === newLink.source &&
              currentClickedNode.target.id === newLink.target) ||
            (currentClickedNode.source.id === newLink.target &&
              currentClickedNode.target.id === newLink.source)
          );
        });

        let newLinks;
        if (linkAlreadyExists) {
          newLinks = this.state.data.links.filter(function(e) {
            return e !== linkAlreadyExists;
          });
        } else {
          newLinks = [...this.state.data.links, newLink];
          console.log('new links', newLinks)
        }

        const cats = this.state.data.categories || {}

        const newData = { categories: cats, nodes: this.state.data.nodes, links: newLinks };
        this.setState({ data: newData });
        this.setState({ lastClickedNode: null });
        this.props.saveAction(newData);
        this.props.selectNode(null);
      }
    } else {
      this.setState({ lastClickedNode: currentClickedNode });
      this.props.selectNode(currentClickedNode);

      const currSelNode = this.state.data.nodes.find(e => {
        return e.id === currentClickedNode;
      });

      this.props.populateCurrentNodeValues(currSelNode);
    }
  };
}

/////// Graph component. Holds Link and Node components

class Graph extends React.Component {
  componentDidUpdate(prevProps, prevState, snapshot) {
    window.force
      .force("link", d3.forceLink(this.props.data.links).distance(90))
      .restart();

    const lastClicked = typeof this.props.lastClickedNode === "number";
    if (lastClicked) {
      let self = this;
      d3.selectAll("circle")
        .filter(function(d, i) {
          return i === self.props.lastClickedNode;
        })
        .style("fill", function(d) {
          return "red";
        }).style("stroke-width", function(d) {
        return "2";
      }).style("stroke-dasharray", function(d) {
        return "6,10";
      }).style("stroke-linecap", function(d) {
        return "round";
      });
    } else {
      d3.selectAll("circle").style("fill", function(d) {
        return color(d.name);
      }).style("stroke-width", function(d) {
        return "1";
      }).style("stroke-dasharray", function(d) {
        return "0,0";
      });
    }

    let force = window.force;

    let dragStarted = d => {
      if (!d3.event.active) force.alphaTarget(0.3).restart();

      if (d.fx) {
        d.sticky = true;
      }

      d.fx = d.x;
      d.fy = d.y;
    };

    let dragging = d => {
      console.log("DRAGGING");

      if (d.sticky) {
        if (this.props.lastClickedNode && this.props.lastClickedNode === d.id) {
          this.props.handleClick(d);
          d.sticky = false;
        } else {
          // needed for some reason
          d.sticky = "f";
        }
      }

      d.fx = d3.event.x;
      d.fy = d3.event.y;
    };

    let dragEnded = d => {
      console.log("DRAG ENDED", d);
      if (!d3.event.active) force.alphaTarget(0);
      if (this.props.lastClickedNode && this.props.lastClickedNode === d.id) {
        console.log("last node", this.props.lastClickedNode, d);
        if (d.sticky === "f") {
          d.fx = null;
          d.fy = null;
          d.sticky = false;
        } else {
          console.log("no d.fx");
          d.fx = d3.event.x;
          d.fy = d3.event.y;
          d.sticky = false;
        }
      } else {
        if (d.sticky) {
          console.log("STIKCY");
          d.fx = d3.event.x;
          d.fy = d3.event.y;
        } else {
          d.fx = null;
          d.fy = null;
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
  }

  componentDidMount() {

    // set initial zoom frame from saved value
    d3.select(".frameForZoom").attr("transform", `translate(${this.props.initialZoom.x}, ${this.props.initialZoom.y})scale(${this.props.initialZoom.k})`);

    console.log("find dom node", this);
    // after initial render, this sets up d3 to do its thing outside of react
    // x and y coords get added onto the nodes but react doesn't recognnize the changes
    this.d3Graph = d3.select(ReactDOM.findDOMNode(this));

    this.d3Graph.call(d3.zoom().on("zoom", () => zoomed(this))).on("dblclick.zoom", () => {
      return null; /*disable zoom on double click by default*/
    });

    // set 'zoom identity' so d3 knows what zoom level you are at from the initialized value
    let transform = d3.zoomIdentity.translate(this.props.initialZoom.x, this.props.initialZoom.y).scale(this.props.initialZoom.k);
    this.d3Graph.call(d3.zoom().transform, transform)

    function zoomed(self) {
      let {x, y, k} = d3.event.transform;
      console.log('ZZZOOOOM', {x, y, k})
      // d3.select(".frameForZoom").attr("transform", `translate(${x}, ${y})scale(${k})`);

      d3.select(".frameForZoom").attr("transform", d3.event.transform);
      self.props.handleZoom(d3.event.transform)
    }

    let force = d3
      .forceSimulation(this.props.data.nodes)
      .force("charge", d3.forceManyBody().strength(-20))
      .force("link", d3.forceLink(this.props.data.links).distance(90))
      .force(
        "center",
        d3
          .forceCenter()
          .x(width / 2)
          .y(height / 2)
      )
      .force("collide", d3.forceCollide([65]).iterations([60]));

    function dragStarted(d) {
      if (!d3.event.active) force.alphaTarget(0.3).restart();
      if (d.fx) {
        d.sticky = true;
      }
      d.fx = d.x;
      d.fy = d.y;
    }

    let dragging = d => {
      console.log("DRAGGING");
      if (d.sticky) {
        if (this.props.lastClickedNode && this.props.lastClickedNode === d.id) {
          this.props.handleClick(d);
          d.sticky = false;
        } else {
          // needed for some reason
          d.sticky = "f";
        }
      }

      d.fx = d3.event.x;
      d.fy = d3.event.y;
    };

    let dragEnded = d => {
      console.log("DRAG ENDED", d);
      if (!d3.event.active) force.alphaTarget(0);
      if (this.props.lastClickedNode && this.props.lastClickedNode === d.id) {
        console.log("last node", this.props.lastClickedNode, d);
        if (d.sticky === "f") {
          d.fx = null;
          d.fy = null;
          d.sticky = false;
        } else {
          console.log("no d.fx");
          d.fx = d3.event.x;
          d.fy = d3.event.y;
          d.sticky = false;
        }
      } else {
        if (d.sticky) {
          console.log("STIKCY");
          d.fx = d3.event.x;
          d.fy = d3.event.y;
        } else {
          d.fx = null;
          d.fy = null;
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

    force.on("tick", () => {
      this.d3Graph.call(updateGraph);
    });

    // set force function on window object to easily access it from React's update lifecyle method
    window.force = force;
  }

  getCategory (cat) {
    console.log('this.props.data',this.props.data )
    console.log('CATE',cat )
    return this.props.data.categories[cat]
  }

  render() {
    const nodes = this.props.data.nodes.map(node => {
      let attrs
      if (node.category) {
        console.log('node category', node.category)
       let cat = this.getCategory(node.category)

        if (cat) {
          node.categoryAttrs = cat
        }

      }
      return (
          <Node
              data={node}
              name={node.name}
              key={node.id}
              handleClick={this.props.handleClick}
          />
      );
    })
    const links = this.props.data.links.map((link, i) => (
      <Link key={i} data={link} />
    ));
    return (
      <svg
        className="graph"
        width={width}
        height={height}
        style={{ border: "1px solid black" }}
      >
        <rect width="100%" height="100%" fill="pink"/>
        <g className="frameForZoom">
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
    this.d3Link = d3
      .select(ReactDOM.findDOMNode(this))
      .datum(this.props.data)
      .call(enterLink);
  }

  componentDidUpdate() {
    this.d3Link.datum(this.props.data).call(updateLink);
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

const updateLink = selection => {
  selection
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y);
};

const updateGraph = selection => {
  selection.selectAll(".node").call(updateNode);
  selection.selectAll(".link").call(updateLink);
};

const updateNode = selection => {
  selection.attr("transform", d => {
    return "translate(" + d.x + "," + d.y + ")";
  });
};

///////

class Node extends React.Component {
  componentDidMount() {
    d3.select(ReactDOM.findDOMNode(this))
      .datum(this.props.data)
      .call(enterNode);
  }

  componentDidUpdate() {
    d3.select(ReactDOM.findDOMNode(this))
      // won't update bg if uncommented
      // .selectAll(".node")
      .datum(this.props.data)
      .call(enterNode);
  }

  render() {
    return (
      <g className="node">
        <circle
          name={this.props.data.id}
          ref="dragMe"
          onClick={e => this.props.handleClick(this.props.data.id)}
        />
        <g>
          <rect />
          <text>{this.props.data.name}</text>
        </g>
      </g>
    );
  }
}

const enterNode = selection => {
  selection
    .select("circle")
    .attr("r", function(d) {
      if (d.tempCustomAttrs && d.tempCustomAttrs.radius) {
        return d.tempCustomAttrs.radius;
      }
      else if (d.customAttrs && d.customAttrs.radius && d.tempCustomAttrs && !d.tempCustomAttrs.radius) {
        // if radius is a custom attribute, but while editing radius is not checked,
        // assign radius value as category value or default value if no category
        return d.tempCategoryAttrs && d.tempCategoryAttrs.radius || d.categoryAttrs && d.categoryAttrs.radius || '30'
      }
      else if (d.customAttrs && d.customAttrs.radius) {
        return d.customAttrs.radius;
      }
      else if (d.tempCategoryAttrs && d.tempCategoryAttrs.radius) {
        return d.tempCategoryAttrs.radius;
      }
      else if (d.categoryAttrs && d.categoryAttrs.radius) {
    return d.categoryAttrs.radius;
  } else {
        return 30;
      }
    })
    .attr("stroke", function(d) {
      if (d.fx) {
        return "black";
      } else {
        return "purple";
      }
    })
    .style("fill", function(d) {
      return color(d.name);
    });

  selection
    .select("text")
    .style("font-size", function(d) {
      if (d.tempCustomAttrs && d.tempCustomAttrs.fontSize) {
        return d.tempCustomAttrs.fontSize;
      }
      else if (d.customAttrs && d.customAttrs.fontSize && d.tempCustomAttrs && !d.tempCustomAttrs.fontSize) {
        // if font size is a custom attribute, but while editing radius is not checked,
        // assign font size value as category value or default value if no category
        return d.categoryAttrs && d.categoryAttrs.fontSize || '18'
      }
      else if (d.customAttrs && d.customAttrs.fontSize) {
        return d.customAttrs.fontSize + "px";
      }
      else if (d.tempCategoryAttrs && d.tempCategoryAttrs.fontSize) {
        return d.tempCategoryAttrs.fontSize;
      }
      else if (d.categoryAttrs && d.categoryAttrs.fontSize) {
        return d.categoryAttrs.fontSize;
      } else {
        return "30px";
      }
    })
    .attr("dy", ".95em")
    .call(getBoundingBox);

  function getBoundingBox(selection) {
    selection.each(function(d) {
      d.bbox = this.getBBox();
    });
  }

  selection
    .select("rect")
    .style("fill", function(d) {
      if (
        d.id === 0 ||
        d.id === 3 ||
        d.id === 7 ||
        d.id === 8 ||
        d.id === 11 ||
        d.id === 15
      ) {
        return "orange";
      } else {
        return "yellow";
      }
    })
    .attr("width", function(d) {
      return d.bbox.width;
    })
    .attr("height", function(d) {
      return d.bbox.height;
    });
};

////////
////////
////////
////////

const mapStateToProps = (state, props) => ({
  // ...state,
  file: state.simpleReducer.editedFile,
  liveNodeEdit: state.liveNodeEdit,
  categoryEdit: state.categoryEdit
});

const mapDispatchToProps = dispatch => ({
  saveAction: file => dispatch(saveAction(file)),
  selectNode: node => dispatch(selectNode(node)),
  populateCurrentNodeValues: node => dispatch(populateCurrentNodeValues(node)),
  handleZoom: zoomAttrs => dispatch(handleZoom(zoomAttrs))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
