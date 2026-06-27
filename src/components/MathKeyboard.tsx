import { type FC, useState } from 'react';

/** Each key on the math keyboard */
interface MathKey {
  /** Display label (can use special chars / symbols) */
  label: string;
  /** Text inserted into the equation input */
  value: string;
  /** Optional tooltip */
  title?: string;
  /** Extra CSS class for styling */
  className?: string;
}

interface MathKeyboardProps {
  mode: '2D' | '3D';
  onInsert: (value: string) => void;
}

/* ────────────────────────────────────────────
   Key definitions organised by category
   ──────────────────────────────────────────── */

const TRIG_KEYS: MathKey[] = [
  { label: 'sin',   value: 'sin(',   title: 'Sine' },
  { label: 'cos',   value: 'cos(',   title: 'Cosine' },
  { label: 'tan',   value: 'tan(',   title: 'Tangent' },
  { label: 'asin',  value: 'asin(',  title: 'Arc sine' },
  { label: 'acos',  value: 'acos(',  title: 'Arc cosine' },
  { label: 'atan',  value: 'atan(',  title: 'Arc tangent' },
  { label: 'sinh',  value: 'sinh(',  title: 'Hyperbolic sine' },
  { label: 'cosh',  value: 'cosh(',  title: 'Hyperbolic cosine' },
  { label: 'tanh',  value: 'tanh(',  title: 'Hyperbolic tangent' },
  { label: 'sec',   value: 'sec(',   title: 'Secant' },
  { label: 'csc',   value: 'csc(',   title: 'Cosecant' },
  { label: 'cot',   value: 'cot(',   title: 'Cotangent' },
];

const FUNC_KEYS: MathKey[] = [
  { label: 'log',   value: 'log(',      title: 'Natural logarithm (ln)' },
  { label: 'log₁₀', value: 'log10(',    title: 'Base-10 logarithm' },
  { label: 'log₂',  value: 'log2(',     title: 'Base-2 logarithm' },
  { label: '√',     value: 'sqrt(',     title: 'Square root' },
  { label: '∛',     value: 'cbrt(',     title: 'Cube root' },
  { label: 'ⁿ√',   value: 'nthRoot(',  title: 'nth root — nthRoot(x, n)' },
  { label: '|x|',   value: 'abs(',      title: 'Absolute value' },
  { label: '⌈x⌉',  value: 'ceil(',     title: 'Ceiling' },
  { label: '⌊x⌋',  value: 'floor(',    title: 'Floor' },
  { label: 'round', value: 'round(',    title: 'Round to nearest integer' },
  { label: 'sign',  value: 'sign(',     title: 'Sign function (−1, 0, 1)' },
  { label: 'exp',   value: 'exp(',      title: 'e raised to power' },
];

const CONST_KEYS: MathKey[] = [
  { label: 'π',     value: 'pi',   title: 'Pi ≈ 3.14159', className: 'key-constant' },
  { label: 'e',     value: 'e',    title: 'Euler\'s number ≈ 2.71828', className: 'key-constant' },
  { label: 'τ',     value: 'tau',  title: 'Tau = 2π ≈ 6.28318', className: 'key-constant' },
  { label: 'φ',     value: 'phi',  title: 'Golden ratio ≈ 1.61803', className: 'key-constant' },
  { label: '∞',     value: 'Infinity', title: 'Infinity', className: 'key-constant' },
];

const VAR_KEYS_2D: MathKey[] = [
  { label: 'x', value: 'x', title: 'Variable x', className: 'key-variable' },
];

const VAR_KEYS_3D: MathKey[] = [
  { label: 'x', value: 'x', title: 'Variable x', className: 'key-variable' },
  { label: 'y', value: 'y', title: 'Variable y', className: 'key-variable' },
];

