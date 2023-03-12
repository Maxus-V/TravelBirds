
const OverviewPanel = (props) => {
    return <div className="overview panel">
    <div className="inner">
        <div className="item">
            <h4>2,190</h4>
            <span>
          <i className="icon-dot" style={{color: '#006cff'}}></i>
          设备总数
        </span>
        </div>
        <div className="item">
            <h4>190</h4>
            <span>
          <i className="icon-dot" style={{color: '#6acca3'}}></i>
          季度新增
        </span>
        </div>
        <div className="item">
            <h4>3,001</h4>
            <span>
          <i className="icon-dot" style={{color: '#6acca3'}}></i>
          运营设备
        </span>
        </div>
        <div className="item">
            <h4>108</h4>
            <span>
          <i className="icon-dot" style={{color: '#ed3f35'}}></i>
          异常设备
        </span>
        </div>
    </div>
</div>
}

export default OverviewPanel