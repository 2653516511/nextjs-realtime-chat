const express = require("express");
const app = express();

const path = require("path");

const PORT = process.env.PORT || 3500;

app.get("^/$|/index(.html)?", (req, res) => {
  // res.send("hello world");
  // res.sendFile('./views/index.html', {root: __dirname})
  res.sendFile(path.join(__dirname, 'views', 'index.html'))
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
