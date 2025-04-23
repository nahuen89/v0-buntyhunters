"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { TooltipProvider } from "@/components/ui/tooltip"
import { locations } from "@/lib/game-data"
import WorldMapLocation from "@/components/world-map-location"

export default function WorldMapPage() {
  const router = useRouter()
  const [selectedLocation, setSelectedLocation] = useState(null)

  const handleLocationSelect = (location) => {
    setSelectedLocation(location)
  }

  const handleEnterLocation = () => {
    if (selectedLocation) {
      if (selectedLocation.type === "battle") {
        router.push(`/battle/${selectedLocation.id}`)
      } else {
        router.push(`/town/${selectedLocation.id}`)
      }
    }
  }

  return (
    <div className="relative w-full h-screen bg-gray-900 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full max-w-6xl aspect-[4/3]">
          <Image src="/images/world-map.png" alt="World Map" fill className="object-cover" priority />

          <TooltipProvider>
            {locations.map((location) => (
              <WorldMapLocation
                key={location.id}
                location={location}
                isSelected={selectedLocation?.id === location.id}
                onSelect={handleLocationSelect}
              />
            ))}
          </TooltipProvider>
        </div>
      </div>

      {selectedLocation && (
        <div className="absolute bottom-0 left-0 right-0 bg-gray-900/90 p-4 border-t border-amber-700">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-amber-400">{selectedLocation.name}</h2>
              <p className="text-gray-300">{selectedLocation.description}</p>
            </div>
            <Button className="mt-4 sm:mt-0 bg-amber-600 hover:bg-amber-700" onClick={handleEnterLocation}>
              {selectedLocation.type === "battle" ? "Begin Battle" : "Enter Town"}
            </Button>
          </div>
        </div>
      )}

      <div className="absolute top-4 right-4 flex gap-2">
        <Button variant="outline" className="border-amber-600 text-amber-400" onClick={() => router.push("/party")}>
          Party
        </Button>
        <Button variant="outline" className="border-amber-600 text-amber-400" onClick={() => router.push("/menu")}>
          Menu
        </Button>
      </div>
    </div>
  )
}
