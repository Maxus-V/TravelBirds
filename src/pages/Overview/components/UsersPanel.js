import * as echarts from 'echarts';
import { useRef, useEffect } from 'react';

const item = {
    name:'',
    value: 1200,
    // 柱子颜色
    itemStyle: {
      color: '#254065'
    },
    // 鼠标经过柱子颜色
    emphasis: {
      itemStyle: {
        color: '#254065'
      }
    },
    // 工具提示隐藏
    tooltip: {
      extraCssText: 'opacity:0'
    }
  }

const UsersPanel = (props) => {
    const barRef = useRef(null)
    useEffect(() => {
        let myChart = echarts.init(barRef.current)
        let option = {
            tooltip: {
                trigger: 'item',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'line'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                // 距离 上右下左 的距离
                top: '6%',
                right: '3%',
                bottom: '3%',
                left: '0%',
                // 是否包含文本
                containLabel: true,
                // 显示边框
                show: true,
                // 边框颜色
                borderColor: 'rgba(0, 240, 255, 0.3)'
              },
            xAxis: [
                {
                    // 使用类目，必须有data属性
                    type: 'category',
                    // 使用 data 中的数据设为刻度文字
                    data: ['上海', '广州', '北京', '深圳', '合肥', '', '......', '', '杭州', '厦门', '济南', '成都', '重庆'],
                    // 刻度设置
                    axisTick: {
                      // true意思：图形在刻度中间
                      // false意思：图形在刻度之间
                      alignWithLabel: true,
                      alignWithLabel: false,
                      show: false
                    },        
                   // 文字
                    axisLabel: {
                      color: '#4c9bfd'
                    }
                  }
            ],
            yAxis: [
                {
                    // 使用数据的值设为刻度文字
                    type: 'value',
                    // 刻度设置
                    axisTick: {
                      show: false
                    },
                    // 文字
                    axisLabel: {
                      color: '#4c9bfd'
                    },
                    splitLine: {
                        lineStyle: {
                        color: 'rgba(0, 240, 255, 0.3)'
                        }
                     }
                  }
            ],
            series: [
                {
                    name: '直接访问',
                    type: 'bar',
                    barWidth: '60%',
                    data: [2100,1900,1700,1560,1400,item,item,item,900,750,600,480,240],
                    itemStyle: {
                        // 提供的工具函数生成渐变颜色
                        color: new echarts.graphic.LinearGradient(
                          // (x1,y2) 点到点 (x2,y2) 之间进行渐变
                          0, 0, 0, 1,
                          [
                            {offset: 0, color: 'red'}, // 0 起始颜色
                            {offset: 1, color: 'blue'}  // 1 结束颜色
                          ]
                        )
                      }
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
    return <div className="users panel">
    <div className="inner">
        <h3>全国用户总量统计</h3>
        <div className="chart">
            <div ref={barRef} className="bar"></div>
            <div className="data">
                <div className="item">
                    <h4>120,899</h4>
                    <span>
  <i className="icon-dot" style={{ color: '#ed3f35' }}></i>
  用户总量
</span>
                </div>
                <div className="item">
                    <h4>248</h4>
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

export default UsersPanel