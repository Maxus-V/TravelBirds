
const { ipcRenderer } = require('electron')

const sendMessageButton = document.getElementById('send-message')
const messageDiv = document.getElementById('message')

sendMessageButton.addEventListener('click', () => {
  ipcRenderer.send('message', 'Hello from renderer process')
})

ipcRenderer.on('message-reply', (event, arg) => {
  messageDiv.innerHTML = arg
})