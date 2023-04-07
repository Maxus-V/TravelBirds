import './ThreeDimensionV2.less'

import Soldier from '../ThreeDimension/components/Soldier'
import Xbot from '../ThreeDimension/components/Xbot'

const ThreeDimensionV2 = (props) => {
    return (
        <div className="data_bodey">
            <div className="index_nav">
                <h1>3D 操作台</h1>
            </div>
            <div className="index_tabs">
                <div className="inner">
                    <div className="left_cage">
                        <div className="dataAllBorder01 cage_cl">
                            <div className='dataAllBorder02'>
                                
                            </div>
                        </div>
                        <div className="dataAllBorder01 cage_cl">
                            <div className='dataAllBorder02'>
                                <Xbot />
                            </div>
                        </div>
                        <div className="dataAllBorder01 cage_cl">
                            <div className='dataAllBorder02'></div>
                        </div>
                    </div>
                    <div className="center_cage">
                        <div className="dataAllBorder01 cage_cl map">
                            <div className='dataAllBorder02'>
                                <Soldier />
                            </div>
                        </div>
                        <div className="dataAllBorder01 cage_cl">
                            <div className='dataAllBorder02'></div>
                        </div>
                    </div>
                    <div className="right_cage">
                        <div className="dataAllBorder01 cage_cl">
                            <div className='dataAllBorder02'></div>
                        </div>
                        <div className="dataAllBorder01 cage_cl">
                            <div className='dataAllBorder02'></div>
                        </div>
                        <div className="dataAllBorder01 cage_cl">
                            <div className='dataAllBorder02'></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ThreeDimensionV2