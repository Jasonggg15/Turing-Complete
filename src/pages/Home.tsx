import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Home() {
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        minHeight: '100vh',
        background: '#0f0f1a',
        color: '#e2e8f0',
        fontFamily: "'Courier New', Courier, monospace",
        paddingTop: '18vh',
      }}
    >
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div
          style={{
            fontSize: 'clamp(4rem, 8vw, 6rem)',
            fontWeight: 300,
            letterSpacing: '0.3em',
            color: '#e2e8f0',
            lineHeight: 1.1,
          }}
        >
          TURING
        </div>
        <div
          style={{
            fontSize: 'clamp(4rem, 8vw, 6rem)',
            fontWeight: 700,
            letterSpacing: '0.2em',
            color: '#D4A843',
            lineHeight: 1.1,
          }}
        >
          COMPLETE
        </div>
      </div>

      {/* Circuit-inspired AND gate logo */}
      <svg
        width="120"
        height="80"
        viewBox="0 0 120 80"
        fill="none"
        style={{ marginBottom: '48px' }}
      >
        {/* AND gate body — curved D-shape */}
        <path
          d="M20 10 L55 10 C85 10 95 40 95 40 C95 40 85 70 55 70 L20 70 L20 10 Z"
          stroke="#D4A843"
          strokeWidth="2"
          strokeOpacity="0.6"
          fill="none"
        />
        {/* Input line top */}
        <line
          x1="0"
          y1="28"
          x2="20"
          y2="28"
          stroke="#D4A843"
          strokeWidth="2"
          strokeOpacity="0.6"
        />
        {/* Input line bottom */}
        <line
          x1="0"
          y1="52"
          x2="20"
          y2="52"
          stroke="#D4A843"
          strokeWidth="2"
          strokeOpacity="0.6"
        />
        {/* Output line */}
        <line
          x1="95"
          y1="40"
          x2="120"
          y2="40"
          stroke="#D4A843"
          strokeWidth="2"
          strokeOpacity="0.6"
        />
      </svg>

      {/* Left-aligned menu */}
      <div
        style={{
          alignSelf: 'flex-start',
          paddingLeft: '80px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div
          onClick={() => navigate('/levels')}
          onMouseEnter={() => setHoveredItem('play')}
          onMouseLeave={() => setHoveredItem(null)}
          style={{
            fontSize: '1.3rem',
            color: hoveredItem === 'play' ? '#D4A843' : '#e2e8f0',
            cursor: 'pointer',
          }}
        >
          {'> play campaign'}
        </div>
        <div
          style={{
            fontSize: '1.3rem',
            color: '#4a4a6a',
            cursor: 'not-allowed',
          }}
        >
          {'> sandbox'}
        </div>
        <div
          style={{
            fontSize: '1.3rem',
            color: '#4a4a6a',
            cursor: 'not-allowed',
          }}
        >
          {'> options'}
        </div>
      </div>

      {/* Footer — center */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '0.8rem',
          color: '#4a4a6a',
        }}
      >
        Made by Jason, 石像 🗿 & OpenCode
      </div>

      {/* Footer — bottom-right version */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          right: '32px',
          fontSize: '0.8rem',
          color: '#4a4a6a',
        }}
      >
        v0.1.0 Alpha
      </div>
    </div>
  );
}
