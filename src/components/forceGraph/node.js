import React from "react";
import * as d3 from "d3";
import ReactDOM from "react-dom";
const color = d3.scaleOrdinal(d3.schemeCategory10);

class Node extends React.Component {
  dragStarted(d, self) {
    // (fires on any mousedown)
    if (!d3.event.active) this.props.force.alphaTarget(0.3).restart();
    if (d.fx) {
      d.sticky = true;
    }
  }

  dragging(d, self) {
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
  }

  dragEnded(d, self) {
    // (fires on any mouseup)
    if (!d3.event.active) this.props.force.alphaTarget(0);
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
  }

  componentDidMount() {
    d3.select(ReactDOM.findDOMNode(this))
      .datum(this.props.data)
      .call(enterNode(this.props.displayAttr));

    // DRAG STUFF
    // original code
    // d3.selectAll("g.node").call(
    //   d3
    //     .drag()
    //     .on("start", dragStarted)
    //     .on("drag", dragging)
    //     .on("end", dragEnded)
    // );

    // let self = this;
    // // experiment for fixing phone issue with drag
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

    let self = this;
    d3.select(ReactDOM.findDOMNode(this)).call(
      d3
        .drag()
        .on("start", function(d) {
          self.dragStarted(d, this);
        })
        .on("drag", function(d) {
          self.dragging(d, this);
        })
        .on("end", function(d) {
          self.dragEnded(d, this);
        })
    );
  }
  shouldComponentUpdate(nextProps) {
    const lockedNode = this.props.lockedNodes[this.props.data.id]; //think this works because of mutation of lockedNodes
    const freshNode = nextProps.data !== this.props.data;
    const lastClicked = nextProps.lastClickedNode === this.props.data.id;
    const unClicked =
      this.props.lastClickedNode === this.props.data.id &&
      nextProps.lastClickedNode !== this.props.lastClickedNode;
    return freshNode || lastClicked || unClicked || lockedNode || false;
  }
  componentDidUpdate() {
    if (this.props.data.id === "af0f8b50-dffd-47cf-a936-1b2627628e53") {
      console.log("node update:", this.props.data);
    }
    d3.select(ReactDOM.findDOMNode(this))
      .datum(this.props.data)
      .call(enterNode(this.props.displayAttr, this.props.lastClickedNode));
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

              if (this.props.data.id === this.props.lastClickedNode) {
                this.props.selectPage(null);
              } else {
                this.props.selectPage("/node");
              }
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

const enterNode = (displayAttr, lastClickedNode) => {
  return selection => {
    selection
      .select("circle")
      .attr("r", function(d) {
        return displayAttr(d, "radius");
      })
      .style("stroke-width", function(d) {
        if (d.id === lastClickedNode) {
          let test = 0.05 * d.tempCustomAttrs.radius;
          return test;
        } else {
          return "1";
        }
      })
      .style("stroke", function(d) {
        if (d.id === lastClickedNode) {
          return "red";
        } else {
          return "purple";
        }
      })
      .attr("filter", "url(#dropshadowunanchored)")
      .style("fill", function(d) {
        return color(d.id);
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
        return displayAttr(d, "fontSize");
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
        return "pink";
      })
      .attr("width", function(d) {
        return d.bbox.width;
      })
      .attr("height", function(d) {
        return d.bbox.height;
      });
  };
};

export default Node;
