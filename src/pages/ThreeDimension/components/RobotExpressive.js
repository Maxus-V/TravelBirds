import { use3D } from "@/hooks/use3D"

const RobotExpressive = (props) => {
    const {RobotExpressiveCanvas} = use3D('RobotExpressive')
    return (
        <div className="container">
            <div ref={RobotExpressiveCanvas}></div>
        </div>
    )
}

export default RobotExpressive