const { ipcRenderer } = require('electron')

window.addEventListener('DOMContentLoaded', () => {
    console.log('hi')
  const xhr = new XMLHttpRequest()
  xhr.open('GET', 'https://jsonplaceholder.typicode.com/todos/1')
  xhr.onload = () => {
    ipcRenderer.sendToHost('data', xhr.responseText)
  };
  xhr.send()
})