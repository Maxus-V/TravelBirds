// console.log('Preload script loaded successfully!')
const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  doAThing: () => {
    console.log('hi')
  }
})