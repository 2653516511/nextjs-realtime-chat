const express = require("express");
const app = express();

const path = require("path");

const PORT = process.env.PORT || 3500;

app.get("^/$|/index(.html)?", (req, res) => {
  // res.send("hello world");
  // res.sendFile('./views/index.html', {root: __dirname})
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get(
  "/hello(.html)?",
  (req, res, next) => {
    console.log("attampted to load hello.html");
    next();
  },
  (req, res) => {
    res.send("hello world");
  }
);

const one = (req, res, next) => {
  console.log("one");
  next();
};
const two = (req, res, next) => {
  console.log("two");
  next();
};
const three = (req, res) => {
  console.log("three");
  res.send("finished");
};
app.get("/chain(.html)?", [one, two, three]);

app.get("/*", (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
