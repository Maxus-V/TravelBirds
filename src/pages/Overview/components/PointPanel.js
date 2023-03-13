import * as echarts from 'echarts';
import { useRef, useEffect } from 'react';

const PointPanel = (props) => {
    const pieRef = useRef(null)

    useEffect(() => {
        let myChart = echarts.init(pieRef.current)
        let option = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
           
            series: [
                {
                    name: '面积模式',
                    type: 'pie',
                    radius: ['10%','70%'],
                    center: ['50%', '50%'],
                    roseType: 'area',
                    data: [
                        { value: 20, name: '云南' },
                        { value: 26, name: '北京' },
                        { value: 24, name: '山东' },
                        { value: 25, name: '河北' },
                        { value: 20, name: '江苏' },
                        { value: 25, name: '浙江' },
                        { value: 30, name: '四川' },
                        { value: 42, name: '湖北' }
                    ],
                    labelLine : {
                        length : 8,
                        length2 : 10,
                    },
                }
            ],
            color:['#006cff', '#60cda0', '#ed8884', '#ff9f7f', '#0096ff', '#9fe6b8', '#32c5e9', '#1d9dff'],
            label : {
                fontSize : 10
            },
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

    return <div className="point panel">
    <div className="inner">
        <h3>点位分布统计</h3>
        <div className="chart">
            <div ref={pieRef} className="pie"></div>
            <div className="data">
                <div className="item">
                    <h4>320,11</h4>
                    <span>
                        <i className="icon-dot" style={{ color: '#ed3f35' }}></i>
                        点位总数
                    </span>
                </div>
                <div className="item">
                    <h4>418</h4>
                    <span>
                        <i className="icon-dot" style={{ color: '#eacf19' }}></i>
                        本月新增
                    </span>
                </div>
            </div>
        </div>
    </div>
</div>
}

export default PointPanel