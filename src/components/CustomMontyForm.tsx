import React, { useState } from 'react'
import type { CustomTable } from '../logic/types'

const ROW_LABELS = [
  'Open prize door',
  'Open player’s pick',
  'Open the other non-prize door',
  'Open none',
]

export function CustomMontyForm({
  onSubmit,
}: {
  onSubmit: (table: CustomTable) => void
}) {
  // start with defaults)
  const [table, setTable] = useState<CustomTable>([
    [0,0],
    [0,0],
    [0.5,0.5],
    [0,0],
  ])
  const [error, setError] = useState<string>()

  function handleChange(row: number, col: 0|1, value: string) {
    const v = parseFloat(value)
    setTable(t => {
      const copy = t.map(r => [...r] as [number,number])
      copy[row][col] = isNaN(v) ? 0 : v
      return copy
    })
  }

  function validateAndSubmit() {
    // ensure each column sums to 1
    const sums = [0,1].map(c => table.reduce((acc, r) => acc + r[c], 0))
    if (Math.abs(sums[0] - 1) > 1e-6 || Math.abs(sums[1] - 1) > 1e-6) {
      setError(`Each column must sum to 1; currently sums are ${sums.map(s=>s.toFixed(2)).join(', ')}`)
      return
    }
    setError(undefined)
    onSubmit(table)
  }

  return (
    <div className="custom-monty-form">
      <h3>Configure your own Monty behavior</h3>
      <table>
        <thead>
          <tr>
            <th>Action</th>
            <th>When pick = prize</th>
            <th>When pick ≠ prize</th>
          </tr>
        </thead>
        <tbody>
          {table.map((row, i) => (
            <tr key={i}>
              <td>{ROW_LABELS[i]}</td>
              {[0,1].map(col => (
                <td key={col}>
                  <input
                    type="number"
                    step="0.01"
                    min="0" max="1"
                    value={row[col]}
                    onChange={e => handleChange(i, col as 0|1, e.target.value)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {error && <div className="error">{error}</div>}
      <button onClick={validateAndSubmit}>Use this table</button>
    </div>
  )
}
