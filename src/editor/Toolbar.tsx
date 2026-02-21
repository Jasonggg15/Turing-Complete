import { GateType } from '../engine/types';

interface ToolbarProps {
  availableGates: GateType[];
  selectedTool: GateType | null;
  onSelectTool: (tool: GateType | null) => void;
  onVerify: () => void;
  onClear: () => void;
}

const buttonBase: React.CSSProperties = {
  padding: '8px 14px',
  border: '1px solid #4a4a6a',
  borderRadius: '6px',
  background: '#1a1a2e',
  color: '#e2e8f0',
  cursor: 'pointer',
  fontSize: '13px',
  fontFamily: 'monospace',
  fontWeight: 'bold',
  transition: 'background 0.15s',
};

const selectedStyle: React.CSSProperties = {
  ...buttonBase,
  background: '#6366f1',
  borderColor: '#6366f1',
};

const actionStyle: React.CSSProperties = {
  ...buttonBase,
  background: '#2d2d44',
};

export default function Toolbar({
  availableGates,
  selectedTool,
  onSelectTool,
  onVerify,
  onClear,
}: ToolbarProps) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        padding: '10px 16px',
        background: '#1a1a2e',
        borderBottom: '1px solid #2d2d44',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      {availableGates.map((gate) => (
        <button
          key={gate}
          style={selectedTool === gate ? selectedStyle : buttonBase}
          onClick={() => onSelectTool(selectedTool === gate ? null : gate)}
        >
          {gate}
        </button>
      ))}

      <div
        style={{
          width: '1px',
          height: '28px',
          background: '#4a4a6a',
          margin: '0 4px',
        }}
      />

      <button
        style={{ ...actionStyle, borderColor: '#22c55e', color: '#22c55e' }}
        onClick={onVerify}
      >
        ✓ Verify
      </button>
      <button
        style={{ ...actionStyle, borderColor: '#ef4444', color: '#ef4444' }}
        onClick={onClear}
      >
        ✕ Clear
      </button>
    </div>
  );
}
