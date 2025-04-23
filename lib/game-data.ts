// Sample game data for development

// World map locations
export const locations = [
  {
    id: "town1",
    name: "Oakvale",
    type: "town",
    x: 30,
    y: 40,
    description: "A peaceful town nestled in the forest.",
  },
  {
    id: "castle1",
    name: "Highkeep Castle",
    type: "castle",
    x: 50,
    y: 30,
    description: "The royal castle and seat of power.",
  },
  {
    id: "battle1",
    name: "Misty Valley",
    type: "battle",
    x: 40,
    y: 50,
    description: "A strategic valley where enemy forces have been spotted.",
  },
  {
    id: "town2",
    name: "Riverport",
    type: "town",
    x: 70,
    y: 60,
    description: "A bustling port town with a thriving market.",
  },
  {
    id: "battle2",
    name: "Darkwood Forest",
    type: "battle",
    x: 60,
    y: 70,
    description: "A dense forest where bandits are known to ambush travelers.",
  },
]

// Character data
export const characters = [
  {
    id: "char1",
    name: "Varian",
    level: 5,
    class: "Warrior",
    currentHP: 120,
    maxHP: 120,
    currentMP: 30,
    maxMP: 30,
    exp: 450,
    nextLevelExp: 600,
    jp: 75,
    portrait: "/placeholder.svg?height=200&width=200",
    stats: {
      str: 14,
      vit: 12,
      dex: 8,
      int: 6,
      wis: 7,
      agi: 9,
    },
    equipment: {
      weapon: { name: "Steel Sword", attack: 12 },
      shield: { name: "Wooden Shield", defense: 5 },
      head: { name: "Leather Cap", defense: 3 },
      body: { name: "Chain Mail", defense: 8 },
      accessory: null,
    },
    statusEffects: [],
    abilities: {
      active: [
        { id: "ability1", name: "Slash", description: "A basic attack with increased accuracy", mpCost: 0 },
        { id: "ability2", name: "Shield Bash", description: "Stun an enemy for 1 turn", mpCost: 8 },
        { id: "ability3", name: "Provoke", description: "Draw enemy attention to self", mpCost: 5 },
      ],
      passive: [{ id: "passive1", name: "Counter", description: "20% chance to counter physical attacks" }],
    },
    behaviors: [
      {
        id: "behavior1",
        name: "Aggressive",
        type: "attack",
        condition: "always",
        target: "nearest_enemy",
        priority: 3,
        isActive: true,
      },
      {
        id: "behavior2",
        name: "Protect Allies",
        type: "defend",
        condition: "ally_hp_below_30",
        target: "weakest_ally",
        priority: 5,
        isActive: true,
      },
    ],
  },
  {
    id: "char2",
    name: "Lyra",
    level: 4,
    class: "Archer",
    currentHP: 85,
    maxHP: 90,
    currentMP: 40,
    maxMP: 40,
    exp: 380,
    nextLevelExp: 500,
    jp: 60,
    portrait: "/placeholder.svg?height=200&width=200",
    stats: {
      str: 8,
      vit: 7,
      dex: 15,
      int: 10,
      wis: 9,
      agi: 13,
    },
    equipment: {
      weapon: { name: "Longbow", attack: 10 },
      shield: null,
      head: { name: "Leather Hood", defense: 2 },
      body: { name: "Leather Armor", defense: 5 },
      accessory: { name: "Hawk Eye Charm", effect: "Increases accuracy" },
    },
    statusEffects: [],
    abilities: {
      active: [
        { id: "ability4", name: "Quick Shot", description: "A fast attack with reduced damage", mpCost: 0 },
        { id: "ability5", name: "Aimed Shot", description: "A precise shot with increased critical chance", mpCost: 6 },
        { id: "ability6", name: "Rain of Arrows", description: "Attack all enemies in an area", mpCost: 12 },
      ],
      passive: [{ id: "passive2", name: "Keen Eye", description: "Increased accuracy with ranged attacks" }],
    },
    behaviors: [
      {
        id: "behavior3",
        name: "Keep Distance",
        type: "move",
        condition: "enemy_nearby",
        target: "safe_position",
        priority: 4,
        isActive: true,
      },
      {
        id: "behavior4",
        name: "Focus Fire",
        type: "attack",
        condition: "always",
        target: "weakest_enemy",
        priority: 2,
        isActive: true,
      },
    ],
  },
  {
    id: "char3",
    name: "Elara",
    level: 4,
    class: "Mage",
    currentHP: 65,
    maxHP: 70,
    currentMP: 85,
    maxMP: 85,
    exp: 360,
    nextLevelExp: 500,
    jp: 65,
    portrait: "/placeholder.svg?height=200&width=200",
    stats: {
      str: 5,
      vit: 6,
      dex: 8,
      int: 16,
      wis: 14,
      agi: 9,
    },
    equipment: {
      weapon: { name: "Oak Staff", attack: 6, magicAttack: 12 },
      shield: null,
      head: { name: "Wizard Hat", defense: 1, magicDefense: 5 },
      body: { name: "Robe", defense: 3, magicDefense: 8 },
      accessory: { name: "Mana Crystal", effect: "Increases MP regeneration" },
    },
    statusEffects: [],
    abilities: {
      active: [
        { id: "ability7", name: "Fireball", description: "A basic fire attack against a single target", mpCost: 8 },
        { id: "ability8", name: "Ice Shard", description: "An ice attack that can slow enemies", mpCost: 10 },
        { id: "ability9", name: "Healing Light", description: "Restore HP to a single ally", mpCost: 12 },
      ],
      passive: [{ id: "passive3", name: "Mana Flow", description: "Recover 5% MP each turn" }],
    },
    behaviors: [
      {
        id: "behavior5",
        name: "Support Role",
        type: "heal",
        condition: "ally_hp_below_50",
        target: "weakest_ally",
        priority: 5,
        isActive: true,
      },
      {
        id: "behavior6",
        name: "Elemental Attack",
        type: "cast",
        condition: "mp_above_30",
        target: "strongest_enemy",
        priority: 3,
        isActive: true,
      },
    ],
  },
]

