
import Soldier from "./components/Soldier"
import RobotExpressive from "./components/RobotExpressive"
import Xbot from './components/Xbot'

import './ThreeDimension.less'

const ThreeDimension = (props) => {
    return (
        <div className="threeDimension">
            <h1> 3D 操作台</h1>
            <div className="models">
                <Soldier />
                <RobotExpressive />
                <Xbot />
            </div>
        </div>
    )
}

export default ThreeDimension