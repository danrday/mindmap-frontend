import React from "react";

import Node from './pages/node'


const navLinks = [
  {
    link: "/open",
    className: "icon ion-android-folder-open",
    navItemText: "Open",
    component: props => {
      const customProps = props
      return () => <div {...customProps} />
    },
  },{
    link: "/save",
    className: "icon ion-android-archive",
    navItemText: "Save",
    component: props => {
      const customProps = props
      return () => <div {...customProps} />
    },
  },{
    link: "/node",
    className: "icon ion-android-add-circle",
    altClassName: "icon ion-aperture",
    navItemText: "Add Node",
    altNavItemText: "Edit Node",
    component: props => {
      const customProps = props
      return () => <Node {...customProps} />
    },
  },
  {
    link: "/categories",
    className: "icon ion-ios-albums-outline",
    navItemText: "Categories",
    subItems: [
      {
        link: "/test/force1",
        className: "icon ion-ios-home-outline",
        navItemText: "Force 1"
      },
      {
        link: "/test/force2",
        className: "icon ion-ios-home-outline",
        navItemText: "Force 2"
      },
      {
        link: "/test/heirarchy",
        className: "icon ion-ios-home-outline",
        navItemText: "Hierarchy"
      }
    ]
  },
  {
    link: "/settings",
    className: "icon ion-android-globe",
    navItemText: "Settings"
  },
  // {
  //   link: "/settings",
  //   className: "icon ion-android-settings",
  //   navItemText: "Settings"
  // }
];

export default navLinks;
