import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import DoorButton from '../../components/DoorButton';
import type { DoorStatus } from '../../components/DoorButton';
import type { Door, GameState, MontyType } from '../../logic/types';
import { defaultDoors } from '../../logic/types';
import { pickPrizeDoor, montyOpensDoor } from '../../logic/montyEngine';
import './SandboxPlayPage.css';

interface SandboxState extends GameState {
  choosingSwitch: boolean;  // true when user clicked "Switch" under secretive Monty
}

export default function SandboxPlayPage() {
  const [search] = useSearchParams();
  const montyParam = (search.get('monty') as MontyType) || 'standard';

  // Initialize state including the new choosingSwitch flag
  const [state, setState] = useState<SandboxState>({
    prizeDoor: pickPrizeDoor(),
    playerPick: null,
    montyOpens: null,
    switchOffered: false,
    finalPick: null,
    result: null,
    montyType: montyParam,
    choosingSwitch: false,
  });

  /** Handle the player's initial door selection */
  const handleInitialPick = (door: Door) => {
    if (state.playerPick !== null) return;

    const mDoor = montyOpensDoor(
      state.prizeDoor,
      door,
      state.montyType
    );

    // Determine if switch is offered
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
   * Handle "Switch" or "Stay" button click.
   * - Stay: finalize original pick immediately.
   * - Switch:
   *    - For standard/evil: compute the one remaining door and finalize.
   *    - For secretive: enter second selection mode.
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
      // Stay: finalize original pick
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
        // Standard/Evil: only one door remains
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
   * When in secretive "choosingSwitch" mode, allow clicking one of the
   * other two doors as the final pick.
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

  /** Reset for another round, preserving MontyType */
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
    <div className="sandbox-play-container">
      <h2>
        Sandbox –{' '}
        {state.montyType.charAt(0).toUpperCase() +
          state.montyType.slice(1)} Monty
      </h2>

      {/* Door row */}
      <div className="sandbox-doors-row">
        {defaultDoors.map(door => {
          // Determine display status for each door
          let status: DoorStatus = 'closed';

          if (state.result != null) {
            // Reveal prize at end
            status =
              door === state.prizeDoor ? 'prize' : 'opened';
          } else if (
            state.playerPick != null &&
            state.finalPick == null
          ) {
            // Post-initial-pick, pre-final-pick
            if (door === state.montyOpens) status = 'opened';
            else if (door === state.playerPick)
              status = 'selected';
          }

          // Decide click handler
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

          // Disable clicking once result or for non-secretive
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

      {/* Switch/Stay prompt */}
      {state.switchOffered &&
        state.finalPick == null &&
        state.result == null &&
        !state.choosingSwitch && (
          <div className="sandbox-switch-stay">
            <p>Do you want to switch or stay?</p>
            <button
              onClick={() => handleChoice(true)}
              className="switch-button"
            >
              Switch
            </button>
            <button onClick={() => handleChoice(false)} className="stay-button">
              Stay
            </button>
          </div>
        )}

      {/* Final result & reset */}
      {state.result && (
        <div className="sandbox-result">
          <h3>You {state.result === 'win' ? 'won!' : 'lost.'}</h3>
          <button onClick={resetGame} className="try-again-button">Try Again</button>
        </div>
      )}
    </div>
  );
}
