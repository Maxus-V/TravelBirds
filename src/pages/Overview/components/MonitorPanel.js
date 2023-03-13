
const addres = []

for (let i = 1000001; i < 1000021; i++) {
    addres.push(i)
}

const MonitorPanel = (props) => {
    return <div className="monitor panel">
    <div className="inner">
        <div className="tabs">
            <a href="/" data-index="0" className="active">故障设备监控</a>
            <a href="/" data-index="1">异常设备监控</a>
        </div>
        <div style={{display: '#block'}}>
            {/* <div className="head">
                <span className="col">故障时间</span>
                <span className="col">设备地址</span>
                <span className="col">异常代码</span>
            </div> */}
            <div className="marquee-view">
                <div className="marquee">
                    {
                        addres.map((item, index) => {
                            return <div className="row" key={index}>
                                <span className="col">20180701</span>
                                <span className="col">11北京市昌平西路金燕龙写字楼</span>
                                <span className="col">{item}</span>
                                <span className="icon-dot"></span>
                            </div>
                        })
                    }
                </div>
            </div>
        </div>
        <div className="content">
            {/* <div className="head">
                <span className="col">异常时间</span>
                <span className="col">设备地址</span>
                <span className="col">异常代码</span>
            </div> */}
            <div className="marquee-view">
                <div className="marquee">
                    {
                        addres.map((item, index) => {
                            return <div className="row" key={index}> 
                                <span className="col">20180701</span>
                                <span className="col">11北京市昌平西路金燕龙写字楼</span>
                                <span className="col">{item}</span>
                                <span className="icon-dot"></span>
                            </div>
                        })
                    }
                </div>
            </div>
        </div>
    </div>
</div>
}

export default MonitorPanel