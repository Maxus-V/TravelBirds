import { useEffect, useState, useRef } from "react"
import moment from "moment"

/**
 * @description 获取本地时间
 */
export const useTime = () => {
	const timer = useRef(null)
	const [time, setTime] = useState(moment().format("YYYY年MM月DD日 dddd HH:mm:ss"))
	useEffect(() => {
		timer.current = setInterval(() => {
			setTime(moment().format("YYYY年MM月DD日 dddd HH:mm:ss"))
		}, 1000)
		return () => {
			clearInterval(timer.current)
		}
	}, [time])

	return {
		time
	}
}