import * as echarts from "echarts"
import { useEffect, useRef } from "react"
/**
 * @description 使用Echarts
 * @param {Element} data 数据 
 * @param {Object} options 绘制Echarts的参数(必传)
 * @return chart
 * */
export const useEchart = (options, data) => {
	const myChart = useRef()
	const echartsRef = useRef(null)

	const echartsResize = () => {
		echartsRef && myChart?.current?.resize()
	};

	useEffect(() => {
		if (data?.length !== 0) {
			myChart?.current?.setOption(options)
		}
	}, [data])

	useEffect(() => {
		if (echartsRef?.current) {
			myChart.current = echarts.init(echartsRef.current)
		}
		myChart?.current?.setOption(options)
		window.addEventListener("resize", echartsResize, false)
		return () => {
			window.removeEventListener("resize", echartsResize)
			myChart?.current?.dispose()
		}
	}, [])

	return [echartsRef]
};
