import { Spin } from "antd"
import "./Loading.less"

const Loading = () => {
	return <Spin tip={"Loading"} size="large" className="request-loading" />
}

export default Loading