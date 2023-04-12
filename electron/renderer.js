
const { ipcRenderer } = require('electron')
const path = require('path')

const sendMessageButton = document.getElementById('send-message')
const messageDiv = document.getElementById('message')

const readFileButton = document.getElementById('read-file')
const sendRequestButton = document.getElementById('send-request')

sendMessageButton.addEventListener('click', () => {
  ipcRenderer.send('message', 'Hello from renderer process')
})

readFileButton.addEventListener('click', () => {
  ipcRenderer.send('read-file', path.join(__dirname, '233.txt'))
  ipcRenderer.send('notify')
})

sendRequestButton.addEventListener('click', () => {
  ipcRenderer.send('fetch-data', 'https://jsonplaceholder.typicode.com/todos/1')
})

ipcRenderer.on('message-reply', (event, arg) => {
  messageDiv.innerHTML = arg
})

ipcRenderer.on('file-data', (event, data) => {
  console.log(data)
})

ipcRenderer.on('data', (event, data) => {
  console.log(data)
})

// const webview = document.getElementById('webview');
// webview.addEventListener('ipc-message', (event) => {
//   if (event.channel === 'data') {
//     console.log(event.args[0], '666');
//   }
// });