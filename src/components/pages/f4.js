import ReactDOM from "react-dom";
import { connect } from "react-redux";

import { saveAction, selectNode } from "../../redux/actions/simpleAction";
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
      return (
        <div>
          <div
            className="graphContainer"
            style={{ position: "fixed", zIndex: 3000 }}
          >
            <Graph
              data={this.state.data}
              lastClickedNode={this.state.lastClickedNode}
              handleClick={this.handleClick}
            />
          </div>

          {/* <div
            style={{
              zIndex: 2000,
              position: "fixed",
              width: "200px",
              background: "#D3D3D3",
              right: "0px",
              height: "100%"
            }}
          >
            Filters
          </div> */}
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
    this.props.saveAction(this.state.data);
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
        }

        const newData = { nodes: this.state.data.nodes, links: newLinks };
        this.setState({ data: newData });
        this.setState({ lastClickedNode: null });
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
        });
    } else {
      d3.selectAll("circle").style("fill", function(d) {
        return color(d.name);
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
    console.log("find dom node", this);
    // after initial render, this sets up d3 to do its thing outside of react
    // x and y coords get added onto the nodes but react doesn't recognnize the changes
    this.d3Graph = d3.select(ReactDOM.findDOMNode(this));

    this.d3Graph.call(d3.zoom().on("zoom", zoomed)).on("dblclick.zoom", () => {
      return null; /*disable zoom on double click by default*/
    });

    function zoomed() {
      console.log("ZOOM>", d3.event.transform);
      d3.select(".frameForZoom").attr("transform", d3.event.transform);
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

  render() {
    const nodes = this.props.data.nodes.map(node => (
      <Node
        data={node}
        name={node.name}
        key={node.id}
        handleClick={this.props.handleClick}
      />
    ));
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
      if (d.radius) {
        return d.radius;
      } else if (
        d.id === 0 ||
        d.id === 3 ||
        d.id === 7 ||
        d.id === 8 ||
        d.id === 11 ||
        d.id === 15
      ) {
        return 30;
      } else {
        return 15;
      }
    })
    .attr("stroke", function(d) {
      if (d.fx) {
        return "black";
      } else {
        return "orange";
      }
    })
    .style("fill", function(d) {
      return color(d.name);
    });

  selection
    .select("text")
    .style("font-size", function(d) {
      if (d.fontSize) {
        return d.fontSize + "px";
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
  file: state.simpleReducer.editedFile
});

const mapDispatchToProps = dispatch => ({
  saveAction: file => dispatch(saveAction(file)),
  selectNode: node => dispatch(selectNode(node)),
  populateCurrentNodeValues: node => dispatch(populateCurrentNodeValues(node))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
