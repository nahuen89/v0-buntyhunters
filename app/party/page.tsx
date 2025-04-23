"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { characters } from "@/lib/game-data"
import CharacterCard from "@/components/character-card"
import BehaviorEditor from "@/components/behavior-editor"

export default function PartyPage() {
  const router = useRouter()
  const [selectedCharacter, setSelectedCharacter] = useState(characters[0])
  const [activeTab, setActiveTab] = useState("stats")

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-amber-400">Party Management</h1>
          <Button
            variant="outline"
            className="border-amber-600 text-amber-400"
            onClick={() => router.push("/world-map")}
          >
            Return to Map
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 bg-gray-800 rounded-lg p-4 h-[600px] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-center border-b border-gray-700 pb-2">Characters</h2>
            <div className="space-y-2">
              {characters.map((character) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  isSelected={selectedCharacter?.id === character.id}
                  onClick={() => setSelectedCharacter(character)}
                />
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 bg-gray-800 rounded-lg p-4">
            {selectedCharacter && (
              <>
                <div className="flex flex-col md:flex-row gap-6 mb-6">
                  <div className="w-full md:w-1/3 flex justify-center">
                    <div className="relative w-48 h-48 border-4 border-amber-700 rounded-lg overflow-hidden">
                      <Image
                        src={selectedCharacter.portrait || "/placeholder.svg"}
                        alt={selectedCharacter.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <div className="w-full md:w-2/3">
                    <h2 className="text-2xl font-bold text-amber-400">{selectedCharacter.name}</h2>
                    <p className="text-gray-400 mb-4">
                      Level {selectedCharacter.level} {selectedCharacter.class}
                    </p>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="bg-gray-700 p-2 rounded">
                        <span className="text-gray-400">HP:</span> {selectedCharacter.currentHP}/
                        {selectedCharacter.maxHP}
                      </div>
                      <div className="bg-gray-700 p-2 rounded">
                        <span className="text-gray-400">MP:</span> {selectedCharacter.currentMP}/
                        {selectedCharacter.maxMP}
                      </div>
                      <div className="bg-gray-700 p-2 rounded">
                        <span className="text-gray-400">EXP:</span> {selectedCharacter.exp}/
                        {selectedCharacter.nextLevelExp}
                      </div>
                      <div className="bg-gray-700 p-2 rounded">
                        <span className="text-gray-400">JP:</span> {selectedCharacter.jp}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(selectedCharacter.stats).map(([stat, value]) => (
                        <div key={stat} className="bg-gray-700 p-2 rounded">
                          <span className="text-gray-400">{stat.toUpperCase()}:</span> {value}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full bg-gray-700">
                    <TabsTrigger value="stats" className="flex-1">
                      Stats & Equipment
                    </TabsTrigger>
                    <TabsTrigger value="abilities" className="flex-1">
                      Abilities
                    </TabsTrigger>
                    <TabsTrigger value="behaviors" className="flex-1">
                      Battle Behaviors
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="stats" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-bold mb-2 border-b border-gray-700 pb-1">Equipment</h3>
                        <div className="space-y-2">
                          {Object.entries(selectedCharacter.equipment).map(([slot, item]) => (
                            <div key={slot} className="flex justify-between bg-gray-700 p-2 rounded">
                              <span className="text-gray-400">{slot}:</span>
                              <span>{item ? item.name : "Empty"}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold mb-2 border-b border-gray-700 pb-1">Status Effects</h3>
                        {selectedCharacter.statusEffects.length > 0 ? (
                          <div className="space-y-2">
                            {selectedCharacter.statusEffects.map((effect) => (
                              <div key={effect.id} className="bg-gray-700 p-2 rounded">
                                <div className="font-bold">{effect.name}</div>
                                <div className="text-sm text-gray-400">{effect.description}</div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-400">No active status effects</p>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="abilities" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-bold mb-2 border-b border-gray-700 pb-1">Active Abilities</h3>
                        <div className="space-y-2">
                          {selectedCharacter.abilities.active.map((ability) => (
                            <div key={ability.id} className="bg-gray-700 p-2 rounded">
                              <div className="font-bold">{ability.name}</div>
                              <div className="text-sm text-gray-400">{ability.description}</div>
                              <div className="text-sm">MP Cost: {ability.mpCost}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold mb-2 border-b border-gray-700 pb-1">Passive Abilities</h3>
                        <div className="space-y-2">
                          {selectedCharacter.abilities.passive.map((ability) => (
                            <div key={ability.id} className="bg-gray-700 p-2 rounded">
                              <div className="font-bold">{ability.name}</div>
                              <div className="text-sm text-gray-400">{ability.description}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="behaviors" className="mt-4">
                    <BehaviorEditor character={selectedCharacter} />
                  </TabsContent>
                </Tabs>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
