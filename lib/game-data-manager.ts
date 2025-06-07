"use client"

import type { Character, GameSave } from "@/types/game-types"
import { characters as defaultCharacters } from "./game-data"

const GAME_SAVE_KEY = "tactics-game-save"
const CHARACTERS_KEY = "tactics-game-characters"

export class GameDataManager {
  static getDefaultGameSave(): GameSave {
    return {
      characters: defaultCharacters,
      currentLocation: "town1",
      gameProgress: {
        completedBattles: [],
        unlockedLocations: ["town1", "castle1", "battle1"],
        gameTime: 0,
      },
      lastSaved: new Date().toISOString(),
    }
  }

  static saveGame(gameData: GameSave): void {
    try {
      const dataToSave = {
        ...gameData,
        lastSaved: new Date().toISOString(),
      }
      localStorage.setItem(GAME_SAVE_KEY, JSON.stringify(dataToSave))
    } catch (error) {
      console.error("Failed to save game:", error)
    }
  }

  static loadGame(): GameSave | null {
    try {
      const savedData = localStorage.getItem(GAME_SAVE_KEY)
      if (savedData) {
        return JSON.parse(savedData)
      }
    } catch (error) {
      console.error("Failed to load game:", error)
    }
    return null
  }

  static saveCharacters(characters: Character[]): void {
    try {
      localStorage.setItem(CHARACTERS_KEY, JSON.stringify(characters))
    } catch (error) {
      console.error("Failed to save characters:", error)
    }
  }

  static loadCharacters(): Character[] {
    try {
      const savedCharacters = localStorage.getItem(CHARACTERS_KEY)
      if (savedCharacters) {
        return JSON.parse(savedCharacters)
      }
    } catch (error) {
      console.error("Failed to load characters:", error)
    }
    return defaultCharacters
  }

  static clearSave(): void {
    try {
      localStorage.removeItem(GAME_SAVE_KEY)
      localStorage.removeItem(CHARACTERS_KEY)
    } catch (error) {
      console.error("Failed to clear save:", error)
    }
  }

  static hasSavedGame(): boolean {
    try {
      return localStorage.getItem(GAME_SAVE_KEY) !== null
    } catch (error) {
      return false
    }
  }
}
