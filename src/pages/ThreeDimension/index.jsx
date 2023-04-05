import { useRef, useEffect } from 'react'

import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js'

let camera, scene, renderer, clock
let count = 0
const mixers = []

const init = (canvasContainer) => {
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 )
    camera.position.set( 2, 3, - 6 )
    camera.lookAt( 0, 1, 0 )

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
        const model2 = SkeletonUtils.clone( gltf.scene )
        const model3 = SkeletonUtils.clone( gltf.scene )
        const model4 = SkeletonUtils.clone( gltf.scene )
        const model5 = SkeletonUtils.clone( gltf.scene )

        let skeleton = new THREE.SkeletonHelper( model5 );
        skeleton.visible = true
        scene.add( skeleton )

        const mixer1 = new THREE.AnimationMixer( model1 )
        const mixer2 = new THREE.AnimationMixer( model2 )
        const mixer3 = new THREE.AnimationMixer( model3 )
        const mixer4 = new THREE.AnimationMixer( model4 )
        const mixer5 = new THREE.AnimationMixer( model5 )

        mixer1.clipAction( gltf.animations[ 1 ] ).play() // idle
        mixer2.clipAction( gltf.animations[ 1 ] ).play() // run
        mixer3.clipAction( gltf.animations[ 1 ] ).play() // walk
        mixer4.clipAction( gltf.animations[ 1 ] ).play() 
        mixer5.clipAction( gltf.animations[ 1 ] ).play() 

        model1.position.z = 4
        model2.position.z = 3
        model3.position.z = 2
        model4.position.z = 1
        model5.position.x = 0

        scene.add( model1, model2, model3, model4, model5 )
        mixers.push( mixer1, mixer2, mixer3, mixer4, mixer5 )

        animate()
    }, undefined, (e) => {
        console.error(e)
    })

    renderer = new THREE.WebGLRenderer( { antialias: true } )
    renderer.setPixelRatio( window.devicePixelRatio )
    renderer.setSize( window.innerWidth, window.innerHeight )
    renderer.outputEncoding = THREE.sRGBEncoding
    renderer.shadowMap.enabled = true 
    canvasContainer.appendChild( renderer.domElement )

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 100 )
    camera.position.set( -1, 2, -3 )

    const controls = new OrbitControls( camera, renderer.domElement )
    controls.enablePan = false
    controls.enableZoom = false
    controls.target.set( 0, 1, 0 )
    controls.update()

    window.addEventListener( 'resize', onWindowResize )
}

const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize( window.innerWidth, window.innerHeight )
}

const animate = () => {
    requestAnimationFrame( animate )
    const delta = clock.getDelta()
    for ( const mixer of mixers ) mixer.update( delta )
    renderer.render( scene, camera )
}

const ThreeDimension = (props) => {
    const view = useRef(null)
    useEffect(() => {
        let canvasContainer = view.current
        init(canvasContainer)
        animate()
        return () => {
            canvasContainer.innerHTML = ""
        }
    }, [])
    return (
        <div>
            <div ref={view}></div>
        </div>
    )
}

export default ThreeDimension