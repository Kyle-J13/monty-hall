// src/components/CustomMontyForm.tsx
// -------------------------------------------------------
// Form component for building an ExtendedCustomConfig in custom mode.
// Handles validation to ensure probability rules are met before submission.

import { useState } from "react"
import type { ExtendedCustomConfig } from "../logic/types"
import "./CustomMontyForm.css"

/**
 * CustomMontyForm
 * Purpose -> Collect and validate custom configuration for Monty's behavior.
 * Features ->
 *   - Toggle Monty's knowledge of prize location.
 *   - Adjust probabilities for each decision scenario.
 *   - Validate that probabilities meet required sum constraints.
 *   - Pass configuration to parent via onSubmit.
 */
export function CustomMontyForm({
  onSubmit,
}: {
  onSubmit: (config: ExtendedCustomConfig) => void
}) {
  // Common settings
  const [openChance, setOpenChance] = useState(1)
  const [offerSwitchUntilOpen, setOfferSwitchUntilOpen] = useState(true)
  const [knowsPrize, setKnowsPrize] = useState(true)

  // When Monty knows prize
  const [openSelectedIfPicked, setOpenSelectedIfPicked] = useState(0.25)
  const [openClosestIfPicked, setOpenClosestIfPicked] = useState(0.25)
  const [openFarthestIfPicked, setOpenFarthestIfPicked] = useState(0.25)
  const [noneIfPicked, setNoneIfPicked] = useState(0.25)

  const [openSelectedIfNot, setOpenSelectedIfNot] = useState(0.33)
  const [openPrizeIfNot, setOpenPrizeIfNot] = useState(0.33)
  const [openOtherIfNot, setOpenOtherIfNot] = useState(0.34)

  // When Monty does not know prize
  const [unknownP1, setUnknownP1] = useState(0.3)
  const [unknownP2, setUnknownP2] = useState(0.3)
  const [unknownP3, setUnknownP3] = useState(0.3)

  const [error, setError] = useState<string>()

  const pickedSum =
    openSelectedIfPicked +
    openClosestIfPicked +
    openFarthestIfPicked +
    noneIfPicked

  const notSum =
    openSelectedIfNot +
    openPrizeIfNot +
    openOtherIfNot

  const unknownSum = unknownP1 + unknownP2 + unknownP3

  /**
   * handleSubmit
   * Purpose -> Validate probability sums, then pass configuration up to parent.
   */
  const handleSubmit = () => {
    if (knowsPrize) {
      if (Math.abs(pickedSum - 1) > 1e-6) {
        setError(`When playerPick == prizeDoor, probabilities must sum to 1 (currently ${pickedSum.toFixed(2)})`)
        return
      }
      if (Math.abs(notSum - 1) > 1e-6) {
        setError(`When playerPick != prizeDoor, probabilities must sum to 1 (currently ${notSum.toFixed(2)})`)
        return
      }
    } else {
      if (unknownSum > 1 + 1e-6) {
        setError(`Unknown prize probabilities must sum to ≤ 1 (currently ${unknownSum.toFixed(2)})`)
        return
      }
    }

    setError(undefined)

    const config: ExtendedCustomConfig = {
      openChance,
      offerSwitchUntilOpen,
      knowsPrize,
      whenPickedPrize: {
        openSelected: openSelectedIfPicked,
        openClosestNonPrize: openClosestIfPicked,
        openFarthestNonPrize: openFarthestIfPicked,
        none: noneIfPicked,
      },
      whenPickedNotPrize: {
        openSelected: openSelectedIfNot,
        openPrize: openPrizeIfNot,
        openOtherNonPrize: openOtherIfNot,
      },
      unknownPrize: {
        door1: unknownP1,
        door2: unknownP2,
        door3: unknownP3,
      },
    }

    onSubmit(config)
  }

  return (
    <div className="custom-monty-form">
      <h3>Configure Monty Behavior</h3>

      <div className="row">
        <label className="label">Overall openChance</label>
        <input
          className="input sm"
          type="number"
          step="0.01"
          value={openChance}
          onChange={(e) => setOpenChance(parseFloat(e.target.value) || 0)}
        />
        <label className="checkbox">
          <input
            type="checkbox"
            checked={offerSwitchUntilOpen}
            onChange={(e) => setOfferSwitchUntilOpen(e.target.checked)}
          />
          Offer switch until Monty opens
        </label>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={knowsPrize}
            onChange={(e) => setKnowsPrize(e.target.checked)}
          />
          Monty knows prize?
        </label>
      </div>

      {knowsPrize ? (
        <>
          <fieldset className="group">
            <legend>
              When playerPick == prizeDoor
              {Math.abs(pickedSum - 1) < 1e-6
                ? <span className="ok">OK</span>
                : <span className="bad">{pickedSum.toFixed(2)}</span>}
            </legend>
            <div className="grid-4">
              <label className="label">
                openSelected
                <input className="input" type="number" step="0.01" value={openSelectedIfPicked} onChange={(e) => setOpenSelectedIfPicked(parseFloat(e.target.value) || 0)} />
              </label>
              <label className="label">
                openClosestNonPrize
                <input className="input" type="number" step="0.01" value={openClosestIfPicked} onChange={(e) => setOpenClosestIfPicked(parseFloat(e.target.value) || 0)} />
              </label>
              <label className="label">
                openFarthestNonPrize
                <input className="input" type="number" step="0.01" value={openFarthestIfPicked} onChange={(e) => setOpenFarthestIfPicked(parseFloat(e.target.value) || 0)} />
              </label>
              <label className="label">
                none
                <input className="input" type="number" step="0.01" value={noneIfPicked} onChange={(e) => setNoneIfPicked(parseFloat(e.target.value) || 0)} />
              </label>
            </div>
          </fieldset>

          <fieldset className="group">
            <legend>
              When playerPick != prizeDoor
              {Math.abs(notSum - 1) < 1e-6
                ? <span className="ok">OK</span>
                : <span className="bad">{notSum.toFixed(2)}</span>}
            </legend>
            <div className="grid-3">
              <label className="label">
                openSelected
                <input className="input" type="number" step="0.01" value={openSelectedIfNot} onChange={(e) => setOpenSelectedIfNot(parseFloat(e.target.value) || 0)} />
              </label>
              <label className="label">
                openPrize
                <input className="input" type="number" step="0.01" value={openPrizeIfNot} onChange={(e) => setOpenPrizeIfNot(parseFloat(e.target.value) || 0)} />
              </label>
              <label className="label">
                openOtherNonPrize
                <input className="input" type="number" step="0.01" value={openOtherIfNot} onChange={(e) => setOpenOtherIfNot(parseFloat(e.target.value) || 0)} />
              </label>
            </div>
          </fieldset>
        </>
      ) : (
        <fieldset className="group">
          <legend>
            Monty does not know prize
            {unknownSum <= 1 + 1e-6
              ? <span className="ok">OK</span>
              : <span className="bad">{unknownSum.toFixed(2)}</span>}
          </legend>
          <div className="grid-3">
            <label className="label">
              door 1
              <input className="input" type="number" step="0.01" value={unknownP1} onChange={(e) => setUnknownP1(parseFloat(e.target.value) || 0)} />
            </label>
            <label className="label">
              door 2
              <input className="input" type="number" step="0.01" value={unknownP2} onChange={(e) => setUnknownP2(parseFloat(e.target.value) || 0)} />
            </label>
            <label className="label">
              door 3
              <input className="input" type="number" step="0.01" value={unknownP3} onChange={(e) => setUnknownP3(parseFloat(e.target.value) || 0)} />
            </label>
          </div>
        </fieldset>
      )}

      {error && <div className="error">{error}</div>}

      <div className="actions">
        <button className="primary" onClick={handleSubmit}>
          Use this configuration
        </button>
      </div>
    </div>
  )
}
