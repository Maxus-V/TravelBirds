import React from "react"
import { Navigate, useRoutes } from "react-router-dom"
import Login from "@/pages/Login"
import lazyLoad from "@/routers/utils/lazyLoad"

import Error from './modules/error'

// * 处理路由
const routerArray = []
routerArray.push(...Error)

export const rootRouter = [
	{
		path: "/",
		element: <Navigate to="/login" />
	},
	{
		path: "/login",
		element: <Login />,
		meta: {
			requiresAuth: false,
			title: "登录页",
			key: "login"
		}
	},
	{
		path: "/datascreen/index",
		element: lazyLoad(React.lazy(() => import("@/pages/DataScreen/index"))),
		meta: {
			requiresAuth: true,
			title: "随风飘飘游",
			key: "datascreen"
		}
	},
	...routerArray,
	{
		path: "*",
		element: <Navigate to="/404" />
	}
]

const Router = () => {
	const routes = useRoutes(rootRouter)
	return routes
}

export default Router
