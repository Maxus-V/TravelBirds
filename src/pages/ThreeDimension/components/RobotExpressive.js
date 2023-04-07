import { useState } from "react"
import { use3D } from "@/hooks/use3D"

const options = {
    camera: {
        initial: {
            fov: 45,
            aspect: 1,
            near: 0.25,
            far: 100,
        },
        position: {
            x: 0,
            y: 4,
            z: 12,
        },
        lookAt: {
            x: 0,
            y: 1,
            z: 0,
        },
    },
    dirLight: {
        position: {
            x: 0,
            y: 20,
            z: 10,
        },
    },
    animationStep: 2,
}

const RobotExpressive = (props) => {
    const [play, setPlay] = useState(true)
    const [data, setData] = useState(options)
    const {RobotExpressiveCanvas} = use3D('RobotExpressive', data)
    const changePlay = () => {
        if (play) {
            options.animationStep = 4
            setData(options)
        } else {
            options.animationStep = 2
            setData(options)
        }
        setPlay(pre => !pre)
    }
    return (
        <div className="container">
            <div ref={RobotExpressiveCanvas}></div>
            <button onClick={changePlay}>{play ? '暂停' : '播放'}</button>
        </div>
    )
}

export default RobotExpressive