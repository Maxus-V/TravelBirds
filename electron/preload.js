// console.log('Preload script loaded successfully!')

window.addEventListener('DOMContentLoaded', () => {
  for (const dependency of ['chrome', 'node', 'electron']) {
    // console.log(`${dependency}-version`, process.versions[dependency])
  }
})

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  doAThing: () => {
    console.log('hi')
  },
  ping: () => ipcRenderer.invoke('ping'),
})