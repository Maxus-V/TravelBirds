# TravelBirds 🐦🐦🐦

### 介绍 📖

✨✨✨ TravelBirds，以 React、Electron 为基础，可持续扩展前端技术栈的一个数据可视化应用。

### 项目相关文档 📚

### 一、在线预览地址 👀

- Link：https://maxus-v.github.io

### 二、Git 仓库地址 ⭐ ⭐

- GitHub：https://github.com/Maxus-V/Geo-React-Electron

### 三、项目功能 🔨 🔨 🔨

- 🚀 采用最新技术找开发：React18、React-Router v6、React-Hooks、TypeScript、Webpack 5
- 🚀 整个项目还集成了 Electron、Echarts、Ant Design
- 🚀 使用 redux 做状态管理，集成 immer、react-redux、redux-persist 开发
- 🚀 使用 TypeScript 对 Axios 整个二次封装 （全局错误拦截、常用请求封装、全局请求 Loading、取消重复等）
- 🚀 使用 自定义高阶组件 进行路由权限拦截（403 页面）
- 🚀 基于Audio实现音乐单曲循环播放功能，用户可自行选择开启或关闭
- 🚀 支持 YouSheBiaoTiHei 和 MetroDF 等外接字体
- 🚀 实现 SVG 动画，i18n 国际化（部分），移动端适配

### 四、安装使用步骤 📑 📑 📑 📑

- **Clone：**

```text
git clone https://github.com/Maxus-V/Geo-React-Electron.git
```

- **Install：**

```text
npm install
cnpm install

# npm install 安装失败，请升级 nodejs 到 16 以上，或尝试使用以下命令：
npm install --registry=https://registry.npm.taobao.org
```

- **Run：**

```text
npm run start
npm run electron-start
```

- **Build：**

```text
# 打包文件
npm run build

# 生成文件
npm run pack
```

### 五、项目截图 🌈 🌈 🌈 🌈 🌈

#### 1、网页端：

![2-1](https://github.com/Maxus-V/Geo-React-Electron/blob/main/public/images/2-1.jpeg) 

![1-1](https://github.com/Maxus-V/Geo-React-Electron/blob/main/public/images/1-1.jpeg) 

![1-1](https://github.com/Maxus-V/Geo-React-Electron/blob/main/public/images/1-1.gif) 

#### 2、移动端：

| ![2-3](https://github.com/Maxus-V/Geo-React-Electron/blob/main/public/images/2-3.jpg)  | ![1-3](https://github.com/Maxus-V/Geo-React-Electron/blob/main/public/images/1-3.jpg) |  |  |
|:--------------------------------------------------------------------------:|:------------------------------------------------------------------------------:|:------------------------------------------------------------------------------:|:--------------------------------------------------------------------------:|
|                  |                                                                                |                                                                                |                                                                            |

#### 3、桌面端：

![2-2](https://github.com/Maxus-V/Geo-React-Electron/blob/main/public/images/2-2.jpeg) 

![1-2](https://github.com/Maxus-V/Geo-React-Electron/blob/main/public/images/1-2.jpeg) 

![1-2](https://github.com/Maxus-V/Geo-React-Electron/blob/main/public/images/1-2.gif) 

#### 4、性能优化：

![4-1](https://github.com/Maxus-V/Geo-React-Electron/blob/main/public/images/4-1.jpeg) 

![4-2](https://github.com/Maxus-V/Geo-React-Electron/blob/main/public/images/4-2.jpg) 

### 六、主要资源目录 🌲 🌲 🌲 🌲 🌲 🌲

```text
TravelBirds
├─ public                 # 静态资源文件（忽略打包）
├─ src
│  ├─ api                 # API 接口管理
│  ├─ assets              # 静态资源文件
│  ├─ components          # 全局公共组件
│  ├─ config              # 全局配置项
│  ├─ enums               # 项目枚举
│  ├─ hooks               # 复用 Hooks
│  ├─ language            # 国际化配置
│  ├─ pages               # 项目所有页面
│  ├─ redux               # 状态管理
│  ├─ routers             # 路由管理
│  ├─ styles              # 全局样式
│  ├─ utils               # 公用工具库
│  ├─ App.js              # 入口页面
│  └─ index.js            # 入口文件
├─ .gitignore             # git 提交忽略
├─ package-lock.json      # 依赖包包版本锁
├─ package.json           # 依赖包管理
├─ README.md              # README 介绍
└─ tsconfig.json          # typescript 全局配置
```

### 七、浏览器支持 ☁️ ☁️ ☁️ ☁️ ☁️ ☁️ ☁️

> 默认支持以下浏览器。更多浏览器可以查看 [Can I Use Es Module](https://caniuse.com/?search=ESModule)
>
> **💢 请不要使用 QQ 浏览器开发，QQ 浏览器 不识别 某些 ES6 以上语法**

| ![Edge](https://iamge-1259297738.cos.ap-chengdu.myqcloud.com/md/Edge.png) | ![Firefox](https://iamge-1259297738.cos.ap-chengdu.myqcloud.com/md/Firefox.png) | ![Chrome](https://iamge-1259297738.cos.ap-chengdu.myqcloud.com/md/Chrome.png) | ![Safari](https://iamge-1259297738.cos.ap-chengdu.myqcloud.com/md/Safari.png) |
| :-----------------------------------------------------------------------: | :-----------------------------------------------------------------------------: | :---------------------------------------------------------------------------: | :---------------------------------------------------------------------------: |
|                              last 2 versions                              |                                 last 2 versions                                 |                                last 2 versions                                |                                last 2 versions                                |
