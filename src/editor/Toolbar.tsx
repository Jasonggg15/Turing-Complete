import { useState, useEffect, useRef } from 'react';
import { GateType } from '../engine/types';
import { WIRE_COLORS, WIRE_COLOR_NAMES } from './WireRenderer';

interface ToolbarProps {
  availableGates: GateType[];
  unlockedComponents?: GateType[];
  selectedTool: GateType | null;
  onSelectTool: (tool: GateType | null) => void;
  onVerify: () => void;
  onClear: () => void;
  onBack?: () => void;
  wireColor?: string;
  onWireColorChange?: (color: string) => void;
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
  wireColor = 'green',
  onWireColorChange,
}: ToolbarProps) {
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!colorPickerOpen) return;
    const handler = (e: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target as Node)) {
        setColorPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [colorPickerOpen]);

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

      {onWireColorChange && (
        <>
          <div
            style={{
              width: '1px',
              height: '28px',
              background: '#4a4a6a',
              margin: '0 4px',
            }}
          />
          <div ref={colorPickerRef} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <button
              style={{
                ...buttonBase,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 10px',
              }}
              onClick={() => setColorPickerOpen(!colorPickerOpen)}
              title={`Wire color: ${wireColor}`}
            >
              <span
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  background: (WIRE_COLORS[wireColor] ?? WIRE_COLORS['green']!).hex,
                  display: 'inline-block',
                  border: '1px solid #6a6a8a',
                }}
              />
              <span style={{ fontSize: '11px' }}>Wire</span>
            </button>

            {colorPickerOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '4px',
                  display: 'flex',
                  gap: '4px',
                  padding: '6px 8px',
                  background: '#1a1a2e',
                  border: '1px solid #4a4a6a',
                  borderRadius: '6px',
                  zIndex: 50,
                }}
              >
                {WIRE_COLOR_NAMES.map((name) => {
                  const entry = WIRE_COLORS[name]!;
                  const isSelected = name === wireColor;
                  return (
                    <button
                      key={name}
                      onClick={() => {
                        onWireColorChange(name);
                        setColorPickerOpen(false);
                      }}
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        background: entry.hex,
                        border: isSelected ? '2px solid #e2e8f0' : '2px solid transparent',
                        cursor: 'pointer',
                        outline: 'none',
                      }}
                      title={name}
                    />
                  );
                })}
              </div>
            )}
          </div>
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
