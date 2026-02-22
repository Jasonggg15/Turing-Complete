import { GateType } from '../engine/types';

interface ToolbarProps {
  availableGates: GateType[];
  unlockedComponents?: GateType[];
  selectedTool: GateType | null;
  onSelectTool: (tool: GateType | null) => void;
  onVerify: () => void;
  onClear: () => void;
  onBack?: () => void;
}

const buttonBase: React.CSSProperties = {
  padding: '8px 14px',
  border: '1px solid #4a4a6a',
  borderColor: '#4a4a6a',
  borderRadius: '6px',
  background: '#1a1a2e',
  color: '#e2e8f0',
  cursor: 'pointer',
  fontSize: '13px',
  fontFamily: 'monospace',
  fontWeight: 'bold',
  transition: 'background 0.15s',
  outline: 'none',
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

const componentButtonStyle: React.CSSProperties = {
  ...buttonBase,
  borderColor: '#2d6a4f',
  background: '#1a2e28',
};

const componentSelectedStyle: React.CSSProperties = {
  ...componentButtonStyle,
  background: '#2d6a4f',
  borderColor: '#2d6a4f',
};

export default function Toolbar({
  availableGates,
  unlockedComponents,
  selectedTool,
  onSelectTool,
  onVerify,
  onClear,
  onBack,
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
      {onBack && (
        <>
          <button
            style={{ ...actionStyle, borderColor: '#94a3b8', color: '#94a3b8' }}
            onClick={onBack}
          >
            ← Back
          </button>
          <div
            style={{
              width: '1px',
              height: '28px',
              background: '#4a4a6a',
              margin: '0 4px',
            }}
          />
        </>
      )}

      {availableGates.map((gate) => (
        <button
          key={gate}
          style={selectedTool === gate ? selectedStyle : buttonBase}
          onClick={() => onSelectTool(selectedTool === gate ? null : gate)}
        >
          {gate}
        </button>
      ))}

      {unlockedComponents && unlockedComponents.length > 0 && (
        <>
          <div
            style={{
              width: '1px',
              height: '28px',
              background: '#4a4a6a',
              margin: '0 4px',
            }}
          />
          <span style={{ color: '#2d6a4f', fontSize: '11px', marginRight: '4px' }}>
            Components:
          </span>
          {unlockedComponents.map((gate) => (
            <button
              key={gate}
              style={selectedTool === gate ? componentSelectedStyle : componentButtonStyle}
              onClick={() => onSelectTool(selectedTool === gate ? null : gate)}
            >
              {gate === GateType.HALF_ADDER ? 'HALF ADD' : gate === GateType.FULL_ADDER ? 'FULL ADD' : gate}
            </button>
          ))}
        </>
      )}

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
