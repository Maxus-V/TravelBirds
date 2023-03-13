import * as echarts from 'echarts';
import { useRef, useEffect } from 'react';

import '../config/china'

import { geoCoordMap, BJData, SHData, GZData, planePath } from '../config/mapData'

const convertData = (data) => {
    var res = [];
    for (var i = 0; i < data.length; i++) {
        var dataItem = data[i];
        var fromCoord = geoCoordMap[dataItem[0].name];
        var toCoord = geoCoordMap[dataItem[1].name];
        if (fromCoord && toCoord) {
            res.push([{
                coord: fromCoord
            }, {
                coord: toCoord
            }]);
        }
    }
    return res;
}

const color = ['#3ed4ff', '#ffa022', '#a6c84c']
const series = []
let test = [
    ['新乡', BJData],
    ['九江', SHData],
    ['新疆', GZData]
].forEach((item, i) => {
    series.push({
        name: item[0] + ' Top10',
        type: 'lines',
        zlevel: 1,
        effect: {
            show: true,
            period: 6,
            trailLength: 0.7,
            color: '#fff',
            symbolSize: 3
        },
        lineStyle: {
                color: color[i],
                width: 0,
                curveness: 0.2
        },
        data: convertData(item[1])
    }, {
        name: item[0] + ' Top10',
        type: 'lines',
        zlevel: 2,
        effect: {
            show: true,
            period: 6,
            trailLength: 0,
            symbol: planePath,
            symbolSize: 15
        },
        lineStyle: {
                color: color[i],
                width: 1,
                opacity: 0.4,
                curveness: 0.2
        },
        data: convertData(item[1])
    }, {
        name: item[0] + ' Top10',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        zlevel: 2,
        rippleEffect: {
            brushType: 'stroke'
        },
        label: {
                show: true,
                position: 'right',
                formatter: '{b}'
        },
        symbolSize: function(val) {
            return val[2] / 8;
        },
        itemStyle: {
                color: color[i]
        },
        data: item[1].map(function(dataItem) {
            return {
                name: dataItem[1].name,
                value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
            };
        })
    });
})

const MapPanel = (props) => {
    const geoRef = useRef(null)

    useEffect(() => {
        let myChart = echarts.init(geoRef.current)
        let option = {
            backgroundColor: '#080a20',
            title: {
                left: 'left',
                textStyle: {
                    color: '#fff'
                }
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                top: 'bottom',
                left: 'right',
                data: ['北京 Top10', '上海 Top10', '广州 Top10'],
                textStyle: {
                    color: '#fff'
                },
                selectedMode: 'single'
            },
            geo: {
                map: 'china',
                zoom : 1.2,
                label: {
                    show: false
                },
                roam: true,
                itemStyle: {
                    areaColor: '#132937',
                    borderColor: '#0692a4',
                    areaColor: '#0b1c2d'
                }
            },
            series: series
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

    return <div className="map">
    <h3>
        <span className="icon-cube"></span> 设备数据统计
    </h3>
    <div className="chart">
        <div ref={geoRef} className="geo"></div>
    </div>
</div>
}

export default MapPanel