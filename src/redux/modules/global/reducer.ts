import produce from "immer"
import * as types from "@/redux/mutation-types"

import { AnyAction } from "redux"
import { GlobalState } from "@/redux/interface"

const globalState: GlobalState = {
	token: "",
	userInfo: "",
	assemblySize: "middle",
	language: "zh",
	themeConfig: {
		// 默认 primary 主题颜色
		primary: "#1890ff",
		// 深色模式
		isDark: false,
		// 色弱模式(weak) || 灰色模式(gray)
		weakOrGray: "",
		// 面包屑导航
		breadcrumb: true,
		// 标签页
		tabs: true,
		// 页脚
		footer: true
	}
}

// global reducer
const global = (state: GlobalState = globalState, action: AnyAction) =>
	// 创建一个新的状态对象，然后返回这个新的状态对象
	// 自动创建一个新的对象或数组，并将更新应用到正确的位置上，而不必手动编写深层次的更新逻辑
	produce(state, draftState => {
		switch (action.type) {
			case types.SET_TOKEN:
				draftState.token = action.token
				break
			case types.SET_ASSEMBLY_SIZE:
				draftState.assemblySize = action.assemblySize
				break
			case types.SET_LANGUAGE:
				draftState.language = action.language
				break
			case types.SET_THEME_CONFIG:
				draftState.themeConfig = action.themeConfig
				break
			default:
				return draftState
		}
	})

export default global
