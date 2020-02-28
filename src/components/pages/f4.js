import ReactDOM from "react-dom";
import { connect } from "react-redux";
import savePdf from 'd3-save-pdf'

import { saveAction, selectNode, handleZoom } from "../../redux/actions/simpleAction";
import { populateCurrentNodeValues } from "../../redux/actions/liveNodeEdit";
import { selectPage } from "../../redux/actions/ui";

let d3 = require("d3");
let React = require("react");

const color = d3.scaleOrdinal(d3.schemeCategory10);

/////// App component holds graph data in state and renders Graph component.
/////// Graph component in turn renders Link and Node components.

class App extends React.Component {
  state = {
    fileLoaded: false
  };

  render() {

    // console.log('RENDER UPDATE?', this.state.data)
    // console.log("this.props", this.props);
    if (this.props.file) {

      const liveNodeEdit = this.props.liveNodeEdit

      let modData = this.props.file


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
      if (this.props.currentNode && liveNodeEdit.selNodeId) {
        let node = modData.nodes.findIndex(n => {
          return n.id === liveNodeEdit.selNodeId
        })

        // if the node hasn't been deleted'
        if (node !== -1) {
          console.log('nodeee', node)
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


      }

      return (
        <div
        >
          <div
            className="graphContainer"
            style={{ width: '100%', height: '100%', position: "fixed", zIndex: 3000 }}
          >
            <Graph
              data={modData}
              globalSettings={this.props.globalEdit}
              lastClickedNode={this.props.currentNode}
              handleClick={this.handleClick}
              handleZoom={this.props.handleZoom}
              selectPage={this.props.selectPage}
              initialZoom={this.props.file.globalSettings.zoom || null}
            />
          </div>
        </div>
      );
    } else {
      return <div></div>;
    }
  }

  componentDidUpdate(prevProps) {

  }


  handleClick = currentClickedNode => {
    const lastClickedNode = this.props.currentNode

    console.log('lst, curr', lastClickedNode, currentClickedNode)

    if (lastClickedNode) {
      if (lastClickedNode === currentClickedNode) {
        console.log(' 1st block', )
        this.setState({ lastClickedNode: null });
        this.props.selectNode(null);
      } else {
        console.log(' 2st block', )


        const last = this.props.file.nodes.find(e => {
          return e.id === lastClickedNode
        })

        const current = this.props.file.nodes.find(e => {
          return e.id ===  currentClickedNode
        })

        console.log('LAST', last)

        const newLink = {
          source: last,
          target: current
        };

        const linkAlreadyExists = this.props.file.links.find(function(
          currentClickedNode
        ) {
          return (
            // Check for target -> source AND source -> target
            (currentClickedNode.source.id === newLink.source.id &&
              currentClickedNode.target.id === newLink.target.id) ||
            (currentClickedNode.source.id === newLink.target.id &&
              currentClickedNode.target.id === newLink.source.id)
          );
        });

        let newLinks;
        if (linkAlreadyExists) {
          newLinks = this.props.file.links.filter(function(e) {
            return e !== linkAlreadyExists;
          });
        } else {
          newLinks = [...this.props.file.links, newLink];
          console.log('new links', newLinks)
        }

        const cats = this.props.file.categories || {}

        const newData = { ...this.props.file, categories: cats, links: newLinks };

        this.props.saveAction(newData);
        this.props.selectNode(null);
      }
    } else {
      this.setState({ lastClickedNode: currentClickedNode });
      this.props.selectNode(currentClickedNode);

      const currSelNode = this.props.file.nodes.find(e => {
        return e.id === currentClickedNode;
      });

      this.props.populateCurrentNodeValues(currSelNode);
    }
  };
}

/////// Graph component. Holds Link and Node components

class Graph extends React.Component {
  componentDidUpdate(prevProps, prevState, snapshot) {
    let canvas = d3.select('svg').node();
    let config = {filename: 'testing'}
    // savePdf.save(canvas, config)
    // console.log('savePdf', savePdf)
    // console.log('did component update?', this.props.data.nodes)

    const charge = this.props.globalSettings.chargeStrength
    const dist = this.props.globalSettings.linkDistance


    window.force
        .force("charge", d3.forceManyBody().strength(charge || -60))
        .force("link", d3.forceLink(this.props.data.links).id(function(d) { return d.id; }).distance(function (d) {
          return dist || 900
        }))
        .alphaTarget(0.5)
        .velocityDecay(0.7)
        .restart()


    setTimeout(function(){  window.force.alphaTarget(0); }, 3000);



    const lastClicked = this.props.lastClickedNode
    if (lastClicked) {
      let self = this;
      d3.selectAll("circle")
        .filter(function(d, i) {
          return d.id === self.props.lastClickedNode;
        })
        // .style("fill", function(d) {
        //   return "red";
        // })
          .style("stroke-width", function(d) {
        return "10";
      })
          .style("stroke", function(d) {
            return "red";
          })

      //     .style("stroke-dasharray", function(d) {
      //   return "6,10";
      // }).style("stroke-linecap", function(d) {
      //   return "round";
      // });
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
      console.log("DRAGGING", d);

      if (d.sticky) {
        if (this.props.lastClickedNode && this.props.lastClickedNode === d.id) {
          this.props.handleClick(d.id);
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
    d3.select(".frameForZoom")
        .attr("transform", `translate(${this.props.initialZoom.x}, ${this.props.initialZoom.y})scale(${this.props.initialZoom.k})`)
        .on('click', d => {
          // let x = (d3.event.x - zoomTrans.x)/zoomTrans.scale;
          // let y = (d3.event.y - zoomTrans.y)/zoomTrans.scale;
          // data.push({ x, y, id: Math.random() });
          console.log('click!', d3.event.x, d3.event.y)
        });

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
      .force("charge", d3.forceManyBody().strength(this.props.globalSettings.chargeStrength || -60))
      .force("link", d3.forceLink(this.props.data.links).id(function(d) { /*reference by id, not index */return d.id }).distance(this.props.globalSettings.linkDistance || 900))
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
    return this.props.data.categories[cat]
  }

  render() {
    const nodes = this.props.data.nodes.map(node => {
      let attrs
      if (node.category) {
        // console.log('node category', node.category)
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
              selectPage={this.props.selectPage}
          />
      );
    })
    const links = this.props.data.links.map((link, i) => (
      <Link key={i} data={link} />
    ));
    return (
      <svg
        className="graph"
        width='100%'
        height='100%'
        style={{ border: "1px solid black" }}
      >
        <defs>
          <filter id="dropshadow" width="150%" height="180%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur"></feGaussianBlur>
            <feOffset in="blur" dx="6" dy="6" result="offsetBlur"></feOffset>
            <feMerge>
              <feMergeNode></feMergeNode>
              <feMergeNode in="SourceGraphic"></feMergeNode>
            </feMerge>
          </filter>
          <filter id="dropshadowtext" width="150%" height="180%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur"></feGaussianBlur>
            <feOffset in="blur" dx="3" dy="3" result="offsetBlur"></feOffset>
            <feMerge>
              <feMergeNode></feMergeNode>
              <feMergeNode in="SourceGraphic"></feMergeNode>
            </feMerge>
          </filter>
          <filter id="dropshadowunanchored" width="150%" height="180%" >
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur"></feGaussianBlur>
            <feOffset in="blur" dx="20" dy="20" result="offsetBlur"></feOffset>
            <feComponentTransfer>
              <feFuncA type="linear" slope=".2"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode></feMergeNode>
              <feMergeNode in="SourceGraphic"></feMergeNode>
            </feMerge>
          </filter>
        </defs>
        <rect width="100%" height="100%" fill="powderblue"/>
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
          onClick={e => {
            this.props.handleClick(this.props.data.id);
            this.props.selectPage(2)
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
    .attr("filter", 'url(#dropshadowunanchored)')
    .style("fill", function(d) {
      return color(d.name);
    }).on('mouseover', function(d, i) {
    console.log("mouseover on", this);
    d3.select(this)
        .transition().duration(200)
        // .style("fill", function(d) {
        //   return 'purple';
        // })
        .style("stroke-width", '10')
        .style("stroke", "black")
  }).on('mouseout', function(d, i) {
    console.log("mouseover on", this);
    d3.select(this)
        .transition().duration(200)
        .style("fill", function(d) {
          if (d.tempCustomAttrs) {
            // return 'red';

            return color(d.name);

          } else {
            return color(d.name);
          }
        })
        .style("stroke-width", function(d) {
          if (d.tempCustomAttrs) {
            return '10'

          } else {
            return '1'
          }
        })
        .style("stroke", function(d) {
          if (d.tempCustomAttrs) {
            return 'red'

          } else {
            return "black"
          }
        })
  })

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
      .attr("filter", 'url(#dropshadowunanchored)')
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
  file: state.simpleReducer.editedFile,
  currentNode: state.simpleReducer.currentNode,
  liveNodeEdit: state.liveNodeEdit,
  categoryEdit: state.categoryEdit,
  globalEdit: state.globalEdit
});

const mapDispatchToProps = dispatch => ({
  saveAction: file => dispatch(saveAction(file)),
  selectNode: node => dispatch(selectNode(node)),
  populateCurrentNodeValues: node => dispatch(populateCurrentNodeValues(node)),
  handleZoom: zoomAttrs => dispatch(handleZoom(zoomAttrs)),
  selectPage: i => dispatch(selectPage(i))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
