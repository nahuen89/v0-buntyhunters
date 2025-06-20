import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-amber-400">Chronicles of Fate</h1>
        <p className="text-xl mb-8">A tactical RPG where your allies make their own decisions in battle</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-gray-800/50 p-6 rounded-lg border border-amber-700">
            <h2 className="text-2xl font-bold mb-4 text-amber-300">Autonomous Combat</h2>
            <p className="mb-4">
              Characters follow behavior patterns you assign before battle, making their own decisions while you focus
              on strategy.
            </p>
          </div>
          <div className="bg-gray-800/50 p-6 rounded-lg border border-amber-700">
            <h2 className="text-2xl font-bold mb-4 text-amber-300">Tactical Depth</h2>
            <p className="mb-4">
              Issue general commands to your team during battle, overriding individual behaviors when needed.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/world-map">
            <Button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-6 text-lg">New Game</Button>
          </Link>
          <Link href="/load-game">
            <Button
              variant="outline"
              className="border-amber-600 text-amber-400 hover:bg-amber-900/30 px-8 py-6 text-lg"
            >
              Load Game
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
