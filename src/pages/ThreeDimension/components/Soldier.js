import { use3D } from "@/hooks/use3D"

const Soldier = (props) => {
    const {SoldierCanvas} = use3D('Soldier')
    return (
        <div className="container">
            <div ref={SoldierCanvas}></div>
        </div>
    )
}

export default Soldier