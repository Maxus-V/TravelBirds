import * as echarts from 'echarts';
import { useRef, useEffect, useState } from 'react';

const time = ["年", "季", "月", "周"]

const data = {
  year: [
    [24, 40, 101, 134, 90, 230, 210, 230, 120, 230, 210, 120],
    [40, 64, 191, 324, 290, 330, 310, 213, 180, 200, 180, 79]
  ],
  quarter: [
    [23, 75, 12, 97, 21, 67, 98, 21, 43, 64, 76, 38],
    [43, 31, 65, 23, 78, 21, 82, 64, 43, 60, 19, 34]
  ],
  month: [
    [34, 87, 32, 76, 98, 12, 32, 87, 39, 36, 29, 36],
    [56, 43, 98, 21, 56, 87, 43, 12, 43, 54, 12, 98]
  ],
  week: [
    [43, 73, 62, 54, 91, 54, 84, 43, 86, 43, 54, 53],
    [32, 54, 34, 87, 32, 45, 62, 68, 93, 54, 54, 24]
  ]
}

const index2Data = {
  0: 'year',
  1: 'quarter',
  2: 'month',
  3: 'week',
}

const SalesPanel = (props) => {
    const lineRef = useRef(null)
    const [now, setNow] = useState('year')
    useEffect(() => {
        let myChart = echarts.init(lineRef.current)
        let option = {
            xAxis: {
                type: 'category',
                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                axisTick: {
                  show: false // 去除刻度线
                },
                axisLabel: {
                  color: '#4c9bfd' // 文本颜色
                },
                axisLine: {
                  show: false // 去除轴线
                },
                boundaryGap: false  // 去除轴内间距
              },
            yAxis: {
                type: 'value',
                axisTick: {
                  show: false  // 去除刻度
                },
                axisLabel: {
                  color: '#4c9bfd' // 文字颜色
                },
                splitLine: {
                  lineStyle: {
                    color: '#012f4a' // 分割线颜色
                  }
                }
              },
            series: [{
                name:'预期销售额',
                data: [24, 40, 101, 134, 90, 230, 210, 230, 120, 230, 210, 120],
                type: 'line',
                smooth: true,
                itemStyle: {
                  color: '#00f2f1'  // 线颜色
                }
              },{
                name:'实际销售额',
                data: [40, 64, 191, 324, 290, 330, 310, 213, 180, 200, 180, 79],
                type: 'line',
                smooth: true,
                itemStyle: {
                  color: '#ed3f35'  // 线颜色
                }
              }],
                // 设置网格样式
            grid: {
                show: true,// 显示边框
                top: '20%',
                left: '3%',
                right: '4%',
                bottom: '3%',
                borderColor: '#012f4a',// 边框颜色
                containLabel: true // 包含刻度文字在内
            },
            legend: {
                textStyle: {
                  color: '#4c9bfd' // 图例文字颜色
                   //  fontSize
                },
                right: '10%' // 距离右边10%
              },
        }
        const chartResize = () => {
            if (myChart) myChart.resize()
        }

        option && myChart.setOption(option)
        window.addEventListener('resize', chartResize)

        let index = 0
        setInterval(() => {
          index++
          if (index > 3) {
            index = 0
          }
          setNow(time[index])
          option.series[0].data = data[index2Data[index]][0]
          option.series[1].data = data[index2Data[index]][1]
          myChart.setOption(option)
        }, 1000);

        return () => {
            window.removeEventListener('resize', chartResize)
            // myChart.dispose()
        }
    }, [])
    return <div className="sales panel">
    <div className="inner">
        <div className="caption">
            <h3>销售额统计</h3>
            {
              time.map((item, index) => {
                return <a href="/" className={item === now ? 'active' : null} key={index}>
                  {item}
                </a>
              })
            }
        </div>
        <div className="chart">
            <div className="label">单位:万</div>
            <div ref={lineRef} className="line"></div>
        </div>
    </div>
</div>
}

export default SalesPanel