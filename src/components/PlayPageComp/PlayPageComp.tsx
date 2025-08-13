// src/components/PlayPageComp/PlayPageComp.tsx
// -------------------------------------------------------
// Main Monty Hall game component using ExtendedCustomConfig for custom mode,
// including correct switch-offer behavior.

import { useState } from "react"
import DoorButton from "../DoorButton"
import type {
  Door,
  GameState,
  MontyType,
  ExtendedCustomConfig
} from "../../logic/types"
import { defaultDoors } from "../../logic/types"
import {
  pickPrizeDoor,
  pickRandomMontyType,
  montyOpensDoor
} from "../../logic/montyEngine"
import type { DoorStatus } from "../DoorButton"
import "./PlayPageComp.css"

import { Bar } from "react-chartjs-2"
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js"

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

/**
 * shouldOfferSwitchUntilOpenCustom
 * Purpose -> In custom mode, decide if the Switch option should be offered.
 * Rules -> Offer if offerSwitchUntilOpen is true AND either:
 *          1) Monty has not opened any door, or
 *          2) Monty opened a safe door (not the player's and not the prize).
 */
function shouldOfferSwitchUntilOpenCustom(
  cfg: ExtendedCustomConfig,
  montyOpens: Door | null,
  playerPick: Door,
  prizeDoor: Door
): boolean {
  if (!cfg.offerSwitchUntilOpen) return false
  return montyOpens === null || (montyOpens !== playerPick && montyOpens !== prizeDoor)
}

interface MontyGameProps {
  initialMontyType?: MontyType
  hideMontyTypeFromUser?: boolean
  customConfig?: ExtendedCustomConfig
}

interface PlayState extends GameState {
  choosingSwitch: boolean
}

// Simulator state
interface SimulationState {
  isRunning: boolean
  numGames: number
  strategy: "stay" | "switch" | "random"
  results: {
    wins: number
    losses: number
    gamesPlayed: number
  }
}

/**
 * MontyGame
 * Purpose -> Classic Monty Hall gameplay component and lightweight simulator.
 * Flow ->
 *   1) User picks a door.
 *   2) Monty (based on behavior) may open a door or not.
 *   3) Prompt "Switch or Stay?" when allowed.
 *      - Stay -> finalize original pick.
 *      - Switch ->
 *          - Standard/Evil -> auto-switch to the only other unopened door.
 *          - Secretive or no door opened -> allow a second selection among the two remaining doors.
 *   4) Reveal result.
 */
