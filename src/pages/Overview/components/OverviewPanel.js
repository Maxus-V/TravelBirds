
const data = [
  {
    name: '设备总数',
    count: '2,190',
    color: '#006cff',
  },
  {
    name: '季度新增',
    count: '190',
    color: '#6acca3',
  },
  {
    name: '运营设备',
    count: '3,001',
    color: '#6acca3',
  },
  {
    name: '异常设备',
    count: '108',
    color: '#ed3f35',
  },
]

const OverviewPanel = (props) => {
    return <div className="overview panel">
    <div className="inner">
      {
        data.map((item, index) => {
          return <div className="item" key={index}>
            <h4>{item.count}</h4>
            <span>
              <i className="icon-dot" style={{color: item.color}}></i>
              {item.name}
            </span>
        </div>
        })
      }
    </div>
</div>
}

export default OverviewPanel