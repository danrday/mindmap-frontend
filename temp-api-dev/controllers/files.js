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

  const postFile = function(req, res) {
    const filename = req.params.filename;

    const e = req.body;

    e.nodes.forEach(obj => {
      obj["vx"] = 0;
      obj["vy"] = 0;
      // delete obj["vx"];
      // delete obj["x"];
      // delete obj["vy"];
      // delete obj["y"];
      // delete obj["index"];
    });

    e.links.forEach(obj => {
      obj.source = obj.source.index;
      obj.target = obj.target.index;
      delete obj.source["index"];
      delete obj.target["index"];

      // delete obj.source["y"];
      // delete obj.source["vx"];
      // delete obj.source["vy"];
      // delete obj.target["x"];
      // delete obj.target["y"];
      // delete obj.target["vx"];
      // delete obj.target["vy"];
    });

    const file = JSON.stringify(e);

    console.log("req body", req);

    if (!filename) {
      res.status(400).send({ error: "must include filename parameter" });
      throw "must include filename parameter";
    }

    let rawfile = fs.writeFileSync(`saved/${filename}.json`, file);
    // return { statusCode: 200, data: "saved" };
    res.status(200).send("saved");
  };
  app.post("/api/savefile/:filename", postFile);
  app.post("/:root/api/savefile/:filename", postFile);
};
