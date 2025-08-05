// src/logic/montyEngine.ts
// -------------------------------------------------------
// Implements Monty's door opening logic

import type { Door, MontyType, ExtendedCustomConfig } from './types'
import { defaultDoors } from './types'
import {
  standardTable,
  evilTable,
  secretiveTable,
  mapRowIndexToDoor,
} from './montyTables'
import type { ProbabilityTable } from './montyTables'

// Pick a random door, excluding any in the list
function getRandomDoor(exclude: Door[] = []): Door {
  const opts = defaultDoors.filter(d => !exclude.includes(d))
  return opts[Math.floor(Math.random() * opts.length)]
}

// Randomly choose the prize door
export function pickPrizeDoor(): Door {
  return getRandomDoor()
}

// All Monty modes
export const montyTypes: MontyType[] = [
  'standard',
  'evil',
  'secretive',
  'custom',
]

// Pick a random non-custom mode
export function pickRandomMontyType(): MontyType {
  const options: MontyType[] = ['standard', 'evil', 'secretive']
  return options[Math.floor(Math.random() * options.length)]
}

/**
 * Custom mode: uses ExtendedCustomConfig for full control.
 * 1) If knowsPrize is true, pick according to openIfPickedPrize
 *    or openIfNotPickedPrize distributions.
 * 2) If knowsPrize is false, pick per-door probabilities unknownOpenProbs,
 *    remainder up to 1 is no open.
 */
function decideExtendedCustomOpens(
  prizeDoor: Door,
  playerPick: Door,
  cfg: ExtendedCustomConfig
): Door | null {
  if (cfg.knowsPrize) {
    if (playerPick === prizeDoor) {
      // Distribution when playerPick == prizeDoor
      const dist = cfg.openIfPickedPrize
      const total =
        dist.openSelected +
        dist.openClosestNonPrize +
        dist.openFarthestNonPrize +
        dist.none
      if (total <= 0) {
        return null
      }
      let r = Math.random() * total
      if (r < dist.openSelected) {
        return playerPick
      }
      r -= dist.openSelected
      if (r < dist.openClosestNonPrize) {
        // left non-prize
        const nonPrize = defaultDoors.filter(d => d !== prizeDoor)
        const [left] = nonPrize.sort((a, b) => a - b)
        return left
      }
      r -= dist.openClosestNonPrize
      if (r < dist.openFarthestNonPrize) {
        // right non-prize
        const nonPrize = defaultDoors.filter(d => d !== prizeDoor)
        const [, right] = nonPrize.sort((a, b) => a - b)
        return right
      }
      // none
      return null
    } else {
      // Distribution when playerPick != prizeDoor
      const dist = cfg.openIfNotPickedPrize
      const total =
        dist.openSelected +
        dist.openPrize +
        dist.openOtherNonPrize
      if (total <= 0) {
        return null
      }
      let r = Math.random() * total
      if (r < dist.openSelected) {
        return playerPick
      }
      r -= dist.openSelected
      if (r < dist.openPrize) {
        return prizeDoor
      }
      r -= dist.openPrize
      if (r < dist.openOtherNonPrize) {
        // the other non-prize, non-picked door
        return defaultDoors.find(d => d !== prizeDoor && d !== playerPick)!
      }
      return null
    }
  } else {
    // Monty does not know prize location: use per-door probabilities
    const p1 = cfg.unknownOpenProbs[1] || 0
    const p2 = cfg.unknownOpenProbs[2] || 0
    const p3 = cfg.unknownOpenProbs[3] || 0
    const total = p1 + p2 + p3
    if (total <= 0) {
      return null
    }
    let r = Math.random() * total
    if (r < p1) {
      return 1
    }
    r -= p1
    if (r < p2) {
      return 2
    }
    r -= p2
    if (r < p3) {
      return 3
    }
    return null
  }
}

/**
 * Decide which door Monty opens:
 * - For 'custom', use ExtendedCustomConfig via decideExtendedCustomOpens
 * - Otherwise, fall back to the 4x2 ProbabilityTable logic
 */
export function montyOpensDoor(
  prizeDoor: Door,
  playerPick: Door,
  montyType: MontyType,
  customConfig?: ExtendedCustomConfig
): Door | null {
  if (montyType === 'custom') {
    if (!customConfig) {
      throw new Error('ExtendedCustomConfig required for MontyType "custom"')
    }
    return decideExtendedCustomOpens(
      prizeDoor,
      playerPick,
      customConfig
    )
  }

  // Legacy table-based logic
  const table: ProbabilityTable =
    montyType === 'standard' ? standardTable
      : montyType === 'evil' ? evilTable
      : secretiveTable

  const col = prizeDoor === playerPick ? 0 : 1
  const roll = Math.random()
  let acc = 0
  for (let row = 0; row < table.length; row++) {
    acc += table[row][col]
    if (roll < acc) {
      return mapRowIndexToDoor(row, prizeDoor, playerPick)
    }
  }
  return null
}
