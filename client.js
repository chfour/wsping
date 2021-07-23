const messagePrefix = 'wp';
const messageInterval = 25;
let messageTimer = null;

/** @type {WebSocket} */
let clientSocket;

let hist = [];

/** @type {CanvasRenderingContext2D} */
const drawCanvas = document.querySelector('canvas#drawwindow').getContext('2d');

function setStatus(text) { document.getElementById('status').innerText = 'status: '+ text; }

function sendMessage() {
  const messageSendTimestamp = performance.now();
  if(clientSocket && clientSocket.readyState === WebSocket.OPEN){
    clientSocket.send(messagePrefix + hist.length.toString());
  }
  
  hist.push({latency: null, start: messageSendTimestamp, end: null});
  console.debug('sent index', hist.length - 1);

  draw();
}

const infoBox = document.getElementById('info');

function afterRecieve(lastRecieved, index) {
  infoBox.innerText = `last: ${(lastRecieved.latency * 1000).toFixed(1).padStart(7)}ms`;
}

function connect() {
  if(clientSocket && clientSocket.readyState === WebSocket.OPEN) clientSocket.close();

  clientSocket = new WebSocket(document.getElementById('host').value);

  clientSocket.onerror = e => {
    console.error(e);
    clientSocket.onclose = () => {};
    setStatus('error');
    clearInterval(messageTimer);
    messageTimer = null;
  }

  clientSocket.onmessage = m => {
    //console.debug(m);
    if (typeof m.data !== 'string') return;
    if (!(m.data.startsWith(messagePrefix))) return;
    const index = parseInt(m.data.slice(messagePrefix.length));
    if (Number.isNaN(index)) return;
    const messageEnd = performance.now();

    hist[index].end = messageEnd;
    const latency = (messageEnd - hist[index].start);
    hist[index].latency = latency;
    console.debug('recieved index', index, latency);

    afterRecieve(hist[index], index);
  }

  clientSocket.onclose = e => {
    console.log(e);
    setStatus(`closed w/ code ${e.code}`);
    //clearInterval(messageTimer);
  }

  clientSocket.onopen = e => {
    console.log(e);
    setStatus('connected');
    if (messageTimer === null) messageTimer = setInterval(sendMessage, messageInterval);
  }
}

function map(value, x1, y1, x2, y2) { return (value - x1) * (y2 - x2) / (y1 - x1) + x2; }

function draw() {
  drawCanvas.clearRect(0, 0, drawCanvas.canvas.width, drawCanvas.canvas.height);
  const viewRange = hist.slice(drawCanvas.canvas.width / -2);
  viewRange.reverse();
  //console.debug(viewRange);
  const maxInView = Math.max.apply(this, viewRange.map(p => p.latency === null ? 0 : p.latency));
  viewRange.forEach((p, i) => {
    let latency = 0;
    if (p.latency === null) {
      drawCanvas.fillStyle = "#FF0000";
      latency = performance.now() - p.start;
    } else {
      drawCanvas.fillStyle = "#FFFFFF";
      latency = p.latency;
    }
    p = map(latency, 0, maxInView, drawCanvas.canvas.height, 0);
    drawCanvas.fillRect(i * 2, p, 2, drawCanvas.canvas.height);
  })
}

document.getElementById('connect').addEventListener('click', () => {
  hist = [];
  connect();
});

for(let i = 0; i < drawCanvas.canvas.width / 2; i++) { hist.push({latency: i}); }
draw();

setStatus('none');
infoBox.innerText = 'last: none';
