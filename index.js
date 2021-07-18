const http = require("http");

const hostname = "0.0.0.0";
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end(`Hello, World!\nPath: ${req.url}`);

  console.log(`${req.method} ${req.url} HTTP/${req.httpVersion} - ${res.statusCode} ${res.statusMessage}`);
});

server.listen(port, hostname, () => {
  console.log(`running @ ${hostname}:${port}\n* http://127.0.0.1:${port}`);
});
