import React from "react";
import * as d3 from "d3";
import ReactDOM from "react-dom";
const color = d3.scaleOrdinal(d3.schemeCategory10);

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
              this.props.selectPage(3);
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
        return displayAttr(d, "radius");
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
