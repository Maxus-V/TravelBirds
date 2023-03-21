import { useLayoutEffect, useRef } from "react"

import Headertime from "./components/DataHeaderTime"
import RealTimeAccessChart from "./components/RealTimeAccessChart"
import MaleFemaleRatioChart from "./components/MaleFemaleRatioChart"
import AgeRatioChart from "./components/AgeRatioChart"
import ChinaMapChart from "./components/ChinaMapChart"
import OverNext30Chart from "./components/OverNext30Chart"
import HotPlateChart from "./components/HotPlateChart"
import AnnualUseChart from "./components/AnnualUseChart"
import PlatformSourceChart from "./components/PlatformSourceChart"

import { message } from "antd"
import { useNavigate } from "react-router-dom"
import { connect } from "react-redux"
import { setToken } from "@/redux/modules/global/action"

import { useAudio } from "@/hooks/useAudio"
import music from './assets/2516694153.mp3'
import dataScreenTitle from "./images/dataScreen-title.webp"

import "./index.less"

const DataScreen = (props) => {
	const { setToken } = props
	const navigate = useNavigate()

	const dataScreenRef = useRef(null)
	const [onMusic, setOnMusic] = useAudio(music)

	/* 退出登录 */
	const logout = () => {
		setToken("")
		message.success("退出登录成功！")
		navigate("/login")
	}
    
	/* 开启或关闭页面背景音乐 */
	const handleTo = () => {
		setOnMusic(pre => !pre)
	}

    /* 浏览器监听 resize 事件 */
	const resize = () => {
		if (dataScreenRef.current) {
			dataScreenRef.current.style.transform = `scale(${getScale()}) translate(-50%, -50%)`
		}
	}

    /* 根据浏览器大小推断缩放比例 */
	const getScale = (width = 1920, height = 1080) => {
		let ww = window.innerWidth / width
		let wh = window.innerHeight / height
		return ww < wh ? ww : wh
	}

    useLayoutEffect(() => {
		if (dataScreenRef.current) {
			dataScreenRef.current.style.transform = `scale(${getScale()}) translate(-50%, -50%)`
			dataScreenRef.current.style.width = `1920px`
			dataScreenRef.current.style.height = `1080px`
		}
		// 为浏览器绑定事件
		window.addEventListener("resize", resize)
		return () => {
			window.removeEventListener("resize", resize)
		}
	}, [])

	return (
		<div className="dataScreen-container">
			<div className="dataScreen" ref={dataScreenRef}>
				<div className="dataScreen-header">
					<div className="header-lf">
						<span className="header-playing">
							{onMusic ? '~ 正在播放：直到世界尽头 ~' : null}
						</span>
						<span className="header-screening" onClick={handleTo}>
							{onMusic ? '关闭' : '开启'}音乐
						</span>
					</div>
					<div className="header-ct">
						<div className="header-ct-title">
							<span>随风飘飘游</span>
							{/* <div className="header-ct-warning">平台高峰预警信息（2条）</div> */}
						</div>
					</div>
					<div className="header-rg">
						<span className="header-download" onClick={logout}>退出登录</span>
						<Headertime />
					</div>
				</div>
				<div className="dataScreen-main">
					<div className="dataScreen-lf">
						<div className="dataScreen-top">
							<div className="dataScreen-main-title">
								<span>实时游客统计</span>
								<img src={dataScreenTitle} alt="" />
							</div>
							<div className="dataScreen-main-chart">
								<RealTimeAccessChart />
							</div>
						</div>
						<div className="dataScreen-center">
							<div className="dataScreen-main-title">
								<span>男女比例</span>
								<img src={dataScreenTitle} alt="" />
							</div>
							<div className="dataScreen-main-chart">
								<MaleFemaleRatioChart />
							</div>
						</div>
						<div className="dataScreen-bottom">
							<div className="dataScreen-main-title">
								<span>年龄比例</span>
								<img src={dataScreenTitle} alt="" />
							</div>
							<div className="dataScreen-main-chart">
								<AgeRatioChart />
							</div>
						</div>
					</div>
					<div className="dataScreen-ct">
						<div className="dataScreen-map">
							<div className="dataScreen-map-title">旅游航线实时监测</div>
							<ChinaMapChart />
						</div>
						<div className="dataScreen-cb">
							<div className="dataScreen-main-title">
								<span>未来30天游客量趋势图</span>
								<img src={dataScreenTitle} alt="" />
							</div>
							<div className="dataScreen-main-chart">
								<OverNext30Chart />
							</div>
						</div>
					</div>
					<div className="dataScreen-rg">
						<div className="dataScreen-top">
							<div className="dataScreen-main-title">
								<span>热门景区排行</span>
								<img src={dataScreenTitle} alt="" />
							</div>
							<div className="dataScreen-main-chart">
								<HotPlateChart />
							</div>
						</div>
						<div className="dataScreen-center">
							<div className="dataScreen-main-title">
								<span>年度游客量对比</span>
								<img src={dataScreenTitle} alt="" />
							</div>
							<div className="dataScreen-main-chart">
								<AnnualUseChart />
							</div>
						</div>
						<div className="dataScreen-bottom">
							<div className="dataScreen-main-title">
								<span>预约渠道数据统计</span>
								<img src={dataScreenTitle} alt="" />
							</div>
							<div className="dataScreen-main-chart">
								<PlatformSourceChart />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

const mapDispatchToProps = { setToken }
export default connect(null, mapDispatchToProps)(DataScreen)
