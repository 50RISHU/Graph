import { type FC } from 'react';

interface ModeToggleProps {
  mode: '2D' | '3D';
  onToggle: (mode: '2D' | '3D') => void;
}

const ModeToggle: FC<ModeToggleProps> = ({ mode, onToggle }) => {
  return (
    <div className="mode-toggle-container">
      <span className="mode-toggle-label">Mode</span>
      <div className="mode-toggle">
        <div
          className="mode-toggle-slider"
          style={{ transform: mode === '3D' ? 'translateX(100%)' : 'translateX(0)' }}
        />
        <button
          className={`mode-toggle-btn ${mode === '2D' ? 'active' : ''}`}
          onClick={() => onToggle('2D')}
          id="mode-toggle-2d"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          2D
        </button>
        <button
          className={`mode-toggle-btn ${mode === '3D' ? 'active' : ''}`}
          onClick={() => onToggle('3D')}
          id="mode-toggle-3d"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 3L2 9l10 6 10-6-10-6z" />
            <path d="M2 17l10 6 10-6" />
            <path d="M2 13l10 6 10-6" />
          </svg>
          3D
        </button>
      </div>
    </div>
  );
};

export default ModeToggle;
