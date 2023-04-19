import * as THREE from 'three'
import * as d3 from 'd3'

let projection

const lines1 = []
const geometry1 = new THREE.BufferGeometry()
let positions1 = null
let opacitys1 = null
let points1
let line = {}

const params = {
    pointSize: 6.0,
    pointColor: '#4ec0e9'
}

// 边缘移动光线
let currentPos = 0
let pointSpeed = 6
const circleYs = []
const projects = {}

const vertexShader = `
    attribute float aOpacity;
    uniform float uSize;
    varying float vOpacity;

    void main(){
        gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
        gl_PointSize = uSize;

        vOpacity=aOpacity;
    }
`

const fragmentShader = `
    varying float vOpacity;
    uniform vec3 uColor;

    float invert(float n){
        return 1.-n;
    }

    void main(){
        if(vOpacity <=0.2){
            discard;
        }
        vec2 uv=vec2(gl_PointCoord.x,invert(gl_PointCoord.y));
        vec2 cUv=2.*uv-1.;
        vec4 color=vec4(1./length(cUv));
        color*=vOpacity;
        color.rgb*=uColor;
        
        gl_FragColor=color;
    }
`

export const setMapDom = (e, scene) => {
    const color = '#008c8c'
        // 用于存储中国地图的所有几何体
        const province = new THREE.Object3D()
        
        projection = d3
        .geoMercator() // 创建了一个墨卡托投影
        .center([106.0, 39.5]) // 设置了中心点
        .scale(47) // 设置了缩放比例
        .translate([0, 0]) // 设置了平移距离

        e.forEach((item, index) => {
            // 从 item 对象中获取 geometry.coordinates[0]，这是一个包含多个坐标点的数组，表示该地区的边界
            let cod = item.geometry.coordinates[0]
            

            // 判断该地区是否有名称，如果有，就将其中心点坐标保存到 centerLatlng.current 对象中，以便后续使用
            if (item.properties.name) {
                // centerLatlng.current[item.properties.name] = item.properties.center
            }
            // 判断该地区是否为广东省或北京市，如果是，就调用 dotBarlight() 函数添加标记点
            if (
                item.properties.name == '广东省' ||
                item.properties.name == '上海市' ||
                item.properties.name == '北京市'
            ) {
                // dotBarlight() 函数接受两个参数：标记点的坐标和颜色
                // 其中，标记点的坐标是通过 projection() 函数将中心点坐标转换为 Three.js 中的坐标得到的
                // 如果该地区是北京市，则标记点的颜色为 '#008c8c'，否则为 'yellow'
                const cylinder = dotBarlight(
                    projection(item.properties.center),
                    item.properties.name == '北京市' ? 'red' : item.properties.name == '上海市' ? 'yellow': '#4ec0e9',
                )
                const {circleY, circleY3} = dotBarlight2(
                    projection(item.properties.center),
                    item.properties.name == '北京市' ? 'red' : item.properties.name == '上海市' ? 'yellow': '#4ec0e9',
                )
                projects[item.properties.name] = item.properties.center
                scene.add(cylinder)
                scene.add(circleY)
                scene.add(circleY3)
            }
            // 判断该地区的坐标点数组长度是否大于 1，如果是，就将其转换为一个包含一个数组的数组，以便后续使用
            // 因为 Three.js 中的几何体需要一个包含多个坐标点的数组，而有些地区的坐标点数组长度只有 1，需要进行特殊处理
            cod = cod.length > 1 ? [[...cod]] : cod

            cod.forEach((polygon) => {
                const line = lineDraw(polygon, 0x92edff)
                province.add(line)

                // 用于保存多边形的形状
                const shape = new THREE.Shape()
                // 用于保存多边形的顶点数据
                const lineGeometry = new THREE.BufferGeometry()
                // 用于保存多边形的顶点坐标
                const pointsArray = new Array()
                // 遍历多边形的坐标点数组 polygon，对每个坐标点进行坐标转换，将其保存到 pointsArray 数组中
                for (let i = 0; i < polygon.length; i++) {
                    // projection -- 坐标转化
                    // 坐标转换是通过 projection() 函数实现的，该函数将地理坐标转换为 Three.js 中的坐标
                    let [x, y] = projection(polygon[i])
                    // 在将坐标点保存到 pointsArray 数组中时，我们将 y 坐标取反，是因为 Three.js 中的坐标系 y 轴向上，而地理坐标系 y 轴向下
                    pointsArray.push(new THREE.Vector3(x, -y, 3))
                    // 在将坐标点保存到 pointsArray 数组中后，我们根据多边形的形状，
                    // 使用 THREE.Shape 对象的 moveTo() 和 lineTo() 方法，将多边形的顶点连接起来，形成一个封闭的多边形
                    if (i === 0) {
                        shape.moveTo(x, -y)
                    }
                    shape.lineTo(x, -y)
                }

                // 添加多个线
                lineGeometry.setFromPoints(pointsArray)
                //线基础材质
                const lineMaterial = new THREE.LineBasicMaterial({
                    color: 'red',
                })
                // 创建线
                let lines = new THREE.Line(lineGeometry, lineMaterial)
                lines.rotation.x = -0.5 * Math.PI
                lines.position.set(0, 2.4, 0)
                // 地图厚度
                lines.scale.set(1, 1, 0.3)
                // lines.layers.enable(1);
                // scene.add(lines)

                const extrudeSettings = {
                    depth: 4, // 表示几何体的深度
                    bevelEnabled: false, // 表示是否启用斜角
                    bevelSegments: 1, // 表示斜角的分段数
                    bevelThickness: 0.2, // 表示斜角的厚度
                }

                // 通过给定的轮廓路径和深度值来创建一个立体几何体
                // ExtrudeGeometry 类可以将一个二维轮廓路径拉伸成一个三维几何体，具体实现方式是将轮廓路径沿着法向量方向拉伸一定的深度，形成一个立体几何体
                const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
                const material = new THREE.MeshBasicMaterial({
                    color: `#1E293B`,
                    transparent: true,
                    opacity: 1,
                })
                const material1 = new THREE.MeshBasicMaterial({
                    // metalness: 0.3, // 目测属性已废弃
                    color: '#6b7280',
                    opacity: 1,
                })
                // MeshBasicMaterial 是 Three.js 中最简单的材质类型，不会受到光照等因素的影响，只显示基本的颜色和透明度。我们将其设置为半透明的深蓝色，以便后续在地图上显示
                const mesh = new THREE.Mesh(geometry, [material, material1])
                mesh.position.set(0, 2, 0)
                // 地图厚度
                mesh.scale.set(1, 1, 0.3)
                // 给mesh开启阴影
                mesh.castShadow = true
                mesh.receiveShadow = true
                mesh._color = color
                mesh.rotation.x = -0.5 * Math.PI
                mesh.properties = item.properties
                province.add(mesh)
            })
        })
        positions1 = new Float32Array(lines1.flat(1))
        // 设置顶点
        geometry1.setAttribute('position', new THREE.BufferAttribute(positions1, 3))
        // 设置 粒子透明度为 0
        opacitys1 = new Float32Array(positions1.length).map(() => 0)
        geometry1.setAttribute('aOpacity', new THREE.BufferAttribute(opacitys1, 1))

        scene.add(province)

        const material1 = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true, // 设置透明
            uniforms: {
              uSize: {
                value: params.pointSize
              },
              uColor: {
                value: new THREE.Color(params.pointColor)
              }
            }
        })
        points1 = new THREE.Points(geometry1, material1)
        points1.rotation.x = -0.5 * Math.PI
        points1.position.set(0, 3.3, 0)
        points1.scale.set(1, 1, 0.3)
        scene.add(points1)

        let {mesh: meshe, aMesh: ameshe1} = makeArcline(projection(projects['北京市']), projection(projects['上海市']))
        let  {mesh: meshe2, aMesh: ameshe2}  = makeArcline(projection(projects['北京市']), projection(projects['广东省']))
        let  {mesh: meshe3, aMesh: ameshe3}  = makeArcline(projection(projects['广东省']), projection(projects['上海市']))
        scene.add(meshe)
        scene.add(meshe2)
        scene.add(meshe3)
        scene.add(ameshe1)
        scene.add(ameshe2)
        scene.add(ameshe3)
}