export default function MontyGame({
  initialMontyType,
  hideMontyTypeFromUser = false,
  customConfig
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

  const [stats, setStats] = useState<any[]>([])

  const [simulation, setSimulation] = useState<SimulationState>({
    isRunning: false,
    numGames: 1000,
    strategy: "switch",
    results: {
      wins: 0,
      losses: 0,
      gamesPlayed: 0,
    }
  })

  const filteredStats = stats.filter((entry) => entry.montyName === state.montyType)
  const winCount = filteredStats.filter((entry) => entry.won === 1).length
  const loseCount = filteredStats.filter((entry) => entry.won === 0).length

  /**
   * updateMontyChoice
   * Purpose -> Report a single game outcome to the backend.
   */
  const updateMontyChoice = (montyKey: string, result: "win" | "lose", switched: boolean) => {
    const field = result === "win" ? 1 : 0

    fetch(`/api/stats`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        montyName: montyKey,
        switched,
        won: field
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log("Stats updated:", data)
      })
      .catch(err => {
        console.error("Failed to report result", err)
      })
  }

  /**
   * callBackendObjs
   * Purpose -> Fetch aggregated game stats from the backend.
   */
  const callBackendObjs = () => {
    fetch("/api/stats", {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch stats")
        return res.json()
      })
      .then(data => {
        console.log("Game stats received:", data)
        setStats(data)
      })
      .catch(err => {
        console.error("Error fetching backend stats:", err)
      })
  }

  /**
   * runSimulation
   * Purpose -> Local simulation loop for estimating outcomes under a chosen strategy.
   * Notes -> Uses current montyType and optional customConfig.
   */
  const runSimulation = async () => {
    setSimulation(prev => ({
      ...prev,
      isRunning: true,
      results: { wins: 0, losses: 0, gamesPlayed: 0 }
    }))

    let wins = 0
    let losses = 0

    for (let i = 0; i < simulation.numGames; i++) {
      const prizeDoor = pickPrizeDoor()
      const montyType = state.montyType
      const initialPick = defaultDoors[Math.floor(Math.random() * 3)]

      const opened = montyOpensDoor(prizeDoor, initialPick, montyType, customConfig)

      let finalPick = initialPick
      let switched = false

      // Early termination if Monty opens the prize door or the player's door
      if (opened === prizeDoor) {
        if (initialPick === prizeDoor) wins++
        else losses++
        continue
      }
      if (opened === initialPick) {
        losses++
        continue
      }

      // Offer switch according to behavior
      const switchOffered =
        montyType === "custom" && customConfig
          ? shouldOfferSwitchUntilOpenCustom(customConfig, opened, initialPick, prizeDoor)
          : (opened === null
              ? false
              : montyType === "secretive"
                ? true
                : opened !== null)

      if (switchOffered) {
        let shouldSwitch = false
        switch (simulation.strategy) {
          case "stay": shouldSwitch = false; break
          case "switch": shouldSwitch = true; break
          case "random": shouldSwitch = Math.random() < 0.5; break
        }

        if (shouldSwitch) {
          switched = true
          if (montyType === "secretive" || opened == null) {
            const remainingDoors = defaultDoors.filter(d => d !== initialPick)
            finalPick = remainingDoors[Math.floor(Math.random() * remainingDoors.length)]
          } else {
            finalPick = defaultDoors.find(d => d !== initialPick && d !== opened)!
          }
        }
      }

      if (finalPick === prizeDoor) wins++
      else losses++

      // Periodic UI update to keep the display responsive
      if (i % 100 === 0 || i === simulation.numGames - 1) {
        setSimulation(prev => ({
          ...prev,
          results: { wins, losses, gamesPlayed: i + 1 }
        }))
        await new Promise(r => setTimeout(r, 1))
      }
    }

    setSimulation(prev => ({ ...prev, isRunning: false }))
    callBackendObjs()
  }

  /**
   * resetSimulation
   * Purpose -> Clear simulation counters without changing settings.
   */
  const resetSimulation = () => {
    setSimulation(prev => ({
      ...prev,
      results: { wins: 0, losses: 0, gamesPlayed: 0 }
    }))
  }

  // -------------------------------------------
  // Core click handlers (manual play)
  // -------------------------------------------

  /**
   * handleInitialPick
   * Purpose -> Handle the player's first door selection and compute Monty's response.
   */
  const handleInitialPick = (door: Door) => {
    if (state.playerPick !== null) return

    const mDoor = montyOpensDoor(
      state.prizeDoor,
      door,
      state.montyType,
      customConfig
    )

    // Immediate result if Monty reveals the prize or opens player's door
    // CHANGED: Only auto-lose on opening player's door when Monty knows the prize (prevents softlock in custom unknown).
    let immediateResult: "win" | "lose" | null =
      mDoor === state.prizeDoor
        ? (door === state.prizeDoor ? "win" : "lose")
        : (mDoor === door
            ? ((state.montyType !== "custom" || !!customConfig?.knowsPrize) ? "lose" : null)
            : null)

    // Decide whether to offer a switch
    let offer: boolean
    if (state.montyType === "custom" && customConfig) {
      offer =
        immediateResult == null &&
        shouldOfferSwitchUntilOpenCustom(customConfig, mDoor, door, state.prizeDoor)
    } else {
      offer =
        immediateResult != null
          ? false
          : state.montyType === "secretive"
            ? true
            : mDoor !== null
    }

    // CHANGED: If no switch is offered and the game isn't decided, auto-resolve as if the player stayed.
    if (!offer && immediateResult == null) {
      const outcome: "win" | "lose" = door === state.prizeDoor ? "win" : "lose"
      updateMontyChoice(state.montyType, outcome, false)
      setState(s => ({
        ...s,
        playerPick: door,
        montyOpens: mDoor,
        switchOffered: false,
        finalPick: door,
        result: outcome,
      }))
      callBackendObjs()
      return
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
   * handleChoice
   * Purpose -> Resolve "Switch" or "Stay".
   * Behavior ->
   *   - Stay -> finalize current pick.
   *   - Switch ->
   *       - Secretive or no door opened -> enter secondary selection mode.
   *       - Otherwise -> switch to the single remaining unopened door.
   */
  const handleChoice = (doSwitch: boolean) => {
    if (
      state.playerPick == null ||
      !state.switchOffered ||
      state.finalPick != null ||
      state.result != null
    ) return

    if (!doSwitch) {
      const outcome = state.playerPick === state.prizeDoor ? "win" : "lose"
      updateMontyChoice(state.montyType, outcome, false)
      setState(s => ({ ...s, finalPick: s.playerPick!, result: outcome }))
      callBackendObjs()
      return
    }

    const opened = state.montyOpens

    if (opened == null || state.montyType === "secretive") {
      setState(s => ({ ...s, choosingSwitch: true }))
      return
    }

    const remaining = defaultDoors.find(d => d !== state.playerPick && d !== opened)!
    const outcome = remaining === state.prizeDoor ? "win" : "lose"
    updateMontyChoice(state.montyType, outcome, true)
    setState(s => ({ ...s, finalPick: remaining, result: outcome }))
    callBackendObjs()
  }

  /**
   * handleFinalPick
   * Purpose -> When in secondary selection mode, finalize the switched pick.
   */
  const handleFinalPick = (door: Door) => {
    if (!state.choosingSwitch || state.finalPick != null || state.result != null) return
    const outcome = door === state.prizeDoor ? "win" : "lose"
    updateMontyChoice(state.montyType, outcome, true)
    setState(s => ({ ...s, finalPick: door, result: outcome, choosingSwitch: false }))
    callBackendObjs()
  }

  /**
   * resetGame
   * Purpose -> Start a new manual round while preserving montyType.
   */
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
    })
  }

  const chartData = {
    labels: ["Win", "Loss"],
    datasets: [
      {
        label: `Manual Games - ${state.montyType}`,
        data: [winCount, loseCount],
        backgroundColor: ["#4caf50", "#f44336"],
      },
      ...(simulation.results.gamesPlayed > 0
        ? [{
            label: `Simulation (${simulation.strategy})`,
            data: [simulation.results.wins, simulation.results.losses],
            backgroundColor: ["#81c784", "#e57373"],
          }]
        : [])
    ],
  }

  const chartOptions = {
    plugins: {
      legend: { labels: { color: "white" } },
    },
    scales: {
      x: { ticks: { color: "white" } },
      y: { ticks: { color: "white" } },
    },
  }

  return (
    <div className={`monty-game-container ${state.result === "win" ? "win" : state.result === "lose" ? "lose" : ""}`}>
      <h2 id="title-name">
        {!hideMontyTypeFromUser
          ? `${state.montyType.charAt(0).toUpperCase() + state.montyType.slice(1)} Monty`
          : "Monty Hall Game"}
      </h2>

      <div className="doors-row">
        {defaultDoors.map(door => {
          let status: DoorStatus = "closed"
          if (state.result != null) {
            status = door === state.prizeDoor ? "prize" : "opened"
          } else if (state.playerPick != null && state.finalPick == null) {
            if (door === state.montyOpens) status = "opened"
            else if (door === state.playerPick) status = "selected"
          }

          const onClick = () => {
            if (state.playerPick == null) handleInitialPick(door)
            else if (state.choosingSwitch && door !== state.playerPick) handleFinalPick(door)
          }

          const disabled =
            Boolean(state.result) ||
            (state.playerPick != null && !state.choosingSwitch && state.montyType !== "secretive")

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

      {/* Switch/Stay prompt */}
      {state.switchOffered && state.finalPick == null && state.result == null && !state.choosingSwitch && (
        <div className="switch-stay">
          <p>Do you want to switch or stay?</p>
          <button onClick={() => handleChoice(true)} style={{ marginRight: "1rem" }}>Switch</button>
          <button onClick={() => handleChoice(false)}>Stay</button>
        </div>
      )}

      {/* Final result and reset */}
      {state.result && (
        <div className="result-display">
          <h3>You {state.result === "win" ? "won!" : "lost."}</h3>
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}

      <div className="chart-container">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Simulation controls */}
      <div className="simulation-controls">
        <h3>Simulation Mode</h3>

        <div className="simulation-input">
          <label>
            Games to simulate:
            <input
              type="number"
              value={simulation.numGames}
              onChange={(e) => setSimulation(prev => ({ ...prev, numGames: parseInt(e.target.value) || 1000 }))}
              min="1"
              max="10000"
              disabled={simulation.isRunning}
            />
          </label>

        <label>
            Strategy:
            <select
              value={simulation.strategy}
              onChange={(e) => setSimulation(prev => ({ ...prev, strategy: e.target.value as "stay" | "switch" | "random" }))}
              disabled={simulation.isRunning}
            >
              <option value="stay">Always Stay</option>
              <option value="switch">Always Switch</option>
              <option value="random">Random Choice</option>
            </select>
          </label>
        </div>

        <div>
          <button
            onClick={runSimulation}
            disabled={simulation.isRunning}
            className="simulation-button"
          >
            {simulation.isRunning ? "Running..." : "Run Simulation"}
          </button>

          <button
            onClick={resetSimulation}
            disabled={simulation.isRunning}
            className="simulation-button-secondary"
          >
            Reset Simulation
          </button>
        </div>

        {simulation.results.gamesPlayed > 0 && (
          <div>
            <h4>Simulation Results:</h4>
            <p>Games Played: {simulation.results.gamesPlayed}</p>
            <p>Wins: {simulation.results.wins} ({((simulation.results.wins / simulation.results.gamesPlayed) * 100).toFixed(1)}%)</p>
            <p>Losses: {simulation.results.losses} ({((simulation.results.losses / simulation.results.gamesPlayed) * 100).toFixed(1)}%)</p>
          </div>
        )}
      </div>
    </div>
  )
}
