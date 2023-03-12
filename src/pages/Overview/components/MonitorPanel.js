
const MonitorPanel = (props) => {
    return <div className="monitor panel">
    <div className="inner">
        <div className="tabs">
            <a href="www.baidu.com" data-index="0" className="active">故障设备监控</a>
            <a href="www.baidu.com" data-index="1">异常设备监控</a>
        </div>
        <div className="content" style={{display: '#block'}}>
            <div className="head">
                <span className="col">故障时间</span>
                <span className="col">设备地址</span>
                <span className="col">异常代码</span>
            </div>
            <div className="marquee-view">
                <div className="marquee">
                    <div className="row">
                        <span className="col">20180701</span>
                        <span className="col">11北京市昌平西路金燕龙写字楼</span>
                        <span className="col">1000001</span>
                        <span className="icon-dot"></span>
                    </div>
                    <div className="row">
                        <span className="col">20190601</span>
                        <span className="col">北京市昌平区城西路金燕龙写字楼</span>
                        <span className="col">1000002</span>
                        <span className="icon-dot"></span>
                    </div>
                    <div className="row">
                        <span className="col">20190704</span>
                        <span className="col">北京市昌平区建材城西路金燕龙写字楼</span>
                        <span className="col">1000003</span>
                        <span className="icon-dot"></span>
                    </div>
                    <div className="row">
                        <span className="col">20180701</span>
                        <span className="col">北京市昌平区建路金燕龙写字楼</span>
                        <span className="col">1000004</span>
                        <span className="icon-dot"></span>
                    </div>
                    <div className="row">
                        <span className="col">20190701</span>
                        <span className="col">北京市昌平区建材城西路金燕龙写字楼</span>
                        <span className="col">1000005</span>
                        <span className="icon-dot"></span>
                    </div>
                    <div className="row">
                        <span className="col">20190701</span>
                        <span className="col">北京市昌平区建材城西路金燕龙写字楼</span>
                        <span className="col">1000006</span>
                        <span className="icon-dot"></span>
                    </div>
                    <div className="row">
                        <span className="col">20190701</span>
                        <span className="col">北京市昌平区建西路金燕龙写字楼</span>
                        <span className="col">1000007</span>
                        <span className="icon-dot"></span>
                    </div>
                    <div className="row">
                        <span className="col">20190701</span>
                        <span className="col">北京市昌平区建材城西路金燕龙写字楼</span>
                        <span className="col">1000008</span>
                        <span className="icon-dot"></span>
                    </div>
                    <div className="row">
                        <span className="col">20190701</span>
                        <span className="col">北京市昌平区建材城西路金燕龙写字楼</span>
                        <span className="col">1000009</span>
                        <span className="icon-dot"></span>
                    </div>
                    <div className="row">
                        <span className="col">20190710</span>
                        <span className="col">北京市昌平区建材城西路金燕龙写字楼</span>
                        <span className="col">1000010</span>
                        <span className="icon-dot"></span>
                    </div>
                </div>
            </div>
        </div>
        <div className="content">
            <div className="head">
                <span className="col">异常时间</span>
                <span className="col">设备地址</span>
                <span className="col">异常代码</span>
            </div>
            <div className="marquee-view">
                <div className="marquee">
                    <div className="row">
                        <span className="col">20190701</span>
                        <span className="col">北京市昌平区建材城西路金燕龙写字楼</span>
                        <span className="col">1000001</span>
                        <span className="icon-dot"></span>
                    </div>
                    <div className="row">
                        <span className="col">20190701</span>
                        <span className="col">北京市昌平区建材城西路金燕龙写字楼</span>
                        <span className="col">1000002</span>
                        <span className="icon-dot"></span>
                    </div>
                    <div className="row">
                        <span className="col">20190703</span>
                        <span className="col">北京市昌平区建材城西路金燕龙写字楼</span>
                        <span className="col">1000002</span>
                        <span className="icon-dot"></span>
                    </div>
                    <div className="row">
                        <span className="col">20190704</span>
                        <span className="col">北京市昌平区建材城西路金燕龙写字楼</span>
                        <span className="col">1000002</span>
                        <span className="icon-dot"></span>
                    </div>
                    <div className="row">
                        <span className="col">20190705</span>
                        <span className="col">北京市昌平区建材城西路金燕龙写字楼</span>
                        <span className="col">1000002</span>
                        <span className="icon-dot"></span>
                    </div>
                    <div className="row">
                        <span className="col">20190706</span>
                        <span className="col">北京市昌平区建材城西路金燕龙写字楼</span>
                        <span className="col">1000002</span>
                        <span className="icon-dot"></span>
                    </div>
                    <div className="row">
                        <span className="col">20190707</span>
                        <span className="col">北京市昌平区建材城西路金燕龙写字楼</span>
                        <span className="col">1000002</span>
                        <span className="icon-dot"></span>
                    </div>
                    <div className="row">
                        <span className="col">20190708</span>
                        <span className="col">北京市昌平区建材城西路金燕龙写字楼</span>
                        <span className="col">1000002</span>
                        <span className="icon-dot"></span>
                    </div>
                    <div className="row">
                        <span className="col">20190709</span>
                        <span className="col">北京市昌平区建材城西路金燕龙写字楼</span>
                        <span className="col">1000002</span>
                        <span className="icon-dot"></span>
                    </div>
                    <div className="row">
                        <span className="col">20190710</span>
                        <span className="col">北京市昌平区建材城西路金燕龙写字楼</span>
                        <span className="col">1000002</span>
                        <span className="icon-dot"></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
}

export default MonitorPanel