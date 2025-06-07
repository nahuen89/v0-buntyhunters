"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useGame } from "@/contexts/game-context"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function SaveLoadMenu() {
  const router = useRouter()
  const { hasSavedGame, loadGame, clearSave, gameData } = useGame()

  const handleNewGame = () => {
    router.push("/world-map")
  }

  const handleLoadGame = () => {
    loadGame()
    router.push("/world-map")
  }

  const handleClearSave = () => {
    clearSave()
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-6 text-lg" onClick={handleNewGame}>
        {hasSavedGame ? "Continue" : "New Game"}
      </Button>

      {hasSavedGame && (
        <>
          <Button
            variant="outline"
            className="border-amber-600 text-amber-400 hover:bg-amber-900/30 px-8 py-6 text-lg"
            onClick={handleLoadGame}
          >
            Load Game
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-900/30 px-8 py-6 text-lg">
                Clear Save
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-gray-800 border-gray-700">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Clear Save Data</AlertDialogTitle>
                <AlertDialogDescription className="text-gray-300">
                  This will permanently delete your saved game data. This action cannot be undone.
                  {gameData.lastSaved && (
                    <div className="mt-2 text-sm text-amber-400">
                      Last saved: {new Date(gameData.lastSaved).toLocaleString()}
                    </div>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-gray-700 text-white border-gray-600">Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white" onClick={handleClearSave}>
                  Clear Save
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  )
}
