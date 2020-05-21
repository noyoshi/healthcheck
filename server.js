// this is the server to run on your laptop etc that will recieve the updated data

const express = require("express");
const app = express();
const cors = require("cors");
const settings = require("./settings.js");
// TODO figure out a better port to use (weird ports don't work in Windows?)
const host = settings.host;
const port = settings.port;

app.use(express.json());

CURRENT_DATA = {};

// Should recieve updated data every 2 seconds or so
app.post("/receiver", cors(), function(req, res) {
  CURRENT_DATA = req.body;
  console.log(req.body);
  res.json({
    status: "success", 
    body: req.body
  });
});

app.get("/", cors(), function(req, res) {
  // Pass the data along to the frontend
  res.send(CURRENT_DATA);
});

app.listen(port, host, () => 
  console.log(`Listening on port ${port} on host ${host}`)
);
