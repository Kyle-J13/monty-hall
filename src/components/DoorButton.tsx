import React from 'react';
import closedImg from '../assets/door-closed.svg';
import openImg   from '../assets/door-open.svg';
import prizeImg  from '../assets/prize.svg';

// Export a named type for the door’s display status
export type DoorStatus = 'closed' | 'opened' | 'selected' | 'prize';

interface DoorButtonProps {
  door: number;
  status: DoorStatus;
  onClick: () => void;
  disabled?: boolean;
}

/**
 * DoorButton renders one door as an image + label.
 * - closed: shows a closed door
 * - opened: shows an open door
 * - selected: closed door with highlight
 * - prize: reveals the prize icon
 */
const DoorButton: React.FC<DoorButtonProps> = ({
  door,
  status,
  onClick,
  disabled = false,
}) => {
  const imgSrc =
    status === 'opened' ? openImg :
    status === 'prize'  ? prizeImg:
                          closedImg;

  const border =
    status === 'selected' ? '4px solid #007ACC' :
    status === 'prize'    ? '4px solid #228B22' :
                            '2px solid #333';

  return (
    <div style={{ textAlign: 'center', userSelect: 'none' }}>
      <img
        src={imgSrc}
        alt={
          status === 'opened' ? 'Open door'
          : status === 'prize'  ? 'Prize'
          : 'Closed door'
        }
        style={{
          width: 100,
          height: 150,
          border,
          borderRadius: 4,
          cursor: disabled ? 'default' : 'pointer',
        }}
        onClick={disabled ? undefined : onClick}
      />
      <div style={{ marginTop: 8 }}>
        <button onClick={onClick} disabled={disabled}>
          Door {door}
        </button>
      </div>
    </div>
  );
};

export default DoorButton;
