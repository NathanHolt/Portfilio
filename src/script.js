import './style.css'
import * as THREE from 'three'


// const TMath = THREE.Math
let plane
let conf = {
    fov: 75,
    cameraZ: 75,
    // orig 20 10 soft 50 4
    xyCoef: 50,
    zCoef: 4,
    lightIntensity: 0.9,
    ambientColor: 0x000000,
    light1Color: 0x0209DE,
    light2Color: 0x12D1E1,
    light3Color: 0x18C02C,
    light4Color: 0x1e3eEf,
  }

const simplex = new SimplexNoise()



// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

let mat = new THREE.MeshLambertMaterial({ color: 0x00ffe1, side: THREE.DoubleSide });
// orig 50 50 soft 600 20
let geo = new THREE.PlaneBufferGeometry(window.innerWidth, 100, 600, 200);
plane = new THREE.Mesh(geo, mat);
scene.add(plane);

plane.rotation.x = -Math.PI / 2 - 0.2;
plane.position.y = -25;

// const textureLoader = new THREE.TextureLoader()

// const material = new THREE.MeshBasicMaterial({
//     // map: textureLoader.load('/profilecopy.png'),
//     color: 0x00ffe1
// })

// const geometry = new THREE.PlaneBufferGeometry(10,10.3)

// const img = new THREE.Mesh(geometry, material)
// img.position.y = -85;
// img.position.x = 20;

// scene.add(img)

// Lights

const r = 30;
const y = 10;
const lightDistance = 500;

let light1 = new THREE.PointLight(conf.light1Color, conf.lightIntensity, lightDistance)
light1.position.set(0, y, r)
scene.add(light1)
let light2 = new THREE.PointLight(conf.light2Color, conf.lightIntensity, lightDistance)
light2.position.set(0, -y, -r)
scene.add(light2)
let light3 = new THREE.PointLight(conf.light3Color, conf.lightIntensity, lightDistance)
light3.position.set(r, y, 0)
scene.add(light3)
let light4 = new THREE.PointLight(conf.light4Color, conf.lightIntensity, lightDistance)
light4.position.set(-r, y, 0)
scene.add(light4)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    plane.width = window.innerWidth

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 60
scene.add(camera)


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true, 
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    const animatePlane = () => {
        let gArray = plane.geometry.attributes.position.array;
        const time = Date.now() * 0.0002;
        const mouse = {
            x: 50,
            y: 50,
        }
        for (let i = 0; i < gArray.length; i += 3) {
          gArray[i + 2] = simplex.noise4D(gArray[i] / conf.xyCoef, gArray[i + 1] / conf.xyCoef, time, mouse.x + mouse.y) * conf.zCoef;
        }
        plane.geometry.attributes.position.needsUpdate = true;
      }

      const animateLights = () => {
        const time = Date.now() * 0.001;
        const d = 50;
        light1.position.x = Math.sin(time * 0.1) * d;
        light1.position.z = Math.cos(time * 0.2) * d;
        light2.position.x = Math.cos(time * 0.3) * d;
        light2.position.z = Math.sin(time * 0.4) * d;
        light3.position.x = Math.sin(time * 0.5) * d;
        light3.position.z = Math.sin(time * 0.6) * d;
        light4.position.x = Math.sin(time * 0.7) * d;
        light4.position.z = Math.cos(time * 0.8) * d;
      }

      animateLights()
      animatePlane()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()