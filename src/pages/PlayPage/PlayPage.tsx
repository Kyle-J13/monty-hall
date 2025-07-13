import React, { useState } from 'react';
import DoorButton from '../../components/DoorButton';
import type { DoorStatus } from '../../components/DoorButton';
import type { Door, GameState } from '../../logic/types';
import { defaultDoors } from '../../logic/types';
import {
  pickPrizeDoor,
  pickRandomMontyType,
  montyOpensDoor
} from '../../logic/montyEngine';

import './PlayPage.css';

interface PlayState extends GameState {
  choosingSwitch: boolean; // true when user clicked “Switch” under secretive Monty
}

/**
 * PlayPage – classic Monty Hall game for data collection.
 * MontyType is chosen randomly but never shown to the user.
 * Flow:
 *   1. User picks a door.
 *   2. Monty (random behavior) opens or not.
 *   3. Prompt “Switch or Stay?” for all behaviors.
 *      • Stay: finalize original pick.
 *      • Switch:
 *         – Standard/Evil: automatically switch to the only other door.
 *         – Secretive: enter second selection mode to choose among the two remaining doors.
 *   4. Reveal all doors and show prize.
 */
export default function PlayPage() {
  // Initialize with random prize and random Monty behavior
  const [state, setState] = useState<PlayState>({
    prizeDoor: pickPrizeDoor(),
    playerPick: null,
    montyOpens: null,
    switchOffered: false,
    finalPick: null,
    result: null,
    montyType: pickRandomMontyType(),
    choosingSwitch: false,
  });

  /** Handle initial selection */
  const handleInitialPick = (door: Door) => {
    if (state.playerPick !== null) return;
    const mDoor = montyOpensDoor(
      state.prizeDoor,
      door,
      state.montyType
    );

    // Determine whether to offer switch
    const offer =
      state.montyType === 'secretive'
        ? true
        : state.montyType === 'evil' && mDoor === door
          ? false
          : mDoor !== null;

    // Instant loss if Evil Monty opens player's door
    const immediateResult = state.montyType === 'evil' && mDoor === state.prizeDoor
      ? 'lose'
      : null;

    setState(s => ({
      ...s,
      playerPick: door,
      montyOpens: mDoor,
      switchOffered: offer,
      result: immediateResult,
    }));
  };

  /**
   * Handle “Switch” or “Stay” button click.
   * - Stay: finalize original pick immediately.
   * - Switch:
   *    - Standard/Evil: switch to the only remaining unopened door.
   *    - Secretive: set choosingSwitch to true so user can pick among two remaining.
   */
  const handleChoice = (doSwitch: boolean) => {
    if (
      state.playerPick == null ||
      !state.switchOffered ||
      state.finalPick != null ||
      state.result != null
    ) {
      return;
    }

    if (!doSwitch) {
      // Stay: finalize original
      const outcome =
        state.playerPick === state.prizeDoor ? 'win' : 'lose';
      setState(s => ({
        ...s,
        finalPick: s.playerPick!,
        result: outcome,
      }));
    } else {
      // Switch requested
      if (state.montyType === 'secretive') {
        // Enter secondary selection mode:
        setState(s => ({ ...s, choosingSwitch: true }));
      } else {
        // Only one choice for standard/evil
        const remaining = defaultDoors.find(
          d => d !== state.playerPick && d !== state.montyOpens
        )!;
        const outcome =
          remaining === state.prizeDoor ? 'win' : 'lose';
        setState(s => ({
          ...s,
          finalPick: remaining,
          result: outcome,
        }));
      }
    }
  };

  /**
   * In secretive “choosingSwitch” mode, allow clicking one of the
   * two other doors to finalize.
   */
  const handleFinalPick = (door: Door) => {
    if (
      !state.choosingSwitch ||
      state.finalPick != null ||
      state.result != null
    ) {
      return;
    }
    const outcome = door === state.prizeDoor ? 'win' : 'lose';
    setState(s => ({
      ...s,
      finalPick: door,
      result: outcome,
    }));
  };

  /** Reset state for a new round, preserving MontyType */
  const resetGame = () => {
    setState({
      prizeDoor: pickPrizeDoor(),
      playerPick: null,
      montyOpens: null,
      switchOffered: false,
      finalPick: null,
      result: null,
      montyType: state.montyType,
      choosingSwitch: false,
    });
  };

  return (
    <div className="play-container">
      {/* Generic heading, MontyType is hidden */}
      <h2>Monty Hall Game</h2>

      {/* Door row */}
      <div className="doors-row">
        {defaultDoors.map(door => {
          let status: DoorStatus = 'closed';

          // Reveal all at the end
          if (state.result != null) {
            status =
              door === state.prizeDoor ? 'prize' : 'opened';
          }
          // After initial pick, before final decision
          else if (
            state.playerPick != null &&
            state.finalPick == null
          ) {
            if (door === state.montyOpens) status = 'opened';
            else if (door === state.playerPick)
              status = 'selected';
          }

          // Decide click behavior
          const onClick = () => {
            if (state.playerPick == null) {
              handleInitialPick(door);
            } else if (
              state.choosingSwitch &&
              door !== state.playerPick
            ) {
              handleFinalPick(door);
            }
          };

          // Disable door clicks when not appropriate
          const disabled =
            Boolean(state.result) ||
            (state.playerPick != null &&
              !state.choosingSwitch &&
              state.montyType !== 'secretive');

          return (
            <DoorButton
              key={door}
              door={door}
              status={status}
              onClick={onClick}
              disabled={disabled}
            />
          );
        })}
      </div>

      {/* Switch/Stay prompt for all behaviors */}
      {state.switchOffered &&
        state.finalPick == null &&
        state.result == null &&
        !state.choosingSwitch && (
          <div className="switch-stay">
            <p>Do you want to switch or stay?</p>
            <button
              onClick={() => handleChoice(true)}
              style={{ marginRight: '1rem' }}
            >
              Switch
            </button>
            <button onClick={() => handleChoice(false)}>
              Stay
            </button>
          </div>
        )}

      {/* Final result and reset */}
      {state.result && (
        <div className="result-display">
          <h3>You {state.result === 'win' ? 'won!' : 'lost.'}</h3>
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}
    </div>
  );
}