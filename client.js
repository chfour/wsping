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
  if(!clientSocket || clientSocket.readyState !== WebSocket.OPEN) {
    clearInterval(messageTimer);
    return;
  }
  const messageSendTimestamp = performance.now();
  clientSocket.send(messagePrefix + hist.length.toString());
  hist.push({latency: null, start: messageSendTimestamp});
}

function connect() {
  hist = [];

  if(clientSocket && clientSocket.readyState === WebSocket.OPEN) clientSocket.close();

  clientSocket = new WebSocket(document.getElementById('host').value);

  clientSocket.onerror = e => {
    console.error(e);
    clientSocket.onclose = () => {};
    setStatus('error');
    clearInterval(messageTimer);
  }

  clientSocket.onmessage = m => {
    //console.debug(m);
    if (typeof m.data !== 'string') return;
    if (!(m.data.startsWith(messagePrefix))) return;
    const index = parseInt(m.data.slice(messagePrefix.length));
    if (Number.isNaN(index)) return;

    const latency = performance.now() - hist[index].start;
    console.debug('recieved index', index, latency);
    hist[index].latency = latency;
    draw();
  }

  clientSocket.onclose = e => {
    console.log(e);
    setStatus(`closed w/ code ${e.code}`);
    clearInterval(messageTimer);
  }

  clientSocket.onopen = e => {
    console.log(e);
    setStatus('connected');
    messageTimer = setInterval(sendMessage, messageInterval);
  }
}

function map(value, x1, y1, x2, y2) { return (value - x1) * (y2 - x2) / (y1 - x1) + x2; }

function draw() {
  drawCanvas.clearRect(0, 0, drawCanvas.canvas.width, drawCanvas.canvas.height);
  drawCanvas.fillStyle = "#FFFFFF";
  const viewRange = hist.slice(drawCanvas.canvas.width / -2);
  viewRange.reverse();
  //console.debug(viewRange);
  const maxInView = Math.max.apply(this, viewRange.map(v => v.latency === null ? 0 : v.latency));
  viewRange.forEach((v, i) => {
    if (v.latency === null) return;
    v = map(v.latency, 0, maxInView, drawCanvas.canvas.height, 0);
    drawCanvas.fillRect(i * 2, v, 2, drawCanvas.canvas.height);
  })
}

document.getElementById('connect').addEventListener('click', connect);

setStatus('none');

for(let i = 0; i < drawCanvas.canvas.width / 2; i++) { hist.push({latency: i}); }
draw();
