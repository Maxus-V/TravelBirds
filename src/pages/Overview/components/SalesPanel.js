
const SalesPanel = (props) => {
    return <div className="sales panel">
    <div className="inner">
        <div className="caption">
            <h3>销售额统计</h3>
            <a href="www.baidu.com" className="active" data-type="year">年</a>
            <a href="www.baidu.com" data-type="quarter">季</a>
            <a href="www.baidu.com" data-type="month">月</a>
            <a href="www.baidu.com" data-type="week">周</a>
        </div>
        <div className="chart">
            <div className="label">单位:万</div>
            <div className="line"></div>
        </div>
    </div>
</div>
}

export default SalesPanel