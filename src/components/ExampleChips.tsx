import { type FC } from 'react';

interface ExampleChipsProps {
  mode: '2D' | '3D';
  onSelect: (equation: string) => void;
}

const EXAMPLES_2D = [
  { label: 'Sine', eq: 'sin(x)' },
  { label: 'Parabola', eq: 'x^2' },
  { label: 'Cubic', eq: 'x^3 - 3*x' },
  { label: 'Abs', eq: 'abs(sin(x)) * x' },
  { label: 'Log', eq: 'log(x + 1)' },
  { label: 'Tangent', eq: 'tan(x)' },
  { label: 'Gaussian', eq: 'exp(-x^2)' },
  { label: 'Damped', eq: 'sin(x) * exp(-x/5)' },
];

const EXAMPLES_3D = [
  { label: 'Waves', eq: 'sin(x) * cos(y)' },
  { label: 'Paraboloid', eq: 'x^2 + y^2' },
  { label: 'Saddle', eq: 'x^2 - y^2' },
  { label: 'Ripple', eq: 'sin(sqrt(x^2 + y^2))' },
  { label: 'Egg Crate', eq: 'sin(x) * sin(y)' },
  { label: 'Cone', eq: 'sqrt(x^2 + y^2)' },
  { label: 'Hat', eq: 'sin(sqrt(x^2+y^2)) / (sqrt(x^2+y^2) + 0.01)' },
  { label: 'Peaks', eq: '3*(1-x)^2*exp(-x^2-(y+1)^2) - 10*(x/5-x^3-y^5)*exp(-x^2-y^2)' },
];

const ExampleChips: FC<ExampleChipsProps> = ({ mode, onSelect }) => {
  const examples = mode === '2D' ? EXAMPLES_2D : EXAMPLES_3D;

  return (
    <div className="example-chips-container">
      <span className="example-chips-label">Try an example</span>
      <div className="example-chips">
        {examples.map((ex) => (
          <button
            key={ex.eq}
            className="example-chip"
            onClick={() => onSelect(ex.eq)}
            title={ex.eq}
            type="button"
          >
            <span className="chip-label">{ex.label}</span>
            <span className="chip-eq">{ex.eq}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExampleChips;
