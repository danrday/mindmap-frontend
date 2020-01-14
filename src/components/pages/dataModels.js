const data = {
  nodes: [
    {
      name: "Bluebell Pineda (Nurse)",
      personId: 3456345,
      role: "Staff",
      details: {
        roleType: {
          name: "Nurse",
          guid: 349304320
        },
        assignments: {
          locations: [34346, 34645363, 345645],
          patients: [456345, 3456346],
          teams: []
        }
      }
    },
    {
      name: "Alexa Duke",
      personId: 354665,
      role: "Patient",
      details: {
        name: "Inpatient",
        locationId: 34346,
        careTeam: [34225, 432543, 345254]
      }
    }
  ],
  links: [{ source: 0, target: 1 }]
};

export default data;
