"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { behaviorTypes, conditions, targets } from "@/lib/game-data"

interface BehaviorEditorProps {
  character: {
    id: string
    name: string
    behaviors: Array<{
      id: string
      name: string
      type: string
      condition: string
      target: string
      priority: number
      isActive: boolean
    }>
  }
}

export default function BehaviorEditor({ character }: BehaviorEditorProps) {
  const [behaviors, setBehaviors] = useState(character.behaviors)
  const [editingBehavior, setEditingBehavior] = useState(null)

  const handleAddBehavior = () => {
    const newBehavior = {
      id: `behavior-${Date.now()}`,
      name: "New Behavior",
      type: "attack",
      condition: "always",
      target: "nearest_enemy",
      priority: 1,
      isActive: true,
    }

    setBehaviors([...behaviors, newBehavior])
    setEditingBehavior(newBehavior)
  }

  const handleSaveBehavior = () => {
    if (!editingBehavior) return

    setBehaviors(behaviors.map((b) => (b.id === editingBehavior.id ? editingBehavior : b)))

    setEditingBehavior(null)
  }

  const handleDeleteBehavior = (id) => {
    setBehaviors(behaviors.filter((b) => b.id !== id))
    if (editingBehavior?.id === id) {
      setEditingBehavior(null)
    }
  }

  const handleToggleBehavior = (id, isActive) => {
    setBehaviors(behaviors.map((b) => (b.id === id ? { ...b, isActive } : b)))
  }

  const updateEditingBehavior = (field, value) => {
    setEditingBehavior({
      ...editingBehavior,
      [field]: value,
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Assigned Behaviors</h3>
          <Button size="sm" onClick={handleAddBehavior}>
            Add Behavior
          </Button>
        </div>

        {behaviors.length > 0 ? (
          <div className="space-y-3">
            {behaviors.map((behavior) => (
              <div
                key={behavior.id}
                className={`bg-gray-700 p-3 rounded-lg cursor-pointer transition-all ${
                  editingBehavior?.id === behavior.id ? "ring-2 ring-amber-500" : ""
                }`}
                onClick={() => setEditingBehavior(behavior)}
              >
                <div className="flex justify-between items-center">
                  <div className="font-medium">{behavior.name}</div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={behavior.isActive}
                      onCheckedChange={(checked) => handleToggleBehavior(behavior.id, checked)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteBehavior(behavior.id)
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  {behavior.condition} → {behavior.type} → {behavior.target}
                </div>
                <div className="text-xs text-amber-400 mt-1">Priority: {behavior.priority}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-700 p-4 rounded-lg text-center text-gray-400">
            No behaviors assigned yet. Add a behavior to define how this character will act in battle.
          </div>
        )}
      </div>

      <div>
        {editingBehavior ? (
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-4">Edit Behavior</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="behavior-name" className="text-right">
                  Name
                </Label>
                <input
                  id="behavior-name"
                  className="col-span-3 bg-gray-800 border border-gray-600 rounded p-2"
                  value={editingBehavior.name}
                  onChange={(e) => updateEditingBehavior("name", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="behavior-type" className="text-right">
                  Action
                </Label>
                <Select value={editingBehavior.type} onValueChange={(value) => updateEditingBehavior("type", value)}>
                  <SelectTrigger id="behavior-type" className="col-span-3 bg-gray-800 border-gray-600">
                    <SelectValue placeholder="Select action type" />
                  </SelectTrigger>
                  <SelectContent>
                    {behaviorTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="behavior-condition" className="text-right">
                  Condition
                </Label>
                <Select
                  value={editingBehavior.condition}
                  onValueChange={(value) => updateEditingBehavior("condition", value)}
                >
                  <SelectTrigger id="behavior-condition" className="col-span-3 bg-gray-800 border-gray-600">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditions.map((condition) => (
                      <SelectItem key={condition.value} value={condition.value}>
                        {condition.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="behavior-target" className="text-right">
                  Target
                </Label>
                <Select
                  value={editingBehavior.target}
                  onValueChange={(value) => updateEditingBehavior("target", value)}
                >
                  <SelectTrigger id="behavior-target" className="col-span-3 bg-gray-800 border-gray-600">
                    <SelectValue placeholder="Select target" />
                  </SelectTrigger>
                  <SelectContent>
                    {targets.map((target) => (
                      <SelectItem key={target.value} value={target.value}>
                        {target.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="behavior-priority" className="text-right">
                  Priority
                </Label>
                <div className="col-span-3 flex items-center gap-4">
                  <Slider
                    id="behavior-priority"
                    min={1}
                    max={10}
                    step={1}
                    value={[editingBehavior.priority]}
                    onValueChange={([value]) => updateEditingBehavior("priority", value)}
                    className="flex-1"
                  />
                  <span className="w-8 text-center">{editingBehavior.priority}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setEditingBehavior(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveBehavior}>Save Behavior</Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-700 p-4 rounded-lg text-center text-gray-400 h-full flex items-center justify-center">
            <div>
              <p className="mb-4">Select a behavior to edit or create a new one.</p>
              <Button onClick={handleAddBehavior}>Add Behavior</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
