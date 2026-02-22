export default function PcbLogo() {
  // Asymmetric pin counts: 4 left, 5 right
  const topPins = [195, 220, 250, 280, 325, 355, 380, 405];
  const bottomPins = [195, 230, 270, 310, 345, 370, 395, 420];
  const leftPins = [85, 115, 140, 170];
  const rightPins = [75, 100, 125, 150, 175];

  // Vias — clustered more on left (near NAND)
  const vias: [number, number][] = [
    // Left cluster (near NAND gate)
    [110, 88], [70, 48], [100, 42],
    [55, 175], [95, 205],
    // Bottom-left
    [75, 240], [160, 258],
    // Center-bottom (crystal area)
    [285, 252], [330, 248],
    // Right side (sparser)
    [530, 70], [510, 105], [545, 140],
    // Narrative trace path
    [490, 175], [395, 246],
  ];

  return (
    <svg
      className="pcb-logo"
      viewBox="0 0 600 280"
      fill="none"
      style={{ width: '100%', maxWidth: 780, marginBottom: 40 }}
    >
      <defs>
        <filter id="signal-glow">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <pattern
          id="pcb-grid"
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M0 0L8 8M8 0L0 8"
            stroke="rgba(212,168,67,0.018)"
            strokeWidth="0.3"
          />
        </pattern>
      </defs>

      {/* ── Board substrate ── */}
      <rect
        x="6"
        y="6"
        width="588"
        height="268"
        rx="6"
        fill="#080e08"
        stroke="#1a3a1a"
        strokeWidth="2"
      />
      <rect
        x="13"
        y="13"
        width="574"
        height="254"
        rx="3"
        fill="url(#pcb-grid)"
      />
      <rect
        x="13"
        y="13"
        width="574"
        height="254"
        rx="3"
        fill="none"
        stroke="rgba(212,168,67,0.05)"
        strokeWidth="0.5"
      />

      {/* ── Mounting holes ── */}
      {(
        [
          [28, 28],
          [572, 28],
          [28, 252],
          [572, 252],
        ] as [number, number][]
      ).map(([cx, cy], i) => (
        <g key={`mh${i}`}>
          <circle
            cx={cx}
            cy={cy}
            r="7"
            fill="none"
            stroke="rgba(212,168,67,0.12)"
            strokeWidth="2"
          />
          <circle cx={cx} cy={cy} r="3.5" fill="#050a05" />
        </g>
      ))}

      {/* ── NAND Gate silkscreen (left — tribute to first level) ── */}
      <g>
        {/* D-shape AND body + negation bubble = NAND */}
        <path
          d="M52 112 L78 112 A28 28 0 0 1 78 168 L52 168 Z"
          fill="none"
          stroke="#3a6a3a"
          strokeWidth="1.2"
        />
        {/* Negation bubble at output */}
        <circle
          cx="110"
          cy="140"
          r="4"
          fill="none"
          stroke="#3a6a3a"
          strokeWidth="1.2"
        />
        {/* Input lines */}
        <line x1="38" y1="127" x2="52" y2="127" stroke="#3a6a3a" strokeWidth="1.2" />
        <line x1="38" y1="153" x2="52" y2="153" stroke="#3a6a3a" strokeWidth="1.2" />
        {/* Output line */}
        <line x1="114" y1="140" x2="135" y2="140" stroke="#3a6a3a" strokeWidth="1.2" />
        {/* Label */}
        <text
          x="72"
          y="182"
          textAnchor="middle"
          fill="#2a5a2a"
          fontSize="8"
          fontFamily="monospace"
          fontWeight="bold"
        >
          NAND
        </text>
        {/* Solder pad dots at connections */}
        <circle cx="38" cy="127" r="2" fill="#D4A843" opacity="0.3" />
        <circle cx="38" cy="153" r="2" fill="#D4A843" opacity="0.3" />
        <circle cx="135" cy="140" r="2.5" fill="#D4A843" opacity="0.35" />
      </g>

      {/* ── Copper traces (asymmetric routing) ── */}
      <g
        stroke="#D4A843"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* === VCC power rail — left edge (wide trace) === */}
        <path d="M22 20 L22 260" strokeWidth="2.5" opacity="0.25" />

        {/* === NAND input traces === */}
        <path d="M22 127 L38 127" strokeWidth="1.2" opacity="0.4" />
        <path d="M38 175 L38 153" strokeWidth="1.2" opacity="0.4" />

        {/* === Narrative trace: NAND output → Chip left pin === */}
        <path d="M135 140 L146 140" strokeWidth="1.8" opacity="0.5" />

        {/* === Top fan-out (left-heavy) === */}
        <path d="M195 33 L195 20 L70 20 L70 48" strokeWidth="1.5" opacity="0.45" />
        <path d="M220 33 L220 18 L100 18 L100 42" strokeWidth="1.5" opacity="0.45" />
        <path d="M250 33 L250 22" strokeWidth="1.5" opacity="0.45" />
        {/* Right side — sparser, one long run */}
        <path d="M380 33 L380 20 L530 20 L530 70" strokeWidth="1.5" opacity="0.45" />
        <path d="M405 33 L405 24" strokeWidth="1.5" opacity="0.45" />

        {/* === Left side traces (dense, near NAND) === */}
        <path d="M146 85 L110 85 L110 88" strokeWidth="1.5" opacity="0.45" />
        <path d="M146 115 L115 115 L115 88" strokeWidth="1.5" opacity="0.45" />
        {/* Curved trace to lower via */}
        <path
          d="M146 170 L125 170 Q120 170 120 180 L120 200"
          strokeWidth="1.2"
          opacity="0.35"
        />

        {/* === Right side traces (sparser, some to CPU area) === */}
        <path d="M454 75 L530 75 L530 70" strokeWidth="1.5" opacity="0.45" />
        <path d="M454 100 L510 100 L510 105" strokeWidth="1.5" opacity="0.45" />
        <path d="M454 125 L545 125 L545 140" strokeWidth="1.5" opacity="0.45" />
        <path d="M454 150 L490 150 L490 175" strokeWidth="1.2" opacity="0.4" />
        <path d="M454 175 L465 175 L465 188" strokeWidth="1.5" opacity="0.45" />

        {/* === Bus traces: Chip bottom → CPU bottom pins (routed under CPU) === */}
        <path
          d="M345 222 L345 260 L485 260 L485 257"
          strokeWidth="1.8"
          opacity="0.5"
        />
        <path
          d="M370 222 L370 263 L510 263 L510 257"
          strokeWidth="1.5"
          opacity="0.45"
        />
        <path
          d="M395 222 L395 266 L540 266 L540 257"
          strokeWidth="1.5"
          opacity="0.45"
        />

        {/* === Bottom traces (asymmetric) === */}
        <path d="M195 222 L195 240 L75 240" strokeWidth="1.5" opacity="0.45" />
        <path d="M230 222 L230 252" strokeWidth="1.2" opacity="0.4" />
        {/* Crystal oscillator routing (left of center) */}
        <path d="M270 222 L270 248 L265 248 L265 258" strokeWidth="1.2" opacity="0.4" />
        <path d="M310 222 L310 248 L315 248 L315 258" strokeWidth="1.2" opacity="0.4" />

        {/* === CPU bottom stubs === */}
        <path d="M485 257 L485 265" strokeWidth="1" opacity="0.3" />
        <path d="M540 257 L540 265 L548 265" strokeWidth="1" opacity="0.3" />

        {/* === GND rail — right edge (shorter than VCC) === */}
        <path d="M575 180 L575 260" strokeWidth="2" opacity="0.2" />

        {/* === Decorative stubs === */}
        <path d="M75 240 L75 258" strokeWidth="1" opacity="0.3" />
        <path d="M120 200 L95 200 L95 205" strokeWidth="1" opacity="0.3" />
      </g>

      {/* ── Vias ── */}
      {vias.map(([cx, cy], i) => (
        <g key={`v${i}`} className={i % 5 === 0 ? 'pcb-via-pulse' : ''}>
          <circle
            cx={cx}
            cy={cy}
            r="4.5"
            fill="none"
            stroke="#D4A843"
            strokeWidth="1.5"
            opacity="0.4"
          />
          <circle
            cx={cx}
            cy={cy}
            r="1.5"
            fill="#080e08"
            stroke="#D4A843"
            strokeWidth="0.5"
            opacity="0.3"
          />
        </g>
      ))}

      {/* ── CPU Block (bottom-right — game's ultimate goal) ── */}
      <g>
        <rect
          x="472"
          y="195"
          width="90"
          height="55"
          rx="3"
          fill="#0a0a1e"
          stroke="#4a4a6a"
          strokeWidth="1.2"
        />
        {/* Pin-1 dot */}
        <circle cx="480" cy="203" r="2" fill="#D4A843" opacity="0.2" />
        {/* Die text */}
        <text
          x="517"
          y="220"
          textAnchor="middle"
          fill="#6366f1"
          fontSize="14"
          fontWeight="bold"
          fontFamily="'Courier New', monospace"
          letterSpacing="2"
        >
          CPU
        </text>
        <text
          x="517"
          y="236"
          textAnchor="middle"
          fill="#3a4a6a"
          fontSize="6"
          fontFamily="monospace"
        >
          {`ALU \u00B7 REG \u00B7 CTL`}
        </text>
        {/* Top pins */}
        {[485, 505, 525, 548].map((x, i) => (
          <rect
            key={`ct${i}`}
            x={x - 2}
            y={188}
            width={4}
            height={7}
            fill="#D4A843"
            rx={0.5}
          />
        ))}
        {/* Bottom pins */}
        {[485, 510, 540].map((x, i) => (
          <rect
            key={`cb${i}`}
            x={x - 2}
            y={250}
            width={4}
            height={7}
            fill="#D4A843"
            rx={0.5}
          />
        ))}
      </g>

      {/* ── SMD components (left-heavy distribution) ── */}
      <g fill="none" strokeWidth="0.8">
        {/* R1 — near NAND (top-left) */}
        <rect x="88" y="42" width="18" height="7" rx="1" stroke="#2a4a2a" />
        <text x="97" y="38" textAnchor="middle" fill="#2a4a2a" fontSize="6" fontFamily="monospace">
          R1
        </text>
        {/* R2 — below NAND */}
        <rect x="50" y="190" width="18" height="7" rx="1" stroke="#2a4a2a" />
        <text x="59" y="187" textAnchor="middle" fill="#2a4a2a" fontSize="6" fontFamily="monospace">
          R2
        </text>
        {/* C1 — left of NAND inputs */}
        <rect x="25" y="95" width="10" height="8" rx="1" stroke="#2a4a2a" />
        <text x="30" y="92" textAnchor="middle" fill="#2a4a2a" fontSize="6" fontFamily="monospace">
          C1
        </text>
        {/* C2 — left of CPU */}
        <rect x="455" y="210" width="10" height="8" rx="1" stroke="#2a4a2a" />
        <text x="460" y="207" textAnchor="middle" fill="#2a4a2a" fontSize="6" fontFamily="monospace">
          C2
        </text>
        {/* R3 — right side */}
        <rect x="535" y="118" width="18" height="7" rx="1" stroke="#2a4a2a" />
        <text x="544" y="115" textAnchor="middle" fill="#2a4a2a" fontSize="6" fontFamily="monospace">
          R3
        </text>
        {/* Y1 — crystal oscillator (slightly left of center) */}
        <ellipse cx="290" cy="258" rx="18" ry="7" stroke="#2a4a2a" strokeWidth="0.8" />
        <text x="290" y="271" textAnchor="middle" fill="#2a4a2a" fontSize="6" fontFamily="monospace">
          Y1 32.768kHz
        </text>
        {/* U2 — small IC, near NAND area */}
        <rect x="115" y="162" width="16" height="12" rx="1" stroke="#2a4a2a" />
        <text x="123" y="159" textAnchor="middle" fill="#2a4a2a" fontSize="5" fontFamily="monospace">
          U2
        </text>
        {/* D1 — LED indicator near CPU */}
        <polygon points="497,258 503,258 500,265" fill="none" stroke="#2a4a2a" strokeWidth="0.8" />
        <line x1="497" y1="265" x2="503" y2="265" stroke="#2a4a2a" strokeWidth="0.8" />
        <text x="500" y="255" textAnchor="middle" fill="#2a4a2a" fontSize="5" fontFamily="monospace">
          D1
        </text>
      </g>

      {/* ── Central IC chip (U1) ── */}
      <g className="pcb-chip">
        <rect
          x="170"
          y="55"
          width="260"
          height="145"
          rx="3"
          fill="#12122a"
          stroke="#4a4a6a"
          strokeWidth="1.5"
        />
        {/* Notch */}
        <path
          d="M292 55 A8 8 0 0 0 308 55"
          fill="#080e08"
          stroke="#4a4a6a"
          strokeWidth="1"
        />
        {/* Pin 1 marker */}
        <circle cx="185" cy="70" r="2.5" fill="#D4A843" opacity="0.25" />

        {/* Die text */}
        <text
          x="300"
          y="115"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="30"
          fontWeight="300"
          letterSpacing="8"
          fontFamily="'Courier New', monospace"
        >
          TURING
        </text>
        <text
          x="300"
          y="152"
          textAnchor="middle"
          fill="#D4A843"
          fontSize="28"
          fontWeight="700"
          letterSpacing="5"
          fontFamily="'Courier New', monospace"
        >
          COMPLETE
        </text>

        <text
          x="300"
          y="188"
          textAnchor="middle"
          fill="#3a5a3a"
          fontSize="7"
          fontFamily="monospace"
        >
          {`TC-01 \u00B7 QFP-25 \u00B7 REV.B`}
        </text>
        <text x="186" y="195" fill="#3a5a3a" fontSize="5" fontFamily="monospace">
          U1
        </text>
      </g>

      {/* ── Chip pins (asymmetric: 4 left, 5 right) ── */}
      <g fill="#D4A843">
        {/* Top — 8 pins */}
        {topPins.map((x, i) => (
          <g key={`tp${i}`}>
            <rect x={x - 0.75} y={40} width={1.5} height={15} />
            <rect x={x - 3} y={33} width={6} height={8} rx={1} />
          </g>
        ))}
        {/* Bottom — 8 pins */}
        {bottomPins.map((x, i) => (
          <g key={`bp${i}`}>
            <rect x={x - 0.75} y={200} width={1.5} height={15} />
            <rect x={x - 3} y={214} width={6} height={8} rx={1} />
          </g>
        ))}
        {/* Left — 4 pins */}
        {leftPins.map((y, i) => (
          <g key={`lp${i}`}>
            <rect x={155} y={y - 0.75} width={15} height={1.5} />
            <rect x={146} y={y - 3} width={9} height={6} rx={1} />
          </g>
        ))}
        {/* Right — 5 pins */}
        {rightPins.map((y, i) => (
          <g key={`rp${i}`}>
            <rect x={430} y={y - 0.75} width={15} height={1.5} />
            <rect x={445} y={y - 3} width={9} height={6} rx={1} />
          </g>
        ))}
      </g>

      {/* ── Animated signal pulses (NAND → CPU direction) ── */}
      <g filter="url(#signal-glow)">
        {/* Signal 1 — NAND output → chip left pin (fast, short) */}
        <path
          className="pcb-signal pcb-signal-1"
          d="M114 140 L146 140"
          stroke="#22c55e"
          strokeWidth="2.5"
          fill="none"
          strokeDasharray="8 30"
          strokeLinecap="round"
        />
        {/* Signal 2 — Chip bottom → CPU bus trace 1 (main narrative) */}
        <path
          className="pcb-signal pcb-signal-2"
          d="M345 222 L345 260 L485 260 L485 257"
          stroke="#22c55e"
          strokeWidth="2"
          fill="none"
          strokeDasharray="10 60"
          strokeLinecap="round"
        />
        {/* Signal 3 — Chip bottom → CPU bus trace 2 */}
        <path
          className="pcb-signal pcb-signal-3"
          d="M370 222 L370 263 L510 263 L510 257"
          stroke="#22c55e"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="10 60"
          strokeLinecap="round"
          opacity="0.7"
        />
        {/* Signal 4 — Top-left fan-out */}
        <path
          className="pcb-signal pcb-signal-4"
          d="M195 33 L195 20 L70 20 L70 48"
          stroke="#D4A843"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="8 30"
          strokeLinecap="round"
          opacity="0.7"
        />
        {/* Signal 5 — NAND input pulse (from VCC rail) */}
        <path
          className="pcb-signal pcb-signal-5"
          d="M22 127 L38 127"
          stroke="#22c55e"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="5 22"
          strokeLinecap="round"
        />
        {/* Signal 6 — Chip bottom → CPU bus trace 3 */}
        <path
          className="pcb-signal pcb-signal-6"
          d="M395 222 L395 266 L540 266 L540 257"
          stroke="#22c55e"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="10 60"
          strokeLinecap="round"
          opacity="0.6"
        />
        {/* Signal 7 — Top fan-out 2 */}
        <path
          className="pcb-signal pcb-signal-7"
          d="M220 33 L220 18 L100 18 L100 42"
          stroke="#D4A843"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="8 30"
          strokeLinecap="round"
          opacity="0.6"
        />
        {/* Signal 8 — Right long run to via */}
        <path
          className="pcb-signal pcb-signal-8"
          d="M380 33 L380 20 L530 20 L530 70"
          stroke="#D4A843"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="8 30"
          strokeLinecap="round"
          opacity="0.6"
        />
        {/* Signal 9 — Right side to CPU area */}
        <path
          className="pcb-signal pcb-signal-9"
          d="M454 125 L545 125 L545 140"
          stroke="#22c55e"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="8 30"
          strokeLinecap="round"
          opacity="0.6"
        />
        {/* Signal 10 — NAND input 2 */}
        <path
          className="pcb-signal pcb-signal-10"
          d="M38 175 L38 153"
          stroke="#22c55e"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="5 22"
          strokeLinecap="round"
          opacity="0.7"
        />
        {/* Signal 11 — Left chip trace */}
        <path
          className="pcb-signal pcb-signal-11"
          d="M146 85 L110 85 L110 88"
          stroke="#D4A843"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="8 30"
          strokeLinecap="round"
          opacity="0.6"
        />
        {/* Signal 12 — Bottom left routing */}
        <path
          className="pcb-signal pcb-signal-12"
          d="M195 222 L195 240 L75 240"
          stroke="#D4A843"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="8 30"
          strokeLinecap="round"
          opacity="0.6"
        />
      </g>

      {/* ── Board markings ── */}
      <text x="16" y="18" fill="#1a3a1a" fontSize="4" fontFamily="monospace">
        VCC
      </text>
      <text x="569" y="178" fill="#1a3a1a" fontSize="4" fontFamily="monospace" textAnchor="end">
        GND
      </text>
      <text x="50" y="267" fill="#1a3a1a" fontSize="7" fontFamily="monospace">
        REV 2.0
      </text>
      <text x="550" y="267" textAnchor="end" fill="#1a3a1a" fontSize="7" fontFamily="monospace">
        PCB-TC-001
      </text>

      {/* Board edge fiducials */}
      {(
        [
          [50, 20],
          [550, 20],
          [50, 262],
          [550, 262],
        ] as [number, number][]
      ).map(([cx, cy], i) => (
        <g key={`fid${i}`}>
          <circle
            cx={cx}
            cy={cy}
            r="2.5"
            fill="none"
            stroke="#1a3a1a"
            strokeWidth="0.5"
          />
          <circle cx={cx} cy={cy} r="0.8" fill="#1a3a1a" />
        </g>
      ))}
    </svg>
  );
}
