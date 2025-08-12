// src/logic/montyTables.ts
// -------------------------------------------------------
// Defines MontyAction, built-in probability tables for standard/evil/secretive modes,
// and a helper to map a selected action row to the actual door Monty opens.

import { defaultDoors } from './types'
import type { Door } from './types'

/** Describes each action Monty can take */
export type MontyAction =
  | 'OpenPrize'       // Monty opens the prize door
  | 'OpenPlayerPick'  // Monty opens the door the player chose
  | 'OpenOther'       // Monty opens one of the other non-prize doors
  | 'None'            // Monty opens no door

/** The actions in the same order as table rows */
export const MontyActions: MontyAction[] = [
  'OpenPrize',
  'OpenPlayerPick',
  'OpenOther',
  'None',
]

/**
 * Probability table type:
 * Each row is [when pick equals prize, when pick not equal prize]
 */
export type ProbabilityTable = [number, number][]

/** Standard Monty: always opens a non-prize door */
export const standardTable: ProbabilityTable = [
  [0, 0], // OpenPrize
  [0, 0], // OpenPlayerPick
  [1, 1], // OpenOther
  [0, 0], // None
]

/** Evil Monty: opens prize door if player did not pick it */
export const evilTable: ProbabilityTable = [
  [0, 1], // OpenPrize
  [0, 0], // OpenPlayerPick
  [1, 0], // OpenOther
  [0, 0], // None
]

/** Secretive Monty: never opens any door until final reveal */
export const secretiveTable: ProbabilityTable = [
  [0, 0], // OpenPrize
  [0, 0], // OpenPlayerPick
  [0, 0], // OpenOther
  [1, 1], // None
]

/**
 * Map a selected table row to the actual door:
 * rowIndex 0 -> prizeDoor
 * rowIndex 1 -> playerPick
 * rowIndex 2 -> the other non-prize, non-picked door
 * any other row -> null (no door)
 */
export function mapRowIndexToDoor(
  rowIndex: number,
  prizeDoor: Door,
  playerPick: Door
): Door | null {
  switch (rowIndex) {
    case 0:
      return prizeDoor
    case 1:
      return playerPick
    case 2:
      return defaultDoors.find(d => d !== prizeDoor && d !== playerPick)!
    default:
      return null
  }
}
