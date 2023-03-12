const QuarterPanel = (props) => {
    return <div className="quarter panel">
    <div className="inner">
        <h3>一季度销售进度</h3>
        <div className="chart">
            <div className="box">
                <div className="gauge"></div>
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