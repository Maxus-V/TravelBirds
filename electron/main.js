const { app, BrowserWindow, ipcMain, session, Menu, globalShortcut, Notification, autoUpdater } = require('electron')

const path = require('path')
const fs = require('fs')
const https = require('https') 
const { dialog } = require('electron')

const notifier = require('node-notifier')

let mainWindow


const template = [
    {
        label: 'File',
        submenu: [
          { label: 'New', accelerator: 'CmdOrCtrl+N', click: () => console.log('New File') },
          { label: 'Open', accelerator: 'CmdOrCtrl+O', click: () => console.log('Open File') },
          { type: 'separator' },
          { label: 'Quit', accelerator: 'CmdOrCtrl+Q', click: () => app.quit() }
        ]
      },
    {
    label: 'Edit',
    submenu: [
            { label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' },
            { label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
            { label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste' },
            { type: 'separator' },
            { label: 'Select All', accelerator: 'CmdOrCtrl+A', role: 'selectall' }
        ]
    }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

const createWindow = () => {
    globalShortcut.register('CmdOrCtrl+Shift+D', () => console.log('Debugging'));
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

    // mainWindow.loadFile('index.html')报错的解决方法
    mainWindow.loadFile(path.join(__dirname, 'index.html'))

    // mainWindow.webContents.on('did-finish-load', () => {
    //     session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    //         details.requestHeaders['Origin'] = 'https://example.com' // 绕过跨域限制
    //         callback({ cancel: false, requestHeaders: details.requestHeaders })
    //     })
    //     mainWindow.webContents.send('start-request') // 发送一个 start-request 消息给渲染进程，以触发网络请求
    // })

    mainWindow.webContents.on('did-finish-load', () => {
        const notification = new Notification({
            title: '通知',
            body: 'Hello, Electron!'
          })
        notification.show()
        // mainWindow.webContents.executeJavaScript(`
        // navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        //     .then(() => {
        //     console.log('已获得摄像头和麦克风权限')
        //     })
        //     .catch(() => {
        //     console.log('访问摄像头和麦克风权限被拒绝')
        //     })
        // `)
    })

    mainWindow.webContents.openDevTools({
        mode:'bottom'
    })


    // mainWindow.setSize(1024, 768)
    // mainWindow.setPosition(1000, 100)
    // mainWindow.setResizable(false)
    // mainWindow.setFullScreen(true)

    mainWindow.on('closed',  () => {
        mainWindow = null
    })
    
    mainWindow.on('minimize', () => {
        console.log('Window minimized')
    })
}

app.on('ready', () => {
    createWindow()

    //下载与更新
    // autoUpdater.setFeedURL({
    //     url: 'https://github.com/Maxus-V/maxus-v.github.io'
    // })
    // autoUpdater.autoDownload = false

    // autoUpdater.on('update-available', function() {
    //     dialog.showMessageBox(mainWindow, {
    //       type: 'info',
    //       title: 'Update Available',
    //       message: 'A new version of the app is available. Do you want to download it now?',
    //       buttons: ['Yes', 'No']
    //     }, function(response) {
    //       if (response === 0) {
    //         autoUpdater.downloadUpdate()
    //       }
    //     })
    // })

    // autoUpdater.on('update-downloaded', function() {
    //     dialog.showMessageBox(mainWindow, {
    //       type: 'info',
    //       title: 'Update Downloaded',
    //       message: 'The update has been downloaded. Do you want to install it now?',
    //       buttons: ['Yes', 'No']
    //     }, function(response) {
    //       if (response === 0) {
    //         autoUpdater.quitAndInstall()
    //       }
    //     })
    //   })

    //   autoUpdater.checkForUpdates()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

app.on('will-quit', () => {
    globalShortcut.unregisterAll() // 在应用程序退出时，注销所有快捷键
})

app.whenReady().then(() => {
    app.setAppUserModelId(process.execPath)
})

ipcMain.on('message', (event, arg) => {
  console.log(arg)
  event.reply('message-reply', '收到消息')
})

ipcMain.on('read-file', (event, filePath) => {
    fs.writeFile(filePath, 'Hello, world!', (err) => {
        if (err) {
          console.error(err)
          return
        }
        console.log('File written successfully')
      })
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) throw err;
      event.reply('file-data', data);
    })
})

ipcMain.on('fetch-data', (event, url) => {
    createWindow()
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        event.reply('data', data);
      });
    }).on('error', (err) => {
      console.log('Error: ' + err.message)
    })
  })

  ipcMain.on('notify', () => {
    const notification = new Notification({
      title: '有通知',
      body: 'Hello, Electron!'
    })
    notification.show()
    notifier.notify({
        title: 'Notification Title',
        message: 'Notification Body',
    })
  })