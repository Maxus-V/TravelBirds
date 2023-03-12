
const PointPanel = (props) => {
    return <div className="point panel">
    <div className="inner">
        <h3>点位分布统计</h3>
        <div className="chart">
            <div className="pie"></div>
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