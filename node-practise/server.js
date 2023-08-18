const http = require("http");
const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;

const EventEmitter = require("events");
const logEvents = require("./logEvents");
class Emitter extends EventEmitter {}

// initialize object
const myEmitter = new Emitter();

myEmitter.on("log", (msg, fileName) => logEvents(msg, fileName));

const PORT = process.env.PORT || 3500;

const serveFile = async (filePath, contentType, response) => {
  try {
    const data = await fsPromises.readFile(filePath, "utf8");
    response.writeHead(200, { "Content-Type": contentType });
    response.end(data);
  } catch (err) {
    console.log("-----serveFile", err);
    myEmitter.emit("log", `${err.name}: ${err.message}`, "errLog.txt");

    response.statusCode = 500;
    response.end();
  }
};

const server = http.createServer((req, res) => {
  console.log("----server created", req.url, req.method);
  myEmitter.emit("log", `${req.url}\t${req.method}`, "reqLog.txt");

  const extension = path.extname(req.url);

  let contentType;
  switch (extension) {
    case ".css":
      contentType = "text/css";
      break;
    case ".js":
      contentType = "text/javascript";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".jpg":
      contentType = "image/jpg";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".txt":
      contentType = "text/plain";
      break;
    default:
      contentType = "text/html";
      break;
  }

  let filePath =
    contentType === "text/html" && req.url === "/"
      ? path.join(__dirname, "views", "index.html")
      : contentType === "text/html" && req.url.slice(-1) === "/"
      ? path.join(__dirname, "views", req.url, "index.html")
      : contentType === "text/html"
      ? path.join(__dirname, "views", req.url)
      : path.join(__dirname, req.url);

  //   makes .html extension not required in the browser
  if (!extension && req.url.slice(-1) !== "/") filePath += ".html";

  const fileExists = fs.existsSync(filePath);

  if (fileExists) {
    // serve the file
    serveFile(filePath, contentType, res)
  } else {
    // 404
    // 301 redirect
    console.log("----else", path.parse(filePath));
    serveFile(filePath, contentType, res)

  }
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
