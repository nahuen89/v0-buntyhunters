"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { getBattleData } from "@/lib/game-data"
import IsometricMap from "@/components/battle/isometric-map"
import BattleHUD from "@/components/battle/battle-hud"
import BattleCommandMenu from "@/components/battle/battle-command-menu"
import BattleCharacter from "@/components/battle/battle-character"
import BattleAI from "@/lib/battle-ai"
import { Play, Pause, FastForward } from "lucide-react"

export default function BattlePage({ params }) {
  const router = useRouter()
  const battleId = params.id
  const [battleData, setBattleData] = useState(null)
  const [selectedUnit, setSelectedUnit] = useState(null)
  const [gameState, setGameState] = useState("initializing") // initializing, running, paused, victory, defeat
  const [simulationSpeed, setSimulationSpeed] = useState(1) // 1 = normal, 2 = fast, 0.5 = slow
  const battleAIRef = useRef(null)
  const animationFrameRef = useRef(null)
  const lastUpdateTimeRef = useRef(0)
  const elapsedTimeRef = useRef(0)
  const turnCountRef = useRef(1)
  const battleDataRef = useRef(null)

  // Initialize battle data and AI
  useEffect(() => {
    // Load battle data
    const data = getBattleData(battleId)

    // Initialize each unit with actionState
    const initializedData = {
      ...data,
      units: data.units.map((unit) => ({
        ...unit,
        actionState: "idle",
        lastActionTime: 0,
        actionTarget: null,
        isDefending: false,
      })),
    }

    setBattleData(initializedData)
    battleDataRef.current = initializedData

    // Initialize battle AI
    battleAIRef.current = new BattleAI(initializedData)

    // Start in paused state to allow player to review the battlefield
    setGameState("paused")

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [battleId])

  // Handle simulation state changes
  useEffect(() => {
    if (gameState === "running" && battleData) {
      lastUpdateTimeRef.current = performance.now()
      runSimulation()
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [gameState, simulationSpeed])

  // Update battleDataRef when battleData changes
  useEffect(() => {
    if (battleData) {
      battleDataRef.current = battleData
    }
  }, [battleData])

  const runSimulation = () => {
    const currentTime = performance.now()
    const deltaTime = (currentTime - lastUpdateTimeRef.current) / 1000 // Convert to seconds
    lastUpdateTimeRef.current = currentTime

    // Accumulate elapsed time
    elapsedTimeRef.current += deltaTime * simulationSpeed

    // Update simulation at fixed intervals (every 0.2 seconds)
    if (elapsedTimeRef.current >= 0.2) {
      elapsedTimeRef.current = 0

      // Process unit behaviors and actions
      if (battleAIRef.current && battleDataRef.current) {
        const updatedBattleData = battleAIRef.current.processAutonomousBehaviors(battleDataRef.current)

        // Update the state
        setBattleData(updatedBattleData)
        battleDataRef.current = updatedBattleData

        // Check victory/defeat conditions
        const playerUnits = updatedBattleData.units.filter((u) => u.team === "player" && u.currentHP > 0)
        const enemyUnits = updatedBattleData.units.filter((u) => u.team === "enemy" && u.currentHP > 0)

        if (enemyUnits.length === 0) {
          setGameState("victory")
        } else if (playerUnits.length === 0) {
          setGameState("defeat")
        }
      }
    }

    // Continue simulation if still running
    if (gameState === "running") {
      animationFrameRef.current = requestAnimationFrame(runSimulation)
    }
  }

  const handleUnitSelect = (unit) => {
    setSelectedUnit(unit)
  }

  const handleToggleSimulation = () => {
    setGameState(gameState === "running" ? "paused" : "running")
  }

  const handleChangeSpeed = (speed) => {
    setSimulationSpeed(speed)
  }

  const handleIssueCommand = (command) => {
    if (!battleData) return

    // Apply command to all player units
    const updatedUnits = battleData.units.map((unit) => {
      if (unit.team === "player" && unit.currentHP > 0) {
        return { ...unit, currentCommand: command }
      }
      return unit
    })

    const updatedBattleData = {
      ...battleData,
      units: updatedUnits,
    }

    setBattleData(updatedBattleData)
    battleDataRef.current = updatedBattleData
  }

  if (!battleData) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-900 text-white">Loading battle...</div>
    )
  }

  return (
    <div className="relative w-full h-screen bg-gray-900 overflow-hidden">
      <Canvas shadows camera={{ position: [10, 10, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        <IsometricMap mapData={battleData.map} />

        {battleData.units.map((unit) => (
          <BattleCharacter
            key={unit.id}
            unit={unit}
            isSelected={selectedUnit?.id === unit.id}
            onClick={() => handleUnitSelect(unit)}
            gameState={gameState}
          />
        ))}

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.5}
        />
      </Canvas>

      <BattleHUD
        battleData={battleData}
        turnCount={turnCountRef.current}
        gameState={gameState}
        selectedUnit={selectedUnit}
      />

      {/* Battle controls */}
      <div className="absolute bottom-4 left-4 flex gap-2 bg-gray-900/80 p-2 rounded-lg border border-amber-700">
        <Button
          variant="outline"
          size="icon"
          className={`${gameState === "running" ? "bg-amber-700/50" : "bg-gray-800"}`}
          onClick={handleToggleSimulation}
        >
          {gameState === "running" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>

        <Button
          variant="outline"
          size="icon"
          className={simulationSpeed === 2 ? "bg-amber-700/50" : "bg-gray-800"}
          onClick={() => handleChangeSpeed(simulationSpeed === 2 ? 1 : 2)}
        >
          <FastForward className="h-4 w-4" />
        </Button>
      </div>

      {/* Command menu */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        <BattleCommandMenu onIssueCommand={handleIssueCommand} />

        {(gameState === "victory" || gameState === "defeat") && (
          <Button className="bg-amber-600 hover:bg-amber-700" onClick={() => router.push("/world-map")}>
            Return to Map
          </Button>
        )}
      </div>
    </div>
  )
}
