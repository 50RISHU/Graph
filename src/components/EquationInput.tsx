import { type FC, type FormEvent, useState, useRef, useCallback } from 'react';
import MathKeyboard from './MathKeyboard';

interface EquationInputProps {
  mode: '2D' | '3D';
  equation: string;
  onChange: (eq: string) => void;
  onPlot: () => void;
  error: string | null;
}

const PLACEHOLDERS: Record<string, string> = {
  '2D': 'e.g. sin(x), x^2, log(x+1)',
  '3D': 'e.g. sin(x)*cos(y), x^2+y^2',
};

const EquationInput: FC<EquationInputProps> = ({ mode, equation, onChange, onPlot, error }) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onPlot();
  };

  /** Insert text from the math keyboard at the current cursor position */
  const handleKeyboardInsert = useCallback(
    (value: string) => {
      const input = inputRef.current;
      if (!input) {
        // Fallback: append
        onChange(equation + value);
        return;
      }

      const start = input.selectionStart ?? equation.length;
      const end = input.selectionEnd ?? equation.length;
      const before = equation.slice(0, start);
      const after = equation.slice(end);
      const newEq = before + value + after;

      onChange(newEq);

      // Restore cursor after the inserted text on next tick
      const newCursorPos = start + value.length;
      requestAnimationFrame(() => {
        input.focus();
        input.setSelectionRange(newCursorPos, newCursorPos);
      });
    },
    [equation, onChange],
  );

  return (
    <form className="equation-input-container" onSubmit={handleSubmit}>
      <label className="equation-label" htmlFor="equation-input">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z" />
          <circle cx="17" cy="17" r="3" />
        </svg>
        Equation
      </label>
      <div className={`equation-input-wrapper ${isFocused ? 'focused' : ''} ${error ? 'has-error' : ''}`}>
        <span className="equation-prefix">f({mode === '2D' ? 'x' : 'x,y'}) =</span>
        <input
          ref={inputRef}
          id="equation-input"
          type="text"
          value={equation}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={PLACEHOLDERS[mode]}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      {error && (
        <div className="equation-error">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}
      <MathKeyboard mode={mode} onInsert={handleKeyboardInsert} />
      <button type="submit" className="plot-button" id="plot-button">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
        Plot Graph
      </button>
    </form>
  );
};

export default EquationInput;
