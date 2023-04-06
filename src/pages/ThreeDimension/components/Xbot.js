import { use3D } from "@/hooks/use3D"

const Xbot = (props) => {
    const {XbotCanvas} = use3D('Xbot')
    return (
        <div className="container">
            <div ref={XbotCanvas}></div>
        </div>
    )
}

export default Xbot