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
	storage: storage
}
const persistReducerConfig = persistReducer(persistConfig, reducer)

// 开启 redux-devtools
const composeEnhancers = compose

// 使用 redux 中间件
const middleWares = applyMiddleware(reduxThunk, reduxPromise)

// 创建 store
const store = createStore(persistReducerConfig, composeEnhancers(middleWares))

// 创建持久化 store
const persistor = persistStore(store)

export { store, persistor }