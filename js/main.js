/**
 * 3D PRODUCT VIEWER - MAIN APPLICATION
 * Entry point that orchestrates all modules using ES6 Three.js imports
 */

// Import Three.js as ES6 modules
import * as THREE from "three"

// Import all application modules
import { initScene } from "./initScene.js"
import { createProduct } from "./createProduct.js"
import { addLighting } from "./addLighting.js"
import { setupInteraction } from "./interaction.js"
import { initCameraAnimation } from "./cameraAnimation.js"

// Global application state
const app = {
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    chair: null,
    cameraController: null,
    interactionHandler: null,
    autoRotate: true,
}

/**
 * Initialize the complete 3D Product Viewer application
 */
async function init() {
    console.log("🚀 Initializing 3D Product Viewer with ES6 Three.js modules...")

    try {
        // Log Three.js version
        console.log("📦 Three.js version:", THREE.REVISION)

        // Step 1: Initialize the basic 3D scene
        const sceneData = await initScene()
        app.scene = sceneData.scene
        app.camera = sceneData.camera
        app.renderer = sceneData.renderer
        app.controls = sceneData.controls

        // Step 2: Add lighting to the scene
        addLighting(app.scene)

        // Step 3: Create the product (chair)
        app.chair = createProduct(app.scene)

        // Step 4: Setup interaction handling
        app.interactionHandler = setupInteraction(app.camera, app.scene, app.renderer.domElement, app.chair)

        // Step 5: Initialize camera animation
        app.cameraController = initCameraAnimation(app.camera)

        // Step 6: Setup application event listeners
        setupEventListeners()

        // Step 7: Hide loading screen and start animation
        setTimeout(() => {
            document.getElementById("loadingScreen").style.display = "none"
            console.log("✅ 3D Product Viewer loaded successfully!")
        }, 1000)

        // Step 8: Start the animation loop
        animate()
    } catch (error) {
        console.error("❌ Error initializing 3D Product Viewer:", error)
        showErrorMessage(`Failed to load 3D viewer: ${error.message}`)
    }
}

/**
 * Setup application-level event listeners
 */
function setupEventListeners() {
    // Auto-rotate toggle
    document.getElementById("autoRotateToggle").addEventListener("change", (e) => {
        app.autoRotate = e.target.checked
        app.controls.enableRotate = !app.autoRotate

        if (app.autoRotate) {
            app.cameraController.reset()
        }

        console.log("🔄 Auto-rotate:", app.autoRotate)
    })

    // Window resize handling
    window.addEventListener("resize", onWindowResize)

    // Mouse events for interaction
    app.renderer.domElement.addEventListener("click", (event) => {
        app.interactionHandler.handleClick(event)
    })

    app.renderer.domElement.addEventListener("mousemove", (event) => {
        app.interactionHandler.handleMouseMove(event)
    })
}

/**
 * Handle window resize events
 */
function onWindowResize() {
    app.camera.aspect = window.innerWidth / window.innerHeight
    app.camera.updateProjectionMatrix()
    app.renderer.setSize(window.innerWidth, window.innerHeight)
}

/**
 * Main animation loop
 */
function animate() {
    requestAnimationFrame(animate)

    // Update camera animation if auto-rotate is enabled
    if (app.autoRotate && app.cameraController) {
        app.cameraController.update()
    }

    // Update product animation
    if (app.chair) {
        app.chair.update()
    }

    // Update orbit controls
    if (app.controls) {
        app.controls.update()
    }

    // Render the scene
    app.renderer.render(app.scene, app.camera)
}

/**
 * Show error message to user
 */
function showErrorMessage(message) {
    const loadingScreen = document.getElementById("loadingScreen")
    loadingScreen.innerHTML = `
    <div style="color: #ff6b6b; text-align: center;">
      <h2>⚠️ Error</h2>
      <p>${message}</p>
      <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #4ecdc4; color: white; border: none; border-radius: 5px; cursor: pointer;">
        Reload Page
      </button>
    </div>
  `
}

/**
 * Debug utilities (accessible from browser console)
 */
window.debugViewer = {
    getApp: () => app,
    setRotationSpeed: (speed) => {
        if (app.cameraController) {
            app.cameraController.setSpeed(speed)
            console.log("🎯 Rotation speed set to:", speed)
        }
    },
    setCameraDistance: (distance) => {
        if (app.cameraController) {
            app.cameraController.setRadius(distance)
            console.log("📏 Camera distance set to:", distance)
        }
    },
    toggleAutoRotate: () => {
        app.autoRotate = !app.autoRotate
        app.controls.enableRotate = !app.autoRotate
        document.getElementById("autoRotateToggle").checked = app.autoRotate
        console.log("🔄 Auto-rotate:", app.autoRotate)
    },
    getChairParts: () => {
        if (app.chair) {
            const parts = Object.keys(app.chair.parts)
            console.log("🪑 Chair parts:", parts)
            return parts
        }
    },
    highlightPart: (partName) => {
        if (app.chair) {
            app.chair.setClickedPart(partName)
            console.log("✨ Highlighted part:", partName)
        }
    },
}

/**
 * Application startup
 */
document.addEventListener("DOMContentLoaded", () => {
    console.log("📄 DOM loaded, starting initialization...")
    console.log("🎮 Debug commands available: window.debugViewer")

    // Initialize the application
    init()
})
