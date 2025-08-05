// src/logic/types.ts
// -------------------------------------------------------
// This file defines core types and interfaces, including the
// ExtendedCustomConfig for fully customizable Monty behavior.

export type Door = number;
export const defaultDoors: Door[] = [1, 2, 3];

// Supported Monty behavior modes
export type MontyType =
  | 'standard'
  | 'evil'
  | 'secretive'
  | 'custom';

// Extended configuration for 'custom' mode:
//  - openChance:              P(Monty opens any door at all)
//  - prizeChance:             P(Monty opens the prize door | he opens a door)
//  - nonPrizeLeftChance:      P(open left non-prize | opening a non-prize door)
//  - nonPrizeRightChance:     P(open right non-prize | opening a non-prize door)
//  - offerSwitchUntilOpen:    whether Monty offers switch until he opens prize or player door
//  - knowsPrize:              whether Monty knows where the prize is when choosing a door
//  - openIfPickedPrize:       distribution (sums to 1) of actions when playerPick == prizeDoor:
//      * openSelected, openClosestNonPrize, openFarthestNonPrize, none
//  - openIfNotPickedPrize:    distribution (sums to 1) of actions when playerPick != prizeDoor:
//      * openSelected, openPrize, openOtherNonPrize
//  - unknownOpenProbs:        per-door open probabilities when knowsPrize is false;
//                             remainder up to 1 is "no open"

export interface ExtendedCustomConfig {
  openChance: number;
  prizeChance: number;
  nonPrizeLeftChance: number;
  nonPrizeRightChance: number;

  offerSwitchUntilOpen: boolean;
  knowsPrize: boolean;

  openIfPickedPrize: {
    openSelected: number;
    openClosestNonPrize: number;
    openFarthestNonPrize: number;
    none: number;
  };

  openIfNotPickedPrize: {
    openSelected: number;
    openPrize: number;
    openOtherNonPrize: number;
  };

  unknownOpenProbs: Record<Door, number>;
}

// Complete state for one Monty Hall round
export interface GameState {
  prizeDoor: Door;                // door hiding the prize
  playerPick: Door | null;        // player’s initial choice
  montyOpens: Door | null;        // door Monty opens, or null if none
  switchOffered: boolean;         // was a switch option presented?
  finalPick: Door | null;         // player’s final choice
  result: 'win' | 'lose' | null;  // outcome of the game
  montyType: MontyType;           // active Monty behavior mode
}
