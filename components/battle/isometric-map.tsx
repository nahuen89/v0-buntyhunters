"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Text } from "@react-three/drei"

const tileColors = {
  grass: "#4ade80",
  water: "#38bdf8",
  mountain: "#a1a1aa",
  forest: "#22c55e",
  road: "#d4d4d8",
  bridge: "#a16207",
}

const tileHeights = {
  grass: 0,
  water: -0.2,
  mountain: 1,
  forest: 0,
  road: 0,
  bridge: 0.1,
}

export default function IsometricMap({ mapData }) {
  const mapRef = useRef()

  // Water animation
  useFrame((state) => {
    if (mapRef.current) {
      mapRef.current.children.forEach((child) => {
        if (child.userData.type === "water") {
          child.position.y =
            tileHeights.water + Math.sin(state.clock.elapsedTime + child.position.x + child.position.z) * 0.05
        }
      })
    }
  })

  return (
    <group ref={mapRef}>
      {/* Base grid */}
      <gridHelper
        args={[mapData.width, mapData.width, "#666666", "#444444"]}
        position={[mapData.width / 2 - 0.5, -0.01, mapData.height / 2 - 0.5]}
        rotation={[0, 0, 0]}
      />

      {/* Map tiles */}
      {mapData.tiles.map((row, z) =>
        row.map((tile, x) => {
          const height = tileHeights[tile.type] || 0
          const color = tileColors[tile.type] || "#ffffff"

          return (
            <group key={`${x}-${z}`} position={[x, 0, z]}>
              {/* Base tile */}
              <mesh position={[0, height / 2, 0]} receiveShadow userData={{ type: tile.type }}>
                <boxGeometry args={[1, height || 0.1, 1]} />
                <meshStandardMaterial color={color} />
              </mesh>

              {/* Forest details */}
              {tile.type === "forest" && (
                <group position={[0, height, 0]}>
                  <mesh position={[0, 0.5, 0]} castShadow>
                    <coneGeometry args={[0.4, 1, 8]} />
                    <meshStandardMaterial color="#15803d" />
                  </mesh>
                  <mesh position={[0, 0, 0]} castShadow>
                    <cylinderGeometry args={[0.1, 0.1, 0.4, 8]} />
                    <meshStandardMaterial color="#854d0e" />
                  </mesh>
                </group>
              )}

              {/* Mountain details */}
              {tile.type === "mountain" && (
                <group position={[0, height, 0]}>
                  <mesh position={[0, 0.3, 0]} castShadow>
                    <coneGeometry args={[0.5, 0.6, 4]} />
                    <meshStandardMaterial color="#71717a" />
                  </mesh>
                </group>
              )}

              {/* Elevation number */}
              {tile.elevation > 0 && (
                <group position={[0, height + 0.05, 0]}>
                  <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[0.3, 0.3]} />
                    <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
                  </mesh>
                  <Text position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.2} color="#000000">
                    {tile.elevation.toString()}
                  </Text>
                </group>
              )}
            </group>
          )
        }),
      )}
    </group>
  )
}
