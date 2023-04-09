import { useState, useCallback, useEffect } from "react"
import { useEchart } from "@/hooks/useEchart"

import "./MaleFemaleRatioChart.less"

import man from "../../images/man.webp"
import woman from "../../images/woman.webp"

const MaleFemaleRatioChart = (props) => {
	const { testData } = props

	const [data, setData] = useState({
		man: 0.6,
		woman: 0.4
	})

	const [tempData, setTempData] = useState(data)

	const options = useCallback((data: any) => {
		return {
			xAxis: {
				type: "value",
				show: false
			},
			grid: {
				left: 0,
				top: "30px",
				bottom: 0,
				right: 0
			},
			yAxis: [
				{
					type: "category",
					position: "left",
					data: ["男生"],
					axisTick: {
						show: false
					},
					axisLine: {
						show: false
					},
					axisLabel: {
						show: false
					}
				},
				{
					type: "category",
					position: "right",
					data: ["女士"],
					axisTick: {
						show: false
					},
					axisLine: {
						show: false
					},
					axisLabel: {
						show: false,
						padding: [0, 0, 40, -60],
						fontSize: 12,
						lineHeight: 60,
						color: "rgba(255, 255, 255, 0.9)",
						formatter: "{value}" + data.woman * 100 + "%",
						rich: {
							a: {
								color: "transparent",
								lineHeight: 30,
								fontFamily: "digital",
								fontSize: 12
							}
						}
					}
				}
			],
			series: [
				{
					type: "bar",
					barWidth: 20,
					data: [data.man],
					z: 20,
					itemStyle: {
						borderRadius: 10,
						color: "#007AFE"
					},
					label: {
						show: true,
						color: "#E7E8ED",
						position: "insideLeft",
						offset: [0, -20],
						fontSize: 12,
						formatter: () => {
							return `男士 ${data.man * 100}%`;
						}
					}
				},
				{
					type: "bar",
					barWidth: 20,
					data: [1],
					barGap: "-100%",
					itemStyle: {
						borderRadius: 10,
						color: "#FF4B7A"
					},
					label: {
						show: true,
						color: "#E7E8ED",
						position: "insideRight",
						offset: [0, -20],
						fontSize: 12,
						formatter: () => {
							return `女士 ${data.woman * 100}%`;
						}
					}
				}
			]
		}
	}, [data])

	const [echartsRef] = useEchart(options(data), data)

	useEffect(() => {
		//模拟当 data 深层对象里面的属性值发生变动时，使用对象展开运算符将 data 保存到第三方变量
		if (testData) setTempData({...testData})
	}, [testData])

	useEffect(() => {
		// 借助第三方变量 tempData 来刷新页面数据
		setData(tempData)
	}, [tempData])

	return (
		<div className="malefemaleRatio-main">
			<div className="malefemaleRatio-header">
				<div className="man">
					<span>男士</span>
					<img src={man} alt="" />
				</div>
				<div className="woman">
					<span>女士</span>
					<img src={woman} alt="" />
				</div>
			</div>
			<div ref={echartsRef} className="echarts"></div>
		</div>
	)
}

export default MaleFemaleRatioChart
