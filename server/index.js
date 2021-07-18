const WebSocket = require('ws');

const port = 8081;

const wsServer = new WebSocket.Server({ port: port });

wsServer.on('connection', (ws, req) => {
  console.log(`* connection from ${req.socket.remoteAddress}`);
  ws.on('message', message => {
    if (ws.readyState === WebSocket.OPEN) ws.send(message);
    console.debug(`- ${ws._socket.remoteAddress} : '${message}'`);
  });
});
