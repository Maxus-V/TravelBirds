import * as THREE from 'three'

const r = 45
const parameters = [[ 1.25, 0x000833, 0.8 ],
    [ 3.0, 0xaaaaaa, 0.75 ], [ 3.5, 0xffffff, 0.5 ], 
    [ 4.5, 0xffffff, 0.25 ], [ 5.5, 0xffffff, 0.125 ]
]

export const createGeometry = () => {
    const geometry = new THREE.BufferGeometry()
    const vertices = []
    const vertex = new THREE.Vector3()
    for ( let i = 0; i < 1500; i ++ ) {
        vertex.x = Math.random() * 2 - 1
        vertex.y = Math.random() * 2 - 1
        vertex.z = Math.random() * 2 - 1
        // 将该向量的方向设置为和原向量相同，但是其长度为1
        vertex.normalize()
        // 将该向量与所传入的标量r进行相乘
        vertex.multiplyScalar( r )
        vertices.push( vertex.x, vertex.y, vertex.z )
        vertex.multiplyScalar( Math.random() * 0.09 + 1 )
        vertices.push( vertex.x, vertex.y, vertex.z )
    }
    // 将几何对象的位置属性设置为一个新的Float32BufferAttribute
    // 顶点参数是定义几何形状的3D坐标数组
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) )
    return geometry
}

// const parameters = [[ 0.25, 0xff7700, 1 ], [ 0.5, 0xff9900, 1 ], [ 0.75, 0xffaa00, 0.75 ], [ 1, 0xffaa00, 0.5 ], [ 1.25, 0x000833, 0.8 ],
//     [ 3.0, 0xaaaaaa, 0.75 ], [ 3.5, 0xffffff, 0.5 ], [ 4.5, 0xffffff, 0.25 ], [ 5.5, 0xffffff, 0.125 ]];
export const createLine = (geometry, scene) => {
    for ( let i = 0; i < parameters.length; ++ i ) {
        const p = parameters[ i ]
        const material = new THREE.LineBasicMaterial( { color: p[ 1 ], opacity: p[ 2 ] } )
        const line = new THREE.LineSegments( geometry, material )
        line.scale.x = line.scale.y = line.scale.z = p[ 0 ]
        line.userData.originalScale = p[ 0 ]
        line.rotation.y = Math.random() * Math.PI
        line.updateMatrix()
        line.canRotate = true
        scene.add( line )
    }
}

export const createStar = (scene) => {
    // 星空运动效果
    const time = Date.now() * 0.0001
    for ( let i = 0; i < scene.children.length; i ++ ) {
        const object = scene.children[ i ]
        // 循环遍历场景中的所有子对象，对于每个是Line类型的对象，进行特效处理
        if ( object.isLine && object.canRotate ) {
            // 计算出每个对象的旋转角度
            // 根据对象的索引值（i）来确定旋转方向
            object.rotation.y = time * ( i < 4 ? ( i + 1 ) : - ( i + 1 ) )
            // 对于前5个对象，还会根据原始比例尺（object.userData.originalScale）和时间变化（Math.sin(7 * time)）来计算出缩放比例（scale），并将其应用到对象的scale属性上
            if ( i < 5 ) {
                const scale = object.userData.originalScale * ( i / 5 + 1 ) * ( 1 + 0.5 * Math.sin( 7 * time ) )
                object.scale.x = object.scale.y = object.scale.z = scale
            }
        }
    }
}