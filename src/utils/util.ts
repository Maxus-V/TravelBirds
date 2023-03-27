import { RouteObject } from "@/routers/interface"

/**
 * @description 生成随机数
 * @param {Number} min 最小值
 * @param {Number} max 最大值
 * @return number
 */
export function randomNum(min: number, max: number): number {
	let num = Math.floor(Math.random() * (min - max) + max)
	return num
}

/**
 * @description 获取浏览器默认语言 
 * @return string
 */
export const getBrowserLang = () => {
	let browserLang = navigator.language ? navigator.language : "CN"
	let defaultBrowserLang = ""
	if (browserLang.toLowerCase() === "cn" || browserLang.toLowerCase() === "zh" || browserLang.toLowerCase() === "zh-cn") {
		defaultBrowserLang = "zh"
	} else {
		defaultBrowserLang = "en"
	}
	return defaultBrowserLang;
}

/**
 * @description 递归查询对应的路由
 * @param {String} path 当前访问地址
 * @param {Array} routes 路由列表
 * @returns array
 */
export const searchRoute = (path: string, routes: RouteObject[] = []): RouteObject => {
	let result: RouteObject = {}
	for (let item of routes) {
		if (item.path === path) return item 
		if (item.children) {
			const res = searchRoute(path, item.children)
			if (Object.keys(res).length) result = res
		}
	}
	return result
}