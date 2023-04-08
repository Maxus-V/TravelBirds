import { useEffect, useRef } from "react"

import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js'

export const use3D = (name, options, data) => {

    const {camera: cameraParams, dirLight: dirLightParams, animationStep} = options
    const { initial, position: cameraParamsPosition, lookAt } = cameraParams
    const { position: dirLightParamsPosition } = dirLightParams

    //宽高变量
    let offsetWidth, offsetHeight
    //初始变量
    let camera, scene, clock, renderer
    //模型变量
    let model, skeleton, mixer
    const mixers = []

    const myCanvas = useRef(null)

    const init = (canvasContainer) => {
        //得到父元素宽度和高度
        offsetWidth = canvasContainer.parentNode.offsetWidth
        offsetHeight = canvasContainer.parentNode.offsetHeight

        //透视投影相机
        camera = new THREE.PerspectiveCamera( initial.fov, initial.aspect, initial.near, initial.far )
        camera.position.set( cameraParamsPosition.x, cameraParamsPosition.y, cameraParamsPosition.z )
        camera.lookAt( lookAt.x, lookAt.y, lookAt.z )

        //三维场景
        scene = new THREE.Scene()
        scene.background = new THREE.Color( 0xa0a0a0 )
        scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 )

        //计时器
        clock = new THREE.Clock()

        //室外光源，模拟来自天空的光线和来自地面的反射光线
        const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 )
        hemiLight.position.set( 0, 20, 0 )
        scene.add( hemiLight )

        //平行光源，模拟来自一个远处的点光源，一般作为主光源使用
        const dirLight = new THREE.DirectionalLight( 0xffffff )
        dirLight.position.set( dirLightParamsPosition.x, dirLightParamsPosition.y, dirLightParamsPosition.z )
        dirLight.castShadow = true
        dirLight.shadow.camera.top = 4
        dirLight.shadow.camera.bottom = - 4
        dirLight.shadow.camera.left = - 4
        dirLight.shadow.camera.right = 4
        dirLight.shadow.camera.near = 0.1
        dirLight.shadow.camera.far = 40
        scene.add( dirLight )

        //基本3D对象，它由几何体和材质组成，几何体定义Mesh的形状和大小，材质定义Mesh的外观和表面特性
        const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 200, 200 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) )
        mesh.rotation.x = - Math.PI / 2
        mesh.receiveShadow = true
        scene.add( mesh )

        //辅助对象，用于在场景中创建网格
        const grid = new THREE.GridHelper( 200, 40, 0x000000, 0x000000 )
		grid.material.opacity = 0.2
		grid.material.transparent = true
		scene.add( grid )

        const loader = new GLTFLoader()
        loader.load(`models/${name}.glb`, (gltf) => {

            model = SkeletonUtils.clone( gltf.scene ) //克隆骨架对象
            model.traverse( ( object ) => {
                if ( object.isMesh ) object.castShadow = true //指定物体投影
            } )
            scene.add( model )

            skeleton = new THREE.SkeletonHelper( model )
            skeleton.visible = false
            scene.add( skeleton )

            mixer = new THREE.AnimationMixer( model )
            mixer.clipAction( gltf.animations[ animationStep ] ).play()
            mixers.push( mixer )
            
            animate()
        }, undefined, (e) => {
            console.error(e)
        })

        //渲染器对象
        renderer = new THREE.WebGLRenderer( { antialias: true } )
        renderer.setPixelRatio( window.devicePixelRatio )
        renderer.setSize( offsetWidth, offsetHeight )
        renderer.outputEncoding = THREE.sRGBEncoding
        renderer.shadowMap.enabled = true 
        canvasContainer.appendChild( renderer.domElement )

        window.addEventListener( 'resize', onWindowResize )

        const controls = new OrbitControls( camera, renderer.domElement )
        controls.enablePan = false
        controls.enableZoom = false
        controls.target.set( 0, 1, 0 )
        controls.update()
    }

    const onWindowResize = () => {
        camera.aspect = 1
        camera.updateProjectionMatrix()
        renderer.setSize( offsetWidth, offsetHeight )
    }

    const animate = () => {
        requestAnimationFrame( animate )
        let mixerUpdateDelta = clock.getDelta()
        for ( const mixer of mixers ) mixer.update( mixerUpdateDelta )
        renderer.render( scene, camera )
    }

    const showModel = () => {
        console.log('hi')
        model.visible = !model.visible
    }

    const showSkeleton = () => {
        skeleton.visible = !skeleton.visible
    }

    useEffect(() => {
        let canvasContainer = myCanvas.current
        init(canvasContainer)
        animate()

        return () => {
            canvasContainer.innerHTML = ""
        }
    }, [options.animationStep])

    return {
        [`${name}Canvas`]:myCanvas,
        showModel,
        showSkeleton,
    }
}