const lineDraw = (polygon, color) => {
    const lineGeometry = new THREE.BufferGeometry()
    const pointsArray = new Array()
    let indexBol = true
    polygon.forEach((row) => {
        const [x, y] = projection(row)
        // 创建三维点
        pointsArray.push(new THREE.Vector3(x, -y, 0))

        if (indexBol) {
        lines1.push([x, -y, 0])
        }
    })
    indexBol = false
    // 放入多个点
    lineGeometry.setFromPoints(pointsArray)

    const lineMaterial = new THREE.LineBasicMaterial({
        color: color
    })

    const line = new THREE.Line(lineGeometry, lineMaterial)
    line.rotation.x = -0.5 * Math.PI
    line.position.set(0, 3.3, 0)
    line.scale.set(1, 1, 0.3)
    return line
}

export const setShining = (scene, camera, renderer) => {
    if (points1 && geometry1.attributes.position) {
        currentPos += pointSpeed
        for (let i = 0; i < pointSpeed; i++) {
          opacitys1[(currentPos - i) % lines1.length] = 0
        }
  
        for (let i = 0; i < 200; i++) {
          opacitys1[(currentPos + i) % lines1.length] = i / 50 > 2 ? 2 : i / 50
        }
        geometry1.attributes.aOpacity.needsUpdate = true
      }
      renderer.render(scene, camera)
}

