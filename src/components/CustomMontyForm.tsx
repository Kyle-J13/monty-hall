// src/components/CustomMontyForm.tsx
// -------------------------------------------------------
// Form for configuring ExtendedCustomConfig in custom mode.
// Users can choose whether Monty knows the prize, whether he offers
// a switch until opening, and then supply one of two sets of opening
// probabilities based on that choice.

import { useState } from 'react'
import type { Door, ExtendedCustomConfig } from '../logic/types'

export function CustomMontyForm({
  onSubmit,
}: {
  onSubmit: (config: ExtendedCustomConfig) => void
}) {
  // Common settings
  const [openChance, setOpenChance] = useState(1)          // P(Monty opens any door at all)
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

  function validateAndSubmit() {
    if (openChance < 0 || openChance > 1) {
      setError('openChance must be between 0 and 1')
      return
    }

    if (knowsPrize) {
      const sumPicked = openSelectedIfPicked + openClosestIfPicked + openFarthestIfPicked + noneIfPicked
      if (Math.abs(sumPicked - 1) > 1e-6) {
        setError('When knowsPrize=true and you picked prize, those four must sum to 1')
        return
      }
      const sumNot = openSelectedIfNot + openPrizeIfNot + openOtherIfNot
      if (Math.abs(sumNot - 1) > 1e-6) {
        setError('When knowsPrize=true and you did not pick prize, those three must sum to 1')
        return
      }
    } else {
      if (unknownP1 < 0 || unknownP1 > 1 || unknownP2 < 0 || unknownP2 > 1 || unknownP3 < 0 || unknownP3 > 1) {
        setError('All unknown-open probabilities must be between 0 and 1')
        return
      }
    }

    setError(undefined)

    onSubmit({
      openChance,
      prizeChance: 0,         
      nonPrizeLeftChance: 0,   
      nonPrizeRightChance: 0,   

      offerSwitchUntilOpen,
      knowsPrize,

      openIfPickedPrize: {
        openSelected: openSelectedIfPicked,
        openClosestNonPrize: openClosestIfPicked,
        openFarthestNonPrize: openFarthestIfPicked,
        none: noneIfPicked,
      },

      openIfNotPickedPrize: {
        openSelected: openSelectedIfNot,
        openPrize: openPrizeIfNot,
        openOtherNonPrize: openOtherIfNot,
      },

      unknownOpenProbs: {
        1: unknownP1,
        2: unknownP2,
        3: unknownP3,
      },
    })
  }

  return (
    <div className="custom-monty-form">
      <h3>Configure Monty Behavior</h3>

      <label>
        Overall openChance:
        <input
          type="number" step="0.01" min="0" max="1"
          value={openChance}
          onChange={e => setOpenChance(parseFloat(e.target.value) || 0)}
        />
      </label>

      <label>
        Offer switch until Monty opens?
        <input
          type="checkbox"
          checked={offerSwitchUntilOpen}
          onChange={e => setOfferSwitchUntilOpen(e.target.checked)}
        />
      </label>

      <label>
        Monty knows prize?
        <input
          type="checkbox"
          checked={knowsPrize}
          onChange={e => setKnowsPrize(e.target.checked)}
        />
      </label>

      {knowsPrize ? (
        <>
          <h4>When playerPick == prizeDoor (sum = 1)</h4>
          <label>
            openSelected:
            <input type="number" step="0.01" min="0" max="1"
              value={openSelectedIfPicked}
              onChange={e => setOpenSelectedIfPicked(parseFloat(e.target.value) || 0)}
            />
          </label>
          <label>
            openClosestNonPrize:
            <input type="number" step="0.01" min="0" max="1"
              value={openClosestIfPicked}
              onChange={e => setOpenClosestIfPicked(parseFloat(e.target.value) || 0)}
            />
          </label>
          <label>
            openFarthestNonPrize:
            <input type="number" step="0.01" min="0" max="1"
              value={openFarthestIfPicked}
              onChange={e => setOpenFarthestIfPicked(parseFloat(e.target.value) || 0)}
            />
          </label>
          <label>
            none:
            <input type="number" step="0.01" min="0" max="1"
              value={noneIfPicked}
              onChange={e => setNoneIfPicked(parseFloat(e.target.value) || 0)}
            />
          </label>

          <h4>When playerPick != prizeDoor (sum = 1)</h4>
          <label>
            openSelected:
            <input type="number" step="0.01" min="0" max="1"
              value={openSelectedIfNot}
              onChange={e => setOpenSelectedIfNot(parseFloat(e.target.value) || 0)}
            />
          </label>
          <label>
            openPrize:
            <input type="number" step="0.01" min="0" max="1"
              value={openPrizeIfNot}
              onChange={e => setOpenPrizeIfNot(parseFloat(e.target.value) || 0)}
            />
          </label>
          <label>
            openOtherNonPrize:
            <input type="number" step="0.01" min="0" max="1"
              value={openOtherIfNot}
              onChange={e => setOpenOtherIfNot(parseFloat(e.target.value) || 0)}
            />
          </label>
        </>
      ) : (
        <>
          <h4>Unknown prize — per-door open probs</h4>
          <label>
            door 1:
            <input type="number" step="0.01" min="0" max="1"
              value={unknownP1}
              onChange={e => setUnknownP1(parseFloat(e.target.value) || 0)}
            />
          </label>
          <label>
            door 2:
            <input type="number" step="0.01" min="0" max="1"
              value={unknownP2}
              onChange={e => setUnknownP2(parseFloat(e.target.value) || 0)}
            />
          </label>
          <label>
            door 3:
            <input type="number" step="0.01" min="0" max="1"
              value={unknownP3}
              onChange={e => setUnknownP3(parseFloat(e.target.value) || 0)}
            />
          </label>
        </>
      )}

      {error && <div className="error">{error}</div>}
      <button onClick={validateAndSubmit}>Use this configuration</button>
    </div>
  )
}
