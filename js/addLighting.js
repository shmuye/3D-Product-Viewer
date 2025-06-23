/**
 * LIGHTING MODULE
 * Handles all lighting setup for realistic 3D rendering
 */

import * as THREE from "three"

/**
 * Add comprehensive lighting setup to the scene
 * @param {THREE.Scene} scene - The Three.js scene
 */
export function addLighting(scene) {
    console.log("💡 Setting up lighting with ES6 modules...")

    // Add ambient lighting for base illumination
    addAmbientLight(scene)

    // Add directional light with shadows
    addDirectionalLight(scene)

    // Add spot light for dramatic highlights
    addSpotLight(scene)

    // Add hemisphere light for softer fill lighting
    addHemisphereLight(scene)

    console.log("✅ Lighting setup complete")
}

/**
 * Add ambient light for general scene illumination
 * @param {THREE.Scene} scene - The Three.js scene
 */
function addAmbientLight(scene) {
    const ambientLight = new THREE.AmbientLight(
        0xffffff, // White light
        0.3, // Low intensity for subtle fill
    )

    scene.add(ambientLight)
    console.log("🌟 Ambient light added")
}

/**
 * Add directional light with shadow casting
 * @param {THREE.Scene} scene - The Three.js scene
 */
function addDirectionalLight(scene) {
    const directionalLight = new THREE.DirectionalLight(
        0xffffff, // White light
        1, // Full intensity
    )

    // Position the light
    directionalLight.position.set(10, 10, 5)

    // Enable shadow casting
    directionalLight.castShadow = true

    // Configure shadow properties for quality
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    directionalLight.shadow.camera.near = 0.5
    directionalLight.shadow.camera.far = 50

    // Set shadow camera bounds
    directionalLight.shadow.camera.left = -10
    directionalLight.shadow.camera.right = 10
    directionalLight.shadow.camera.top = 10
    directionalLight.shadow.camera.bottom = -10

    // Reduce shadow acne
    directionalLight.shadow.bias = -0.0001

    scene.add(directionalLight)
    console.log("☀️ Directional light with shadows added")
}

/**
 * Add spot light for focused illumination
 * @param {THREE.Scene} scene - The Three.js scene
 */
function addSpotLight(scene) {
    const spotLight = new THREE.SpotLight(
        0xffffff, // White light
        0.5, // Medium intensity
        0, // No distance limit
        0.3, // Cone angle
        0.2, // Penumbra (soft edge)
    )

    // Position the spot light
    spotLight.position.set(-5, 5, 2)

    // Enable shadow casting
    spotLight.castShadow = true

    // Configure shadow map
    spotLight.shadow.mapSize.width = 1024
    spotLight.shadow.mapSize.height = 1024
    spotLight.shadow.camera.near = 0.5
    spotLight.shadow.camera.far = 20

    scene.add(spotLight)
    console.log("🔦 Spot light added")
}

/**
 * Add hemisphere light for natural sky/ground lighting
 * @param {THREE.Scene} scene - The Three.js scene
 */
function addHemisphereLight(scene) {
    const hemisphereLight = new THREE.HemisphereLight(
        0xffffff, // Sky color (white)
        0x444444, // Ground color (dark gray)
        0.2, // Low intensity
    )

    scene.add(hemisphereLight)
    console.log("🌅 Hemisphere light added")
}

/**
 * Create a light helper for debugging (optional)
 * @param {THREE.Light} light - The light to create a helper for
 * @param {THREE.Scene} scene - The scene to add the helper to
 */
export function addLightHelper(light, scene) {
    let helper

    if (light instanceof THREE.DirectionalLight) {
        helper = new THREE.DirectionalLightHelper(light, 1)
    } else if (light instanceof THREE.SpotLight) {
        helper = new THREE.SpotLightHelper(light)
    }

    if (helper) {
        scene.add(helper)
        console.log("🔧 Light helper added for debugging")
    }
}
