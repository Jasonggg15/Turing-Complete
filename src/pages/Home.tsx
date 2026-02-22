import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import PcbLogo from './PcbLogo';

export default function Home() {
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div
      className="home-bg"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        minHeight: '100vh',
        background: '#0f0f1a',
        color: '#e2e8f0',
        fontFamily: "'Courier New', Courier, monospace",
        paddingTop: '8vh',
      }}
    >
      <div className="home-content" style={{ display: 'contents' }}>
        {/* PCB-style chip logo */}
        <PcbLogo />

        {/* Left-aligned menu */}
        <div
          style={{
            alignSelf: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div
            className="menu-item"
            onClick={() => navigate('/levels')}
            onMouseEnter={() => setHoveredItem('play')}
            onMouseLeave={() => setHoveredItem(null)}
            style={{
              fontSize: '1.3rem',
              color: hoveredItem === 'play' ? '#D4A843' : '#e2e8f0',
              cursor: 'pointer',
            }}
          >
            <span className="menu-item-arrow">▸</span>
            {'> play campaign'}
          </div>
          <div
            className="menu-item"
            style={{
              fontSize: '1.3rem',
              color: '#4a4a6a',
              cursor: 'not-allowed',
            }}
          >
            <span className="menu-item-arrow" style={{ visibility: 'hidden' }}>▸</span>
            {'> sandbox'}
          </div>
          <div
            className="menu-item"
            style={{
              fontSize: '1.3rem',
              color: '#4a4a6a',
              cursor: 'not-allowed',
            }}
          >
            <span className="menu-item-arrow" style={{ visibility: 'hidden' }}>▸</span>
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
            zIndex: 2,
          }}
        >
          Made by Jason & Moai🗿 · Powered by Claude Opus 4.6
        </div>

        {/* Footer — bottom-right version */}
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            right: '32px',
            fontSize: '0.8rem',
            color: '#4a4a6a',
            zIndex: 2,
          }}
        >
          v0.1.0 Alpha
        </div>
      </div>
    </div>
  );
}
