const navLinks = [
  {
    link: "/",
    className: "icon ion-ios-home-outline",
    navItemText: "Dashboard"
  },
  {
    link: "/page2",
    className: "icon ion-ios-photos-outline",
    navItemText: "D3 tests",
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
    className: "icon ion-ios-email-outline",
    navItemText: "Other Page"
  }
];

export default navLinks;
