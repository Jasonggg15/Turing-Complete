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
  gateCount?: number;
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
  transition: 'background 0.15s, box-shadow 0.15s',
  outline: 'none',
};

const selectedStyle: React.CSSProperties = {
  ...buttonBase,
  background: '#6366f1',
  borderColor: '#818cf8',
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
  borderColor: '#4ade80',
};

const separatorStyle: React.CSSProperties = {
  width: '1px',
  height: '28px',
  background: '#4a4a6a',
  margin: '0 4px',
};

const groupLabelStyle: React.CSSProperties = {
  fontSize: '9px',
  color: '#4a4a6a',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  marginRight: '2px',
  userSelect: 'none' as const,
};

function gateLabel(gate: GateType): string {
  if (gate === GateType.HALF_ADDER) return 'HALF ADD';
  if (gate === GateType.FULL_ADDER) return 'FULL ADD';
  return gate;
}

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
  gateCount,
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
        gap: '6px',
        padding: '8px 12px',
        background: '#1a1a2e',
        borderBottom: '1px solid #2d2d44',
        alignItems: 'center',
        flexWrap: 'wrap',
        minHeight: '44px',
      }}
    >
      {/* Navigation */}
      {onBack && (
        <>
          <button
            className="toolbar-btn"
            data-tooltip="Back to levels"
            style={{ ...actionStyle, borderColor: '#94a3b8', color: '#94a3b8', padding: '6px 10px' }}
            onClick={onBack}
          >
            ← Back
          </button>
          <div style={separatorStyle} />
        </>
      )}

      {/* Gate tools group */}
      <span style={groupLabelStyle}>Gates</span>
      {availableGates.map((gate) => {
        const isSelected = selectedTool === gate;
        return (
          <button
            key={gate}
            className={`toolbar-btn${isSelected ? ' toolbar-btn--selected' : ''}`}
            data-tooltip={gateLabel(gate)}
            style={isSelected ? selectedStyle : buttonBase}
            onClick={() => onSelectTool(isSelected ? null : gate)}
          >
            {gateLabel(gate)}
          </button>
        );
      })}

      {/* Unlocked components group */}
      {unlockedComponents && unlockedComponents.length > 0 && (
        <>
          <div style={separatorStyle} />
          <span style={{ ...groupLabelStyle, color: '#2d6a4f' }}>Components</span>
          {unlockedComponents.map((gate) => {
            const isSelected = selectedTool === gate;
            return (
              <button
                key={gate}
                className={`toolbar-btn${isSelected ? ' toolbar-btn--selected' : ''}`}
                data-tooltip={gateLabel(gate)}
                style={isSelected ? componentSelectedStyle : componentButtonStyle}
                onClick={() => onSelectTool(isSelected ? null : gate)}
              >
                {gateLabel(gate)}
              </button>
            );
          })}
        </>
      )}

      {/* Wire color */}
      {onWireColorChange && (
        <>
          <div style={separatorStyle} />
          <div ref={colorPickerRef} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <button
              className="toolbar-btn"
              data-tooltip="Wire color"
              style={{
                ...buttonBase,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 10px',
              }}
              onClick={() => setColorPickerOpen(!colorPickerOpen)}
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

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Gate count */}
      {gateCount !== undefined && (
        <span style={{ fontSize: '11px', color: '#4a4a6a', fontFamily: 'monospace', marginRight: '4px' }}>
          {gateCount} gates
        </span>
      )}

      {/* Actions group */}
      <div style={separatorStyle} />
      <span style={groupLabelStyle}>Actions</span>
      <button
        className="toolbar-btn"
        data-tooltip="Verify circuit"
        style={{ ...actionStyle, borderColor: '#22c55e', color: '#22c55e' }}
        onClick={onVerify}
      >
        ✓ Verify
      </button>
      <button
        className="toolbar-btn"
        data-tooltip="Clear circuit"
        style={{ ...actionStyle, borderColor: '#ef4444', color: '#ef4444' }}
        onClick={onClear}
      >
        ✕ Clear
      </button>
    </div>
  );
}
