import { type FC, useMemo } from 'react';
import Plot from 'react-plotly.js';
import type { Data, Layout } from 'plotly.js';
import type { PlotData2D, PlotData3D } from '../utils/mathEval';

interface GraphCanvasProps {
  mode: '2D' | '3D';
  data2D: PlotData2D | null;
  data3D: PlotData3D | null;
  equation: string;
}

const PLOTLY_DARK_LAYOUT_BASE = {
  paper_bgcolor: 'rgba(0,0,0,0)',
  plot_bgcolor: 'rgba(10,10,30,0.6)',
  font: {
    family: "'Inter', sans-serif",
    color: '#a0a0c0',
    size: 12,
  },
  margin: { t: 40, r: 30, b: 50, l: 55 },
  autosize: true,
};

const AXIS_STYLE = {
  gridcolor: 'rgba(100,100,180,0.15)',
  zerolinecolor: 'rgba(150,150,220,0.3)',
  linecolor: 'rgba(100,100,180,0.2)',
  tickcolor: 'rgba(100,100,180,0.3)',
};

const GraphCanvas: FC<GraphCanvasProps> = ({ mode, data2D, data3D, equation }) => {
  const hasData = mode === '2D' ? data2D !== null : data3D !== null;

  const plotData = useMemo(() => {
    if (mode === '2D' && data2D) {
      return [
        {
          x: data2D.x,
          y: data2D.y,
          type: 'scatter' as const,
          mode: 'lines' as const,
          line: {
            color: '#818cf8',
            width: 2.5,
            shape: 'spline' as const,
          },
          name: equation,
        },
      ];
    }
    if (mode === '3D' && data3D) {
      return [
        {
          x: data3D.x,
          y: data3D.y,
          z: data3D.z,
          type: 'surface' as const,
          colorscale: [
            [0, '#6366f1'],
            [0.25, '#818cf8'],
            [0.5, '#a78bfa'],
            [0.75, '#c084fc'],
            [1, '#e879f9'],
          ],
          showscale: false,
          contours: {
            z: {
              show: true,
              usecolormap: true,
              highlightcolor: '#c084fc',
              project: { z: false },
            },
          },
          lighting: {
            ambient: 0.6,
            diffuse: 0.7,
            specular: 0.3,
            roughness: 0.5,
          },
          name: equation,
        },
      ];
    }
    return [];
  }, [mode, data2D, data3D, equation]);

  const layout = useMemo(() => {
    if (mode === '2D') {
      return {
        ...PLOTLY_DARK_LAYOUT_BASE,
        xaxis: { ...AXIS_STYLE, title: 'x' },
        yaxis: { ...AXIS_STYLE, title: 'f(x)' },
        showlegend: false,
      };
    }
    return {
      ...PLOTLY_DARK_LAYOUT_BASE,
      scene: {
        xaxis: { ...AXIS_STYLE, title: 'x', backgroundcolor: 'rgba(10,10,30,0.3)' },
        yaxis: { ...AXIS_STYLE, title: 'y', backgroundcolor: 'rgba(10,10,30,0.3)' },
        zaxis: { ...AXIS_STYLE, title: 'z', backgroundcolor: 'rgba(10,10,30,0.3)' },
        bgcolor: 'rgba(10,10,30,0.3)',
        camera: {
          eye: { x: 1.5, y: 1.5, z: 1.2 },
        },
      },
      showlegend: false,
      margin: { t: 20, r: 10, b: 10, l: 10 },
    };
  }, [mode]);

  return (
    <div className={`graph-canvas ${hasData ? 'has-data' : ''}`} id="graph-canvas">
      {!hasData ? (
        <div className="graph-placeholder">
          <div className="placeholder-icon">
            {mode === '2D' ? (
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            ) : (
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M12 3L2 9l10 6 10-6-10-6z" />
                <path d="M2 17l10 6 10-6" />
                <path d="M2 13l10 6 10-6" />
              </svg>
            )}
          </div>
          <p className="placeholder-text">
            Enter an equation and click <strong>Plot Graph</strong> to visualize
          </p>
          <p className="placeholder-hint">
            or try one of the examples on the left
          </p>
        </div>
      ) : (
        <Plot
          data={plotData as Data[]}
          layout={layout as Partial<Layout>}
          config={{
            responsive: true,
            displayModeBar: true,
            displaylogo: false,
            modeBarButtonsToRemove: ['lasso2d', 'select2d'],
          }}
          useResizeHandler
          style={{ width: '100%', height: '100%' }}
        />
      )}
    </div>
  );
};

export default GraphCanvas;
