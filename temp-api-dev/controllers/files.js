const fs = require("fs");

module.exports.controller = function(app) {
  const getFile = function(req, res) {
    const filename = req.params.filename;

    if (!filename) {
      res.status(400).send({ error: "must include filename parameter" });
      throw "must include filename parameter";
    }

    let rawfile = fs.readFileSync(`saved/${filename}.json`);
    let file = JSON.parse(rawfile);

    res.send({ file });
  };
  app.get("/api/getfile/:filename", getFile);
  app.get("/:root/api/getfile/:filename", getFile);
};
