// src/logic/montyEngine.ts

import type { Door, MontyType } from './types'
import { defaultDoors } from './types'

// Tables defining Monty’s behavior and a helper to map a table row to a door
import {
  standardTable,
  evilTable,
  secretiveTable,
  mapRowIndexToDoor,
} from './montyTables'
import type { ProbabilityTable } from './montyTables'

/**
 * Returns a random door from defaultDoors, excluding any in the exclude list.
 */
function getRandomDoor(exclude: Door[] = []): Door {
  const options = defaultDoors.filter(d => !exclude.includes(d))
  return options[Math.floor(Math.random() * options.length)]
}

/**
 * Randomly selects the door that hides the prize.
 */
export function pickPrizeDoor(): Door {
  return getRandomDoor()
}

/**
 * The Monty behavior modes supported by the game.
 */
export const montyTypes: MontyType[] = [
  'standard',
  'evil',
  'secretive',
  'custom',
]

const randomMontyTypes: MontyType[] = ['standard', 'evil', 'secretive'];

/**
 * Randomly select one of the Monty behavior modes.
 */
export function pickRandomMontyType(): MontyType {
  const idx = Math.floor(Math.random() * randomMontyTypes.length)
  return randomMontyTypes[idx]
}

/**
 * Decide which door Monty opens, based on a 4×2 probability table in 'montyTables.ts'.
 *
 * The table has four rows representing the actions:
 *   0 -> open the prize door
 *   1 -> open the player’s picked door
 *   2 -> open the other non-prize door
 *   3 -> open no door
 *
 * Each row has two columns:
 *   [0] when playerPick === prizeDoor
 *   [1] when playerPick !== prizeDoor
 *
 * @param prizeDoor   the door hiding the prize
 * @param playerPick  the door the player initially chose
 * @param montyType   the Monty behavior mode
 * @returns the door Monty opens, or null if none
 */
export function montyOpensDoor(
  prizeDoor: Door,
  playerPick: Door,
  montyType: MontyType,
  customTable?: ProbabilityTable
): Door | null {
  // select the appropriate probability table
  const table: ProbabilityTable =
    montyType === 'custom'
      ? (() => {
          if (!customTable) {
            throw new Error('Custom table required for MontyType "custom".')
          }
          return customTable
        })()
      : montyType === 'standard'
        ? standardTable
        : montyType === 'evil'
          ? evilTable
          : montyType === 'secretive'
            ? secretiveTable
            : (() => { throw new Error(`Unknown MontyType: ${montyType}`) })()

  // determine which column applies
  const column = prizeDoor === playerPick ? 0 : 1

  // sample a random number to pick a row
  const randomValue = Math.random()
  let accumulator = 0

  // walk through each row, accumulating probabilities until the randomValue is covered
  for (let row = 0; row < table.length; row++) {
    accumulator += table[row][column]
    if (randomValue < accumulator) {
      // map the chosen row index to a door number (or null)
      return mapRowIndexToDoor(row, prizeDoor, playerPick)
    }
  }

  // fallback if probabilities don't sum to 1 exactly
  return null
}
