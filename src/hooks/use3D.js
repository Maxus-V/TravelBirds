import { useEffect, useRef } from "react"

import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js'

export const use3D = (name, options, data) => {
    const myCanvas = useRef(null)
    let camera, scene, renderer, clock
    const mixers = []
    const init = (canvasContainer) => {
        camera = new THREE.PerspectiveCamera( 45, 1, 0.25, 100 )
        camera.position.set( - 1, 4, 12 )
        camera.lookAt( 0, 2, 0 )

        scene = new THREE.Scene()
        scene.background = new THREE.Color( 0xa0a0a0 )
        scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 )

        clock = new THREE.Clock()

        const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 )
        hemiLight.position.set( 0, 20, 0 )
        scene.add( hemiLight )

        const dirLight = new THREE.DirectionalLight( 0xffffff )
        dirLight.position.set( 0, 20, 10 )
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

        const grid = new THREE.GridHelper( 200, 40, 0x000000, 0x000000 )
		grid.material.opacity = 0.2
		grid.material.transparent = true
		scene.add( grid )

        const loader = new GLTFLoader()
        loader.load(`models/${name}.glb`, (gltf) => {
        gltf.scene.traverse( ( object ) => {
            if ( object.isMesh ) object.castShadow = true
        } )
        const model1 = SkeletonUtils.clone( gltf.scene )
        const mixer1 = new THREE.AnimationMixer( model1 )
        mixer1.clipAction( gltf.animations[ 2 ] ).play()
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
        renderer.setSize( 400, 400 )
    }

    const animate = () => {
        const delta = clock.getDelta()
        for ( const mixer of mixers ) mixer.update( delta )
        requestAnimationFrame( animate )
        renderer.render( scene, camera )
    }
    useEffect(() => {
        let my_canvas = myCanvas.current
        init(my_canvas)
        animate()
        return () => {
            my_canvas.innerHTML = ""
        }
    }, [])
    return {
        [`${name}Canvas`]:myCanvas
    }
}