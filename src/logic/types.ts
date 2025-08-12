// src/logic/types.ts
// -------------------------------------------------------
// Core type definitions for the Monty Hall game.
// Includes ExtendedCustomConfig for fully customizable Monty behavior.

export type Door = number
export const defaultDoors: Door[] = [1, 2, 3]

// Supported Monty behavior modes
export type MontyType =
  | "standard"
  | "evil"
  | "secretive"
  | "custom"

/**
 * ExtendedCustomConfig
 * Purpose -> Defines all probability settings for 'custom' Monty mode.
 * Fields ->
 *   openChance              -> Probability that Monty opens any door at all.
 *   offerSwitchUntilOpen    -> Whether to keep offering switch until Monty opens prize or player's door.
 *   knowsPrize              -> Whether Monty knows prize location.
 *   whenPickedPrize         -> Distribution of actions when playerPick == prizeDoor (sums to 1):
 *                                openSelected, openClosestNonPrize, openFarthestNonPrize, none
 *   whenPickedNotPrize      -> Distribution of actions when playerPick != prizeDoor (sums to 1):
 *                                openSelected, openPrize, openOtherNonPrize
 *   unknownPrize            -> Per-door open probabilities when knowsPrize is false; remaining probability is "no open".
 */
export interface ExtendedCustomConfig {
  openChance: number
  offerSwitchUntilOpen: boolean
  knowsPrize: boolean

  whenPickedPrize: {
    openSelected: number
    openClosestNonPrize: number
    openFarthestNonPrize: number
    none: number
  }

  whenPickedNotPrize: {
    openSelected: number
    openPrize: number
    openOtherNonPrize: number
  }

  unknownPrize: {
    door1: number
    door2: number
    door3: number
  }
}

/**
 * GameState
 * Purpose -> Tracks all data for a single Monty Hall round.
 */
export interface GameState {
  prizeDoor: Door              // Door hiding the prize
  playerPick: Door | null      // Player's initial choice
  montyOpens: Door | null      // Door Monty opens, or null if none
  switchOffered: boolean       // Was a switch option presented
  finalPick: Door | null       // Player's final choice
  result: "win" | "lose" | null// Outcome of the game
  montyType: MontyType         // Active Monty behavior mode
}
