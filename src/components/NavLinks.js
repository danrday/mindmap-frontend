const navLinks = [
  {
    link: "/",
    className: "icon ion-android-folder-open",
    navItemText: "Open"
  },{
    link: "/",
    className: "icon ion-android-archive",
    navItemText: "Save"
  },{
    link: "/",
    className: "icon ion-android-add-circle",
    navItemText: "Node"
  },
  {
    link: "/page2",
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
    link: "/sub1",
    className: "icon ion-android-settings",
    navItemText: "Settings"
  }
];

export default navLinks;
