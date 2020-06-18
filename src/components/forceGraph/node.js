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
  shouldComponentUpdate(nextProps) {
    // if (this.props.data.id === "2fc4ce12-b49c-4590-a6dc-afc361320e85") {
    if (nextProps.data != this.props.data) {
      console.log("WQUA??", { next: nextProps.data, curr: this.props.data });
      console.log("WQUA??", nextProps.data === this.props.data);
      return true;
    } else {
      return false;
    }
    //   return false;
    // } else {
    //   return true;
    // }
  }
  componentDidUpdate() {
    if (this.props.data.id === "af0f8b50-dffd-47cf-a936-1b2627628e53") {
      console.log("node update:", this.props.data);
    }
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
      .style("stroke-width", function(d) {
        return "1";
      })
      .style("stroke", function(d) {
        if (d.fx) {
          return "black";
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
