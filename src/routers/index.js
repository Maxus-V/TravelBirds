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
		path: "/dataScreen",
		element: lazyLoad(React.lazy(() => import("@/pages/DataScreen"))),
		meta: {
			requiresAuth: true,
			title: "随风飘飘游",
			key: "dataScreen"
		}
	},
	{
		path: "/threeDimension",
		element: lazyLoad(React.lazy(() => import("@/pages/ThreeDimension"))),
		meta: {
			requiresAuth: true,
			title: "三维模型",
			key: "threeDimension"
		}
	},
	{
		path: "/threeDimensionV2",
		element: lazyLoad(React.lazy(() => import("@/pages/ThreeDimensionV2"))),
		meta: {
			requiresAuth: false,
			title: "三维模型V2",
			key: "threeDimensionV2"
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
