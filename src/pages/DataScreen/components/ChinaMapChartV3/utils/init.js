import { render } from '@testing-library/react'
import * as THREE from 'three'

const init = (mapRefCurrent) => {
    const scene = new THREE.Scene();
    const geometry = new THREE.BoxGeometry(100, 100, 100); 

    const material = new THREE.MeshBasicMaterial({
        color: 0xff0000,//0xff0000设置材质颜色为红色
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0,10,0);

    scene.add(mesh); 

    const camera = new THREE.PerspectiveCamera(30, 1, 1, 3000);
    camera.position.set(200, 200, 200); 
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(mapRefCurrent.parentNode.offsetWidth, mapRefCurrent.parentNode.offsetHeight)
    renderer.render(scene, camera)
    mapRefCurrent.appendChild(renderer.domElement)
}

export default init