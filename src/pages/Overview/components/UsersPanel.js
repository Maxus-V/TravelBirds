
const UsersPanel = (props) => {
    return <div className="users panel">
    <div className="inner">
        <h3>全国用户总量统计</h3>
        <div className="chart">
            <div className="bar"></div>
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