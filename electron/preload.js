const { contextBridge, ipcRenderer, shell } = require('electron');
const remote = require('@electron/remote/main')

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer,
  remote,
  shell,
})