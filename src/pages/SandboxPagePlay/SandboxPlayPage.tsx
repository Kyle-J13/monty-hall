// src/pages/SandboxPlayPage.tsx
// -------------------------------------------------------
// Show CustomMontyForm for 'custom' mode, then pass ExtendedCustomConfig to MontyGame

import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { MontyType, ExtendedCustomConfig } from '../../logic/types'
import MontyGame from '../../components/PlayPageComp/PlayPageComp'
import { CustomMontyForm } from '../../components/CustomMontyForm'

export default function SandboxPlayPage() {
  const [search] = useSearchParams()
  const montyParam = (search.get('monty') as MontyType) || 'standard'
  const [customConfig, setCustomConfig] = useState<ExtendedCustomConfig>()
  const isCustom = montyParam === 'custom'

  if (isCustom && !customConfig) {
    // Render form to collect extended custom configuration
    return <CustomMontyForm onSubmit={setCustomConfig} />
  }

  // Pass the collected config (or undefined) into MontyGame
  return (
    <MontyGame
      initialMontyType={montyParam}
      hideMontyTypeFromUser={false}
      customConfig={customConfig}
    />
  )
}
