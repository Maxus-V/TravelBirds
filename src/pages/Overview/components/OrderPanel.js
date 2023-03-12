
const OrderPanel = (props) => {
    return <div className="order panel">
    <div className="inner">
        <div className="filter">
            <a href="www.baidu.com" data-key="day365" className="active">365天</a>
            <a href="www.baidu.com" data-key="day90">90天</a>
            <a href="www.baidu.com" data-key="day30">30天</a>
            <a href="www.baidu.com" data-key="day1">24小时</a>
        </div>
        <div className="data">
            <div className="item">
                <h4>20,301,987</h4>
                <span>
    <i className="icon-dot" style={{ color: '#ed3f35' }}></i>
    订单量
  </span>
            </div>
            <div className="item">
                <h4>99834</h4>
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