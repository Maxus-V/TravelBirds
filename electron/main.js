// app 模块，它控制应用程序的事件生命周期。
// 事件调用app.on('eventName', callback)，方法调用app.functionName(arg)
// BrowserWindow 模块，它创建和管理应用程序 窗口。
// new BrowserWindow([options]) 事件和方法调用同app
const {app, BrowserWindow, nativeImage} = require('electron');

// const url = require('url');
// const path = require('path');

// 添加一个createWindow()方法来将index.html加载进一个新的BrowserWindow实例。
const createWindow = () => {
  let win = new BrowserWindow({
    width: 800,// 窗口宽度
    height: 600, // 窗口高度
    title: '随风飘飘游', // 窗口标题,如果由loadURL()加载的HTML文件中含有标签<title>，该属性可忽略
    // "string" || nativeImage.createFromPath('src/image/icons/256x256.ico')从位于 path 的文件创建新的 NativeImage 实例
    icon: nativeImage.createFromPath('src/public/favicon.ico'),
    webPreferences: { // 网页功能设置
      nodeIntegration: true, // 是否启用node集成 渲染进程的内容有访问node的能力
      webviewTag: true, // 是否使用<webview>标签 在一个独立的 frame 和进程里显示外部 web 内容
      webSecurity: false, // 禁用同源策略
      nodeIntegrationInSubFrames: true // 是否允许在子页面(iframe)或子窗口(child window)中集成Node.js
    }
  });
  // 加载应用 --开发阶段  需要运行 npm run start
  win.loadURL('http://localhost:3000/');

  // __dirname 字符串指向当前正在执行脚本的路径
  // path.join API 将多个路径联结在一起，创建一个跨平台的路径字符串。
  // win.loadURL(url.format({
  //   pathname: path.join(__dirname, './build/index.html'),
  //   protocol: 'file:',
  //   slashes: true
  // }));

  // 解决应用启动白屏问题
  win.on('ready-to-show', () => {
    win.show();
    win.focus();
  });

  // 当窗口关闭时发出。在你收到这个事件后，你应该删除对窗口的引用，并避免再使用它。
  win.on('closed', () => {
    win = null;
  });
};

// 调用createWindow()函数来打开您的窗口。
// 在 Electron 中，只有在 app 模块的 ready 事件被激发后才能创建浏览器窗口。
// 您可以通过使用 app.whenReady() API来监听此事件。
// 在whenReady()成功后调用createWindow()。
app.whenReady().then(() => {
  createWindow();

  // 当 Linux 和 Windows 应用在没有窗口打开时退出了，macOS 应用通常在没有打开任何窗口的情况下也继续运行，
  // 并且在没有窗口可用的情况下激活应用时会打开新的窗口。
  // 实现这个特性，则监听app模块的 activate 事件。如果没有任何浏览器窗口是打开的，则调用 createWindow() 方法。
  // 因为窗口无法在 ready 事件前创建，你应当在你的应用初始化后仅监听 activate 事件，在 whenReady() 回调中附上您的事件监听器来完成这个操作
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 关闭所有窗口时退出应用
// 在 window 和 Linux 上，关闭所有窗口通常会完全退出一个应用程序。
app.on('window-all-closed', () => {
  // macOS(darwin)
  if (process.platform !== 'darwin') app.quit();
});