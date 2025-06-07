"use client"

import type React from "react"
import { createContext, useContext, useCallback } from "react"
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
  const defaultGameSave = GameDataManager.getDefaultGameSave()

  const [gameData, setGameData, clearGameData] = useLocalStorage<GameSave>("tactics-game-save", defaultGameSave)

  const [characters, setCharacters] = useLocalStorage<Character[]>(
    "tactics-game-characters",
    defaultGameSave.characters,
  )

  const updateGameData = useCallback(
    (updates: Partial<GameSave>) => {
      setGameData((prev) => ({
        ...prev,
        ...updates,
        lastSaved: new Date().toISOString(),
      }))
    },
    [setGameData],
  )

  const updateCharacters = useCallback(
    (newCharacters: Character[]) => {
      setCharacters(newCharacters)
    },
    [setCharacters],
  )

  const updateCharacter = useCallback(
    (characterId: string, updates: Partial<Character>) => {
      setCharacters((prev) => prev.map((char) => (char.id === characterId ? { ...char, ...updates } : char)))
    },
    [setCharacters],
  )

  const saveGame = useCallback(() => {
    const currentGameData = {
      ...gameData,
      characters: characters,
      lastSaved: new Date().toISOString(),
    }
    setGameData(currentGameData)
  }, [gameData, characters, setGameData])

  const loadGame = useCallback(() => {
    const savedGame = GameDataManager.loadGame()
    if (savedGame) {
      setGameData(savedGame)
      setCharacters(savedGame.characters)
    }
  }, [setGameData, setCharacters])

  const clearSave = useCallback(() => {
    clearGameData()
    setCharacters(defaultGameSave.characters)
    GameDataManager.clearSave()
  }, [clearGameData, setCharacters, defaultGameSave.characters])

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
