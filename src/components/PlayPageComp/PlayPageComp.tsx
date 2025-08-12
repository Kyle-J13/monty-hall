// src/components/PlayPageComp/PlayPageComp.tsx
// -------------------------------------------------------
// Main Monty Hall game component — updated to use ExtendedCustomConfig
// for custom mode, including per‐config switchRule logic

import { useState } from 'react'
import DoorButton from '../DoorButton'
import type {
  Door,
  GameState,
  MontyType,
  ExtendedCustomConfig
} from '../../logic/types'
import { defaultDoors } from '../../logic/types'
import {
  pickPrizeDoor,
  pickRandomMontyType,
  montyOpensDoor
} from '../../logic/montyEngine'
import type { DoorStatus } from '../DoorButton'
import './PlayPageComp.css'

import { Bar } from 'react-chartjs-2'
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

function shouldOfferSwitchUntilOpen(
  cfg: ExtendedCustomConfig,
  montyOpens: Door | null
): boolean {
  return cfg.offerSwitchUntilOpen && montyOpens === null
}

interface MontyGameProps {
  initialMontyType?: MontyType
  hideMontyTypeFromUser?: boolean
  customConfig?: ExtendedCustomConfig   // now expects ExtendedCustomConfig
}

interface PlayState extends GameState {
  choosingSwitch: boolean
}

