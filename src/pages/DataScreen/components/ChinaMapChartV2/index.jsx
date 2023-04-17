import { useRef, useEffect } from "react"

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js'

import * as d3 from 'd3'
import TWEEN from '@tweenjs/tween.js'

import { getGeoJsonall } from '../../services/index'
import mapJson from "../../assets/china.json"

import "./ChinaMapChartV2.less"

let controls
let renderer, scene, camera, bloomComposer, finalComposer, lastPick
let raycaster
let mouse
const circleYs = []

let currentPos = 0
let pointSpeed = 20

// canvas节点及其父元素的宽、高、左边缘距、顶边缘距
let canvasContainer, offsetWidth, offsetHeight, offsetLeft, offsetTop, innerWidth, innerHeight

const BLOOM_LAYER = 1

const bloomLayer = new THREE.Layers()
bloomLayer.set(BLOOM_LAYER)
const materials = {}
const darkMaterials = {}
const clock = new THREE.Clock()
let test = 0

const vs = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`
const fs = `
uniform sampler2D baseTexture;
uniform sampler2D bloomTexture;
varying vec2 vUv;
void main() {
  gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );
}
`

const params = {
    pointSize: 2.0,
    pointColor: '#4ec0e9'
  }

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


const ChinaMapChartV2 = (props) => {

    // 获取 DOM 节点，挂载 canvas
    const mapRef = useRef(null)

    const tipRef = useRef(null)

    // 设置恒定变量，保存省份中心坐标
    const centerLatlng = useRef({})

    const init = (mapCurrent) => {
        canvasContainer = mapCurrent
        offsetWidth = mapCurrent.parentNode.offsetWidth
        offsetHeight = mapCurrent.parentNode.offsetHeight
        offsetLeft = mapCurrent.parentNode.offsetLeft
        offsetTop = mapCurrent.parentNode.offsetTop
        innerWidth = window.innerWidth
        innerHeight = window.innerHeight

        // 三维世界
        scene = new THREE.Scene()
        scene.background = new THREE.Color('#000000')

        // 辅助观察的坐标系
        const axesHelper = new THREE.AxesHelper(150)
        scene.add(axesHelper)

        // 设置点光源
        // const pointLight = new THREE.PointLight(0xffffff, 1.0)
        // pointLight.position.set(0, 30, 0)
        // scene.add(pointLight)

        // 模拟人眼观察这个世界
        camera = new THREE.PerspectiveCamera(
            40, // 圆锥角度
            window.innerWidth / window.innerHeight, // 圆锥底部宽高比
            0.01, // 圆锥点到近截面的距离
            1000, // 圆锥点到远截面的距离
        )
        // 摄像机在三维空间中的位置坐标，默认是坐标原点
        camera.position.set(30.9, 21.7, 37.4)
        //假设自己站在位置坐标上，手拿着相机，相机观察目标指向Threejs 3D空间中某个位置
        camera.lookAt(0, 0, 0)

        // 渲染器
        // antialias 减少图像边缘处的锯齿状物体边缘的颗粒感 使得渲染出来的图像更加平滑
        // alpha 开启透明度，可以让场景中的物体透明或半透明
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        // 阴影渲染
        renderer.shadowMap.enabled = true
        // Three.js 旧版本的阴影渲染 同上
        renderer.shadowMapEnabled = true
        // 开启阴影的柔和效果，可以让阴影边缘更加平滑
        renderer.shadowMapSoft = true
        // 使用 PCFSoftShadowMap 类型的阴影渲染器，这种类型的阴影渲染器可以提供更加柔和的阴影效果
        renderer.shadowMap.type = THREE.PCFSoftShadowMap
        //解决canvas画布输出模糊问题
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setSize(offsetWidth, offsetHeight)
        mapCurrent.appendChild(renderer.domElement)
        window.addEventListener( 'resize', onWindowResize )
        // renderer.render(scene, camera) 相当于拿着照相机，对周围场景进行拍照操作

        // 辉光材质 泛光（Bloom）效果
        // 用于渲染场景和相机
        const renderPass = new RenderPass(scene, camera)
        // 实现泛光效果
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(
                renderer.domElement.offsetWidth,
                renderer.domElement.offsetHeight,
            ), // 泛光纹理的分辨率
            1,
            1,
            0.1,
        )
        bloomPass.threshold = 0 // 泛光阈值
        bloomPass.strength = 1.6 // 泛光强度
        bloomPass.radius = 0 // 泛光半径
        // 创建了一个 EffectComposer 对象，用于管理后期处理的通道
        bloomComposer = new EffectComposer(renderer)
        // 表示不直接将渲染结果输出到屏幕上
        bloomComposer.renderToScreen = false
        bloomComposer.addPass(renderPass)
        bloomComposer.addPass(bloomPass)
        // 渲染场景时，先使用 bloomComposer 渲染泛光效果，再将渲染结果输出到屏幕上

        // 普通材质 自定义着色器
        finalComposer = new EffectComposer(renderer)
        // 创建了一个 FxaaPass 对象，用于实现 FXAA 抗锯齿效果
        const FxaaPass = createFxaaPass()
        // 创建了一个 ShaderPass 对象，用于实现自定义的后期处理效果
        const shaderPass = new ShaderPass(
            // 允许开发者使用自定义的着色器程序来渲染物体
            // 与其他材质类型不同，ShaderMaterial 不依赖于 Three.js 内置的渲染管线，因此可以实现更加灵活和高效的渲染效果
            new THREE.ShaderMaterial({
                // 支持使用 Uniform 变量来传递数据到着色器程序中，例如光照信息、纹理坐标等
                uniforms: {
                    baseTexture: { value: null }, // 原始纹理
                    bloomTexture: { value: bloomComposer.renderTarget2.texture }, // 泛光纹理
                }, 
                //通过指定顶点着色器和片元着色器来创建，开发者可以在这两个着色器程序中编写自己的 GLSL 代码，实现各种复杂的渲染效果
                vertexShader: vs,
                fragmentShader: fs,
                defines: {}, // 定义了需要在着色器代码中使用的宏定义
            }), // 用于渲染的材质
            'baseTexture', // 用于渲染的纹理 ID，这里设置为 'baseTexture'，表示使用 baseTexture uniform 中的纹理进行渲染
        )    

        // shaderPass.needsSwap = true 表示需要交换前后缓冲区
        // 在 Three.js 中，渲染场景时会使用两个缓冲区，一个用于渲染前景，一个用于渲染背景
        //默认情况下，渲染完前景后会自动交换前后缓冲区，使得前景成为背景，背景成为前景
        // 这样可以避免渲染时出现闪烁的情况
        //在使用 EffectComposer 和 ShaderPass 进行后期处理时，需要手动控制缓冲区的交换
        // 因为后期处理可能需要多次渲染，而每次渲染后都需要交换前后缓冲区，才能保证后续的渲染结果正确
        // 因此，设置 shaderPass.needsSwap = true 表示需要在渲染完当前 pass 后交换前后缓冲区
        shaderPass.needsSwap = true
        // 创建自定义的着色器Pass
        finalComposer.addPass(renderPass)
        finalComposer.addPass(shaderPass)
        finalComposer.addPass(FxaaPass)

        addScence()
        addlight()
        render()
        renderanmi()
    }

    // 灯光
    const addlight = () => {
        // 平行光
        let spotLight = new THREE.AmbientLight(0xcccccc)
        spotLight.position.set(-50, 60, 15)
        // spotLight.castShadow = true // 让光源产生阴影
        spotLight.shadowCameraVisible = true
        scene.add(spotLight)
    }

    // 搭建组件
    const addScence = () => {
        // 添加辅助线-后期可以关闭
        // var axisHelper = new THREE.AxisHelper(500)
        // scene.add(axisHelper)
        setRaycaster()
        setTerritory()
        addFloot()
        mouseMove()
        CameraAnmition()
    }

    // 几何体集合
    const setTerritory = () => {
        //新建圆柱体
        const geometry1a = new THREE.CylinderGeometry(29, 29, 1, 100, 1)
        
        // transparent 设置 true 开启透明
        // 物理材质
        const material1 = new THREE.MeshStandardMaterial({
            color: '#ffffff',
            transparent: false,
            // opacity:0.5, // 开启透明，这里还要设置透明度
        })

        // 使用分层渲染，不管用什么材质对象，都必须克隆 geometry1a.clone()
        // 形状，填充材料
        const circleY1 = new THREE.Mesh(geometry1a.clone(), material1)

        // 绘制地图时 y轴取反 这里同步
        // 设置了 circleY1 的位置为 (0, 1, 0)，即在 y 轴上向上移动了一个单位
        circleY1.position.set(0, 1, 0)
        // 将 circleY1 的不透明度设置为 1，即完全不透明
        circleY1.material.opacity = 1
        // 将 circleY1 的缩放比例设置为 (1, 1, 1)，即不进行缩放
        circleY1.scale.set(1, 1, 1)
        // 将 circleY1 绕 y 轴旋转了 -0.5 * Math.PI 弧度，即逆时针旋转了 90 度，使其面向 x 轴正方向
        circleY1.rotation.y = -0.5 * Math.PI

        //环形几何体
        const geometry4a = new THREE.RingGeometry(31, 31.5, 200)

        // transparent 设置 true 开启透明
        const material4 = new THREE.MeshStandardMaterial({
            side: THREE.DoubleSide,
            color: '#13154f',
            transparent: true,
            opacity: 0.8,
        })

        const circleY4 = new THREE.Mesh(geometry4a.clone(), material4.clone())
        // 绘制地图时 y轴取反 这里同步
        // 设置了 circleY4 的位置为 (0, 0, -0.5)，即在 z 轴上向负方向移动了一个单位
        circleY4.position.set(0, 0, -0.5)
        circleY4.scale.set(1, 1, 1)
        // 在原来的基础上进行了 1.2 倍的缩放。注意，这里使用了 scale.multiplyScalar() 方法，将原来的缩放比例乘以一个标量，而不是直接设置一个新的缩放比例
        circleY4.scale.multiplyScalar(1.2)
        // 将 circleY4 绕 x 轴旋转了 -0.5 * Math.PI 弧度，即逆时针旋转了 90 度，使其面向 y 轴正方向。这里的旋转方向和上一个例子不同，因为这里是绘制地图时 y 轴取反，所以需要进行相应的调整
        circleY4.rotation.x = -0.5 * Math.PI
        // 将 circleY4 添加到第一个图层（layer 1）中，即将其设置为可见
        circleY4.layers.enable(1)

        //半圆环
        const geometry5a = new THREE.RingGeometry(31.5, 32.7, 200, 0.6, 1, 3)
        // transparent 设置 true 开启透明
        const material5 = new THREE.MeshStandardMaterial({
            side: THREE.DoubleSide,
            color: '#13154f',
            transparent: true,
            opacity: 0.8,
        })

        const circleY5 = new THREE.Mesh(geometry5a.clone(), material5.clone())
        // 绘制地图时 y轴取反 这里同步
        circleY5.position.set(0, 0, -0.5)
        circleY5.scale.set(1, 1, 1)
        circleY5.rotation.x = -0.5 * Math.PI
        circleY5.layers.enable(1)

        //整圆
        const geometry5b = new THREE.RingGeometry(0, 28.5, 200)
        // transparent 设置 true 开启透明
        const material5a = new THREE.MeshStandardMaterial({
            side: THREE.DoubleSide,
            color: '#6b7280',
            transparent: true,
        })

        const circleY5a = new THREE.Mesh(geometry5b.clone(), material5a.clone())
        // 绘制地图时 y轴取反 这里同步
        circleY5a.position.set(0, 1.6, 0)
        circleY5a.scale.set(1, 1, 1)
        circleY5a.rotation.x = -0.5 * Math.PI

        //圆环4
        const geometry5r = new THREE.RingGeometry(28, 29, 200)
        // transparent 设置 true 开启透明
        const material5r = new THREE.MeshStandardMaterial({
            side: THREE.DoubleSide,
            color: '#29fcff',
            transparent: true,
        })

        const circleY5r = new THREE.Mesh(geometry5r.clone(), material5r.clone())
        // 绘制地图时 y轴取反 这里同步
        circleY5r.position.set(0, 1.65, 0)
        circleY5r.scale.set(1, 1, 1)
        circleY5r.rotation.x = -0.5 * Math.PI

        // 将 虚拟对象 添加到 三维场景中
        scene.add(circleY5r)
        scene.add(circleY5a)
        scene.add(circleY1)
        scene.add(ArcCurveGeometry())
        scene.add(circleY5)
        scene.add(circleY4)
        scene.add(rectShape())
        render()
    }

    // 地板 发光墙，流体墙
    const addFloot = () => {
        //矩形平面
        const geometry = new THREE.PlaneGeometry(1000, 1000, 1, 1)
        //网格基础材质， 目前只有这种材质不受光源影响
        const material = new THREE.MeshBasicMaterial({ color: '#13154f' })
        const floor = new THREE.Mesh(geometry, material)
        floor.material.side = THREE.DoubleSide
        floor.rotation.x = 0.5 * Math.PI
        scene.add(floor)
    }

     // 多面圆环
    const rectShape = () => {
        //圆环几何体 
        const geometry = new THREE.TorusGeometry(27, 0.3, 16, 100, 5)
        const material = new THREE.MeshBasicMaterial({ color: '#29fcff' })
        const torus = new THREE.Mesh(geometry, material)
        torus.position.set(0, 1.65, 0)
        torus.scale.set(1, 1, 1)
        torus.rotation.x = -0.5 * Math.PI
        return torus
    }

    // 绘制虚线的椭圆形
    const ArcCurveGeometry = () => {
        const positions = [] // 存储椭圆形的顶点位置
        const colors = [] // 存储椭圆形的颜色信息
        // Geometry 的一种优化版本，不包含任何面、顶点等信息，而是将这些信息存储在缓冲区中，以提高渲染性能，用于创建复杂的几何体，如地形、粒子系统、流体
        const lineGeometry = new THREE.BufferGeometry() // 存储椭圆形的几何信息

        // 创建了一个椭圆曲线 curve
        const curve = new THREE.EllipseCurve(
            0, // ax: 椭圆中心点的 x 坐标，默认为 0
            0, // ay: 椭圆中心点的 y 坐标，默认为 0
            30, // xRadius: 椭圆的 x 轴半径，默认为 1
            30, // yRadius: 椭圆的 y 轴半径，默认为 1
            0, // aStartAngle: 椭圆弧的起始角度，默认为 0
            2 * Math.PI, // aEndAngle: 椭圆弧的结束角度，默认为 2 * Math.PI
            false, // aClockwise: 椭圆弧是否按逆时针方向绘制，默认为 false，表示按顺时针方向绘制
            0, // aRotation: 椭圆的旋转角度，默认为 0
        )
        // 将椭圆曲线上的点存储到 BufferGeometry 对象中，并将其作为 THREE.Line 对象的几何信息
        // 获取了 100 个点，用于绘制椭圆形的线段
        const points = curve.getPoints(100)

        // 这里使用了 THREE.BufferAttribute 类型来存储数据，
        // 其中第一个参数是数据数组，第二个参数是每个数据项的大小，这里是 3，表示每个数据项包含三个值，即 x、y、z 坐标或颜色的 RGB 值
        // 第三个参数是一个布尔值，表示数据是否需要更新，这里设置为 true
        lineGeometry.attributes['position'] = new THREE.BufferAttribute(new Float32Array(positions), 3, true)
        lineGeometry.attributes['color'] = new THREE.BufferAttribute(new Float32Array(colors), 3, true)

        // 将传入的点数组作为几何信息存储到 BufferGeometry 对象中，并自动计算顶点法向量和包围盒等信息
        lineGeometry.setFromPoints(points)

        // 虚线材质
        const material = new THREE.LineDashedMaterial({
            color: '#ff0000',
            scale: 1.1,
            dashSize: 100,
            gapSize: 10,
          })
        const ellipse = new THREE.Line(lineGeometry, material)
        // 计算了椭圆形的线段长度，并将其设置为虚线的间隔大小
        ellipse.computeLineDistances()
        ellipse.rotation.x = -0.5 * Math.PI
        // 将 ellipse 添加到第一个图层（layer 1）中，即将其设置为可见
        ellipse.layers.enable(1)
        return ellipse
    }

    // 抗锯齿优化
    const createFxaaPass = () => {
        let FxaaPass = new ShaderPass(FXAAShader)
        // 获取了当前渲染器的像素比例，用于计算分辨率
        const pixelRatio = renderer.getPixelRatio()
        // 分别对应着屏幕的宽度和高度，这里的值是根据实际情况进行调整
        FxaaPass.material.uniforms['resolution'].value.x =
        1 / (window.innerWidth * pixelRatio)
        FxaaPass.material.uniforms['resolution'].value.y =
        1 / (window.innerHeight * pixelRatio)
        // 表示将该着色器通道的输出直接渲染到屏幕上
        FxaaPass.renderToScreen = true
        return FxaaPass
    }

    // 鼠标移动
    const mouseMove = () => {
        controls = new OrbitControls(camera, renderer.domElement) //创建控件对象
        controls.addEventListener('change', render)
    }

    // 地图
    const setMapDom = (e) => {
        const color = '#008c8c'
        // 用于存储中国地图的所有几何体
        const province = new THREE.Object3D()
        
        const projection = d3
        .geoMercator() // 创建了一个墨卡托投影
        .center([106.0, 39.5]) // 设置了中心点
        .scale(47) // 设置了缩放比例
        .translate([0, 0]) // 设置了平移距离

        e.forEach((item, index) => {
            // 从 item 对象中获取 geometry.coordinates[0]，这是一个包含多个坐标点的数组，表示该地区的边界
            let cod = item.geometry.coordinates[0]
            

            // 判断该地区是否有名称，如果有，就将其中心点坐标保存到 centerLatlng.current 对象中，以便后续使用
            if (item.properties.name) {
                centerLatlng.current[item.properties.name] = item.properties.center
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
                dotBarlight(
                    projection(item.properties.center),
                    item.properties.name == '北京市' ? 'red' : item.properties.name == '上海市' ? 'yellow': '#008c8c',
                )
            }
            // 判断该地区的坐标点数组长度是否大于 1，如果是，就将其转换为一个包含一个数组的数组，以便后续使用
            // 因为 Three.js 中的几何体需要一个包含多个坐标点的数组，而有些地区的坐标点数组长度只有 1，需要进行特殊处理
            cod = cod.length > 1 ? [[...cod]] : cod

            cod.forEach((polygon) => {
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
                    color: '#13154f',
                })
                // 创建线
                let lines = new THREE.Line(lineGeometry, lineMaterial)
                lines.rotation.x = -0.5 * Math.PI
                lines.position.set(0, 2.5, 0)
                // 地图厚度
                lines.scale.set(1, 1, 0.3)
                // lines.layers.enable(1);
                scene.add(lines)

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

        scene.add(province)
        // const line = lineConection(projection([106.557691, 29.559296]), projection([121.495721, 31.236797]))
        // scene.add(line)
        render()
    }

    const lines = []
    const geometry = new THREE.BufferGeometry()
    let positions = null
    let opacitys = null

    // 地图描边
    const setmapborder = (e) => {
        const province = new THREE.Object3D()
        const projection = d3
        .geoMercator()
        .center([106.0, 39.5])
        .scale(47)
        .translate([0, 0])

        e.forEach((item, index) => {
            let cod = item.geometry.coordinates[0]
            cod = cod.length > 1 ? [[...cod]] : cod

            cod.forEach((polygon) => {
                const shape = new THREE.Shape()
                const lineGeometry = new THREE.BufferGeometry()
                const pointsArray = new Array()
                for (let i = 0; i < polygon.length; i++) {
                    // projection -- 坐标转化
                    let [x, y] = projection(polygon[i])
                    pointsArray.push(new THREE.Vector3(x, -y, 3))
                    if (i === 0) {
                        shape.moveTo(x, -y)
                    }
                    shape.lineTo(x, -y)
                }

                // 添加多个线
                lineGeometry.setFromPoints(pointsArray)
                const lineMaterial = new THREE.LineBasicMaterial({
                    color: '#13154f',
                })
                // 创建线
                let lines = new THREE.Line(lineGeometry, lineMaterial)
                lines.rotation.x = -0.5 * Math.PI
                lines.position.set(0, 0.2, 0)

                // 地图厚度
                lines.scale.set(1, 1, 1)
                lines.layers.enable(1)
                scene.add(lines)
                province.add(lines)
            })
        })

        positions = new Float32Array(lines.flat(1))
        // 设置顶点
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        // 设置 粒子透明度为 0
        opacitys = new Float32Array(positions.length).map(() => 0)
        geometry.setAttribute('aOpacity', new THREE.BufferAttribute(opacitys, 1))
        scene.add(province)
        const material = new THREE.ShaderMaterial({
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
        const points = new THREE.Points(geometry, material)
        scene.add(points)
        render()
    }

    // 动画集合,波动光圈
    const AnmiRingGeometry = (post, colors) => {
        const [x0, y0, z0] = [...post, 3.5]
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
        scene.add(circleY)

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
        scene.add(circleY3)
    }

    // 光点柱
    const dotBarlight = (posStart, colors) => {
        // 使用解构赋值将 posStart 数组中的三个元素分别赋值给 x0、y0、z0 变量，并将 z0 设置为 5
        // 这里的 posStart 数组应该是一个包含三个数字的数组，表示圆锥体的起始位置
        const [x0, y0, z0] = [...posStart, 5]
        // 调用 AnmiRingGeometry 函数，将圆锥体转换为环形动画。这个函数的作用是将圆锥体沿着一个环形路径运动，并在路径上显示出一些特效，比如颜色渐变、透明度变化
        // posStart 参数表示圆锥体的起始位置，colors 参数表示颜色数组，用于设置特效的颜色
        AnmiRingGeometry([x0, y0], colors)

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
        scene.add(cylinder)
        render()
    }

    const lineConection = (posStart, posEnd) => {
        const [x0, y0, z0] = [...posStart, 10.01]
        const [x1, y1, z1] = [...posEnd, 10.01]

        // 使用QuadraticBezierCurve3() 创建 三维二次贝塞尔曲线
        const curve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(x0, -y0, z0),
            new THREE.Vector3((x0 + x1) / 2, -(y0 + y1) / 2, 20),
            new THREE.Vector3(x1, -y1, z1)
        )

        const lineGeometry = new THREE.BufferGeometry()
        // 获取曲线 上的50个点
        var points = curve.getPoints(500)
        var positions = []
        var colors = []
        var color = new THREE.Color()

        // 给每个顶点设置演示 实现渐变
        for (var j = 0; j < points.length; j++) {
            color.setHSL(0.81666 + j, 0.88, 0.715 + j * 0.0025) // 粉色
            colors.push(color.r, color.g, color.b)
            positions.push(points[j].x, points[j].y, points[j].z)
        }

        lineGeometry['position'] = new THREE.BufferAttribute(new Float32Array(positions), 3, true)
        lineGeometry['color'] = new THREE.BufferAttribute(new Float32Array(colors), 3, true)

        const material = new THREE.LineBasicMaterial({ vertexColors: 2, side: THREE.DoubleSide, color: '#13154f', })
        const line = new THREE.Line(lineGeometry, material)

        console.log(x0, y0, z0, x1, y1, z1, curve)
        return line
    }

    
    const spotCircle = (spot) => {
        // 圆
        const geometry1 = new THREE.CircleGeometry(0.5, 200)
        const material1 = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide })
        const circle = new THREE.Mesh(geometry1, material1)
        // 绘制地图时 y轴取反 这里同步
        circle.position.set(spot[0], -spot[1], spot[2] + 0.1)
        scene.add(circle)

        // 圆环
        const geometry2 = new THREE.RingGeometry(0.5, 0.7, 50)
        // transparent 设置 true 开启透明
        const material2 = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide, transparent: true })
        const circleY = new THREE.Mesh(geometry2, material2)
        circleY.position.set(spot[0], -spot[1], spot[2] + 0.1)
        scene.add(circleY)

        circleYs.push(circleY)
    }

    const lineConnect = (posStart, posEnd) => {
        console.log('posStart, posEnd', posStart, posEnd)
        // 根据目标坐标设置3D坐标  z轴位置在地图表面
        const [x0, y0, z0] = [8.535504694343786, -3.43180172321248733, 10.01]
        const [x1, y1, z1] = [5.972341102748558, -3.81653550771486, 10.01]
        

        // 使用QuadraticBezierCurve3() 创建 三维二次贝塞尔曲线
        const curve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(x0, -y0, z0),
            new THREE.Vector3((x0 + x1) / 2, -(y0 + y1) / 2, 20),
            new THREE.Vector3(x1, -y1, z1)
        )

        // 绘制 目标位置
        spotCircle([x0, y0, z0])
        spotCircle([x1, y1, z1])

        const lineGeometry = new THREE.BufferGeometry()
        // 获取曲线 上的50个点
        let points = curve.getPoints(50)
        let positions = []
        let colors = []
        let color = new THREE.Color()

        // 给每个顶点设置演示 实现渐变
        for (let j = 0; j < points.length; j++) {
            color.setHSL(0.81666 + j, 0.88, 0.715 + j * 0.0025) // 粉色
            colors.push(color.r, color.g, color.b)
            positions.push(points[j].x, points[j].y, points[j].z)
        }

        // 放入顶点 和 设置顶点颜色
        lineGeometry['position'] = new THREE.BufferAttribute(new Float32Array(positions), 3, true)
        lineGeometry['color'] = new THREE.BufferAttribute(new Float32Array(colors), 3, true)

        const material = new THREE.LineBasicMaterial({ vertexColors: 2, side: THREE.DoubleSide, color: '#13154f', })
        const line = new THREE.Line(lineGeometry, material)
        console.log('line', line)
        return line

        
    }


    const CameraAnmition = () => {
        // 使用 Tween.js 库创建了三个 Tween 对象，分别表示相机从一个位置移动到另一个位置的动画
        // Tween.js 是 Three.js 中的一个动画库，用于创建平滑的动画效果
        const tweena = cameraCon(
            { x: 89.67626699596627, y: 107.58058095557215, z: 51.374711690741705 },
            { x: 89.67626699596627, y: 107.58058095557215, z: 51.374711690741705 },
            300,
        )
        const tweenb = cameraCon(
            { x: 89.67626699596627, y: 107.58058095557215, z: 51.374711690741705 },
            { x: 31.366485208227502, y: 42.7325471436067, z: 26.484221462746017 },
            800,
        )
        const tweenc = cameraCon(
            { x: 31.366485208227502, y: 42.7325471436067, z: 26.484221462746017 },
            { x: 32.19469382023058, y: 22.87664020700182, z: 27.742681212371384 },
            1000,
        )
        // 调用 cameraCon 函数创建了三个 Tween 对象，分别为 tweena、tweenb 和 tweenc
        // 这个函数的作用是创建一个 Tween 对象，表示相机从一个位置移动到另一个位置的动画
        // 其中，第一个参数表示相机的起始位置，第二个参数表示相机的目标位置，第三个参数表示动画的持续时间
        // 着，我们使用 chain 方法将三个 Tween 对象连接起来，形成一个动画序列。chain 方法的作用是将一个 Tween 对象连接到另一个 Tween 对象的末尾，形成一个动画序列
        // 这样，当第一个 Tween 对象完成时，会自动启动第二个 Tween 对象，以此类推
        // 最后，我们调用 start 方法启动第一个 Tween 对象，开始整个动画序列。start 方法的作用是启动一个 Tween 对象，开始执行动画
        // 由于我们已经将三个 Tween 对象连接起来，因此只需要启动第一个 Tween 对象即可，整个动画序列会自动执行
        tweena.chain(tweenb)
        tweenb.chain(tweenc)
        tweena.start()
    }

    const cameraCon = (
        p1 = { x: 0, y: 0, z: 0 },
        p2 = { x: 30, y: 30, z: 30 }, // p1 和 p2 是包含 x、y 和 z 坐标的对象，表示相机的起始位置和目标位置
        time = 6000, // time 表示动画的持续时间，默认为 6000 毫秒
    ) => {
        // 创建了一个 Tween 对象 tween1，用于表示相机从 p1 移动到 p2 的动画
        // 具体来说，我们使用 new TWEEN.Tween(p1) 创建了一个 Tween 对象，将其起始值设置为 p1
        // 然后，我们使用 .to(p2, time || 200000) 方法将 Tween 对象的目标值设置为 p2，并指定动画的持续时间
        // 在这里，我们使用了 TWEEN.Easing.Quadratic.InOut 缓动函数，使得动画效果更加平滑
        const tween1 = new TWEEN.Tween(p1)
        .to(p2, time || 200000)
        .easing(TWEEN.Easing.Quadratic.InOut)

        // 接下来，我们定义了一个名为 update 的函数，用于在 Tween 对象更新时更新相机的位置
        // 具体来说，我们使用 camera.position.set(p1.x, p1.y, p1.z) 将相机的位置设置为 Tween 对象的当前值
        const update = () => {
            camera.position.set(p1.x, p1.y, p1.z)
        }
        // 使用 tween1.onUpdate(update) 将 update 函数绑定到 Tween 对象的 onUpdate 事件上，以便在 Tween 对象更新时自动调用 update 函数。最后，我们返回 Tween 对象 tween1，以便在其他地方使用
        tween1.onUpdate(update)
        return tween1
    }

    
    const setRaycaster = () => {
        raycaster = new THREE.Raycaster()
        mouse = new THREE.Vector2()
        
        const onMouseMove = (event) => {
            // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
            if (event.clientX > 415 && event.clientY > 85 && event.clientY < 450 && event.clientX < 1030) {
                mouse.x = (event.clientX / window.innerWidth) * 2 - 1
                mouse.y = -(event.clientY / window.innerHeight) * 2.5 + 1
                tipRef.current.style.left = event.clientX + 2 + 'px'
                tipRef.current.style.top = event.clientY + 2 + 'px'
            }
            
        }
        window.addEventListener('mousemove', onMouseMove, false)
    }
  
    
    // 用于更新场景中的动画效果。具体来说，该函数会在每一帧更新时被调用
    const renderanmi = () => {
        // 在函数内部，我们首先获取了当前时间与上一帧时间的差值 dt，以便在动画中使用。然后，我们使用 Date.now() 获取当前时间，并将其赋值给 start 变量，以便在下一帧更新时计算帧率
        const dt = clock.getDelta()
        // 接下来，我们调用 TWEEN.update() 方法，以更新 Tween.js 库中的 Tween 对象。然后，我们调用 controls.update() 方法，以更新 OrbitControls 对象
        TWEEN.update()
        controls.update()

        aboutLastPick()

        xuanguang()
        // 调用 render() 方法，以渲染场景中的所有物体。最后，我们使用 window.requestAnimationFrame() 方法请求下一帧的渲染，并将其赋值给 test 变量。如果 test 小于 1000，那么就会继续请求下一帧的渲染，否则就会停止渲染
        render()
        // if (test < 1000) test = window.requestAnimationFrame(renderanmi)
        test = window.requestAnimationFrame(renderanmi)
    }

    const xuanguang = () => {
        if (geometry.attributes.position) {
            currentPos += pointSpeed
            for (let i = 0; i < pointSpeed; i++) {
              opacitys[(currentPos - i) % lines.length] = 0
            }
      
            for (let i = 0; i < 200; i++) {
              opacitys[(currentPos + i) % lines.length] = i / 50 > 2 ? 2 : i / 50
            }
            geometry.attributes.aOpacity.needsUpdate = true
        }
    }

    // 渲染
    const render = () => {
        scene.traverse(darkenNonBloomed2)
        // 2. 用 bloomComposer 产生辉光
        bloomComposer.render()
        // 3. 将转成黑色材质的物体还原成初始材质
        scene.traverse(restoreMaterial)
        // 4. 用 finalComposer 作最后渲染
        finalComposer.render()

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

        canvasContainer = mapRef.current
    }

    // 用于将不在 bloomLayer 中的物体材质变暗。具体来说，该函数会遍历场景中的所有物体，如果该物体的材质存在且不在 bloomLayer 中，那么就将其材质变暗
    const darkenNonBloomed2 = (obj) => {
        const material = obj.material
        // 在函数内部，我们首先获取了该物体的材质，并将其赋值给 material 变量
        // 然后，我们使用 bloomLayer.test(obj.layers) 方法判断该物体是否在 bloomLayer 中
        // 如果不在，那么就将该物体的材质变暗
        if (material && bloomLayer.test(obj.layers) === false) {
            // 接着，我们将该物体的材质存储到 materials 对象中，以便在后面恢复材质时使用
            // 然后，我们判断 darkMaterials 对象中是否已经存在该材质类型的变暗材质
            // 如果不存在，那么就使用 Object.getPrototypeOf(material).constructor 获取该材质的构造函数，并使用该构造函数创建一个新的变暗材质
            // 最后，我们将该物体的材质替换为变暗材质
            materials[obj.uuid] = material
            if (!darkMaterials[material.type]) {
                const Proto = Object.getPrototypeOf(material).constructor
                darkMaterials[material.type] = new Proto({ color: 0x000000 })
            }
            obj.material = darkMaterials[material.type]
        }
        // 这段代码的作用是将不在 bloomLayer 中的物体的材质变暗，以便突出 bloomLayer 中的物体。同时，它还会存储原始材质，以便在后面恢复材质时使用
    }

    // 用于恢复物体的原始材质
    // 具体来说，该函数会接收一个物体作为参数，然后判断该物体的材质是否已经被存储在 materials 对象中。如果是，那么就将该物体的材质替换为原始材质，并从 materials 对象中删除该材质
    const restoreMaterial = (obj) => {
        // 函数内部，我们首先使用 obj.uuid 获取该物体的唯一标识符，并使用 materials[obj.uuid] 获取该物体的原始材质
        // 然后，我们判断该材质是否存在。如果存在，那么就将该物体的材质替换为原始材质，并使用 delete materials[obj.uuid] 将该材质从 materials 对象中删除
        if (materials[obj.uuid]) {
            obj.material = materials[obj.uuid]
            delete materials[obj.uuid]
        }
    }

    const onWindowResize = () => {
        camera.aspect = 1
        camera.updateProjectionMatrix()
        // renderer.setSize( offsetWidth, offsetHeight )
    }

    const aboutLastPick = () => {
        raycaster.setFromCamera(mouse, camera)
        const intersects = raycaster.intersectObjects(
            scene.children,
            true
        )
        // 恢复上一次清空的
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
        }

        if (lastPick) {
            const properties = lastPick.object.properties
            tipRef.current.textContent = properties.name
            tipRef.current.style.visibility = 'visible'
        } else {
            tipRef.current.style.visibility = 'hidden'
        }
    }

	useEffect(() => {
        let mapRefCurrent = mapRef.current
        init(mapRefCurrent)
        // getGeoJsonall('100000_full').then((e) => {
        //     if(e.data.features) {
        //         setMapDom(mapJson.features)
        //         setmapborder(mapJson.features)
        //     }
        // })
        setMapDom(mapJson.features)
        setmapborder(mapJson.features)
        return () => {
            controls.removeEventListener('change')
            mapRefCurrent.innerHTML = ""
        }
	}, [])

	return (
		<div className="content-box2">
            <div className="mapRef" ref={mapRef}></div>
            <div className="tipRef" ref={tipRef}>2222</div>
		</div>
	)
}

export default ChinaMapChartV2