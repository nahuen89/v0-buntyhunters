"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function BattleHUD({ battleData, turnCount, gameState, selectedUnit }) {
  const [activeTab, setActiveTab] = useState("units")

  const playerUnits = battleData.units.filter((unit) => unit.team === "player")
  const enemyUnits = battleData.units.filter((unit) => unit.team === "enemy")

  return (
    <div className="absolute top-0 left-0 w-full p-4">
      <div className="flex justify-between items-start">
        {/* Battle info */}
        <div className="bg-gray-900/80 p-3 rounded-lg border border-amber-700">
          <h2 className="text-xl font-bold text-amber-400">{battleData.name}</h2>
          <div className="text-white">Turn: {turnCount}</div>
          <div className="text-white capitalize">
            {gameState === "running"
              ? "Battle in Progress"
              : gameState === "paused"
                ? "Paused"
                : gameState === "victory"
                  ? "Victory!"
                  : gameState === "defeat"
                    ? "Defeat"
                    : gameState}
          </div>
        </div>

        {/* Victory/Defeat message */}
        {(gameState === "victory" || gameState === "defeat") && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900/90 p-8 rounded-lg border-2 border-amber-600 text-center">
            <h2 className="text-4xl font-bold mb-4 text-amber-400">
              {gameState === "victory" ? "Victory!" : "Defeat"}
            </h2>
            <p className="text-white mb-6">
              {gameState === "victory"
                ? "Your forces have prevailed on the battlefield!"
                : "Your forces have been defeated..."}
            </p>
            <div className="flex justify-center">
              <Button className="bg-amber-600 hover:bg-amber-700">Continue</Button>
            </div>
          </div>
        )}

        {/* Unit info panel */}
        <div className="bg-gray-900/80 p-3 rounded-lg border border-amber-700 w-80">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full bg-gray-800">
              <TabsTrigger value="units" className="flex-1">
                Units
              </TabsTrigger>
              <TabsTrigger value="objectives" className="flex-1">
                Objectives
              </TabsTrigger>
            </TabsList>

            <TabsContent value="units" className="mt-2">
              <div className="space-y-2">
                <div>
                  <h3 className="text-sm font-bold text-blue-400 mb-1">Allies</h3>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {playerUnits.map((unit) => (
                      <div
                        key={unit.id}
                        className="flex justify-between items-center text-sm bg-gray-800/60 p-1 rounded"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${unit.currentHP > 0 ? "bg-green-500" : "bg-red-500"}`}
                          ></div>
                          <span>{unit.name}</span>
                        </div>
                        <div className="text-xs">
                          HP: {unit.currentHP}/{unit.maxHP}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-red-400 mb-1">Enemies</h3>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {enemyUnits.map((unit) => (
                      <div
                        key={unit.id}
                        className="flex justify-between items-center text-sm bg-gray-800/60 p-1 rounded"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${unit.currentHP > 0 ? "bg-green-500" : "bg-red-500"}`}
                          ></div>
                          <span>{unit.name}</span>
                        </div>
                        <div className="text-xs">
                          HP: {unit.currentHP}/{unit.maxHP}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="objectives" className="mt-2">
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-amber-400">Battle Objectives</h3>
                <ul className="space-y-1">
                  {battleData.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div
                        className={`w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center mt-0.5 ${
                          objective.completed ? "bg-green-600" : "bg-gray-700"
                        }`}
                      >
                        {objective.completed && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        )}
                      </div>
                      <div>
                        <div className={objective.completed ? "text-green-400" : "text-white"}>
                          {objective.description}
                        </div>
                        {objective.subtext && <div className="text-xs text-gray-400">{objective.subtext}</div>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
          </Tabs>

          {/* Selected unit details */}
          {selectedUnit && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <h3 className="text-sm font-bold text-amber-400 mb-2">Selected Unit</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-gray-800/60 p-1 rounded">
                  <span className="text-gray-400">Name:</span> {selectedUnit.name}
                </div>
                <div className="bg-gray-800/60 p-1 rounded">
                  <span className="text-gray-400">Class:</span> {selectedUnit.class}
                </div>
                <div className="bg-gray-800/60 p-1 rounded">
                  <span className="text-gray-400">HP:</span> {selectedUnit.currentHP}/{selectedUnit.maxHP}
                </div>
                <div className="bg-gray-800/60 p-1 rounded">
                  <span className="text-gray-400">MP:</span> {selectedUnit.currentMP}/{selectedUnit.maxMP}
                </div>
                <div className="bg-gray-800/60 p-1 rounded col-span-2">
                  <span className="text-gray-400">Command:</span> {selectedUnit.currentCommand || "None"}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
