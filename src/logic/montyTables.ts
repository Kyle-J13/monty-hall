// src/logic/montyTables.ts

import { defaultDoors } from './types'
import type { Door } from './types'

/**
 * Describes each action Monty can take:
 * - 'OpenPrize': Monty opens the prize door 
 * - 'OpenPlayerPick': Monty opens the door the player chose
 * - 'OpenOther': Monty opens one of the other non-prize doors
 * - 'None': Monty opens no door
 */
export type MontyAction =
  | 'OpenPrize'
  | 'OpenPlayerPick'
  | 'OpenOther'
  | 'None'

/**
 * The four MontyAction values, in the same order as the rows
 * in each probability table below.
 */
export const MontyActions: MontyAction[] = [
  'OpenPrize',
  'OpenPlayerPick',
  'OpenOther',
  'None',
]

/**
 * A 2 column probability table for each MontyAction:
 * - Column 0: when player's pick matches the prize
 * - Column 1: when player's pick does not match the prize
 *
 * Rows correspond to MontyActions[0] through MontyActions[3].
 */
export type ProbabilityTable = [number, number][]

/**
 * Standard Monty behavior:
 * - If player picked the prize: pick one door at random
 * - If player did not pick the prize: open the only other non-prize door
 */
export const standardTable: ProbabilityTable = [
  /* OpenPrize      */ [0, 0],
  /* OpenPlayerPick */ [0, 0],
  /* OpenOther      */ [1, 1],
  /* None           */ [0, 0],
]

/**
 * Evil Monty behavior:
 * - If player picked the prize: pick one door at random
 * - If player did not pick the prize: open the door
 */
export const evilTable: ProbabilityTable = [
  /* OpenPrize      */ [0, 1],
  /* OpenPlayerPick */ [0, 0],
  /* OpenOther      */ [1, 0],
  /* None           */ [0, 0],
]

/**
 * Secretive Monty behavior:
 * - Monty never opens a door to hide his strategy
 */
export const secretiveTable: ProbabilityTable = [
  /* OpenPrize      */ [0, 0],
  /* OpenPlayerPick */ [0, 0],
  /* OpenOther      */ [0, 0],
  /* None           */ [1, 1],
]

/**
 * Given a selected row index, return which door Monty opens:
 * - rowIndex 0: prizeDoor
 * - rowIndex 1: playerPick
 * - rowIndex 2: the other non-prize door
 * - any other: none
 *
 * @param rowIndex  index of the action row in the table
 * @param prizeDoor door hiding the prize
 * @param playerPick door the player chose
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
      // find the one door that is neither prize nor player pick
      return defaultDoors.find(d => d !== prizeDoor && d !== playerPick)!
    default:
      return null
  }
}