// 光点柱
const dotBarlight = (posStart, colors) => {
    // 使用解构赋值将 posStart 数组中的三个元素分别赋值给 x0、y0、z0 变量，并将 z0 设置为 5
    // 这里的 posStart 数组应该是一个包含三个数字的数组，表示圆锥体的起始位置
    const [x0, y0, z0] = [...posStart, 5]

    // 使用缓冲区对象来存储几何体数据的，因此可以更高效地渲染大量的圆锥体
    // 建一个 ConeBufferGeometry 几何体对象，表示一个圆锥体。ConeBufferGeometry 是 Three.js 中的一个内置几何体类，
    // 用于创建圆锥体。这里我们设置圆锥体的底部半径为 0.25，高度为 3.5，分段数为 5
    const geometry = new THREE.ConeGeometry(0.25, 3.5, 5)
    const material1 = new THREE.MeshBasicMaterial({
        color: colors,
        transparent: true,
        opacity: 0.4,
    })
    const cylinder = new THREE.Mesh(geometry, material1)
    cylinder.position.set(x0, z0, y0)
    cylinder.layers.enable(1)
    return cylinder
}

const dotBarlight2 = (posStart, colors) => {
    // 调用 AnmiRingGeometry 函数，将圆锥体转换为环形动画。这个函数的作用是将圆锥体沿着一个环形路径运动，并在路径上显示出一些特效，比如颜色渐变、透明度变化
    // posStart 参数表示圆锥体的起始位置，colors 参数表示颜色数组，用于设置特效的颜色
    const [x0, y0, z0] = [...posStart, 3.5]
    const geometry2 = new THREE.RingGeometry(0, 0.15, 50)
    // transparent 设置 true 开启透明
    const material2 = new THREE.MeshBasicMaterial({
        color: colors,
        side: THREE.DoubleSide,
        transparent: true,
    })

    const circleY = new THREE.Mesh(geometry2, material2)
    // 绘制地图时 y轴取反 这里同步
    circleY.position.set(x0, z0, y0)
    circleY.scale.set(2, 2, 1)
    circleY.rotation.x = -0.5 * Math.PI
    
    // 小-圆环
    const geometry3 = new THREE.RingGeometry(0.25, 0.3, 6)
    // transparent 设置 true 开启透明
    const material3 = new THREE.MeshBasicMaterial({
        color: colors,
        side: THREE.DoubleSide,
        transparent: true,
    })

    const circleY3 = new THREE.Mesh(geometry3, material3)
    // 绘制地图时 y轴取反 这里同步
    circleY3.position.set(x0, z0, y0)
    circleY3.scale.set(2, 2, 1)
    circleY3.rotation.x = -0.5 * Math.PI
    circleY3.layers.enable(1)
    circleYs.push(circleY3)

    return {
        circleY,
        circleY3
    }
}

export const setLighting = () => {
    circleYs.forEach((mesh) => {
        // 目标 圆环放大 并 透明
        mesh._s += 0.01
        mesh.scale.set(5 * mesh._s, 5 * mesh._s, 5 * mesh._s)
        if (mesh._s <= 2) {
            mesh.material.opacity = 2 - mesh._s
        } else {
            mesh._s = 1
        }
    })
}

let colorHigh = new THREE.Color("rgb(33, 150, 243)")

