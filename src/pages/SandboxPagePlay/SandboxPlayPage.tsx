import { useSearchParams } from 'react-router-dom';
import type { MontyType } from '../../logic/types';
import MontyGame from '../../components/PlayPageComp/PlayPageComp';

export default function SandboxPlayPage() {
  const [search] = useSearchParams();
  const montyParam = (search.get('monty') as MontyType) || 'standard';

  return (
    <div className="sandbox-play-container">
      <MontyGame
        initialMontyType={montyParam}
        hideMontyTypeFromUser={false}
      />
    </div>
  );
}
