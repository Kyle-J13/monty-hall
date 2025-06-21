import type { Door, MontyType } from './types';
import { defaultDoors } from './types';

/**
 * Returns a random door from defaultDoors, excluding any in the exclude list.
 */
function getRandomDoor(exclude: Door[] = []): Door {
  const options = defaultDoors.filter(d => !exclude.includes(d));
  return options[Math.floor(Math.random() * options.length)];
}

/** Randomly selects the door that hides the prize. */
export function pickPrizeDoor(): Door {
  return getRandomDoor();
}

// List of Monty types for random selection
export const montyTypes: MontyType[] = ['standard', 'evil', 'secretive'];

/** Randomly picks one of the supported MontyType values. */
export function pickRandomMontyType(): MontyType {
  const i = Math.floor(Math.random() * montyTypes.length);
  return montyTypes[i];
}

/**
 * Determines which door Monty opens based on his behavior.
 * - standard: opens a door that is neither the prize nor the player's pick
 * - evil: opens the player's pick if it's wrong, else opens another random door
 * - secretive: opens no door
 */
export function montyOpensDoor(
  prize: Door,
  player: Door,
  type: MontyType
): Door | null {
  switch (type) {
    case 'standard':
      return getRandomDoor([prize, player]);
    case 'evil':
      return prize === player
        ? getRandomDoor([player])
        : player;
    case 'secretive':
      return null;
  }
}
