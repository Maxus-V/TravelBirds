const ChannelPanel = (props) => {
    return <div className="channel panel">
    <div className="inner">
        <h3>渠道分布</h3>
        <div className="data">
            <div className="item">
                <h4>39 <small>%</small></h4>
                <span>
    <i className="icon-plane"></i>
    机场
  </span>
            </div>
            <div className="item">
                <h4>28 <small>%</small></h4>
                <span>
    <i className="icon-bag"></i>
    商场
  </span>
            </div>
        </div>
        <div className="data">
            <div className="item">
                <h4>20 <small>%</small></h4>
                <span>
    <i className="icon-train"></i>
    地铁
  </span>
            </div>
            <div className="item">
                <h4>13 <small>%</small></h4>
                <span>
    <i className="icon-bus"></i>
    火车站
  </span>
            </div>
        </div>
    </div>
</div>
}

export default ChannelPanel