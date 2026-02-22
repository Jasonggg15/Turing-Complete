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

const NODE_W = 170;
const NODE_H = 38;
const ROW_GAP = 80;
const COL_GAP = 40;
const PADDING_TOP = 70;
const BANNER_HEIGHT = 60;

export default function LevelSelect() {
  const navigate = useNavigate();

  const completed = useMemo(() => new Set(getCompletedLevels()), []);

  const { nodes, edges, banners, svgHeight, svgWidth } = useMemo(() => {
    const levelMap = new Map<string, Level>();
    levels.forEach((l) => levelMap.set(l.id, l));

    // Build child map from prerequisites
    const childMap = new Map<string, string[]>();
    levels.forEach((l) => {
      (l.prerequisites ?? []).forEach((prereqId) => {
        if (!childMap.has(prereqId)) childMap.set(prereqId, []);
        childMap.get(prereqId)!.push(l.id);
      });
    });

    const roots = levels.filter(
      (l) => !l.prerequisites || l.prerequisites.length === 0,
    );

    // BFS to assign rows (longest path from any root)
    const rowMap = new Map<string, number>();
    const queue: string[] = roots.map((r) => r.id);
    roots.forEach((r) => rowMap.set(r.id, 0));

    while (queue.length > 0) {
      const id = queue.shift()!;
      const row = rowMap.get(id)!;
      const children = childMap.get(id) ?? [];
      children.forEach((childId) => {
        const childLevel = levelMap.get(childId);
        if (!childLevel) return;
        // Row = max(all prerequisite rows) + 1
        const prereqRows = (childLevel.prerequisites ?? []).map(
          (p) => rowMap.get(p) ?? 0,
        );
        const newRow = Math.max(...prereqRows, row) + 1;
        const existing = rowMap.get(childId);
        if (existing === undefined || newRow > existing) {
          rowMap.set(childId, newRow);
        }
        if (!queue.includes(childId)) queue.push(childId);
      });
    }

    // Group nodes by row for horizontal layout
    const rowGroups = new Map<number, Level[]>();
    levels.forEach((l) => {
      const row = rowMap.get(l.id);
      if (row === undefined) return;
      if (!rowGroups.has(row)) rowGroups.set(row, []);
      rowGroups.get(row)!.push(l);
    });

    // Determine section first-appearance rows (one banner per section)
    const orderedLevels = levels
      .filter((l) => rowMap.has(l.id))
      .sort((a, b) => rowMap.get(a.id)! - rowMap.get(b.id)!);

    const sectionFirstRow = new Map<LevelSection, number>();
    for (const lvl of orderedLevels) {
      const row = rowMap.get(lvl.id)!;
      if (!sectionFirstRow.has(lvl.section)) {
        sectionFirstRow.set(lvl.section, row);
      }
    }

    // Build set of rows that need a banner
    const bannerAtRow = new Map<number, string[]>();
    for (const [section, row] of sectionFirstRow) {
      if (!bannerAtRow.has(row)) bannerAtRow.set(row, []);
      bannerAtRow.get(row)!.push(section.toUpperCase());
    }

    // Compute cumulative Y offset and banners for each row
    const maxRow = Math.max(...rowMap.values());
    const bannerList: SectionBanner[] = [];
    const rowYOffset = new Map<number, number>();
    let bannerOffset = 0;

    for (let r = 0; r <= maxRow; r++) {
      const labels = bannerAtRow.get(r);
      if (labels) {
        for (const label of labels) {
          bannerOffset += BANNER_HEIGHT;
          bannerList.push({
            label,
            y: PADDING_TOP + r * ROW_GAP + bannerOffset - 40,
          });
        }
      }
      rowYOffset.set(r, bannerOffset);
    }

    // Compute unlocked set using prerequisites
    const unlockedSet = new Set<string>();
    levels.forEach((l) => {
      if (!l.prerequisites || l.prerequisites.length === 0) {
        unlockedSet.add(l.id);
        return;
      }
      if (l.prerequisites.every((p) => completed.has(p))) {
        unlockedSet.add(l.id);
      }
    });

    // Compute dynamic SVG width from widest row
    let maxNodesInRow = 1;
    for (const [, group] of rowGroups) {
      maxNodesInRow = Math.max(maxNodesInRow, group.length);
    }
    const svgWidth = Math.max(
      1000,
      maxNodesInRow * NODE_W + (maxNodesInRow - 1) * COL_GAP + 120,
    );
    const centerX = svgWidth / 2;

    // Build nodes with horizontal layout
    const nodeList: NodePos[] = [];
    for (const [row, group] of rowGroups) {
      const n = group.length;
      const totalW = n * NODE_W + (n - 1) * COL_GAP;
      const startX = centerX - totalW / 2 + NODE_W / 2;
      const extraY = rowYOffset.get(row) ?? 0;
      const y = PADDING_TOP + row * ROW_GAP + extraY;

      group.forEach((l, i) => {
        const x = startX + i * (NODE_W + COL_GAP);
        let status: NodePos['status'] = 'locked';
        if (completed.has(l.id)) status = 'completed';
        else if (unlockedSet.has(l.id)) status = 'unlocked';
        nodeList.push({ level: l, x, y, row, status });
      });
    }

    // Build edges from prerequisites
    const nodeMap = new Map<string, NodePos>();
    nodeList.forEach((n) => nodeMap.set(n.level.id, n));

    const edgeList: Edge[] = [];
    levels.forEach((l) => {
      const to = nodeMap.get(l.id);
      if (!to) return;
      (l.prerequisites ?? []).forEach((prereqId) => {
        const from = nodeMap.get(prereqId);
        if (!from) return;
        edgeList.push({
          x1: from.x,
          y1: from.y + NODE_H / 2,
          x2: to.x,
          y2: to.y - NODE_H / 2,
          completed: completed.has(prereqId),
          id: `${prereqId}-${l.id}`,
        });
      });
    });

    const maxY = Math.max(...nodeList.map((n) => n.y), 200);
    const h = maxY + NODE_H / 2 + 80;

    return {
      nodes: nodeList,
      edges: edgeList,
      banners: bannerList,
      svgHeight: h,
      svgWidth,
    };
  }, [completed]);

  const handleClick = useCallback(
    (node: NodePos) => {
      if (node.status !== 'locked') {
        navigate(`/play/${node.level.id}`);
      }
    },
    [navigate],
  );

  return (
    <div
      className="level-select-bg"
      style={{
        background: '#0f0f1a',
        minHeight: '100vh',
        color: '#e2e8f0',
        fontFamily:
          "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
        overflow: 'auto',
        position: 'relative',
      }}
    >
      {/* Home link */}
      <div
        style={{
          position: 'fixed',
          top: 12,
          left: 12,
          zIndex: 100,
          padding: '8px 16px',
          background: 'rgba(15, 15, 26, 0.85)',
          borderRadius: '6px',
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
        <svg
          width={svgWidth}
          height={svgHeight}
          style={{ display: 'block' }}
        >
          <defs>
            <filter
              id="glow-gold"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter
              id="glow-green"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
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
                x1={svgWidth / 2 - 200}
                y1={b.y + 10}
                x2={svgWidth / 2 + 200}
                y2={b.y + 10}
                stroke="#D4A843"
                strokeWidth={1}
                opacity={0.35}
              />
              <text
                x={svgWidth / 2}
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
                x1={svgWidth / 2 - 200}
                y1={b.y - 12}
                x2={svgWidth / 2 + 200}
                y2={b.y - 12}
                stroke="#D4A843"
                strokeWidth={1}
                opacity={0.35}
              />
            </g>
          ))}

          {/* Connection lines (bezier curves for DAG) */}
          {edges.map((e) => {
            const color = e.completed ? '#22c55e' : '#444';
            const pathId = `path-${e.id}`;
            const dy = (e.y2 - e.y1) * 0.4;
            const d = `M ${e.x1} ${e.y1} C ${e.x1} ${e.y1 + dy}, ${e.x2} ${e.y2 - dy}, ${e.x2} ${e.y2}`;
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
                <circle
                  r={3}
                  fill={e.completed ? '#22c55e' : '#888'}
                  opacity={0.8}
                >
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
                <rect
                  x={nx}
                  y={ny}
                  width={NODE_W}
                  height={NODE_H}
                  rx={8}
                  fill={bg}
                  stroke={border}
                  strokeWidth={2}
                  filter={
                    node.status === 'unlocked'
                      ? 'url(#glow-gold)'
                      : undefined
                  }
                />
                {icon && (
                  <text
                    x={nx + 14}
                    y={node.y + 1}
                    dominantBaseline="central"
                    fontSize={node.status === 'locked' ? 12 : 14}
                    fill={
                      node.status === 'completed' ? '#22c55e' : '#666'
                    }
                  >
                    {icon}
                  </text>
                )}
                <text
                  x={node.x}
                  y={node.y + 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={textColor}
                  fontSize={11}
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
