"use client"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Castle, Home, Swords } from "lucide-react"

interface WorldMapLocationProps {
  location: {
    id: string
    name: string
    type: string
    x: number
    y: number
    description: string
  }
  isSelected: boolean
  onSelect: (location: any) => void
}

export default function WorldMapLocation({ location, isSelected, onSelect }: WorldMapLocationProps) {
  const getIcon = () => {
    switch (location.type) {
      case "town":
        return <Home className="h-4 w-4" />
      case "castle":
        return <Castle className="h-4 w-4" />
      case "battle":
        return <Swords className="h-4 w-4" />
      default:
        return <Home className="h-4 w-4" />
    }
  }

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <button
          className={`absolute w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isSelected
              ? "bg-amber-500 text-black scale-125 z-10"
              : "bg-gray-800 text-amber-400 hover:bg-amber-700 hover:text-white"
          }`}
          style={{
            left: `${location.x}%`,
            top: `${location.y}%`,
            transform: isSelected ? "translate(-50%, -50%) scale(1.25)" : "translate(-50%, -50%)",
          }}
          onClick={() => onSelect(location)}
        >
          {getIcon()}
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{location.name}</p>
      </TooltipContent>
    </Tooltip>
  )
}