const OP_KEYS: MathKey[] = [
  { label: '+',  value: ' + ', title: 'Add' },
  { label: '−',  value: ' - ', title: 'Subtract' },
  { label: '×',  value: ' * ', title: 'Multiply' },
  { label: '÷',  value: ' / ', title: 'Divide' },
  { label: 'xⁿ', value: '^',  title: 'Power' },
  { label: 'x²', value: '^2', title: 'Square' },
  { label: 'x³', value: '^3', title: 'Cube' },
  { label: '(',  value: '(',  title: 'Left parenthesis' },
  { label: ')',  value: ')',  title: 'Right parenthesis' },
  { label: ',',  value: ', ', title: 'Comma separator' },
  { label: '!',  value: '!',  title: 'Factorial' },
  { label: '%',  value: ' % ', title: 'Modulus' },
];

const NUM_KEYS: MathKey[] = [
  { label: '7', value: '7' },
  { label: '8', value: '8' },
  { label: '9', value: '9' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '0', value: '0' },
  { label: '.', value: '.' },
];

type TabId = 'trig' | 'func' | 'const' | 'ops' | 'num';

interface Tab {
  id: TabId;
  label: string;
  icon: string;
}

const TABS: Tab[] = [
  { id: 'trig',  label: 'Trig',       icon: '∿' },
  { id: 'func',  label: 'Functions',   icon: 'ƒ' },
  { id: 'const', label: 'Constants',   icon: 'π' },
  { id: 'ops',   label: 'Operators',   icon: '±' },
  { id: 'num',   label: 'Numpad',      icon: '#' },
];

const MathKeyboard: FC<MathKeyboardProps> = ({ mode, onInsert }) => {
  const [activeTab, setActiveTab] = useState<TabId>('trig');
  const [isOpen, setIsOpen] = useState(true);

  const variableKeys = mode === '3D' ? VAR_KEYS_3D : VAR_KEYS_2D;

  const getActiveKeys = (): MathKey[] => {
    switch (activeTab) {
      case 'trig':  return TRIG_KEYS;
      case 'func':  return FUNC_KEYS;
      case 'const': return [...CONST_KEYS, ...variableKeys];
      case 'ops':   return OP_KEYS;
      case 'num':   return NUM_KEYS;
    }
  };

  const activeKeys = getActiveKeys();

  return (
    <div className={`math-keyboard ${isOpen ? 'open' : 'collapsed'}`}>
      {/* Header — toggle */}
      <button
        type="button"
        className="math-keyboard-header"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        id="math-keyboard-toggle"
      >
        <span className="keyboard-header-left">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <line x1="6" y1="8" x2="6.01" y2="8" />
            <line x1="10" y1="8" x2="10.01" y2="8" />
            <line x1="14" y1="8" x2="14.01" y2="8" />
            <line x1="18" y1="8" x2="18.01" y2="8" />
            <line x1="6" y1="12" x2="6.01" y2="12" />
            <line x1="10" y1="12" x2="10.01" y2="12" />
            <line x1="14" y1="12" x2="14.01" y2="12" />
            <line x1="18" y1="12" x2="18.01" y2="12" />
            <line x1="8" y1="16" x2="16" y2="16" />
          </svg>
          Math Keyboard
        </span>
        <svg
          className={`chevron ${isOpen ? 'rotated' : ''}`}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Keyboard body (animated) */}
      <div className="math-keyboard-body">
        {/* Category tabs */}
        <div className="keyboard-tabs" role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`keyboard-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              id={`keyboard-tab-${tab.id}`}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Key grid */}
        <div
          className={`keyboard-keys ${activeTab === 'num' ? 'numpad-grid' : ''}`}
          role="group"
          aria-label={`${activeTab} keys`}
        >
          {activeKeys.map((key, i) => (
            <button
              key={`${key.label}-${i}`}
              type="button"
              className={`math-key ${key.className ?? ''}`}
              title={key.title}
              onClick={() => onInsert(key.value)}
              id={`math-key-${key.value.replace(/[^a-zA-Z0-9]/g, '')}-${i}`}
            >
              {key.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MathKeyboard;
