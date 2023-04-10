import { combineReducers, compose, legacy_createStore as createStore } from "redux"

import storage from "redux-persist/lib/storage"
import { persistReducer, persistStore } from "redux-persist"

import { applyMiddleware } from "redux"
import reduxThunk from "redux-thunk"
import reduxPromise from "redux-promise"

import global from "./modules/global/reducer"
import auth from "./modules/auth/reducer"

// 创建reducer(拆分reducer)
const reducer = combineReducers({
	global,
	auth,
})

// redux 持久化配置
const persistConfig = {
	key: "redux-state",
	storage: storage, //指定 localStorage 存储数据
}
//新的reducer，用于创建 Redux store
const persistReducerConfig = persistReducer(persistConfig, reducer)

// 开启 redux-devtools（调试 Redux 应用程序的浏览器扩展程序）
const composeEnhancers = compose

// 使用 redux 中间件
// reduxThunk 将异步操作和 Redux 的 action 创建函数结合起来，只能处理成功的情况
// redux-promise 将异步操作和 Redux 的 action 创建函数结合起来，可以处理异步操作的成功和失败
const middleWares = applyMiddleware(reduxThunk, reduxPromise)

// 创建持久化 store ，将其与 Redux store 绑定在一起，以便在页面刷新或关闭后仍能保留数据
const store = createStore(persistReducerConfig, composeEnhancers(middleWares))

// 创建持久化 store
const persistor = persistStore(store)

export { store, persistor }