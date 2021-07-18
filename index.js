const http = require("http");
const statik = require("node-static");

const port = 3000;

const staticFiles = new statik.Server("./static/");

const server = http.createServer((req, res) => {
  req.addListener("end", () => {
    staticFiles.serve(req, res);
    console.log(`${req.method} ${req.url} HTTP/${req.httpVersion} - ${res.statusCode}`);
  }).resume();
});

server.listen(port, "0.0.0.0", () => {
  console.log(`running @ 0.0.0.0:${port}\n* http://127.0.0.1:${port}`);
});
