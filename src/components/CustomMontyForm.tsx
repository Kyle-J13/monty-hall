// src/components/CustomMontyForm.tsx
// -------------------------------------------------------
// Form for configuring ExtendedCustomConfig in custom mode.
// Users can choose whether Monty knows the prize, whether he offers
// a switch until opening, and then supply one of two sets of opening
// probabilities based on that choice.

import { useState } from 'react'
import type { ExtendedCustomConfig } from '../logic/types'
import './CustomMontyForm.css';

export function CustomMontyForm({
  onSubmit,
}: {
  onSubmit: (config: ExtendedCustomConfig) => void
}) {
  // Common settings
  const [openChance, setOpenChance] = useState(1) // P(Monty opens any door at all)
  const [offerSwitchUntilOpen, setOfferSwitchUntilOpen] = useState(true)
  const [knowsPrize, setKnowsPrize] = useState(true)

  // When Monty knows prize:
  // A) If playerPick == prizeDoor, these sum to 1
  const [openSelectedIfPicked, setOpenSelectedIfPicked] = useState(0.25)
  const [openClosestIfPicked, setOpenClosestIfPicked] = useState(0.25)
  const [openFarthestIfPicked, setOpenFarthestIfPicked] = useState(0.25)
  const [noneIfPicked, setNoneIfPicked] = useState(0.25)

  // B) If playerPick != prizeDoor, these sum to 1
  const [openSelectedIfNot, setOpenSelectedIfNot] = useState(0.33)
  const [openPrizeIfNot, setOpenPrizeIfNot] = useState(0.33)
  const [openOtherIfNot, setOpenOtherIfNot] = useState(0.34)

  // When Monty does not know prize: per-door open probs
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

  const handleSubmit = () => {
    // Validation
    if (knowsPrize) {
      if (Math.abs(pickedSum - 1) > 1e-6) {
        setError(
          `When playerPick == prizeDoor, probabilities must sum to 1 (currently ${pickedSum.toFixed(2)})`
        )
        return
      }
      if (Math.abs(notSum - 1) > 1e-6) {
        setError(
          `When playerPick != prizeDoor, probabilities must sum to 1 (currently ${notSum.toFixed(2)})`
        )
        return
      }
    } else {
      if (unknownSum > 1 + 1e-6) {
        setError(
          `Unknown prize probabilities must sum to ≤ 1 (currently ${unknownSum.toFixed(2)})`
        )
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

      <div>
        <label>
          Overall openChance:
          <input
            type="number"
            step="0.01"
            value={openChance}
            onChange={(e) => setOpenChance(parseFloat(e.target.value) || 0)}
          />
        </label>
        <label>
          <input
            type="checkbox"
            checked={offerSwitchUntilOpen}
            onChange={(e) => setOfferSwitchUntilOpen(e.target.checked)}
          />
          Offer switch until Monty opens
        </label>
        <label>
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
          <fieldset>
            <legend>When playerPick == prizeDoor (sum = {pickedSum.toFixed(2)})</legend>
            <label>
              openSelected:
              <input
                type="number"
                step="0.01"
                value={openSelectedIfPicked}
                onChange={(e) =>
                  setOpenSelectedIfPicked(parseFloat(e.target.value) || 0)
                }
              />
            </label>
            <label>
              openClosestNonPrize:
              <input
                type="number"
                step="0.01"
                value={openClosestIfPicked}
                onChange={(e) =>
                  setOpenClosestIfPicked(parseFloat(e.target.value) || 0)
                }
              />
            </label>
            <label>
              openFarthestNonPrize:
              <input
                type="number"
                step="0.01"
                value={openFarthestIfPicked}
                onChange={(e) =>
                  setOpenFarthestIfPicked(parseFloat(e.target.value) || 0)
                }
              />
            </label>
            <label>
              none:
              <input
                type="number"
                step="0.01"
                value={noneIfPicked}
                onChange={(e) =>
                  setNoneIfPicked(parseFloat(e.target.value) || 0)
                }
              />
            </label>
          </fieldset>

          <fieldset>
            <legend>When playerPick != prizeDoor (sum = {notSum.toFixed(2)})</legend>
            <label>
              openSelected:
              <input
                type="number"
                step="0.01"
                value={openSelectedIfNot}
                onChange={(e) =>
                  setOpenSelectedIfNot(parseFloat(e.target.value) || 0)
                }
              />
            </label>
            <label>
              openPrize:
              <input
                type="number"
                step="0.01"
                value={openPrizeIfNot}
                onChange={(e) =>
                  setOpenPrizeIfNot(parseFloat(e.target.value) || 0)
                }
              />
            </label>
            <label>
              openOtherNonPrize:
              <input
                type="number"
                step="0.01"
                value={openOtherIfNot}
                onChange={(e) =>
                  setOpenOtherIfNot(parseFloat(e.target.value) || 0)
                }
              />
            </label>
          </fieldset>
        </>
      ) : (
        <fieldset>
          <legend>
            Monty does not know prize (sum = {unknownSum.toFixed(2)}, remainder is no-open)
          </legend>
          <label>
            door 1:
            <input
              type="number"
              step="0.01"
              value={unknownP1}
              onChange={(e) =>
                setUnknownP1(parseFloat(e.target.value) || 0)
              }
            />
          </label>
          <label>
            door 2:
            <input
              type="number"
              step="0.01"
              value={unknownP2}
              onChange={(e) =>
                setUnknownP2(parseFloat(e.target.value) || 0)
              }
            />
          </label>
          <label>
            door 3:
            <input
              type="number"
              step="0.01"
              value={unknownP3}
              onChange={(e) =>
                setUnknownP3(parseFloat(e.target.value) || 0)
              }
            />
          </label>
        </fieldset>
      )}

      {error && <div className="error">{error}</div>}

      <button onClick={handleSubmit}>Use this configuration</button>
    </div>
  )
}
