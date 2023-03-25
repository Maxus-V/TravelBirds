import { useTime } from "@/hooks/useTime"
const DataHeaderTime = () => {
	const { time } = useTime()

	return <span className="header-time">现在：{time}</span>
}

export default DataHeaderTime