// Behavior types for the behavior editor
export const behaviorTypes = [
  { value: "attack", label: "Attack" },
  { value: "defend", label: "Defend" },
  { value: "heal", label: "Heal" },
  { value: "cast", label: "Cast Spell" },
  { value: "move", label: "Move" },
  { value: "item", label: "Use Item" },
  { value: "flee", label: "Flee" },
]

// Conditions for the behavior editor
export const conditions = [
  { value: "always", label: "Always" },
  { value: "hp_below_30", label: "Self HP < 30%" },
  { value: "hp_below_50", label: "Self HP < 50%" },
  { value: "ally_hp_below_30", label: "Ally HP < 30%" },
  { value: "ally_hp_below_50", label: "Ally HP < 50%" },
  { value: "mp_above_30", label: "MP > 30%" },
  { value: "mp_above_50", label: "MP > 50%" },
  { value: "enemy_nearby", label: "Enemy Nearby" },
  { value: "outnumbered", label: "Outnumbered" },
  { value: "status_effect", label: "Has Status Effect" },
]

// Targets for the behavior editor
export const targets = [
  { value: "self", label: "Self" },
  { value: "nearest_enemy", label: "Nearest Enemy" },
  { value: "strongest_enemy", label: "Strongest Enemy" },
  { value: "weakest_enemy", label: "Weakest Enemy" },
  { value: "nearest_ally", label: "Nearest Ally" },
  { value: "weakest_ally", label: "Weakest Ally" },
  { value: "all_enemies", label: "All Enemies" },
  { value: "all_allies", label: "All Allies" },
  { value: "safe_position", label: "Safe Position" },
]

// Battle data
export function getBattleData(battleId) {
  // Sample battle data
  return {
    id: battleId,
    name: battleId === "battle1" ? "Misty Valley Skirmish" : "Darkwood Ambush",
    map: {
      width: 10,
      height: 10,
      tiles: Array(10)
        .fill()
        .map((_, z) =>
          Array(10)
            .fill()
            .map((_, x) => ({
              type:
                Math.random() < 0.7
                  ? "grass"
                  : Math.random() < 0.5
                    ? "forest"
                    : Math.random() < 0.5
                      ? "mountain"
                      : "water",
              elevation: Math.floor(Math.random() * 3),
            })),
        ),
    },
    units: [
      // Player units
      {
        id: "p1",
        name: "Varian",
        team: "player",
        class: "warrior",
        level: 5,
        currentHP: 120,
        maxHP: 120,
        currentMP: 30,
        maxMP: 30,
        actionPoints: 2,
        maxActionPoints: 2,
        position: { x: 2, z: 2 },
        currentCommand: null,
      },
      {
        id: "p2",
        name: "Lyra",
        team: "player",
        class: "archer",
        level: 4,
        currentHP: 85,
        maxHP: 90,
        currentMP: 40,
        maxMP: 40,
        actionPoints: 2,
        maxActionPoints: 2,
        position: { x: 3, z: 3 },
        currentCommand: null,
      },
      {
        id: "p3",
        name: "Elara",
        team: "player",
        class: "mage",
        level: 4,
        currentHP: 65,
        maxHP: 70,
        currentMP: 85,
        maxMP: 85,
        actionPoints: 2,
        maxActionPoints: 2,
        position: { x: 2, z: 3 },
        currentCommand: null,
      },

      // Enemy units
      {
        id: "e1",
        name: "Goblin Warrior",
        team: "enemy",
        class: "warrior",
        level: 3,
        currentHP: 60,
        maxHP: 60,
        currentMP: 10,
        maxMP: 10,
        actionPoints: 2,
        maxActionPoints: 2,
        position: { x: 7, z: 7 },
        currentCommand: null,
      },
      {
        id: "e2",
        name: "Goblin Archer",
        team: "enemy",
        class: "archer",
        level: 3,
        currentHP: 45,
        maxHP: 45,
        currentMP: 15,
        maxMP: 15,
        actionPoints: 2,
        maxActionPoints: 2,
        position: { x: 8, z: 7 },
        currentCommand: null,
      },
      {
        id: "e3",
        name: "Goblin Shaman",
        team: "enemy",
        class: "mage",
        level: 4,
        currentHP: 40,
        maxHP: 40,
        currentMP: 50,
        maxMP: 50,
        actionPoints: 2,
        maxActionPoints: 2,
        position: { x: 7, z: 8 },
        currentCommand: null,
      },
    ],
    objectives: [
      {
        description: "Defeat all enemy units",
        completed: false,
        subtext: "0/3 enemies defeated",
      },
      {
        description: "Keep all allies alive",
        completed: true,
        subtext: "3/3 allies remaining",
      },
      {
        description: "Complete battle in under 10 turns",
        completed: false,
        subtext: "Current turn: 1/10",
      },
    ],
  }
}
