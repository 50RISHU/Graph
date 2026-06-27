import { compile } from 'mathjs';

export interface PlotData2D {
  x: number[];
  y: number[];
}

export interface PlotData3D {
  x: number[][];
  y: number[][];
  z: number[][];
}

/**
 * Evaluate a 2D expression f(x) over a range.
 */
export function evaluate2D(
  expr: string,
  xMin = -10,
  xMax = 10,
  steps = 500
): PlotData2D {
  const compiled = compile(expr);
  const x: number[] = [];
  const y: number[] = [];
  const dx = (xMax - xMin) / steps;

  for (let i = 0; i <= steps; i++) {
    const xVal = xMin + i * dx;
    try {
      const yVal = compiled.evaluate({ x: xVal });
      if (typeof yVal === 'number' && isFinite(yVal)) {
        x.push(xVal);
        y.push(yVal);
      } else {
        x.push(xVal);
        y.push(NaN);
      }
    } catch {
      x.push(xVal);
      y.push(NaN);
    }
  }

  return { x, y };
}

/**
 * Evaluate a 3D expression f(x, y) over a mesh grid.
 */
export function evaluate3D(
  expr: string,
  rangeMin = -5,
  rangeMax = 5,
  steps = 60
): PlotData3D {
  const compiled = compile(expr);
  const x: number[][] = [];
  const y: number[][] = [];
  const z: number[][] = [];
  const d = (rangeMax - rangeMin) / steps;

  for (let i = 0; i <= steps; i++) {
    const xRow: number[] = [];
    const yRow: number[] = [];
    const zRow: number[] = [];
    const yVal = rangeMin + i * d;

    for (let j = 0; j <= steps; j++) {
      const xVal = rangeMin + j * d;
      xRow.push(xVal);
      yRow.push(yVal);
      try {
        const zVal = compiled.evaluate({ x: xVal, y: yVal });
        if (typeof zVal === 'number' && isFinite(zVal)) {
          zRow.push(zVal);
        } else {
          zRow.push(NaN);
        }
      } catch {
        zRow.push(NaN);
      }
    }

    x.push(xRow);
    y.push(yRow);
    z.push(zRow);
  }

  return { x, y, z };
}

/**
 * Validate an expression without fully evaluating it.
 */
export function validateExpression(expr: string, mode: '2D' | '3D'): string | null {
  if (!expr.trim()) return 'Please enter an equation';
  try {
    const compiled = compile(expr);
    if (mode === '2D') {
      compiled.evaluate({ x: 0 });
    } else {
      compiled.evaluate({ x: 0, y: 0 });
    }
    return null;
  } catch (e: unknown) {
    if (e instanceof Error) {
      return e.message;
    }
    return 'Invalid expression';
  }
}
