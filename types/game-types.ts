export interface Character {
  id: string
  name: string
  level: number
  class: string
  currentHP: number
  maxHP: number
  currentMP: number
  maxMP: number
  exp: number
  nextLevelExp: number
  jp: number
  portrait: string
  stats: {
    str: number
    vit: number
    dex: number
    int: number
    wis: number
    agi: number
  }
  equipment: {
    weapon: Equipment | null
    shield: Equipment | null
    head: Equipment | null
    body: Equipment | null
    accessory: Equipment | null
  }
  statusEffects: StatusEffect[]
  abilities: {
    active: Ability[]
    passive: Ability[]
  }
  behaviors: Behavior[]
}

export interface Equipment {
  name: string
  attack?: number
  defense?: number
  magicAttack?: number
  magicDefense?: number
  effect?: string
}

export interface StatusEffect {
  id: string
  name: string
  description: string
  duration?: number
}

export interface Ability {
  id: string
  name: string
  description: string
  mpCost: number
}

export interface Behavior {
  id: string
  name: string
  type: string
  condition: string
  target: string
  priority: number
  isActive: boolean
}

export interface GameSave {
  characters: Character[]
  currentLocation: string
  gameProgress: {
    completedBattles: string[]
    unlockedLocations: string[]
    gameTime: number
  }
  lastSaved: string
}

export interface BattleUnit {
  id: string
  name: string
  team: "player" | "enemy" | "neutral"
  class: string
  level: number
  currentHP: number
  maxHP: number
  currentMP: number
  maxMP: number
  actionPoints: number
  maxActionPoints: number
  position: { x: number; z: number }
  currentCommand: string | null
  actionState?: string
  lastActionTime?: number
  actionTarget?: string | null
  isDefending?: boolean
}
