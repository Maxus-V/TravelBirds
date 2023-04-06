import { useRef, useEffect } from 'react'

import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js'

import './ThreeDimensionV2.less'

let camera, scene, renderer, clock, renderer1, camera1
const mixers = []

const init = (mycanvas) => {
    camera = new THREE.PerspectiveCamera( 45, 1, 1, 1000 )
    camera.position.set( 2, 3, - 6 )
    camera.lookAt( 0, 1, 0 )

    camera1 = new THREE.PerspectiveCamera( 45, 1, 1, 1000 )
    camera1.position.set( 2, 3, - 6 )
    camera1.lookAt( 0, 1, 0 )

    clock = new THREE.Clock()
    scene = new THREE.Scene()
    scene.background = new THREE.Color( 0xa0a0a0 )
    scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 )

    const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 )
    hemiLight.position.set( 0, 20, 0 )
    scene.add( hemiLight )

    const dirLight = new THREE.DirectionalLight( 0xffffff )
    dirLight.position.set( - 3, 10, - 10 )
    dirLight.castShadow = true
    dirLight.shadow.camera.top = 4
    dirLight.shadow.camera.bottom = - 4
    dirLight.shadow.camera.left = - 4
    dirLight.shadow.camera.right = 4
    dirLight.shadow.camera.near = 0.1
    dirLight.shadow.camera.far = 40
    scene.add( dirLight )

    const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 200, 200 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) )
    mesh.rotation.x = - Math.PI / 2
    mesh.receiveShadow = true
    scene.add( mesh )

    const loader = new GLTFLoader()
    loader.load('models/Soldier.glb', (gltf) => {
        gltf.scene.traverse( ( object ) => {
            if ( object.isMesh ) object.castShadow = true
        } )
        const model1 = SkeletonUtils.clone( gltf.scene )
        const mixer1 = new THREE.AnimationMixer( model1 )
        mixer1.clipAction( gltf.animations[ 3 ] ).play()
        model1.position.z = 4
        scene.add( model1 )
        mixers.push( mixer1 )
        animate()
    }, undefined, (e) => {
        console.error(e)
    })
    renderer = new THREE.WebGLRenderer( { antialias: true } )
    renderer.setPixelRatio( window.devicePixelRatio )
    renderer.setSize( 400, 400 )
    renderer.outputEncoding = THREE.sRGBEncoding
    renderer.shadowMap.enabled = true 
    renderer1 = new THREE.WebGLRenderer( { antialias: true } )
    renderer1.setPixelRatio( window.devicePixelRatio )
    renderer1.setSize( 400, 400 )
    renderer1.outputEncoding = THREE.sRGBEncoding
    renderer1.shadowMap.enabled = true 
    mycanvas.appendChild( renderer.domElement )
    mycanvas.appendChild( renderer1.domElement )

    camera = new THREE.PerspectiveCamera( 45, 1, 1, 100 )
    camera.position.set( -1, 2, -3 )

    const controls = new OrbitControls( camera, renderer.domElement )
    controls.enablePan = false
    controls.enableZoom = false
    controls.target.set( 0, 1, 0 )
    controls.update()

    camera1 = new THREE.PerspectiveCamera( 45, 1, 1, 100 )
    camera1.position.set( -1, 2, -3 )
    const controls1 = new OrbitControls( camera1, renderer1.domElement )
    controls1.enablePan = false
    controls1.enableZoom = false
    controls1.target.set( 0, 1, 0 )
    controls1.update()

    window.addEventListener( 'resize', onWindowResize )
}

const onWindowResize = () => {
    camera.aspect = 1
    camera.updateProjectionMatrix()
    renderer.setSize( 400, 400)
    camera1.aspect = 1
    camera1.updateProjectionMatrix()
    renderer1.setSize( 400, 400)
}

const animate = () => {
    requestAnimationFrame( animate )
    const delta = clock.getDelta()
    for ( const mixer of mixers ) mixer.update( delta )
    renderer.render( scene, camera )
    renderer1.render( scene, camera1 )
}

const ThreeDimensionV2 = (props) => {
    const myCanvas = useRef(null)
    useEffect(() => {
        let mycanvas = myCanvas.current
        init(mycanvas)
        animate()
        return () => {
            mycanvas.innerHTML = ""
        }
    }, [])
    return (
        <div>
            <h1>233</h1>
            <div ref={myCanvas} className="myCanvas"></div>
        </div>
    )
}

export default ThreeDimensionV2