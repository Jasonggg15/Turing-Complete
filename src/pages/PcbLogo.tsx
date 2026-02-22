export default function PcbLogo() {
  const topPins = [190, 215, 240, 265, 335, 360, 385, 410];
  const bottomPins = [190, 215, 240, 265, 290, 310, 335, 360, 385, 410];
  const sidePins = [80, 105, 130, 155, 180];

  const vias: [number, number][] = [
    [70, 22], [100, 48], [500, 48], [530, 22],
    [70, 80], [530, 80],
    [45, 130], [555, 130],
    [70, 242], [530, 242],
    [90, 180], [510, 180],
    [90, 242], [510, 242],
    [285, 255], [315, 255],
  ];

  const extraVias: [number, number][] = [
    [240, 18], [360, 18],
    [115, 80], [485, 80],
    [240, 250], [360, 250],
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
      {/* Ground-plane crosshatch */}
      <rect
        x="13"
        y="13"
        width="574"
        height="254"
        rx="3"
        fill="url(#pcb-grid)"
      />
      {/* Inner copper border */}
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

      {/* ── Copper traces ── */}
      <g
        stroke="#D4A843"
        strokeWidth="1.5"
        fill="none"
        opacity="0.45"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Top fan-out */}
        <path d="M190 33 L190 22 L70 22 L70 80" />
        <path d="M215 33 L215 18 L100 18 L100 48" />
        <path d="M385 33 L385 18 L500 18 L500 48" />
        <path d="M410 33 L410 22 L530 22 L530 80" />
        {/* Top stubs */}
        <path d="M240 33 L240 18" />
        <path d="M265 33 L265 22" />
        <path d="M335 33 L335 22" />
        <path d="M360 33 L360 18" />

        {/* Bottom fan-out */}
        <path d="M190 222 L190 242 L70 242" />
        <path d="M410 222 L410 242 L530 242" />
        <path d="M240 222 L240 250" />
        <path d="M360 222 L360 250" />
        {/* Crystal oscillator routing */}
        <path d="M290 222 L290 245 L285 245 L285 255" />
        <path d="M310 222 L310 245 L315 245 L315 255" />

        {/* Left side traces */}
        <path d="M146 80 L70 80" />
        <path d="M146 105 L115 105 L115 80" />
        <path d="M146 130 L45 130" />
        <path d="M146 155 L100 155 L100 180" />
        <path d="M146 180 L90 180 L90 242" />

        {/* Right side traces */}
        <path d="M454 80 L530 80" />
        <path d="M454 105 L485 105 L485 80" />
        <path d="M454 130 L555 130" />
        <path d="M454 155 L500 155 L500 180" />
        <path d="M454 180 L510 180 L510 242" />

        {/* Extra board traces (decorative) */}
        <path d="M70 242 L70 260" />
        <path d="M530 242 L530 260" />
        <path d="M100 180 L100 200" />
        <path d="M500 180 L500 200" />
      </g>

      {/* ── Vias ── */}
      {vias.map(([cx, cy], i) => (
        <g key={`v${i}`} className={i % 4 === 0 ? 'pcb-via-pulse' : ''}>
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
      {extraVias.map(([cx, cy], i) => (
        <g key={`ev${i}`}>
          <circle
            cx={cx}
            cy={cy}
            r="3.5"
            fill="none"
            stroke="#D4A843"
            strokeWidth="1"
            opacity="0.25"
          />
          <circle cx={cx} cy={cy} r="1.2" fill="#080e08" />
        </g>
      ))}

      {/* ── SMD components (silkscreen) ── */}
      <g fill="none" strokeWidth="0.8">
        {/* R1 — top-left */}
        <rect x="88" y="42" width="18" height="7" rx="1" stroke="#2a4a2a" />
        <text
          x="97"
          y="38"
          textAnchor="middle"
          fill="#2a4a2a"
          fontSize="6"
          fontFamily="monospace"
        >
          R1
        </text>
        {/* R2 — top-right */}
        <rect x="494" y="42" width="18" height="7" rx="1" stroke="#2a4a2a" />
        <text
          x="503"
          y="38"
          textAnchor="middle"
          fill="#2a4a2a"
          fontSize="6"
          fontFamily="monospace"
        >
          R2
        </text>
        {/* C1 — left */}
        <rect x="36" y="125" width="10" height="8" rx="1" stroke="#2a4a2a" />
        <text
          x="41"
          y="121"
          textAnchor="middle"
          fill="#2a4a2a"
          fontSize="6"
          fontFamily="monospace"
        >
          C1
        </text>
        {/* C2 — right */}
        <rect
          x="550"
          y="125"
          width="10"
          height="8"
          rx="1"
          stroke="#2a4a2a"
        />
        <text
          x="555"
          y="121"
          textAnchor="middle"
          fill="#2a4a2a"
          fontSize="6"
          fontFamily="monospace"
        >
          C2
        </text>
        {/* R3 — bottom-left */}
        <rect x="58" y="255" width="18" height="7" rx="1" stroke="#2a4a2a" />
        <text
          x="67"
          y="252"
          textAnchor="middle"
          fill="#2a4a2a"
          fontSize="6"
          fontFamily="monospace"
        >
          R3
        </text>
        {/* R4 — bottom-right */}
        <rect
          x="520"
          y="255"
          width="18"
          height="7"
          rx="1"
          stroke="#2a4a2a"
        />
        <text
          x="529"
          y="252"
          textAnchor="middle"
          fill="#2a4a2a"
          fontSize="6"
          fontFamily="monospace"
        >
          R4
        </text>
        {/* Y1 — crystal oscillator (bottom center) */}
        <ellipse
          cx="300"
          cy="255"
          rx="18"
          ry="7"
          stroke="#2a4a2a"
          strokeWidth="0.8"
        />
        <text
          x="300"
          y="268"
          textAnchor="middle"
          fill="#2a4a2a"
          fontSize="6"
          fontFamily="monospace"
        >
          Y1 32.768kHz
        </text>
        {/* U2 — small IC, bottom-left area */}
        <rect
          x="95"
          y="192"
          width="16"
          height="12"
          rx="1"
          stroke="#2a4a2a"
        />
        <text
          x="103"
          y="189"
          textAnchor="middle"
          fill="#2a4a2a"
          fontSize="5"
          fontFamily="monospace"
        >
          U2
        </text>
        {/* U3 — small IC, bottom-right area */}
        <rect
          x="489"
          y="192"
          width="16"
          height="12"
          rx="1"
          stroke="#2a4a2a"
        />
        <text
          x="497"
          y="189"
          textAnchor="middle"
          fill="#2a4a2a"
          fontSize="5"
          fontFamily="monospace"
        >
          U3
        </text>
      </g>

      {/* ── Central IC chip (U1) ── */}
      <g className="pcb-chip">
        {/* Chip body */}
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

        {/* Die text — the logo */}
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

        {/* Part number / designation */}
        <text
          x="300"
          y="188"
          textAnchor="middle"
          fill="#3a5a3a"
          fontSize="7"
          fontFamily="monospace"
        >
          {`TC-01 \u00B7 QFP-28 \u00B7 REV.A`}
        </text>

        {/* Designation label */}
        <text
          x="186"
          y="195"
          fill="#3a5a3a"
          fontSize="5"
          fontFamily="monospace"
        >
          U1
        </text>
      </g>

      {/* ── Chip pins ── */}
      <g fill="#D4A843">
        {/* Top */}
        {topPins.map((x, i) => (
          <g key={`tp${i}`}>
            <rect x={x - 0.75} y={40} width={1.5} height={15} />
            <rect x={x - 3} y={33} width={6} height={8} rx={1} />
          </g>
        ))}
        {/* Bottom */}
        {bottomPins.map((x, i) => (
          <g key={`bp${i}`}>
            <rect x={x - 0.75} y={200} width={1.5} height={15} />
            <rect x={x - 3} y={214} width={6} height={8} rx={1} />
          </g>
        ))}
        {/* Left */}
        {sidePins.map((y, i) => (
          <g key={`lp${i}`}>
            <rect x={155} y={y - 0.75} width={15} height={1.5} />
            <rect x={146} y={y - 3} width={9} height={6} rx={1} />
          </g>
        ))}
        {/* Right */}
        {sidePins.map((y, i) => (
          <g key={`rp${i}`}>
            <rect x={430} y={y - 0.75} width={15} height={1.5} />
            <rect x={445} y={y - 3} width={9} height={6} rx={1} />
          </g>
        ))}
      </g>

      {/* ── Animated signal pulses ── */}
      <g filter="url(#signal-glow)">
        {/* Signal 1 — top-left to left-side */}
        <path
          className="pcb-signal pcb-signal-1"
          d="M190 33 L190 22 L70 22 L70 80"
          stroke="#22c55e"
          strokeWidth="2"
          fill="none"
          strokeDasharray="8 30"
          strokeLinecap="round"
        />
        {/* Signal 2 — top-right to right-side */}
        <path
          className="pcb-signal pcb-signal-2"
          d="M410 33 L410 22 L530 22 L530 80"
          stroke="#22c55e"
          strokeWidth="2"
          fill="none"
          strokeDasharray="8 30"
          strokeLinecap="round"
        />
        {/* Signal 3 — left horizontal to C1 */}
        <path
          className="pcb-signal pcb-signal-3"
          d="M146 130 L45 130"
          stroke="#D4A843"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="5 25"
          strokeLinecap="round"
          opacity="0.7"
        />
        {/* Signal 4 — right horizontal to C2 */}
        <path
          className="pcb-signal pcb-signal-4"
          d="M454 130 L555 130"
          stroke="#D4A843"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="5 25"
          strokeLinecap="round"
          opacity="0.7"
        />
        {/* Signal 5 — bottom to crystal */}
        <path
          className="pcb-signal pcb-signal-5"
          d="M290 222 L290 245 L285 245 L285 255"
          stroke="#22c55e"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="5 22"
          strokeLinecap="round"
        />
        {/* Signal 6 — left side down */}
        <path
          className="pcb-signal pcb-signal-6"
          d="M146 180 L90 180 L90 242"
          stroke="#22c55e"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="6 24"
          strokeLinecap="round"
          opacity="0.6"
        />
      </g>

      {/* ── Board markings ── */}
      <text
        x="50"
        y="267"
        fill="#1a3a1a"
        fontSize="7"
        fontFamily="monospace"
      >
        REV 1.0
      </text>
      <text
        x="550"
        y="267"
        textAnchor="end"
        fill="#1a3a1a"
        fontSize="7"
        fontFamily="monospace"
      >
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
