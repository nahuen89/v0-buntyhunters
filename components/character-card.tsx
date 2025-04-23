"use client"

interface CharacterCardProps {
  character: {
    id: string
    name: string
    level: number
    class: string
    currentHP: number
    maxHP: number
    portrait: string
  }
  isSelected: boolean
  onClick: () => void
}

export default function CharacterCard({ character, isSelected, onClick }: CharacterCardProps) {
  const hpPercentage = (character.currentHP / character.maxHP) * 100
  const hpColor = hpPercentage > 50 ? "bg-green-500" : hpPercentage > 25 ? "bg-yellow-500" : "bg-red-500"

  return (
    <button
      className={`w-full p-2 rounded-lg transition-all ${
        isSelected ? "bg-amber-700/50 border border-amber-500" : "bg-gray-700 hover:bg-gray-600"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-600">
          <img src={character.portrait || "/placeholder.svg"} alt={character.name} className="object-cover" />
        </div>
        <div className="text-left">
          <div className="font-medium">{character.name}</div>
          <div className="text-xs text-gray-400">
            Lv.{character.level} {character.class}
          </div>
        </div>
      </div>
      <div className="mt-2 w-full h-2 bg-gray-600 rounded-full overflow-hidden">
        <div className={`h-full ${hpColor}`} style={{ width: `${hpPercentage}%` }}></div>
      </div>
    </button>
  )
}
