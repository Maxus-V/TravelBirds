import React from "react"
import lazyLoad from "@/routers/utils/lazyLoad"

// 错误页面模块
const errorRouter = [
	{
		path: "/404",
		element: lazyLoad(React.lazy(() => import("@/components/ErrorMessage/404"))),
		meta: {
			requiresAuth: false,
			title: "404页面",
			key: "404"
		}
	},
]

export default errorRouter