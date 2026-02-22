import { useEffect, useRef } from 'react';
import { WIRE_COLORS, WIRE_COLOR_NAMES } from './WireRenderer';

interface WireColorPickerProps {
  wireId: string;
  currentColor: string;
  x: number;
  y: number;
  onSelectColor: (wireId: string, color: string) => void;
  onDeleteWire: (wireId: string) => void;
  onClose: () => void;
}

export default function WireColorPicker({
  wireId,
  currentColor,
  x,
  y,
  onSelectColor,
  onDeleteWire,
  onClose,
}: WireColorPickerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        background: '#1a1a2e',
        border: '1px solid #4a4a6a',
        borderRadius: '8px',
        padding: '8px',
        zIndex: 30,
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '4px',
        }}
      >
        {WIRE_COLOR_NAMES.map((name) => {
          const entry = WIRE_COLORS[name]!;
          const isSelected = name === currentColor;
          return (
            <button
              key={name}
              onClick={() => onSelectColor(wireId, name)}
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: entry.hex,
                border: isSelected ? '2px solid #e2e8f0' : '2px solid transparent',
                cursor: 'pointer',
                outline: 'none',
                boxShadow: isSelected ? '0 0 4px rgba(226,232,240,0.5)' : 'none',
              }}
              title={name}
            />
          );
        })}
      </div>
      <button
        onClick={() => onDeleteWire(wireId)}
        style={{
          padding: '4px 8px',
          background: '#2d2d44',
          border: '1px solid #ef4444',
          borderRadius: '4px',
          color: '#ef4444',
          cursor: 'pointer',
          fontSize: '11px',
          fontFamily: 'monospace',
        }}
      >
        Delete Wire
      </button>
    </div>
  );
}
