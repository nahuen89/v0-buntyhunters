"use client"

import type React from "react"
import { createContext, useContext, useEffect } from "react"
import type { Character, GameSave } from "@/types/game-types"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { GameDataManager } from "@/lib/game-data-manager"

interface GameContextType {
  gameData: GameSave
  updateGameData: (data: Partial<GameSave>) => void
  characters: Character[]
  updateCharacters: (characters: Character[]) => void
  updateCharacter: (characterId: string, updates: Partial<Character>) => void
  saveGame: () => void
  loadGame: () => void
  clearSave: () => void
  hasSavedGame: boolean
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameData, setGameData, clearGameData] = useLocalStorage<GameSave>(
    "tactics-game-save",
    GameDataManager.getDefaultGameSave(),
  )

  const [characters, setCharacters] = useLocalStorage<Character[]>(
    "tactics-game-characters",
    GameDataManager.getDefaultGameSave().characters,
  )

  // Auto-save when game data changes
  useEffect(() => {
    if (gameData) {
      GameDataManager.saveGame(gameData)
    }
  }, [gameData])

  // Auto-save when characters change
  useEffect(() => {
    if (characters) {
      GameDataManager.saveCharacters(characters)
      // Also update characters in game data
      setGameData((prev) => ({
        ...prev,
        characters: characters,
      }))
    }
  }, [characters, setGameData])

  const updateGameData = (updates: Partial<GameSave>) => {
    setGameData((prev) => ({
      ...prev,
      ...updates,
      lastSaved: new Date().toISOString(),
    }))
  }

  const updateCharacters = (newCharacters: Character[]) => {
    setCharacters(newCharacters)
  }

  const updateCharacter = (characterId: string, updates: Partial<Character>) => {
    setCharacters((prev) => prev.map((char) => (char.id === characterId ? { ...char, ...updates } : char)))
  }

  const saveGame = () => {
    const currentGameData = {
      ...gameData,
      characters: characters,
      lastSaved: new Date().toISOString(),
    }
    setGameData(currentGameData)
    GameDataManager.saveGame(currentGameData)
  }

  const loadGame = () => {
    const savedGame = GameDataManager.loadGame()
    if (savedGame) {
      setGameData(savedGame)
      setCharacters(savedGame.characters)
    }
  }

  const clearSave = () => {
    clearGameData()
    setCharacters(GameDataManager.getDefaultGameSave().characters)
    GameDataManager.clearSave()
  }

  const hasSavedGame = GameDataManager.hasSavedGame()

  return (
    <GameContext.Provider
      value={{
        gameData,
        updateGameData,
        characters,
        updateCharacters,
        updateCharacter,
        saveGame,
        loadGame,
        clearSave,
        hasSavedGame,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider")
  }
  return context
}
