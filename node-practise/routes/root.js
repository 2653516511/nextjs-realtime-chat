const express = require("express");
const router = express.Router();
const path = require("path");

router.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});
router.get("/old-page(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "new-page.html"));
});

// router.get(
//   "/hello(.html)?",
//   (req, res, next) => {
//     console.log("attampted to load hello.html");
//     next();
//   },
//   (req, res) => {
//     res.send("hello world");
//   }
// );

module.exports = router;
