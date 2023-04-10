import { useRef, useEffect } from 'react'

import * as THREE from 'three'

import './AnimationEffect.less'

let renderer, scene, camera, cameraCtrl
let width, height, cx, cy, wWidth, wHeight, size
let container

let conf = {
    color: 0xffffff,
    objectWidth: 12,
    objectThickness: 3,
    ambientColor: 0x808080,
    light1Color: 0xffffff,
    shadow: false,
    perspective: 75,
    cameraZ: 75,
}

let objects = []
let geometry, material
let hMap, hMap0, nx, ny

const AnimationEffect = (props) => {
    const ContainerRef = useRef(null)
    const RevealEffectRef = useRef(null)

    const init = (container, animateCanvas) => {
        renderer = new THREE.WebGLRenderer({ canvas: animateCanvas, antialias: true, alpha: true })
        renderer.setSize(window.innerWidth, window.innerHeight)
        container.appendChild(renderer.domElement)

        camera = new THREE.PerspectiveCamera(conf.perspective, window.innerWidth / window.innerHeight, 0.1, 1000)
        camera.position.z = conf.cameraZ

        scene = new THREE.Scene()
        geometry = new THREE.BoxGeometry(conf.objectWidth, conf.objectWidth, conf.objectThickness)

        initScene()
        animate()
    }

    const initScene = () => {
        onResize()
        scene = new THREE.Scene()
        initLights()
        initObjects()
    }

    const initLights = () => {
        scene.add(new THREE.AmbientLight(conf.ambientColor))
        let light = new THREE.PointLight(0xffffff)
        light.position.z = 100
        scene.add(light)
    }

    const initObjects = () => {
        objects = []
        nx = Math.round(wWidth / conf.objectWidth) + 1
        ny = Math.round(wHeight / conf.objectWidth) + 1
        let mesh, x, y
        for (let i = 0; i < nx; i++) {
            for (let j = 0; j < ny; j++) {
                material = new THREE.MeshLambertMaterial({ color: conf.color, transparent: true, opacity: 1 })
                mesh = new THREE.Mesh(geometry, material)
                x = -wWidth / 2 + i * conf.objectWidth
                y = -wHeight / 2 + j * conf.objectWidth
                mesh.position.set(x, y, 0)
                objects.push(mesh)
                scene.add(mesh)
            }
        }
        // container.classList.add('loaded')
        startAnim()
    }

    const startAnim = () => {
        container.classList.remove('revealed') //这里要配合css样式
        objects.forEach(mesh => {
            mesh.rotation.set(0, 0, 0)
            mesh.material.opacity = 1
            mesh.position.z = 0
            let delay = 1
            let rx = 2 * Math.PI
            let ry = 2 * Math.PI
            let rz = 2 * Math.PI
            TweenMax.to(mesh.rotation, 2, { x: rx, y: ry, z: rz, delay: delay })
            TweenMax.to(mesh.position, 2, { z: 80, delay: delay + 0.5, ease: Power1.easeOut })
            TweenMax.to(mesh.material, 2, { opacity: 0, delay: delay + 0.5 })
        });
        setTimeout(() => {
            container.classList.add('revealed') //这里要配合css样式
        }, 4500)
    }

    const animate = () => {
        requestAnimationFrame(animate)
        renderer.render(scene, camera)
    }

    const onResize = () => {
        width = window.innerWidth; cx = width / 2
        height = window.innerHeight; cy = height / 2
        camera.aspect = width / height
        camera.updateProjectionMatrix()
        renderer.setSize(width, height)
      
        size = getRendererSize()
        wWidth = size[0]
        wHeight = size[1]
    }

    const getRendererSize = () => {
        const cam = new THREE.PerspectiveCamera(conf.perspective, camera.aspect)
        const vFOV = cam.fov * Math.PI / 180
        const height = 2 * Math.tan(vFOV / 2) * Math.abs(conf.cameraZ)
        const width = height * cam.aspect
        return [width, height]
    }

    useEffect(() => {
        container = ContainerRef.current
        let animate = RevealEffectRef.current
        init(container, animate)
    }, [])

    return (
        <div ref={ContainerRef} className="container">
            <canvas className='canvas' ref={RevealEffectRef}></canvas>
        </div>
    )
}

export default AnimationEffect