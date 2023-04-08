import { useState } from "react"
import { use3D } from "@/hooks/use3D"
import MenuFor3D from "./MenuFor3D"


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
    const [data, setData] = useState(options)
    const {SoldierCanvas, showModel, showSkeleton} = use3D('Soldier', data)
    
    return (
        <div className="container">
            <div ref={SoldierCanvas}></div>
            <MenuFor3D 
                options={options}
                setData={setData}
                showModel={showModel}
                showSkeleton={showSkeleton}
            />
        </div>
    )
}

export default Soldier