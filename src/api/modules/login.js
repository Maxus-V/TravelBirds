
import { PORT1 } from "@/api/config/servicePort"
import qs from "qs"

import http from "@/api"

/**
 * @name 登录模块
 */
// * 用户登录接口
export const loginApi = (params) => {
	// return http.post(PORT1 + `/login`)
	// return http.post(PORT1 + `/login`, {}, { params }) // post 请求携带 query 参数  ==>  ?username=admin&password=123456
	return http.post(PORT1 + `/login`, qs.stringify(params)) // post 请求携带 表单 参数  ==>  application/x-www-form-urlencoded
	// return http.post(PORT1 + `/login`, params, { headers: { noLoading: true } }) // 控制当前请求不显示 loading
}

// * 获取按钮权限
export const getAuthorButtons = () => {
	return http.get(PORT1 + `/auth/buttons`)
}

// * 获取菜单列表
export const getMenuList = () => {
	return http.get(PORT1 + `/menu/list`)
}