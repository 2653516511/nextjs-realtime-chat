const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 3500;

// custom middleware logger
// test: chorme: fetch('localhost:3500')
app.use(logger);

// cross origin resorce sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded data
// in other words, form data:
//   'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

// build-in middleware for json
app.use(express.json());

// middleware for cookie
app.use(cookieParser());

// serve static files
app.use("/", express.static(path.join(__dirname, "/public")));

app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/login", require("./routes/login"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

app.use(verifyJWT);
app.use("/employees", require("./routes/api/employees"));

app.all("*", (req, res) => {
  res.status(404);

  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
