
const TopPanel = (props) => {
    return <div className="top panel">
    <div className="inner">
        <div className="all">
            <h3>全国热榜</h3>
            <ul>
                <li>
                    <i className="icon-cup1" style={{ color: '#d93f36' }}></i> 可爱多
                </li>
                <li>
                    <i className="icon-cup2" style={{ color: '#68d8fe' }}></i> 娃哈啥
                </li>
                <li>
                    <i className="icon-cup3" style={{ color: '#4c9bfd' }}></i> 喜之郎
                </li>
            </ul>
        </div>
        <div className="province">
            <h3>各省热销 <i className="date">近30日</i></h3>
            <div className="data">
                <ul className="sup">
                    <li>
                        <span>北京</span>
                        <span>25,179 <s className="icon-up"></s></span>
                    </li>
                    <li>
                        <span>河北</span>
                        <span>23,252 <s className="icon-down"></s></span>
                    </li>
                    <li>
                        <span>上海</span>
                        <span>20,760 <s className="icon-up"></s></span>
                    </li>
                    <li>
                        <span>江苏</span>
                        <span>23,252 <s className="icon-down"></s></span>
                    </li>
                    <li>
                        <span>山东</span>
                        <span>20,760 <s className="icon-up"></s></span>
                    </li>
                </ul>
                <ul className="sub">
                    <li><span>数据</span><span> 数据<s className="icon-up"></s></span></li>
                    <li><span>数据</span><span> 数据<s className="icon-up"></s></span></li>
                    <li><span>数据</span><span> 数据<s className="icon-up"></s></span></li>
                    <li><span>数据</span><span> 数据<s className="icon-up"></s></span></li>
                    <li><span>数据</span><span> 数据<s className="icon-up"></s></span></li>
                    <li><span>数据</span><span> 数据<s className="icon-up"></s></span></li>
                </ul>
            </div>
        </div>
    </div>
</div>
}

export default TopPanel