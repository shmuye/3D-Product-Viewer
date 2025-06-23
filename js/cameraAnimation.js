/**
 * CAMERA ANIMATION MODULE
 * Handles automatic camera rotation and movement around the product
 */

import * as THREE from "three"

/**
 * Initialize camera animation controller
 * @param {THREE.Camera} camera - The scene camera
 * @returns {CameraController} The camera controller instance
 */
export function initCameraAnimation(camera) {
    console.log("📹 Initializing camera animation with ES6 modules...")

    const controller = new CameraController(camera)
    console.log("✅ Camera animation ready")

    return controller
}

/**
 * CameraController class - Manages automatic camera rotation and positioning
 */
class CameraController {
    constructor(camera) {
        this.camera = camera

        // Animation parameters
        this.angle = 0
        this.radius = 8
        this.speed = 0.5
        this.targetY = 3
        this.lookAtTarget = new THREE.Vector3(0, 1, 0)

        // Animation state
        this.isAnimating = true
        this.animationStartTime = Date.now()

        // Advanced animation options
        this.verticalOscillation = {
            enabled: true,
            amplitude: 0.5,
            frequency: 0.3,
        }

        this.radiusOscillation = {
            enabled: false,
            amplitude: 1,
            frequency: 0.2,
        }

        // Initialize starting position
        this.initializePosition()
    }

    /**
     * Initialize camera starting position
     */
    initializePosition() {
        const currentPos = this.camera.position.clone()
        this.angle = Math.atan2(currentPos.z, currentPos.x)
        this.radius = Math.sqrt(currentPos.x * currentPos.x + currentPos.z * currentPos.z)

        console.log(`📍 Camera initialized at angle: ${this.angle.toFixed(2)}, radius: ${this.radius.toFixed(2)}`)
    }

    /**
     * Update camera position and rotation
     */
    update() {
        if (!this.isAnimating) return

        const deltaTime = 0.016 // ~60fps
        const elapsedTime = (Date.now() - this.animationStartTime) / 1000

        // Update rotation angle
        this.angle += deltaTime * this.speed

        // Calculate base position
        let currentRadius = this.radius
        let currentY = this.targetY

        // Apply radius oscillation if enabled
        if (this.radiusOscillation.enabled) {
            currentRadius += Math.sin(elapsedTime * this.radiusOscillation.frequency) * this.radiusOscillation.amplitude
        }

        // Apply vertical oscillation if enabled
        if (this.verticalOscillation.enabled) {
            currentY += Math.sin(elapsedTime * this.verticalOscillation.frequency) * this.verticalOscillation.amplitude
        }

        // Calculate new camera position
        const x = Math.cos(this.angle) * currentRadius
        const z = Math.sin(this.angle) * currentRadius

        // Update camera position
        this.camera.position.x = x
        this.camera.position.z = z
        this.camera.position.y = currentY

        // Always look at the target (chair center)
        this.camera.lookAt(this.lookAtTarget)
    }

    /**
     * Reset camera animation to current position
     */
    reset() {
        this.initializePosition()
        this.animationStartTime = Date.now()
        console.log("🔄 Camera animation reset")
    }

    /**
     * Set rotation speed
     * @param {number} speed - New rotation speed
     */
    setSpeed(speed) {
        this.speed = Math.max(0, speed) // Ensure non-negative
        console.log(`⚡ Camera rotation speed set to: ${this.speed}`)
    }

    /**
     * Set camera orbit radius
     * @param {number} radius - New orbit radius
     */
    setRadius(radius) {
        this.radius = Math.max(2, Math.min(20, radius)) // Clamp between 2 and 20
        console.log(`📏 Camera orbit radius set to: ${this.radius}`)
    }

    /**
     * Set camera target height
     * @param {number} height - New target Y position
     */
    setTargetHeight(height) {
        this.targetY = height
        console.log(`📐 Camera target height set to: ${this.targetY}`)
    }

    /**
     * Start camera animation
     */
    start() {
        this.isAnimating = true
        this.animationStartTime = Date.now()
        console.log("▶️ Camera animation started")
    }

    /**
     * Stop camera animation
     */
    stop() {
        this.isAnimating = false
        console.log("⏹️ Camera animation stopped")
    }

    /**
     * Toggle animation state
     */
    toggle() {
        if (this.isAnimating) {
            this.stop()
        } else {
            this.start()
        }
    }

    /**
     * Set look-at target
     * @param {number} x - Target X coordinate
     * @param {number} y - Target Y coordinate
     * @param {number} z - Target Z coordinate
     */
    setLookAtTarget(x, y, z) {
        this.lookAtTarget.set(x, y, z)
        console.log(`🎯 Camera look-at target set to: (${x}, ${y}, ${z})`)
    }
}
