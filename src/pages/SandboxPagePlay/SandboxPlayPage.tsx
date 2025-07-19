import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { MontyType, CustomTable } from '../../logic/types'
import MontyGame from '../../components/PlayPageComp/PlayPageComp'
import { CustomMontyForm } from '../../components/CustomMontyForm'

export default function SandboxPlayPage() {
  const [search] = useSearchParams()
  const montyParam = (search.get('monty') as MontyType) || 'standard'

  const [customTable, setCustomTable] = useState<CustomTable>()
  const isCustom = montyParam === 'custom'

  if (isCustom && !customTable) {
    // ask the user to fill out their table first
    return <CustomMontyForm onSubmit={setCustomTable} />
  }

  return (
    <MontyGame
      initialMontyType={montyParam}
      hideMontyTypeFromUser={false}
      // only passed in for custom mode
      customTable={customTable}
    />
  )
}
