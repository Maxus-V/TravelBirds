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

// import init from "./utils/init"
import "./ChinaMapChartV3.less"

import { createGeometry, createLine, createStars } from './utils/starsEffect'

let mapRefCurrent = null
let camera, scene, renderer

const ChinaMapChartV3 = (props) => {
    // 获取 DOM 节点，挂载 canvas
    const mapRef = useRef(null)

    const init = () => {
        camera = new THREE.PerspectiveCamera( 80, 1, 1, 3000 )
		camera.position.z = 1000

        scene = new THREE.Scene()
        const geometry = createGeometry()
        createLine(geometry, scene)

        renderer = new THREE.WebGLRenderer( { antialias: true } )
        renderer.setPixelRatio( window.devicePixelRatio )
        renderer.setSize( mapRefCurrent.parentNode.offsetWidth, mapRefCurrent.parentNode.offsetHeight )

        mapRefCurrent.appendChild( renderer.domElement )
    }
    const animate = () => {
        requestAnimationFrame( animate )
        render()
    }

    const render = () => {
        renderer.render( scene, camera )
        createStars(scene)
    }

	useEffect(() => {
        mapRefCurrent = mapRef.current
        init()
        animate()
        return () => {
            mapRefCurrent.innerHTML = ""
        }
	}, [])

	return (
		<div className="content-box2">
            <div className="mapRef" ref={mapRef}></div>
		</div>
	)
}

export default ChinaMapChartV3