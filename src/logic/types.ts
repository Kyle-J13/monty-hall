// Door is a numeric identifier to allow N-door games in future
export type Door = number;

// Default set of doors for a 3-door Monty Hall game
export const defaultDoors: Door[] = [1, 2, 3];

// Supported Monty behavior models
export type MontyType = 
  | 'standard' 
  | 'evil' 
  | 'secretive'
  | 'custom'

// new shape for a custom table (4 rows × 2 columns)
export type CustomTable = [number,number][]

// GameState describes all relevant data for a single round
export interface GameState {
  prizeDoor: Door;               // Door hiding the prize
  playerPick: Door | null;       // Player’s initial selection
  montyOpens: Door | null;       // Door Monty opens
  switchOffered: boolean;        // Is player offered a switch?
  finalPick: Door | null;        // Player’s final choice
  result: 'win' | 'lose' | null; // Outcome of the game
  montyType: MontyType;          // Which Monty logic was used
}
