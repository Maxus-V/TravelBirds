import { useRef, useEffect } from "react"

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js'


import TWEEN from '@tweenjs/tween.js'

import { getGeoJsonall } from '../../services/index'
import mapJson from "../../assets/china.json"

// import init from "./utils/init"
import "./ChinaMapChartV3.less"

import { createGeometry, createLine, createStar } from './utils/createStars'
import { setMapDom, setShining, setLighting, setMoveSpot, setRaycaster } from "./utils/createMaps"

let mapRefCurrent, tipRefCurrent = null
let camera, scene, renderer, controls

const ChinaMapChartV3 = (props) => {
    // 获取 DOM 节点，挂载 canvas
    const mapRef = useRef(null)
    const tipRef = useRef(null)

    const init = () => {
        camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.01, 1000 )
		// camera.position.z = 1000
        camera.position.set(30.9, 21.7, 37.4)
        camera.lookAt(0, 0, 0)

        scene = new THREE.Scene()
        const geometry = createGeometry()
        createLine(geometry, scene)

        renderer = new THREE.WebGLRenderer( { antialias: true } )
        renderer.setPixelRatio( window.devicePixelRatio )
        renderer.setSize( mapRefCurrent.parentNode.offsetWidth, mapRefCurrent.parentNode.offsetHeight )

        mapRefCurrent.appendChild( renderer.domElement )
        mouseMove()
    }

    const mouseMove = () => {
        controls = new OrbitControls(camera, renderer.domElement) //创建控件对象
        controls.addEventListener('change', render)
    }

    const animate = () => {
        requestAnimationFrame( animate )
        render()
    }

    const render = () => {
        renderer.render( scene, camera )
        createStar(scene)
        setShining(scene, camera, renderer)
        setLighting()
        setMoveSpot()
    }
    

	useEffect(() => {
        mapRefCurrent = mapRef.current
        tipRefCurrent = tipRef.current
        init()
        setMapDom(mapJson.features, scene)
        setRaycaster(scene, camera, mapRefCurrent, tipRefCurrent)
        animate()
        return () => {
            mapRefCurrent.innerHTML = ""
        }
	}, [])

	return (
		<div className="content-box2">
            <div className="mapRef" ref={mapRef}></div>
            <div className="tipRef" ref={tipRef}>
                <div className="content">
                    <h1></h1>
                    <p>
                        <span>区域排名：</span>
                        <span className="num"></span>
                    </p>
                    <p>
                        <span>ad编号：</span>
                        <span className="num"></span>
                    </p>
                    <p>
                        <span>中心地带：</span>
                        <span className="num"></span>
                    </p>
                </div>
            </div>
		</div>
	)
}

export default ChinaMapChartV3