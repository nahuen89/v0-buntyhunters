"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Sword, Shield, Heart, Users } from "lucide-react"

export default function BattleCommandMenu({ onIssueCommand }) {
  const [open, setOpen] = useState(false)

  const handleCommand = (command) => {
    onIssueCommand(command)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="border-amber-600 text-amber-400">
          <Users className="mr-2 h-4 w-4" />
          Issue Command
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 bg-gray-800 border-amber-700">
        <div className="grid gap-2">
          <h3 className="font-medium text-center text-amber-400 mb-1">Team Commands</h3>
          <Button
            variant="outline"
            className="justify-start border-red-700 text-red-400 hover:bg-red-950/30"
            onClick={() => handleCommand("attack")}
          >
            <Sword className="mr-2 h-4 w-4" />
            Attack
          </Button>
          <Button
            variant="outline"
            className="justify-start border-blue-700 text-blue-400 hover:bg-blue-950/30"
            onClick={() => handleCommand("defend")}
          >
            <Shield className="mr-2 h-4 w-4" />
            Defend
          </Button>
          <Button
            variant="outline"
            className="justify-start border-green-700 text-green-400 hover:bg-green-950/30"
            onClick={() => handleCommand("support")}
          >
            <Heart className="mr-2 h-4 w-4" />
            Support
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
