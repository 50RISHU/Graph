import { useState, useCallback } from 'react';
import './App.css';
import ModeToggle from './components/ModeToggle';
import EquationInput from './components/EquationInput';
import ExampleChips from './components/ExampleChips';
import GraphCanvas from './components/GraphCanvas';
import { evaluate2D, evaluate3D, validateExpression } from './utils/mathEval';
import type { PlotData2D, PlotData3D } from './utils/mathEval';

function App() {
  const [mode, setMode] = useState<'2D' | '3D'>('2D');
  const [equation, setEquation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [data2D, setData2D] = useState<PlotData2D | null>(null);
  const [data3D, setData3D] = useState<PlotData3D | null>(null);
  const [currentEquation, setCurrentEquation] = useState('');

  const handlePlot = useCallback(() => {
    const validationError = validateExpression(equation, mode);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setCurrentEquation(equation);

    if (mode === '2D') {
      const result = evaluate2D(equation);
      setData2D(result);
      setData3D(null);
    } else {
      const result = evaluate3D(equation);
      setData3D(result);
      setData2D(null);
    }
  }, [equation, mode]);

  const handleModeToggle = useCallback((newMode: '2D' | '3D') => {
    setMode(newMode);
    setEquation('');
    setError(null);
    setData2D(null);
    setData3D(null);
    setCurrentEquation('');
  }, []);

  const handleExampleSelect = useCallback((eq: string) => {
    setEquation(eq);
    setError(null);

    // Auto-plot the example
    const validationError = validateExpression(eq, mode);
    if (!validationError) {
      setCurrentEquation(eq);
      if (mode === '2D') {
        setData2D(evaluate2D(eq));
        setData3D(null);
      } else {
        setData3D(evaluate3D(eq));
        setData2D(null);
      }
    }
  }, [mode]);

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <h1>Grapher</h1>
          <span className="version">v1.0</span>
        </div>
        <div className="sidebar-content">
          <ModeToggle mode={mode} onToggle={handleModeToggle} />
          <EquationInput
            mode={mode}
            equation={equation}
            onChange={(eq) => { setEquation(eq); setError(null); }}
            onPlot={handlePlot}
            error={error}
          />
          <ExampleChips mode={mode} onSelect={handleExampleSelect} />
        </div>
      </aside>
      <main className="main-content">
        <GraphCanvas
          mode={mode}
          data2D={data2D}
          data3D={data3D}
          equation={currentEquation}
        />
      </main>
    </div>
  );
}

export default App;
