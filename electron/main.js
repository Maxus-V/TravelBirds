const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

let mainWindow

function createWindow () {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
        //   preload: path.join(__dirname, 'preload.js'),
        webSecurity: false, // Electron 将遵循 Chromium 的同源策略，禁止跨域访问
        nodeIntegration: true, // 是否在渲染进程中启用 Node.js 集成。如果启用，渲染进程将可以访问 Node.js 模块
        enableRemoteModule: false, // 是否启用远程模块。如果启用，渲染进程将可以使用 `require('electron').remote` 来访问主进程中的模块。这个选项默认是禁用的，因为它可能会导致安全问题
        contextIsolation: false, // 是否启用上下文隔离。如果启用，渲染进程将在一个沙箱环境中运行，不能直接访问 Node.js 模块和 Electron 模块。这个选项默认是禁用的，但是在安全性要求较高的情况下，可以启用它
        }
    })

    mainWindow.webContents.openDevTools({
        mode:'bottom'
    })

    // mainWindow.loadFile('index.html')报错的解决方法
    mainWindow.loadFile(path.join(__dirname, 'index.html'))

    // mainWindow.setSize(1024, 768)
    // mainWindow.setPosition(1000, 100)
    // mainWindow.setResizable(false)
    // mainWindow.setFullScreen(true)

    mainWindow.on('closed', function () {
        mainWindow = null
    })
    
    mainWindow.on('minimize', () => {
        console.log('Window minimized')
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('message', (event, arg) => {
  console.log(arg)
  event.reply('message-reply', '收到消息')
})