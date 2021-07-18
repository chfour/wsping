const WebSocket = require('ws');

const argv = process.argv.slice(2);

function printUsage() {
  console.log(`usage: server.js [(PORT) | -h | --help]}
  PORT: port to listen on, default: 8081
  -h, --help: display this message`)
}

if(argv[0] === '-h' || argv[0] === '--help'){
  printUsage();
  process.exit(0);
}

const port = parseInt(argv[0]) || 8081;

const wsServer = new WebSocket.Server({ port: port });

wsServer.on('listening', () => console.log(`# listening on :${port}`));

wsServer.on('connection', (ws, req) => {
  console.log(`* connection ${req.socket.remoteAddress}`);
  ws.on('message', message => {
    if (ws.readyState === WebSocket.OPEN) ws.send(message);
    console.debug(`- ${req.socket.remoteAddress} : '${message}'`);
  });
  ws.on('close', (code, reason) => {
    console.log(`* connection ${req.socket.remoteAddress} closed w/ code ${code}, reason: ${reason || 'none'}`);
  })
});
