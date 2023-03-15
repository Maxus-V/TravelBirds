import { useTime } from "@/hooks/useTime"
const DataHeaderTime = () => {
	const { time } = useTime()

	return <span className="header-time">当前时间：{time}</span>
};

export default DataHeaderTime