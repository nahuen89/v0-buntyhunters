export default class BattleAI {
  constructor(battleData) {
    this.battleData = battleData
    this.actionCooldowns = {}
    this.unitTargets = {}
    this.pathfinding = {}
    this.lastProcessTime = Date.now()
  }

  processAutonomousBehaviors(battleData) {
    // Clone the battle data to avoid direct mutations
    const updatedBattleData = JSON.parse(JSON.stringify(battleData))
    const currentTime = Date.now()

    // Process each unit's behavior
    updatedBattleData.units.forEach((unit) => {
      if (unit.currentHP > 0) {
        // Check if enough time has passed since the last action
        const cooldownTime = this.actionCooldowns[unit.id] || 0

        if (currentTime >= cooldownTime) {
          this.processUnitBehavior(unit, updatedBattleData, currentTime)
        }
      } else {
        // Ensure dead units have the right state
        unit.actionState = "dead"
      }
    })

    this.lastProcessTime = currentTime
    return updatedBattleData
  }

  processUnitBehavior(unit, battleData, currentTime) {
    // Get unit's behaviors based on team
    let behaviors = []

    if (unit.team === "player") {
      // For player units, use the behaviors from character data or use the current command
      const characterData = this.getCharacterData(unit.name)

      if (unit.currentCommand) {
        // Override with current command
        behaviors = [
          {
            type: unit.currentCommand,
            condition: "always",
            target:
              unit.currentCommand === "attack"
                ? "nearest_enemy"
                : unit.currentCommand === "defend"
                  ? "self"
                  : "weakest_ally",
            priority: 10, // Higher priority than regular behaviors
          },
        ]
      } else if (characterData && characterData.behaviors) {
        // Use defined behaviors
        behaviors = characterData.behaviors.filter((b) => b.isActive).sort((a, b) => b.priority - a.priority) // Sort by priority (highest first)
      }
    } else {
      // For enemy units, use simple AI behaviors
      behaviors = [
        { type: "attack", condition: "always", target: "nearest_enemy", priority: 3 },
        { type: "heal", condition: "hp_below_30", target: "self", priority: 5 },
      ]
    }

    // Find the highest priority applicable behavior
    const applicableBehavior = behaviors.find((behavior) => this.isConditionMet(behavior.condition, unit, battleData))

    if (!applicableBehavior) {
      // If no behavior applies, default to idle
      unit.actionState = "idle"
      return
    }

    // Execute the behavior
    this.executeBehavior(applicableBehavior, unit, battleData)

    // Set cooldown based on action type (in milliseconds)
    const cooldownTime = this.getActionCooldown(applicableBehavior.type)
    this.actionCooldowns[unit.id] = currentTime + cooldownTime
  }

  isConditionMet(condition, unit, battleData) {
    switch (condition) {
      case "always":
        return true
      case "hp_below_30":
        return unit.currentHP / unit.maxHP < 0.3
      case "hp_below_50":
        return unit.currentHP / unit.maxHP < 0.5
      case "ally_hp_below_30":
        return battleData.units.some(
          (u) => u.team === unit.team && u.id !== unit.id && u.currentHP > 0 && u.currentHP / u.maxHP < 0.3,
        )
      case "ally_hp_below_50":
        return battleData.units.some(
          (u) => u.team === unit.team && u.id !== unit.id && u.currentHP > 0 && u.currentHP / u.maxHP < 0.5,
        )
      case "mp_above_30":
        return unit.currentMP / unit.maxMP > 0.3
      case "mp_above_50":
        return unit.currentMP / unit.maxMP > 0.5
      case "enemy_nearby":
        return this.findNearestEnemy(unit, battleData, 3) !== null
      default:
        return false
    }
  }

  executeBehavior(behavior, unit, battleData) {
    switch (behavior.type) {
      case "attack":
        this.executeAttack(unit, behavior.target, battleData)
        break
      case "defend":
        this.executeDefend(unit, battleData)
        break
      case "heal":
        this.executeHeal(unit, behavior.target, battleData)
        break
      case "cast":
        this.executeCast(unit, behavior.target, battleData)
        break
      case "move":
        this.executeMove(unit, behavior.target, battleData)
        break
      case "support":
        this.executeSupport(unit, battleData)
        break
      default:
        unit.actionState = "idle"
    }
  }

  executeAttack(unit, targetType, battleData) {
    // Find target based on target type
    const target = this.findTarget(unit, targetType, battleData)
    if (!target) {
      unit.actionState = "idle"
      return
    }

    // Calculate distance to target
    const distance = this.calculateDistance(unit.position, target.position)

    // If too far, move towards target
    const attackRange = unit.class === "archer" ? 4 : 1.5
    if (distance > attackRange) {
      this.moveTowards(unit, target.position, battleData)
      return
    }

    // Calculate damage
    const baseDamage = unit.class === "warrior" ? 15 : unit.class === "archer" ? 12 : 10
    const damage = Math.max(1, Math.floor(baseDamage * (0.8 + Math.random() * 0.4)))

    // Apply damage to target
    const targetIndex = battleData.units.findIndex((u) => u.id === target.id)
    if (targetIndex !== -1) {
      battleData.units[targetIndex].currentHP = Math.max(0, battleData.units[targetIndex].currentHP - damage)

      // Set hit state on target
      battleData.units[targetIndex].actionState = "hit"
      battleData.units[targetIndex].lastActionTime = Date.now()

      // Set animation state for the unit
      unit.actionState = "attacking"
      unit.actionTarget = target.id
      unit.lastActionTime = Date.now()
    }
  }

  executeDefend(unit, battleData) {
    // Apply defend status
    unit.isDefending = true
    unit.actionState = "defending"
    unit.lastActionTime = Date.now()
  }

  executeHeal(unit, targetType, battleData) {
    // Find target based on target type
    const target = this.findTarget(unit, targetType, battleData)
    if (!target) {
      unit.actionState = "idle"
      return
    }

    // Check if unit has enough MP
    if (unit.currentMP < 10) {
      this.executeMove(unit, "safe_position", battleData)
      return
    }

    // Calculate distance to target
    const distance = this.calculateDistance(unit.position, target.position)

    // If too far, move towards target
    if (distance > 3) {
      this.moveTowards(unit, target.position, battleData)
      return
    }

    // Calculate healing amount
    const healAmount = 20 + Math.floor(Math.random() * 10)

    // Apply healing to target
    const targetIndex = battleData.units.findIndex((u) => u.id === target.id)
    if (targetIndex !== -1) {
      battleData.units[targetIndex].currentHP = Math.min(
        battleData.units[targetIndex].maxHP,
        battleData.units[targetIndex].currentHP + healAmount,
      )

      // Reduce MP
      unit.currentMP -= 10

      // Set animation state
      unit.actionState = "casting"
      unit.actionTarget = target.id
      unit.lastActionTime = Date.now()
    }
  }

  executeCast(unit, targetType, battleData) {
    // Find target based on target type
    const target = this.findTarget(unit, targetType, battleData)
    if (!target) {
      unit.actionState = "idle"
      return
    }

    // Check if unit has enough MP
    if (unit.currentMP < 15) {
      this.executeMove(unit, "safe_position", battleData)
      return
    }

    // Calculate distance to target
    const distance = this.calculateDistance(unit.position, target.position)

    // If too far, move towards target (but keep some distance for ranged attacks)
    if (distance > 5) {
      this.moveTowards(unit, target.position, battleData)
      return
    }

    // Calculate damage
    const baseDamage = 20
    const damage = Math.max(1, Math.floor(baseDamage * (0.8 + Math.random() * 0.4)))

    // Apply damage to target
    const targetIndex = battleData.units.findIndex((u) => u.id === target.id)
    if (targetIndex !== -1) {
      battleData.units[targetIndex].currentHP = Math.max(0, battleData.units[targetIndex].currentHP - damage)

      // Set hit state on target
      battleData.units[targetIndex].actionState = "hit"
      battleData.units[targetIndex].lastActionTime = Date.now()

      // Reduce MP
      unit.currentMP -= 15

      // Set animation state
      unit.actionState = "casting"
      unit.actionTarget = target.id
      unit.lastActionTime = Date.now()
    }
  }

  executeMove(unit, targetType, battleData) {
    let targetPosition

    if (targetType === "safe_position") {
      targetPosition = this.findSafePosition(unit, battleData)
    } else {
      const target = this.findTarget(unit, targetType, battleData)
      if (target) {
        // Move towards or away from target based on unit class
        if (unit.class === "archer" || unit.class === "mage") {
          // Ranged units try to maintain distance
          targetPosition = this.findPositionAwayFrom(unit, target.position, battleData)
        } else {
          targetPosition = target.position
        }
      }
    }

    if (targetPosition) {
      this.moveTowards(unit, targetPosition, battleData)
    } else {
      unit.actionState = "idle"
    }
  }

  executeSupport(unit, battleData) {
    // Find allies that need support
    const allies = battleData.units.filter((u) => u.team === unit.team && u.id !== unit.id && u.currentHP > 0)

    // Sort by HP percentage (lowest first)
    allies.sort((a, b) => a.currentHP / a.maxHP - b.currentHP / b.maxHP)

    if (allies.length > 0) {
      const target = allies[0]

      // If healer, try to heal
      if (unit.class === "mage" && unit.currentMP >= 10) {
        this.executeHeal(unit, "weakest_ally", battleData)
      }
      // Otherwise, move towards ally to provide support
      else {
        this.moveTowards(unit, target.position, battleData)
      }
    } else {
      unit.actionState = "idle"
    }
  }

  moveTowards(unit, targetPosition, battleData) {
    // Calculate direction vector
    const dx = targetPosition.x - unit.position.x
    const dz = targetPosition.z - unit.position.z

    // Normalize direction
    const distance = Math.sqrt(dx * dx + dz * dz)

    if (distance < 0.1) {
      unit.actionState = "idle"
      return // Already at target
    }

    const moveSpeed = 0.5 // Units per update
    const normalizedDx = dx / distance
    const normalizedDz = dz / distance

    // Calculate new position
    const newX = unit.position.x + normalizedDx * Math.min(moveSpeed, distance)
    const newZ = unit.position.z + normalizedDz * Math.min(moveSpeed, distance)

    // Check if new position is valid (not occupied, within bounds)
    if (this.isValidPosition({ x: newX, z: newZ }, unit.id, battleData)) {
      unit.position.x = newX
      unit.position.z = newZ
      unit.actionState = "moving"
      unit.lastActionTime = Date.now()
    } else {
      // Try to find an alternative path
      const alternativePosition = this.findAlternativePath(unit.position, targetPosition, unit.id, battleData)
      if (alternativePosition) {
        unit.position.x = alternativePosition.x
        unit.position.z = alternativePosition.z
        unit.actionState = "moving"
        unit.lastActionTime = Date.now()
      } else {
        unit.actionState = "idle"
      }
    }
  }

  findAlternativePath(currentPos, targetPos, unitId, battleData) {
    // Try 8 directions around the unit
    const directions = [
      { x: 0.5, z: 0 },
      { x: 0.5, z: 0.5 },
      { x: 0, z: 0.5 },
      { x: -0.5, z: 0.5 },
      { x: -0.5, z: 0 },
      { x: -0.5, z: -0.5 },
      { x: 0, z: -0.5 },
      { x: 0.5, z: -0.5 },
    ]

    // Sort directions by how close they get us to the target
    directions.sort((a, b) => {
      const posA = { x: currentPos.x + a.x, z: currentPos.z + a.z }
      const posB = { x: currentPos.x + b.x, z: currentPos.z + b.z }
      const distA = this.calculateDistance(posA, targetPos)
      const distB = this.calculateDistance(posB, targetPos)
      return distA - distB
    })

    // Try each direction
    for (const dir of directions) {
      const newPos = { x: currentPos.x + dir.x, z: currentPos.z + dir.z }
      if (this.isValidPosition(newPos, unitId, battleData)) {
        return newPos
      }
    }

    return null
  }

  findTarget(unit, targetType, battleData) {
    switch (targetType) {
      case "self":
        return unit
      case "nearest_enemy":
        return this.findNearestEnemy(unit, battleData)
      case "strongest_enemy":
        return this.findStrongestEnemy(unit, battleData)
      case "weakest_enemy":
        return this.findWeakestEnemy(unit, battleData)
      case "nearest_ally":
        return this.findNearestAlly(unit, battleData)
      case "weakest_ally":
        return this.findWeakestAlly(unit, battleData)
      default:
        return null
    }
  }

  findNearestEnemy(unit, battleData, maxDistance = Number.POSITIVE_INFINITY) {
    const enemies = battleData.units.filter((u) => u.team !== unit.team && u.currentHP > 0)

    if (enemies.length === 0) return null

    let nearest = enemies[0]
    let nearestDistance = this.calculateDistance(unit.position, nearest.position)

    enemies.forEach((enemy) => {
      const distance = this.calculateDistance(unit.position, enemy.position)
      if (distance < nearestDistance) {
        nearest = enemy
        nearestDistance = distance
      }
    })

    return nearestDistance <= maxDistance ? nearest : null
  }

  findStrongestEnemy(unit, battleData) {
    const enemies = battleData.units.filter((u) => u.team !== unit.team && u.currentHP > 0)

    if (enemies.length === 0) return null

    // Sort by level (higher first)
    return [...enemies].sort((a, b) => b.level - a.level)[0]
  }

  findWeakestEnemy(unit, battleData) {
    const enemies = battleData.units.filter((u) => u.team !== unit.team && u.currentHP > 0)

    if (enemies.length === 0) return null

    // Sort by HP percentage (lowest first)
    return [...enemies].sort((a, b) => a.currentHP / a.maxHP - b.currentHP / b.maxHP)[0]
  }

  findNearestAlly(unit, battleData) {
    const allies = battleData.units.filter((u) => u.team === unit.team && u.id !== unit.id && u.currentHP > 0)

    if (allies.length === 0) return null

    let nearest = allies[0]
    let nearestDistance = this.calculateDistance(unit.position, nearest.position)

    allies.forEach((ally) => {
      const distance = this.calculateDistance(unit.position, ally.position)
      if (distance < nearestDistance) {
        nearest = ally
        nearestDistance = distance
      }
    })

    return nearest
  }

  findWeakestAlly(unit, battleData) {
    const allies = battleData.units.filter((u) => u.team === unit.team && u.id !== unit.id && u.currentHP > 0)

    if (allies.length === 0) return null

    // Sort by HP percentage (lowest first)
    return [...allies].sort((a, b) => a.currentHP / a.maxHP - b.currentHP / b.maxHP)[0]
  }

  findSafePosition(unit, battleData) {
    // Find position away from enemies
    const enemies = battleData.units.filter((u) => u.team !== unit.team && u.currentHP > 0)

    if (enemies.length === 0) return unit.position

    // Calculate average enemy position
    const avgX = enemies.reduce((sum, enemy) => sum + enemy.position.x, 0) / enemies.length
    const avgZ = enemies.reduce((sum, enemy) => sum + enemy.position.z, 0) / enemies.length

    // Move in opposite direction
    const dx = unit.position.x - avgX
    const dz = unit.position.z - avgZ

    // Normalize direction
    const distance = Math.sqrt(dx * dx + dz * dz)
    const normalizedDx = distance > 0 ? dx / distance : 0
    const normalizedDz = distance > 0 ? dz / distance : 0

    // Calculate target position (3 units away from current position)
    return {
      x: Math.max(0, Math.min(battleData.map.width - 1, unit.position.x + normalizedDx * 3)),
      z: Math.max(0, Math.min(battleData.map.height - 1, unit.position.z + normalizedDz * 3)),
    }
  }

  findPositionAwayFrom(unit, targetPosition, battleData) {
    // Calculate direction away from target
    const dx = unit.position.x - targetPosition.x
    const dz = unit.position.z - targetPosition.z

    // Normalize direction
    const distance = Math.sqrt(dx * dx + dz * dz)

    // If already at a good distance, stay put
    if (distance >= 3) return unit.position

    const normalizedDx = distance > 0 ? dx / distance : 0
    const normalizedDz = distance > 0 ? dz / distance : 0

    // Calculate target position (3 units away from target)
    return {
      x: Math.max(0, Math.min(battleData.map.width - 1, targetPosition.x + normalizedDx * 3)),
      z: Math.max(0, Math.min(battleData.map.height - 1, targetPosition.z + normalizedDz * 3)),
    }
  }

  isValidPosition(position, unitId, battleData) {
    // Check map boundaries
    if (position.x < 0 || position.z < 0 || position.x >= battleData.map.width || position.z >= battleData.map.height) {
      return false
    }

    // Check if position is occupied by another unit
    const isOccupied = battleData.units.some(
      (u) =>
        u.id !== unitId &&
        u.currentHP > 0 &&
        Math.abs(u.position.x - position.x) < 0.5 &&
        Math.abs(u.position.z - position.z) < 0.5,
    )

    if (isOccupied) return false

    // Check if tile is passable
    const tileX = Math.floor(position.x)
    const tileZ = Math.floor(position.z)
    const tile = battleData.map.tiles[tileZ]?.[tileX]

    if (!tile) return false

    // Water tiles are impassable
    return tile.type !== "water"
  }

  calculateDistance(pos1, pos2) {
    return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.z - pos2.z, 2))
  }

  getActionCooldown(actionType) {
    // Return cooldown in milliseconds
    switch (actionType) {
      case "attack":
        return 1500
      case "defend":
        return 1000
      case "heal":
        return 2000
      case "cast":
        return 2500
      case "move":
        return 800
      case "support":
        return 1200
      default:
        return 1000
    }
  }

  getCharacterData(name) {
    // This would normally fetch from a global state or context
    // For now, we'll use a simple mapping
    const characterMap = {
      Varian: {
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
      Lyra: {
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
      Elara: {
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
    }

    return characterMap[name]
  }
}
