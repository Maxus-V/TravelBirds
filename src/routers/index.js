import { Navigate, useRoutes } from "react-router-dom"
import Login from "@/pages/Login"

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