const makeArcline = (posStart, posEnd) => {
    const [x1, y1, z1] = [...posStart, 3]
    const [x2, y2, z2] = [...posEnd, 3]
    const yHeight = 6
    const point1 = new THREE.Vector3(x1, z1, y1)
    const point2 = new THREE.Vector3(x2, z2, y2)
    const controlPoint = new THREE.Vector3(
        (point1.x + point2.x) / 2, 
        (point1.y + point2.y) / 2 + yHeight, 
        (point1.z + point2.z) / 2
    )
    // 创建三维二次贝塞尔曲线
    const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(point1.x, point1.y, point1.z),
        new THREE.Vector3(controlPoint.x, controlPoint.y, controlPoint.z),
        new THREE.Vector3(point2.x, point2.y, point2.z),
    )

    // 流动线效果
    const divisions = 20  // 曲线的分段数量
    const points = curve.getPoints(divisions) // 返回分段的点 31个

    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    line.geometry = geometry  // 全局保存一下
    let colors = new Float32Array(points.length * 4)

    points.forEach((d, i) => {
        colors[i * 4] = colorHigh.r
        colors[i * 4 + 1] = colorHigh.g
        colors[i * 4 + 2] = colorHigh.b
        colors[i * 4 + 3] = 1
    })

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    // 材质
    const material = new THREE.LineBasicMaterial({
        vertexColors: true, // 顶点着色
        linewidth: 5, // 理论上改变宽度的设置，实际上需要借助样本包模块来实现改变宽度
        transparent: true,
        side: THREE.DoubleSide,
    })

    const mesh = new THREE.Line(geometry, material)
    const aMesh = moveSpot(curve)
    return {mesh, aMesh}
}

const moveSpots = []
const moveSpot = (curve) => {
    // 线上的移动物体
    const aGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4)
    const aMater = new THREE.MeshPhongMaterial({ color: 0xff0000, side: THREE.DoubleSide })
    const aMesh = new THREE.Mesh(aGeo, aMater)
    // 保存曲线实例
    aMesh.curve = curve
    aMesh._s = 0
    moveSpots.push(aMesh)
    return aMesh
}
export const setMoveSpot = () => {
    moveSpots.forEach( (mesh) => {
        mesh._s += 0.006
        let tankPosition = new THREE.Vector3()
        tankPosition = mesh.curve.getPointAt(mesh._s % 1)
        mesh.position.set(tankPosition.x, tankPosition.y, tankPosition.z)
    })
}

let raycaster 
let mouse
export const setRaycaster = (scene, camera, mapRefCurrent, tipRefCurrent) => {
    raycaster = new THREE.Raycaster()
    mouse = new THREE.Vector2(0, 0)

    const onMouseMove = (event) => {
        mouse.x = (event.offsetX / mapRefCurrent.offsetWidth) * 2 - 1
        mouse.y = -(event.offsetY / mapRefCurrent.offsetHeight) * 2 + 1

        if (
            event.clientX > mapRefCurrent.getBoundingClientRect().left &&
            event.clientX < mapRefCurrent.getBoundingClientRect().right &&
            event.clientY > mapRefCurrent.getBoundingClientRect().top &&
            event.clientY < mapRefCurrent.getBoundingClientRect().bottom
        ) {
            tipRefCurrent.style.left = event.clientX + 'px'
            tipRefCurrent.style.top = event.clientY + 'px'
            aboutLastPick(scene, camera, tipRefCurrent)
        }
    }
    window.addEventListener('mousemove', onMouseMove,true)
}


let lastPick
const aboutLastPick = (scene, camera, tipRefCurrent) => {
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(
        scene.children,
        true
    )
    if (lastPick) {
        lastPick.object.material[0].color.set('#1e293b')
        lastPick.object.material[1].color.set('#1e293b')
    }
    lastPick = null
    lastPick = intersects.find(
        (item) => item.object.material && item.object.material.length === 2
    )
    if (lastPick) {
        lastPick.object.material[0].color.set(0x05e8fe)
        lastPick.object.material[1].color.set(0x05e8fe)

        const properties = lastPick.object.properties

        if (properties.name) {
            tipRefCurrent.childNodes[0].childNodes[0].textContent = properties.name
            tipRefCurrent.childNodes[0].childNodes[1].childNodes[1].textContent = properties.childrenNum
            tipRefCurrent.childNodes[0].childNodes[2].childNodes[1].textContent = properties.adcode
            tipRefCurrent.childNodes[0].childNodes[3].childNodes[1].textContent = properties.center
            tipRefCurrent.style.visibility = 'visible'
        }
    } else {
        tipRefCurrent.style.visibility = 'hidden'
    }
}
