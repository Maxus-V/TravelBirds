import { useState } from "react"

import { Button, Checkbox } from 'antd'

import { use3D } from "@/hooks/use3D"

const options = {
    camera: {
        initial: {
            fov: 45,
            aspect: 1,
            near: 1,
            far: 50,
        },
        position: {
            x: 0,
            y: 1,
            z: -3,
        },
        lookAt: {
            x: 0,
            y: 1,
            z: 0,
        },
    },
    dirLight: {
        position: {
            x: -3,
            y: 10,
            z: -10,
        },
    },
    animationStep: 3,
}

const Soldier = (props) => {
    const [play, setPlay] = useState(true)
    const [data, setData] = useState(options)
    const {SoldierCanvas, showModel, showSkeleton, deactivateAllActions, activateAllActions} = use3D('Soldier', data)
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
            <div ref={SoldierCanvas}></div>
            <div className="option">
                <Button onClick={changePlay}>{play ? '暂停' : '播放'}</Button>
                <Button onClick={showModel}>显示或隐藏</Button>
                <Button onClick={showSkeleton}>显示或隐藏骨骼</Button>
                <Button onClick={deactivateAllActions}>测试</Button>
            </div>
        </div>
    )
}

export default Soldier