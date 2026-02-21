import React, { useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { levels } from './levels/index';
import { getCompletedLevels } from '../save/SaveManager';
import type { Level, LevelSection } from './Level';

interface NodePos {
  level: Level;
  x: number;
  y: number;
  status: 'completed' | 'unlocked' | 'locked';
}

interface Edge {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface SectionDivider {
  label: string;
  y: number;
}

const NODE_SIZE = 32;
const ROW_GAP = 80;
const COL_GAP = 100;
const PADDING_X = 200;
const PADDING_TOP = 80;

const STATUS_COLORS: Record<string, string> = {
  completed: '#4ade80',
  unlocked: '#eab308',
  locked: '#991b1b',
};

export default function LevelSelect() {
  const navigate = useNavigate();
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  const completed = useMemo(() => new Set(getCompletedLevels()), []);

  const { nodes, edges, dividers, width, height } = useMemo(() => {
    const levelMap = new Map<string, Level>();
    levels.forEach((l) => levelMap.set(l.id, l));

    // Build parent map: childId -> parentIds
    const parentMap = new Map<string, string[]>();
    levels.forEach((l) => {
      (l.unlocks ?? []).forEach((childId) => {
        if (!parentMap.has(childId)) parentMap.set(childId, []);
        parentMap.get(childId)!.push(l.id);
      });
    });

    // Find roots (no parents)
    const roots = levels.filter((l) => !parentMap.has(l.id));

    // BFS to assign rows
    const rowMap = new Map<string, number>();
    const queue: string[] = roots.map((r) => r.id);
    roots.forEach((r) => rowMap.set(r.id, 0));

    while (queue.length > 0) {
      const id = queue.shift()!;
      const row = rowMap.get(id)!;
      const lvl = levelMap.get(id)!;
      (lvl.unlocks ?? []).forEach((childId) => {
        const existing = rowMap.get(childId);
        const newRow = row + 1;
        if (existing === undefined || newRow > existing) {
          rowMap.set(childId, newRow);
        }
        if (!queue.includes(childId)) queue.push(childId);
      });
    }

    // Group by row
    const rowGroups = new Map<number, string[]>();
    rowMap.forEach((row, id) => {
      if (!rowGroups.has(row)) rowGroups.set(row, []);
      rowGroups.get(row)!.push(id);
    });

    const maxRow = Math.max(...rowGroups.keys(), 0);

    // Assign x positions: center each row's nodes
    const posMap = new Map<string, { x: number; y: number }>();
    let maxX = 0;

    for (let r = 0; r <= maxRow; r++) {
      const ids = rowGroups.get(r) ?? [];
      const totalWidth = (ids.length - 1) * COL_GAP;
      const startX = PADDING_X + (-totalWidth / 2);
      ids.forEach((id, i) => {
        const x = startX + i * COL_GAP;
        const y = PADDING_TOP + r * ROW_GAP;
        posMap.set(id, { x, y });
        if (x > maxX) maxX = x;
      });
    }

    // Center everything
    const centerOffset = PADDING_X;
    const allPositions = [...posMap.values()];
    const minX = Math.min(...allPositions.map((p) => p.x));
    const shift = centerOffset - minX;
    posMap.forEach((pos) => {
      pos.x += shift;
    });

    // Determine unlocked set
    const unlockedSet = new Set<string>();
    // Roots are always unlocked
    roots.forEach((r) => unlockedSet.add(r.id));
    // Anything unlocked by a completed level
    completed.forEach((id) => {
      const lvl = levelMap.get(id);
      (lvl?.unlocks ?? []).forEach((childId) => unlockedSet.add(childId));
    });

    // Build nodes
    const nodeList: NodePos[] = levels
      .filter((l) => posMap.has(l.id))
      .map((l) => {
        const pos = posMap.get(l.id)!;
        let status: NodePos['status'] = 'locked';
        if (completed.has(l.id)) status = 'completed';
        else if (unlockedSet.has(l.id)) status = 'unlocked';
        return { level: l, x: pos.x, y: pos.y, status };
      });

    // Build edges
    const edgeList: Edge[] = [];
    levels.forEach((l) => {
      const from = posMap.get(l.id);
      if (!from) return;
      (l.unlocks ?? []).forEach((childId) => {
        const to = posMap.get(childId);
        if (!to) return;
        edgeList.push({ x1: from.x, y1: from.y, x2: to.x, y2: to.y });
      });
    });

    // Section dividers
    const sectionFirstRow = new Map<LevelSection, number>();
    levels.forEach((l) => {
      const row = rowMap.get(l.id);
      if (row === undefined) return;
      const existing = sectionFirstRow.get(l.section);
      if (existing === undefined || row < existing) {
        sectionFirstRow.set(l.section, row);
      }
    });

    const dividerList: SectionDivider[] = [];
    const seenSections = new Set<LevelSection>();
    // Sort sections by their first row
    const sortedSections = [...sectionFirstRow.entries()].sort((a, b) => a[1] - b[1]);
    sortedSections.forEach(([section, row]) => {
      if (!seenSections.has(section)) {
        seenSections.add(section);
        const y = PADDING_TOP + row * ROW_GAP - ROW_GAP / 2 + shift * 0;
        // Place divider above the first row of this section
        dividerList.push({
          label: section.toString().toUpperCase().replace(/_/g, ' '),
          y: PADDING_TOP + row * ROW_GAP - 40 + (row === 0 ? -20 : 0),
        });
      }
    });

    const allNodes = nodeList;
    const w = Math.max(...allNodes.map((n) => n.x), 400) + PADDING_X;
    const h = Math.max(...allNodes.map((n) => n.y), 200) + PADDING_TOP + 40;

    return { nodes: nodeList, edges: edgeList, dividers: dividerList, width: w, height: h };
  }, [completed]);

  const handleClick = useCallback(
    (node: NodePos) => {
      if (node.status !== 'locked') {
        navigate(`/play/${node.level.id}`);
      }
    },
    [navigate]
  );

  return (
    <div
      style={{
        background: '#0f0f1a',
        minHeight: '100vh',
        color: '#e2e8f0',
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
        overflow: 'auto',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          zIndex: 10,
          padding: '16px 24px',
          background: 'linear-gradient(to bottom, #0f0f1a 60%, transparent)',
        }}
      >
        <a
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}
          href="/"
          style={{
            color: '#94a3b8',
            textDecoration: 'none',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          ← Home
        </a>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 60 }}>
        <svg
          width={width}
          height={height}
          style={{ display: 'block' }}
        >
          {/* Section dividers */}
          {dividers.map((d, i) => (
            <g key={`div-${i}`}>
              <line
                x1={40}
                y1={d.y}
                x2={width - 40}
                y2={d.y}
                stroke="#334155"
                strokeWidth={1}
                strokeDasharray="6 4"
              />
              <text
                x={60}
                y={d.y - 8}
                fill="#64748b"
                fontSize={11}
                fontFamily="inherit"
                letterSpacing="2px"
              >
                {d.label}
              </text>
            </g>
          ))}

          {/* Edges */}
          {edges.map((e, i) => (
            <line
              key={`edge-${i}`}
              x1={e.x1}
              y1={e.y1}
              x2={e.x2}
              y2={e.y2}
              stroke="#334155"
              strokeWidth={2}
            />
          ))}

          {/* Nodes */}
          {nodes.map((node) => {
            const color = STATUS_COLORS[node.status];
            const half = NODE_SIZE / 2;
            const clickable = node.status !== 'locked';

            return (
              <g
                key={node.level.id}
                style={{ cursor: clickable ? 'pointer' : 'not-allowed' }}
                onClick={() => handleClick(node)}
                onMouseEnter={(e) => {
                  const rect = (e.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect();
                  setTooltip({
                    text: node.level.name,
                    x: node.x + rect.left,
                    y: node.y + rect.top - half - 12,
                  });
                }}
                onMouseLeave={() => setTooltip(null)}
              >
                {/* Glow for unlocked */}
                {node.status === 'unlocked' && (
                  <rect
                    x={node.x - half - 2}
                    y={node.y - half - 2}
                    width={NODE_SIZE + 4}
                    height={NODE_SIZE + 4}
                    rx={2}
                    fill="none"
                    stroke={color}
                    strokeWidth={1}
                    opacity={0.4}
                    transform={`rotate(45 ${node.x} ${node.y})`}
                  />
                )}
                <rect
                  x={node.x - half}
                  y={node.y - half}
                  width={NODE_SIZE}
                  height={NODE_SIZE}
                  rx={3}
                  fill={node.status === 'locked' ? '#1e1e2e' : color}
                  stroke={color}
                  strokeWidth={2}
                  transform={`rotate(45 ${node.x} ${node.y})`}
                  opacity={node.status === 'locked' ? 0.5 : 1}
                />
                {node.status === 'completed' && (
                  <text
                    x={node.x}
                    y={node.y + 5}
                    textAnchor="middle"
                    fill="#0f0f1a"
                    fontSize={14}
                    fontWeight="bold"
                  >
                    ✓
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          style={{
            position: 'fixed',
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -100%)',
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '4px 10px',
            borderRadius: 4,
            fontSize: 12,
            fontFamily: 'inherit',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            border: '1px solid #334155',
            zIndex: 100,
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
