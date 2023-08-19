const { logEvents } = require("./logEvents");

const errorHandler = (err, req, res) => {
  logEvents(`${err.message}\t${err.url}`, "logName");
};

module.exports = errorHandler;