export default function MontyGame({
  initialMontyType,
  hideMontyTypeFromUser = false,
  customConfig,
}: MontyGameProps) {
  const [state, setState] = useState<PlayState>({
    prizeDoor: pickPrizeDoor(),
    playerPick: null,
    montyOpens: null,
    switchOffered: false,
    finalPick: null,
    result: null,
    montyType: initialMontyType || pickRandomMontyType(),
    choosingSwitch: false,
  })

  const [stats, setStats] = useState<any[]>([]);

  const filteredStats = stats.filter((entry) => entry.montyName === state.montyType);

  const winCount = filteredStats.filter((entry) => entry.won === 1).length;
  const loseCount = filteredStats.filter((entry) => entry.won === 0).length;

  const updateMontyChoice = (montyKey: string, result: 'win' | 'lose', switched: boolean) => {
    const field = result === 'win' ? 1 : 0;

    console.log(montyKey, field, switched);


    fetch(`/api/stats`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ montyName: montyKey,
        switched,
        won: field 
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log("Stats updated:", data);
    })
    .catch(err => {
      console.error("Failed to report result", err);
    });
  };

  const callBackendObjs = () => {
    fetch("/api/stats", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch stats");
        return res.json();
      })
      .then(data => {
        console.log("Game stats received:", data);
        setStats(data);
      })
      .catch(err => {
        console.error("Error fetching backend stats:", err);
      });
  };


  const handleInitialPick = (door: Door) => {
    if (state.playerPick !== null) return

    // figure out which door Monty opens (or none)
    const mDoor = montyOpensDoor(
      state.prizeDoor,
      door,
      state.montyType,
      customConfig
    )

    // if Monty immediately resolves (opens prize or player pick), we get result right away
    const immediateResult =
      mDoor === state.prizeDoor
        ? (door === state.prizeDoor ? 'win' : 'lose')
        : null

   // new offer logic: custom uses our helper, otherwise fallback
   let offer: boolean
   if (state.montyType === 'custom' && customConfig) {
     offer = shouldOfferSwitchUntilOpen(customConfig, mDoor)
   } else {
     offer =
       immediateResult != null
         ? false
         : state.montyType === 'secretive'
           ? true
           : mDoor !== null
   }

    setState(s => ({
      ...s,
      playerPick: door,
      montyOpens: mDoor,
      switchOffered: offer,
      result: immediateResult,
    }))
  }

  /**
   * Handle Switch or Stay”button click.
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
    ) return;

    if (!doSwitch) {
      // Stay: finalize original
      const outcome = state.playerPick === state.prizeDoor ? 'win' : 'lose';
      updateMontyChoice(state.montyType, outcome, false);
      setState(s => ({ ...s, finalPick: s.playerPick!, result: outcome }));
      callBackendObjs();
    } else {
      // Switch requested
      const opened = state.montyOpens;

      // If Monty has NOT opened any door yet, let the user pick among the two remaining (secretive-like).
      if (opened == null) {
        setState(s => ({ ...s, choosingSwitch: true }));
        return;
      }

      if (state.montyType === 'secretive') {
        // Enter secondary selection mode:
        setState(s => ({ ...s, choosingSwitch: true }));
      } else {
        // Only one choice for standard/evil when one door is already opened
        const remaining = defaultDoors.find(
          d => d !== state.playerPick && d !== opened
        )!;
        const outcome = remaining === state.prizeDoor ? 'win' : 'lose';
        updateMontyChoice(state.montyType, outcome, true);
        setState(s => ({ ...s, finalPick: remaining, result: outcome }));
        callBackendObjs();
      }
    }
  };

  /**
   * In secretive choosingSwitch”mode, allow clicking one of the
   * two other doors to finalize.
   */
  const handleFinalPick = (door: Door) => {
    if (!state.choosingSwitch || state.finalPick != null || state.result != null) return;
    const outcome = door === state.prizeDoor ? 'win' : 'lose';
    updateMontyChoice(state.montyType, outcome, false);
    setState(s => ({ ...s, finalPick: door, result: outcome }));
    callBackendObjs();
  };

  /** Reset state for a new round, keep same MontyType */
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

  const chartData = {
    labels: ['Win', 'Loss'],
    datasets: [
      {
        label: `Results for ${state.montyType}`,
        data: [winCount, loseCount],
        backgroundColor: ['#4caf50', '#f44336'],
      },
    ],
  };

    
  const chartOptions = {
    plugins: {
      legend: {
        labels: {
          color: 'white', 
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'white', 
        },
      },
      y: {
        ticks: {
          color: 'white', 
        },
      },
    },
  };


  return (
    <div className={`monty-game-container ${state.result === 'win' ? 'win' : state.result === 'lose' ? 'lose' : ''}`}>
      <h2 id="title-name">
        {!hideMontyTypeFromUser
          ? `${state.montyType.charAt(0).toUpperCase() + state.montyType.slice(1)} Monty`
          : 'Monty Hall Game'}
      </h2>

      <div className="doors-row">
        {defaultDoors.map(door => {
          let status: DoorStatus = 'closed'
          if (state.result != null) {
            status = door === state.prizeDoor ? 'prize' : 'opened'
          } else if (state.playerPick != null && state.finalPick == null) {
            if (door === state.montyOpens) status = 'opened'
            else if (door === state.playerPick) status = 'selected'
          }
          const onClick = () => {
            if (state.playerPick == null) handleInitialPick(door)
            else if (state.choosingSwitch && door !== state.playerPick) handleFinalPick(door)
          }
          const disabled =
            Boolean(state.result) ||
            (state.playerPick != null && !state.choosingSwitch && state.montyType !== 'secretive')

          return (
            <DoorButton
              key={door}
              door={door}
              status={status}
              onClick={onClick}
              disabled={disabled}
              gameResult={state.result}
            />
          )
        })}
      </div>
      
      {/* Switch/Stay prompt for all behaviors */}
      {state.switchOffered && state.finalPick == null && state.result == null && !state.choosingSwitch && (
        <div className="switch-stay">
          <p>Do you want to switch or stay?</p>
          <button onClick={() => handleChoice(true)} style={{ marginRight: '1rem' }}>Switch</button>
          <button onClick={() => handleChoice(false)}>Stay</button>
        </div>
      )}

      {/* Final result and reset */}
      {state.result && (
        <div className="result-display">
          <h3>You {state.result === 'win' ? 'won!' : 'lost.'}</h3>
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}

      <div className="chart-container">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
