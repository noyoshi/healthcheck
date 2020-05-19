// this is the server to run on your laptop etc that will recieve the updated data

const express = require("express");
const app = express();
const cors = require("cors");
const host = "0.0.0.0";
const port = 6000;

app.use(express.json());

CURRENT_DATA = {};

app.post("/receiver", cors(), function(req, res) {
  CURRENT_DATA = req.body;
  console.log(req.body);
  // res.send({status: "success"});
  res.json({
    status: "success", 
    body: req.body
  });
});

app.get("/", cors(), function(req, res) {
  res.send(CURRENT_DATA);
});

app.listen(port, host, () => 
  console.log(`Listening on port ${port} on host ${host}`)
);
