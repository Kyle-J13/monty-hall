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
 * Custom mode (matches ExtendedCustomConfig in types.ts):
 * 1) Respect openChance (top-level gate).
 * 2) If knowsPrize:
 *    - whenPickedPrize (playerPick === prizeDoor):
 *        openSelected | openClosestNonPrize | openFarthestNonPrize | none  (sum ~ 1)
 *    - whenPickedNotPrize (playerPick !== prizeDoor):
 *        openSelected | openPrize | openOtherNonPrize              (sum ~ 1)
 * 3) If !knowsPrize:
 *    - unknownPrize: door1 | door2 | door3                         (sum <= 1; remainder = none)
 */
function decideExtendedCustomOpens(
  prizeDoor: Door,
  playerPick: Door,
  cfg: ExtendedCustomConfig
): Door | null {
  // 0) Overall chance to open at all
  if (Math.random() >= cfg.openChance) {
    return null
  }

  // 1) Monty knows where the prize is
  if (cfg.knowsPrize) {
    if (playerPick === prizeDoor) {
      const dist = cfg.whenPickedPrize
      const total =
        dist.openSelected +
        dist.openClosestNonPrize +
        dist.openFarthestNonPrize +
        dist.none

      if (total <= 0) return null

      let r = Math.random() * total
      if ((r -= dist.openSelected) < 0) return playerPick

      if ((r -= dist.openClosestNonPrize) < 0) {
        const nonPrize = defaultDoors.filter(d => d !== prizeDoor).sort((a, b) => a - b)
        const [left] = nonPrize
        return left
      }

      if ((r -= dist.openFarthestNonPrize) < 0) {
        const nonPrize = defaultDoors.filter(d => d !== prizeDoor).sort((a, b) => a - b)
        const [, right] = nonPrize
        return right
      }

      // none
      return null
    } else {
      const dist = cfg.whenPickedNotPrize
      const total =
        dist.openSelected +
        dist.openPrize +
        dist.openOtherNonPrize

      if (total <= 0) return null

      let r = Math.random() * total
      if ((r -= dist.openSelected) < 0) return playerPick
      if ((r -= dist.openPrize) < 0) return prizeDoor
      if ((r -= dist.openOtherNonPrize) < 0) {
        return defaultDoors.find(d => d !== prizeDoor && d !== playerPick)! // the other non-prize
      }
      return null
    }
  }

  // 2) Monty does NOT know the prize location
  const p1 = cfg.unknownPrize.door1 || 0
  const p2 = cfg.unknownPrize.door2 || 0
  const p3 = cfg.unknownPrize.door3 || 0
  const total = p1 + p2 + p3

  // remainder up to 1 is "no open"
  if (total <= 0) return null

  let r = Math.random() * total
  if ((r -= p1) < 0) return 1
  if ((r -= p2) < 0) return 2
  if ((r -= p3) < 0) return 3
  return null
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
    return decideExtendedCustomOpens(prizeDoor, playerPick, customConfig)
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
