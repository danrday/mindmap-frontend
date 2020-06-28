import React, { Component } from "react";

export default function SplitPane({ children, ...props }) {
  console.log("FUCK props", children);
  return (
    <div {...props} className="split-pane">
      {children[0]}
      <div className="separator" />
      {children[1]}
    </div>
  );
}

SplitPane.Top = function SplitPaneTop(props) {
  return <div {...props} className="split-pane-top" />;
};

SplitPane.Bottom = function SplitPaneBottom(props) {
  return <div {...props} className="split-pane-bottom" />;
};
