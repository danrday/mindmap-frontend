import React from "react";
import Node from "./pages/node";
import Categories from "./pages/categories";
import GlobalSettings from "./pages/global";
import RichText from "./pages/richText";

const navLinks = [
  {
    link: "/open",
    className: "icon ion-android-folder-open",
    navItemText: "",
    component: props => {
      const customProps = props;
      return <div {...customProps} />;
    }
  },
  {
    link: "/save",
    className: "icon ion-disc",
    navItemText: "",
    component: props => {
      const customProps = props;
      return <div {...customProps} />;
    }
  },
  // {
  //   link: "/save",
  //   className: "icon ion-android-archive",
  //   navItemText: "",
  //   component: props => {
  //     const customProps = props;
  //     return <div {...customProps} />;
  //   }
  // },
  {
    link: "/node",
    className: "icon ion-android-add-circle",
    altClassName: "icon ion-android-create",
    navItemText: "",
    altNavItemText: "",
    component: props => {
      const customProps = props;
      return <Node {...customProps} />;
    }
  },
  // {
  //   link: "/categories",
  //   className: "icon ion-ios-albums-outline",
  //   navItemText: "",
  //   component: props => {
  //     const customProps = props;
  //     return <Categories {...customProps} />;
  //   },
  //   subItems: [
  //     {
  //       link: "/test/force1",
  //       className: "icon ion-ios-home-outline",
  //       navItemText: "Force 1"
  //     },
  //     {
  //       link: "/test/force2",
  //       className: "icon ion-ios-home-outline",
  //       navItemText: "Force 2"
  //     },
  //     {
  //       link: "/test/heirarchy",
  //       className: "icon ion-ios-home-outline",
  //       navItemText: "Hierarchy"
  //     }
  //   ]
  // },
  {
    link: "/richText",
    className: "icon ion-ios-book-outline",
    navItemText: "",
    component: props => {
      const customProps = props;
      return <RichText {...customProps} />;
    }
  },
  {
    link: "/settings",
    className: "icon ion-android-globe",
    navItemText: "",
    component: props => {
      const customProps = props;
      return <GlobalSettings {...customProps} />;
    }
  },
  {
    link: "/share",
    className: "icon ion-android-share-alt",
    navItemText: "",
    component: props => {
      const customProps = props;
      return <div {...customProps} />;
    }
  }
  // {
  //   link: "/settings",
  //   className: "icon ion-android-settings",
  //   navItemText: "Settings"
  // }
];

export default navLinks;
