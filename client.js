function setStatus(text) { document.getElementById('status').innerText = 'status: '+ text; }

window.onload = () => {
  setStatus('none');
}
