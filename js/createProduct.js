/**
 * PRODUCT CREATION MODULE
 * Handles the creation and management of the 3D chair product
 */

import * as THREE from "three"

/**
 * Create the main product (chair) for the scene
 * @param {THREE.Scene} scene - The Three.js scene
 * @returns {Chair} The created chair instance
 */
export function createProduct(scene) {
    console.log("🪑 Creating product (chair) with ES6 modules...")

    const chair = new Chair(scene)
    console.log("✅ Chair created successfully")

    return chair
}

/**
 * Chair class - Manages the 3D chair model built from basic geometries
 */
class Chair {
    constructor(scene) {
        this.scene = scene
        this.group = new THREE.Group()
        this.parts = {}
        this.hoveredPart = null
        this.clickedPart = null
        this.animationTime = 0

        // Create all chair components
        this.createChairComponents()

        // Position the chair group
        this.group.position.set(0, 1, 0)
        scene.add(this.group)
    }

    /**
     * Create all components of the chair using basic geometries
     */
    createChairComponents() {
        console.log("🔨 Building chair components...")

        // Main seating surface
        this.createPart("seat", new THREE.BoxGeometry(2, 0.2, 2), [0, 0, 0], 0x8b4513, "Main seating surface")

        // Backrest for support
        this.createPart("backrest", new THREE.BoxGeometry(2, 2, 0.2), [0, 1, -0.9], 0xa0522d, "Ergonomic backrest")

        // Four chair legs (cylindrical)
        this.createPart(
            "front-left-leg",
            new THREE.CylinderGeometry(0.05, 0.05, 1.2),
            [-0.8, -0.6, 0.8],
            0x654321,
            "Front left support leg",
        )

        this.createPart(
            "front-right-leg",
            new THREE.CylinderGeometry(0.05, 0.05, 1.2),
            [0.8, -0.6, 0.8],
            0x654321,
            "Front right support leg",
        )

        this.createPart(
            "back-left-leg",
            new THREE.CylinderGeometry(0.05, 0.05, 1.2),
            [-0.8, -0.6, -0.8],
            0x654321,
            "Back left support leg",
        )

        this.createPart(
            "back-right-leg",
            new THREE.CylinderGeometry(0.05, 0.05, 1.2),
            [0.8, -0.6, -0.8],
            0x654321,
            "Back right support leg",
        )

        // Armrests for comfort
        this.createPart("left-armrest", new THREE.BoxGeometry(0.4, 0.1, 1.5), [-1.2, 0.5, 0], 0x8b4513, "Left armrest")

        this.createPart("right-armrest", new THREE.BoxGeometry(0.4, 0.1, 1.5), [1.2, 0.5, 0], 0x8b4513, "Right armrest")

        // Armrest support columns
        this.createPart(
            "left-support",
            new THREE.CylinderGeometry(0.03, 0.03, 0.5),
            [-1.2, 0.25, 0],
            0x654321,
            "Left armrest support",
        )

        this.createPart(
            "right-support",
            new THREE.CylinderGeometry(0.03, 0.03, 0.5),
            [1.2, 0.25, 0],
            0x654321,
            "Right armrest support",
        )

        console.log(`✅ Created ${Object.keys(this.parts).length} chair components`)
    }

    /**
     * Create an individual chair part
     * @param {string} name - Part identifier
     * @param {THREE.BufferGeometry} geometry - Three.js geometry
     * @param {Array} position - [x, y, z] position
     * @param {number} color - Hex color value
     * @param {string} description - Part description
     */
    createPart(name, geometry, position, color, description) {
        // Create material with realistic properties
        const material = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.7,
            metalness: 0.1,
        })

        // Create mesh
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(...position)
        mesh.castShadow = true
        mesh.receiveShadow = true

        // Store metadata for interactions
        mesh.userData = {
            name: name,
            originalColor: color,
            description: description,
            originalScale: { x: 1, y: 1, z: 1 },
        }

        // Store part reference and add to group
        this.parts[name] = mesh
        this.group.add(mesh)
    }

    /**
     * Update chair animation and visual states
     */
    update() {
        this.animationTime += 0.016 // ~60fps

        // Gentle floating animation
        this.group.position.y = 1 + Math.sin(this.animationTime * 0.5) * 0.1

        // Update visual states for all parts
        Object.values(this.parts).forEach((part) => {
            const name = part.userData.name

            // Reset to original state
            part.material.color.setHex(part.userData.originalColor)
            part.scale.set(1, 1, 1)

            // Apply hover effect (teal color + slight scale)
            if (this.hoveredPart === name) {
                part.material.color.setHex(0x4ecdc4) // Teal
                part.scale.set(1.05, 1.05, 1.05)
            }

            // Apply click effect (red color + larger scale)
            if (this.clickedPart === name) {
                part.material.color.setHex(0xff6b6b) // Red
                part.scale.set(1.1, 1.1, 1.1)
            }
        })
    }

    /**
     * Set which part is currently being hovered
     * @param {string|null} partName - Name of the hovered part
     */
    setHoveredPart(partName) {
        this.hoveredPart = partName
        document.body.style.cursor = partName ? "pointer" : "default"
    }

    /**
     * Set which part was clicked (with auto-reset)
     * @param {string|null} partName - Name of the clicked part
     */
    setClickedPart(partName) {
        this.clickedPart = partName

        // Auto-reset click state after animation duration
        if (partName) {
            setTimeout(() => {
                this.clickedPart = null
            }, 500)
        }
    }

    /**
     * Get a specific part by name
     * @param {string} name - Part name
     * @returns {THREE.Mesh|undefined} The part mesh
     */
    getPartByName(name) {
        return this.parts[name]
    }

    /**
     * Get all chair parts as an array
     * @returns {Array<THREE.Mesh>} Array of all part meshes
     */
    getAllParts() {
        return Object.values(this.parts)
    }

    /**
     * Get part names and descriptions
     * @returns {Object} Object mapping part names to descriptions
     */
    getPartDescriptions() {
        const descriptions = {}
        Object.values(this.parts).forEach((part) => {
            descriptions[part.userData.name] = part.userData.description
        })
        return descriptions
    }
}
