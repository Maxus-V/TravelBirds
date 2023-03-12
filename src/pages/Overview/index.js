import './assets/style.css';
import './assets/fonts/icomoon.css'

import OverviewPanel from './components/OverviewPanel';
import MonitorPanel from './components/MonitorPanel';
import PointPanel from './components/PointPanel';

import MapPanel from './components/MapPanel';
import UsersPanel from './components/UsersPanel';

import OrderPanel from './components/OrderPanel';
import SalesPanel from './components/SalesPanel';
import ChannelPanel from './components/ChannelPanel';
import QuarterPanel from './components/QuarterPanel';
import TopPanel from './components/TopPanel';

const Overview = (props) => {

    return <div className="viewport">

    <div className="column">
        <OverviewPanel />
        <MonitorPanel />
        <PointPanel />
    </div>

    <div className="column">
        <MapPanel />
        <UsersPanel />
    </div>

    <div className="column">
        <OrderPanel />
        <SalesPanel />
        <div className="wrap">
            <ChannelPanel />
            <QuarterPanel />
        </div>
        <TopPanel />
    </div>
</div>
}


export default Overview