import { useState } from "react"

import { Button } from 'antd'

const MenuFor3D = (props) => {
    const {options, setData, showModel, showSkeleton} = props
    const [play, setPlay] = useState(true)
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
        <div className="option">
            {/* <Button onClick={showModel}>显示模型/隐藏模型</Button> */}
            {/* <Button onClick={changePlay}>{play ? '暂停' : '播放'}</Button> */}
            <Button onClick={showSkeleton}>显示骨骼/隐藏骨骼</Button>
        </div>
    )
}

export default MenuFor3D