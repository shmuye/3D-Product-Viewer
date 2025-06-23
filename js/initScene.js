/**
 * SCENE INITIALIZATION MODULE
 * Handles basic Three.js scene setup, camera, renderer, and controls
 */

import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

/**
 * Initialize the basic 3D scene with camera, renderer, and controls
 * @returns {Promise<Object>} Scene components (scene, camera, renderer, controls)
 */
export async function initScene() {
    console.log("🎬 Initializing scene with ES6 modules...")

    // Create the main scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x2a2a2a)

    // Create perspective camera
    const camera = new THREE.PerspectiveCamera(
        50, // Field of view
        window.innerWidth / window.innerHeight, // Aspect ratio
        0.1, // Near clipping plane
        1000, // Far clipping plane
    )
    camera.position.set(5, 3, 5)

    // Create WebGL renderer with optimized settings
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
    })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Enable shadows
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    // Set color space and tone mapping for better visuals
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1

    // Add renderer to DOM
    const canvasContainer = document.getElementById("canvas-container")
    if (!canvasContainer) {
        throw new Error("Canvas container not found")
    }
    canvasContainer.appendChild(renderer.domElement)

    // Create orbit controls for manual camera control
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enablePan = true
    controls.enableZoom = true
    controls.enableRotate = false // Start with auto-rotate enabled
    controls.minDistance = 3
    controls.maxDistance = 15
    controls.target.set(0, 1, 0) // Look at chair center
    controls.enableDamping = true
    controls.dampingFactor = 0.05

    // Create ground plane
    createGround(scene)

    console.log("✅ Scene initialized successfully")

    return {
        scene,
        camera,
        renderer,
        controls,
    }
}

/**
 * Create ground plane for the scene
 * @param {THREE.Scene} scene - The Three.js scene
 */
function createGround(scene) {
    const groundGeometry = new THREE.PlaneGeometry(20, 20)
    const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x2a2a2a,
        roughness: 0.8,
        metalness: 0.1,
    })

    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -0.1
    ground.receiveShadow = true

    scene.add(ground)
    console.log("🏢 Ground plane created")
}
