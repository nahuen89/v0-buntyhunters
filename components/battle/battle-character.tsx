"use client"

import { useRef, useState, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { Text } from "@react-three/drei"
import * as THREE from "three"

const teamColors = {
  player: "#3b82f6",
  enemy: "#ef4444",
  neutral: "#a3a3a3",
}

export default function BattleCharacter({ unit, isSelected, onClick, gameState }) {
  const groupRef = useRef()
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [animationProgress, setAnimationProgress] = useState(0)
  const targetPositionRef = useRef(new THREE.Vector3(unit.position.x, 0.5, unit.position.z))
  const lastActionStateRef = useRef(unit.actionState || "idle")
  const colorRef = useRef(new THREE.Color(teamColors[unit.team] || "#ffffff"))

  // Handle hover state
  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto"
    return () => {
      document.body.style.cursor = "auto"
    }
  }, [hovered])

  // Update target position when unit position changes
  useEffect(() => {
    if (targetPositionRef.current) {
      targetPositionRef.current.set(unit.position.x, 0.5, unit.position.z)
    }
  }, [unit.position.x, unit.position.z])

  // Reset animation progress when action state changes
  useEffect(() => {
    if (unit.actionState !== lastActionStateRef.current) {
      setAnimationProgress(0)
      lastActionStateRef.current = unit.actionState
    }
  }, [unit.actionState])

  // Animation and behavior
  useFrame((state, delta) => {
    if (!meshRef.current || !groupRef.current) return

    // Hover and selection effects
    if (isSelected) {
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 4) * 0.05)
    } else if (hovered) {
      meshRef.current.scale.setScalar(1.1)
    } else if (unit.actionState !== "attacking" && unit.actionState !== "casting" && unit.actionState !== "defending") {
      meshRef.current.scale.setScalar(1)
    }

    // Smooth position updates
    if (gameState === "running" && targetPositionRef.current) {
      const currentPos = groupRef.current.position
      currentPos.lerp(targetPositionRef.current, 0.1)
    }

    // Handle different action states
    switch (unit.actionState) {
      case "attacking":
        setAnimationProgress((prev) => Math.min(prev + delta * 5, 1))

        // Forward lunge animation
        if (animationProgress < 0.5) {
          meshRef.current.position.z = Math.sin(animationProgress * Math.PI) * 0.3
        } else {
          meshRef.current.position.z = Math.sin((1 - animationProgress) * Math.PI) * 0.3
        }

        // Reset when animation completes
        if (animationProgress >= 1) {
          meshRef.current.position.z = 0
          unit.actionState = "idle"
          setAnimationProgress(0)
        }
        break

      case "casting":
        setAnimationProgress((prev) => Math.min(prev + delta * 3, 1))

        // Casting animation - float up and down with rotation
        meshRef.current.position.y = Math.sin(animationProgress * Math.PI * 2) * 0.2
        meshRef.current.rotation.y += delta * 5

        // Reset when animation completes
        if (animationProgress >= 1) {
          meshRef.current.position.y = 0
          meshRef.current.rotation.y = 0
          unit.actionState = "idle"
          setAnimationProgress(0)
        }
        break

      case "hit":
        setAnimationProgress((prev) => Math.min(prev + delta * 8, 1))

        // Hit animation - flash red
        const baseColor = new THREE.Color(teamColors[unit.team])
        const flashColor = new THREE.Color(1, 0, 0)
        const lerpFactor = Math.sin(animationProgress * Math.PI)

        if (meshRef.current.material) {
          meshRef.current.material.color.copy(baseColor).lerp(flashColor, lerpFactor)
        }

        // Reset when animation completes
        if (animationProgress >= 1) {
          if (meshRef.current.material) {
            meshRef.current.material.color.copy(baseColor)
          }
          unit.actionState = "idle"
          setAnimationProgress(0)
        }
        break

      case "moving":
        // Bobbing animation while moving
        meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 10) * 0.05
        break

      case "defending":
        // Shield/defensive stance animation
        meshRef.current.scale.y = 0.8 + Math.sin(state.clock.elapsedTime * 5) * 0.1
        meshRef.current.scale.x = 1.2 + Math.sin(state.clock.elapsedTime * 5) * 0.05
        meshRef.current.scale.z = 1.2 + Math.sin(state.clock.elapsedTime * 5) * 0.05
        break

      case "dead":
        // Dead animation
        groupRef.current.position.y = Math.max(0, groupRef.current.position.y - delta * 2)
        if (meshRef.current.material && meshRef.current.material.opacity > 0) {
          meshRef.current.material.opacity -= delta
        }
        break

      case "idle":
      default:
        // Idle animation - gentle floating
        if (unit.currentHP > 0) {
          groupRef.current.position.y = 0.5 + Math.sin(state.clock.elapsedTime * 2 + unit.id.charCodeAt(0)) * 0.05
        }
        break
    }
  })

  // Set color based on team
  const color = teamColors[unit.team] || "#ffffff"

  return (
    <group
      ref={groupRef}
      position={[unit.position.x, 0.5, unit.position.z]}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Character model */}
      <mesh ref={meshRef} castShadow>
        {unit.class === "warrior" ? (
          <boxGeometry args={[0.6, 0.8, 0.6]} />
        ) : unit.class === "archer" ? (
          <cylinderGeometry args={[0.3, 0.3, 0.8, 8]} />
        ) : unit.class === "mage" ? (
          <coneGeometry args={[0.4, 0.8, 8]} />
        ) : (
          <sphereGeometry args={[0.4, 16, 16]} />
        )}
        <meshStandardMaterial color={color} transparent={true} opacity={1} />
      </mesh>

      {/* Character name */}
      <Text position={[0, 1, 0]} fontSize={0.3} color={color} anchorX="center" anchorY="bottom">
        {unit.name}
      </Text>

      {/* Health bar */}
      <group position={[0, 1.2, 0]}>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[0.8, 0.1]} />
          <meshBasicMaterial color="#333333" />
        </mesh>
        <mesh
          position={[-0.4 + (unit.currentHP / unit.maxHP) * 0.4, 0, 0.01]}
          scale={[unit.currentHP / unit.maxHP, 1, 1]}
        >
          <planeGeometry args={[0.8, 0.1]} />
          <meshBasicMaterial color={unit.currentHP > unit.maxHP * 0.3 ? "#22c55e" : "#ef4444"} />
        </mesh>
      </group>

      {/* Selection indicator */}
      {isSelected && (
        <mesh position={[0, -0.45, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.6, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      )}

      {/* Current command indicator */}
      {unit.currentCommand && (
        <group position={[0, 1.5, 0]}>
          <mesh>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshBasicMaterial
              color={
                unit.currentCommand === "attack"
                  ? "#ef4444"
                  : unit.currentCommand === "defend"
                    ? "#3b82f6"
                    : unit.currentCommand === "support"
                      ? "#22c55e"
                      : "#a3a3a3"
              }
            />
          </mesh>
        </group>
      )}

      {/* Action state indicator (debug) */}
      {unit.actionState && unit.actionState !== "idle" && unit.actionState !== "dead" && (
        <Text position={[0, 1.8, 0]} fontSize={0.2} color="#ffffff" anchorX="center" anchorY="bottom">
          {unit.actionState}
        </Text>
      )}
    </group>
  )
}
