import * as echarts from 'echarts';
import { useRef, useEffect } from 'react';


const QuarterPanel = (props) => {
    const gaugeRef = useRef(null)
    useEffect(() => {
        let myChart = echarts.init(gaugeRef.current)
        let option = {
            series: [
              {
                type: 'pie',
                radius: ['130%', '150%'],  // 放大图形
                center: ['48%', '80%'],    // 往下移动  套住75%文字
                label: {
                  show: false,
                },
                startAngle: 180,
                hoverOffset: 0,
                data: [
                    { value: 100 }, // 不需要名称
                    { value: 100,}, // 不需要名称
                    { value: 200, itemStyle: { color: 'transparent' } } // 透明隐藏第三块区域
                ]
              }
            ]
          }
        const chartResize = () => {
            if (myChart) myChart.resize()
        }

        option && myChart.setOption(option)
        window.addEventListener('resize', chartResize)

        return () => {
            window.removeEventListener('resize', chartResize)
            myChart.dispose()
        }
    }, [])
    return <div className="quarter panel">
    <div className="inner">
        <h3>一季度销售进度</h3>
        <div className="chart">
            <div className="box">
                <div ref={gaugeRef} className="gauge"></div>
                <div className="label">75<small> %</small></div>
            </div>
            <div className="data">
                <div className="item">
                    <h4>1,321</h4>
                    <span>
      <i className="icon-dot" style={{ color: '#6acca3' }}></i>
      销售额(万元)
    </span>
                </div>
                <div className="item">
                    <h4>150%</h4>
                    <span>
      <i className="icon-dot" style={{ color: '#ed3f35' }}></i>
      同比增长
    </span>
                </div>
            </div>
        </div>
    </div>
</div>
}

export default QuarterPanel