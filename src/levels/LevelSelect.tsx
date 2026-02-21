import { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { levels } from './levels/index';
import { getCompletedLevels } from '../save/SaveManager';
import type { Level, LevelSection } from './Level';

interface NodePos {
  level: Level;
  x: number;
  y: number;
  row: number;
  status: 'completed' | 'unlocked' | 'locked';
}

interface Edge {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  completed: boolean;
  id: string;
}

interface SectionBanner {
  label: string;
  y: number;
}

const NODE_W = 180;
const NODE_H = 38;
const ROW_GAP = 100;
const PADDING_TOP = 70;
const SVG_WIDTH = 600;

export default function LevelSelect() {
  const navigate = useNavigate();

  const completed = useMemo(() => new Set(getCompletedLevels()), []);

  const { nodes, edges, banners, svgHeight } = useMemo(() => {
    const levelMap = new Map<string, Level>();
    levels.forEach((l) => levelMap.set(l.id, l));

    // Build parent map
    const parentMap = new Map<string, string[]>();
    levels.forEach((l) => {
      (l.unlocks ?? []).forEach((childId) => {
        if (!parentMap.has(childId)) parentMap.set(childId, []);
        parentMap.get(childId)!.push(l.id);
      });
    });

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

    // Detect section transitions and insert banner rows
    // First, compute a mapping of row -> effective Y with banners inserted
    const orderedLevels = levels
      .filter((l) => rowMap.has(l.id))
      .sort((a, b) => rowMap.get(a.id)! - rowMap.get(b.id)!);

    let currentSection: LevelSection | null = null;
    const bannerList: SectionBanner[] = [];
    const rowYOffset = new Map<number, number>(); // row -> extra Y offset from banners
    let bannerOffset = 0;

    for (const lvl of orderedLevels) {
      const row = rowMap.get(lvl.id)!;
      if (lvl.section !== currentSection) {
        currentSection = lvl.section;
        // Banner sits above this row
        if (!rowYOffset.has(row)) {
          bannerOffset += 50; // space for banner
          bannerList.push({
            label: lvl.section.toUpperCase().replace(/_/g, ' '),
            y: PADDING_TOP + row * ROW_GAP + bannerOffset - 40,
          });
        }
      }
      if (!rowYOffset.has(row)) {
        rowYOffset.set(row, bannerOffset);
      }
    }

    // Compute unlocked set
    const unlockedSet = new Set<string>();
    roots.forEach((r) => unlockedSet.add(r.id));
    completed.forEach((id) => {
      const lvl = levelMap.get(id);
      (lvl?.unlocks ?? []).forEach((childId) => unlockedSet.add(childId));
    });

    // Center X
    const centerX = SVG_WIDTH / 2;

    // Build nodes
    const nodeList: NodePos[] = orderedLevels.map((l) => {
      const row = rowMap.get(l.id)!;
      const extraY = rowYOffset.get(row) ?? 0;
      const y = PADDING_TOP + row * ROW_GAP + extraY;

      let status: NodePos['status'] = 'locked';
      if (completed.has(l.id)) status = 'completed';
      else if (unlockedSet.has(l.id)) status = 'unlocked';

      return { level: l, x: centerX, y, row, status };
    });

    // Build edges
    const nodeMap = new Map<string, NodePos>();
    nodeList.forEach((n) => nodeMap.set(n.level.id, n));

    const edgeList: Edge[] = [];
    levels.forEach((l) => {
      const from = nodeMap.get(l.id);
      if (!from) return;
      (l.unlocks ?? []).forEach((childId) => {
        const to = nodeMap.get(childId);
        if (!to) return;
        const parentCompleted = completed.has(l.id);
        edgeList.push({
          x1: from.x,
          y1: from.y + NODE_H / 2,
          x2: to.x,
          y2: to.y - NODE_H / 2,
          completed: parentCompleted,
          id: `${l.id}-${childId}`,
        });
      });
    });

    const maxY = Math.max(...nodeList.map((n) => n.y), 200);
    const h = maxY + NODE_H / 2 + 80;

    return { nodes: nodeList, edges: edgeList, banners: bannerList, svgHeight: h };
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
      className="level-select-bg"
      style={{
        background: '#0f0f1a',
        minHeight: '100vh',
        color: '#e2e8f0',
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
        overflow: 'auto',
        position: 'relative',
      }}
    >
      {/* Home link */}
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
            color: '#D4A843',
            textDecoration: 'none',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          ← Home
        </a>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          paddingBottom: 60,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <svg width={SVG_WIDTH} height={svgHeight} style={{ display: 'block' }}>
          <defs>
            {/* Glow filter for unlocked nodes */}
            <filter id="glow-gold" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Glow filter for completed connections */}
            <filter id="glow-green" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Section banners */}
          {banners.map((b, i) => (
            <g key={`banner-${i}`}>
              <line
                x1={SVG_WIDTH / 2 - 160}
                y1={b.y + 10}
                x2={SVG_WIDTH / 2 + 160}
                y2={b.y + 10}
                stroke="#D4A843"
                strokeWidth={1}
                opacity={0.35}
              />
              <text
                x={SVG_WIDTH / 2}
                y={b.y}
                textAnchor="middle"
                fill="#D4A843"
                fontSize={16}
                fontWeight="bold"
                fontFamily="inherit"
                letterSpacing="6px"
                opacity={1}
                filter="url(#glow-gold)"
              >
                {b.label}
              </text>
              <line
                x1={SVG_WIDTH / 2 - 160}
                y1={b.y - 12}
                x2={SVG_WIDTH / 2 + 160}
                y2={b.y - 12}
                stroke="#D4A843"
                strokeWidth={1}
                opacity={0.35}
              />
            </g>
          ))}

          {/* Connection lines */}
          {edges.map((e) => {
            const color = e.completed ? '#22c55e' : '#444';
            const pathId = `path-${e.id}`;
            const d = `M ${e.x1} ${e.y1} L ${e.x2} ${e.y2}`;
            return (
              <g key={e.id}>
                <path
                  id={pathId}
                  d={d}
                  stroke={color}
                  strokeWidth={2}
                  fill="none"
                  filter={e.completed ? 'url(#glow-green)' : undefined}
                />
                {/* Flow dot */}
                <circle r={3} fill={e.completed ? '#22c55e' : '#888'} opacity={0.8}>
                  <animateMotion dur="2s" repeatCount="indefinite">
                    <mpath href={`#${pathId}`} />
                  </animateMotion>
                </circle>
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const clickable = node.status !== 'locked';
            const nx = node.x - NODE_W / 2;
            const ny = node.y - NODE_H / 2;

            let bg: string;
            let border: string;
            let textColor: string;
            let icon: string | null = null;

            switch (node.status) {
              case 'completed':
                bg = '#1a3a2a';
                border = '#22c55e';
                textColor = '#ffffff';
                icon = '✓';
                break;
              case 'unlocked':
                bg = '#2a2a1a';
                border = '#D4A843';
                textColor = '#ffffff';
                break;
              default:
                bg = '#1a1a2a';
                border = '#333';
                textColor = '#666';
                icon = '🔒';
                break;
            }

            return (
              <g
                key={node.level.id}
                className={`tree-node tree-node--${node.status}`}
                style={{ cursor: clickable ? 'pointer' : 'not-allowed' }}
                onClick={() => handleClick(node)}
              >
                {/* Node rect */}
                <rect
                  x={nx}
                  y={ny}
                  width={NODE_W}
                  height={NODE_H}
                  rx={8}
                  fill={bg}
                  stroke={border}
                  strokeWidth={2}
                  filter={node.status === 'unlocked' ? 'url(#glow-gold)' : undefined}
                />
                {/* Icon left */}
                {icon && (
                  <text
                    x={nx + 14}
                    y={node.y + 1}
                    dominantBaseline="central"
                    fontSize={node.status === 'locked' ? 12 : 14}
                    fill={node.status === 'completed' ? '#22c55e' : '#666'}
                  >
                    {icon}
                  </text>
                )}
                {/* Level name */}
                <text
                  x={node.x}
                  y={node.y + 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={textColor}
                  fontSize={12}
                  fontFamily="inherit"
                >
                  {node.level.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
