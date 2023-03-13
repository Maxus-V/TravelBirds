import { useState, useEffect } from 'react'

const time = ['365天', '90天', '30天', '24小时']

const data = {
    day365: { orders: '20,301,987', amount: '99834' },
    day90: { orders: '301,987', amount: '9834' },
    day30: { orders: '1,987', amount: '3834' },
    day1: { orders: '987', amount: '834' }
  }
const index2Data = {
    0: "day365",
    1: "day90",
    2: "day30",
    3: "day1",
}

const OrderPanel = (props) => {
    const [orders, setOrders] = useState(20,301,987)
    const [amount, setAmount] = useState(99834)
    const [currentTime, setCurrentTime] = useState('day365')

    useEffect(() => {
        let index = 0
        setInterval(() => {
            index ++
            if (index > 3) {
                index = 0
            }
            setOrders(data[index2Data[index]].orders)
            setAmount(data[index2Data[index]].amount)
            setCurrentTime(time[index])
        }, 1000)
    }, [])

    return <div className="order panel">
                <div className="inner">
                    <div className="filter">
                        {
                            time.map((item, index) => {
                                return <a href='/' className={item === currentTime ? "active" : null} key={index}>
                                    {item}
                                </a>
                            })
                        }
                    </div>
                    <div className="data">
                        <div className="item">
                            <h4>{orders}</h4>
                            <span>
                                <i className="icon-dot" style={{ color: '#ed3f35' }}></i>
                                订单量
                            </span>
                        </div>
                        <div className="item">
                            <h4>{amount}</h4>
                            <span>
                                <i className="icon-dot" style={{ color: '#eacf19' }}></i>
                                销售额(万元)
                            </span>
                        </div>
                    </div>
                </div>
            </div>
}

export default OrderPanel