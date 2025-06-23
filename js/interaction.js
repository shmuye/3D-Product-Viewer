/**
 * INTERACTION MODULE
 * Handles mouse interactions, raycasting, and user interface updates
 */

import * as THREE from "three"

/**
 * Setup interaction handling for the 3D scene
 * @param {THREE.Camera} camera - The scene camera
 * @param {THREE.Scene} scene - The Three.js scene
 * @param {HTMLElement} domElement - The renderer DOM element
 * @param {Chair} chair - The chair product instance
 * @returns {InteractionHandler} The interaction handler instance
 */
export function setupInteraction(camera, scene, domElement, chair) {
    console.log("🖱️ Setting up interaction handling with ES6 modules...")

    const handler = new InteractionHandler(camera, scene, domElement, chair)
    console.log("✅ Interaction handler ready")

    return handler
}

/**
 * InteractionHandler class - Manages mouse interactions and raycasting
 */
class InteractionHandler {
    constructor(camera, scene, domElement, chair) {
        this.camera = camera
        this.scene = scene
        this.domElement = domElement
        this.chair = chair

        // Raycasting setup
        this.raycaster = new THREE.Raycaster()
        this.mouse = new THREE.Vector2()

        // Part descriptions for UI display
        this.partDescriptions = {
            seat: "The main seating surface - crafted from solid wood",
            backrest: "Ergonomic backrest for comfortable support",
            "front-left-leg": "Front left support leg - sturdy cylindrical design",
            "front-right-leg": "Front right support leg - sturdy cylindrical design",
            "back-left-leg": "Back left support leg - sturdy cylindrical design",
            "back-right-leg": "Back right support leg - sturdy cylindrical design",
            "left-armrest": "Left armrest for comfortable arm positioning",
            "right-armrest": "Right armrest for comfortable arm positioning",
            "left-support": "Left armrest support column",
            "right-support": "Right armrest support column",
        }

        // Interaction state
        this.lastClickTime = 0
        this.clickDelay = 200 // Prevent double-clicks
    }

    /**
     * Update mouse position in normalized device coordinates
     * @param {MouseEvent} event - The mouse event
     */
    updateMousePosition(event) {
        const rect = this.domElement.getBoundingClientRect()

        // Convert to normalized device coordinates (-1 to +1)
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    }

    /**
     * Perform raycasting to find intersected objects
     * @returns {THREE.Object3D|null} The intersected object or null
     */
    getIntersectedObject() {
        // Update raycaster with camera and mouse position
        this.raycaster.setFromCamera(this.mouse, this.camera)

        // Check for intersections with chair parts
        const intersects = this.raycaster.intersectObjects(this.chair.getAllParts())

        return intersects.length > 0 ? intersects[0].object : null
    }

    /**
     * Handle mouse move events for hover effects
     * @param {MouseEvent} event - The mouse move event
     */
    handleMouseMove(event) {
        this.updateMousePosition(event)
        const intersectedObject = this.getIntersectedObject()

        if (intersectedObject) {
            // Object is being hovered
            const partName = intersectedObject.userData.name
            this.chair.setHoveredPart(partName)

            // Update cursor style
            this.domElement.style.cursor = "pointer"
        } else {
            // No object being hovered
            this.chair.setHoveredPart(null)
            this.domElement.style.cursor = "default"
        }
    }

    /**
     * Handle mouse click events for part selection
     * @param {MouseEvent} event - The mouse click event
     */
    handleClick(event) {
        // Prevent rapid clicking
        const currentTime = Date.now()
        if (currentTime - this.lastClickTime < this.clickDelay) {
            return
        }
        this.lastClickTime = currentTime

        this.updateMousePosition(event)
        const intersectedObject = this.getIntersectedObject()

        if (intersectedObject) {
            // Part was clicked
            const partName = intersectedObject.userData.name
            this.chair.setClickedPart(partName)
            this.showInteractionPanel(partName)

            console.log("🎯 Clicked on chair part:", partName)

            // Optional: Add click sound effect
            this.playClickSound()
        } else {
            // Clicked on empty space
            this.hideInteractionPanel()
        }
    }

    /**
     * Show the interaction panel with part information
     * @param {string} partName - Name of the selected part
     */
    showInteractionPanel(partName) {
        const panel = document.getElementById("interactionPanel")
        const title = document.getElementById("partTitle")
        const description = document.getElementById("partDescription")

        if (!panel || !title || !description) {
            console.warn("⚠️ Interaction panel elements not found")
            return
        }

        // Update panel content
        title.textContent = this.formatPartName(partName)
        description.textContent = this.partDescriptions[partName] || "Chair component"

        // Show panel with animation
        panel.style.display = "block"
        panel.classList.add("panel-show")

        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.hideInteractionPanel()
        }, 5000)
    }

    /**
     * Hide the interaction panel
     */
    hideInteractionPanel() {
        const panel = document.getElementById("interactionPanel")

        if (panel) {
            panel.style.display = "none"
            panel.classList.remove("panel-show")
        }
    }

    /**
     * Format part name for display (convert kebab-case to title case)
     * @param {string} partName - The part name to format
     * @returns {string} Formatted part name
     */
    formatPartName(partName) {
        return partName
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
    }

    /**
     * Play click sound effect (optional)
     */
    playClickSound() {
        // Create a simple click sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)()
            const oscillator = audioContext.createOscillator()
            const gainNode = audioContext.createGain()

            oscillator.connect(gainNode)
            gainNode.connect(audioContext.destination)

            oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
            oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1)

            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

            oscillator.start(audioContext.currentTime)
            oscillator.stop(audioContext.currentTime + 0.1)
        } catch (error) {
            // Silently fail if audio context is not available
            console.log("🔇 Audio context not available for click sound")
        }
    }
}
