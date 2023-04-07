import { useState } from "react"
import { use3D } from "@/hooks/use3D"

const options = {
    camera: {
        initial: {
            fov: 35,
            aspect: 1,
            near: 0.25,
            far: 80,
        },
        position: {
            x: 0,
            y: 1,
            z: 12,
        },
        lookAt: {
            x: 0,
            y: 2,
            z: 1,
        },
    },
    dirLight: {
        position: {
            x: 0,
            y: 20,
            z: 10,
        },
    },
    animationStep: 3,
}

const Xbot = (props) => {
    const [play, setPlay] = useState(true)
    const [data, setData] = useState(options)
    const {XbotCanvas} = use3D('Xbot', data)
    const changePlay = () => {
        if (play) {
            options.animationStep = 0
            setData(options)
        } else {
            options.animationStep = 3
            setData(options)
        }
        setPlay(pre => !pre)
    }
    return (
        <div className="container">
            <div ref={XbotCanvas}></div>
            <button className="option" onClick={changePlay}>{play ? '暂停' : '播放'}</button>
        </div>
    )
}

export default Xbot