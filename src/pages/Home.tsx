import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#0f0f1a',
        color: '#e2e8f0',
        fontFamily: 'monospace',
      }}
    >
      <h1
        style={{
          fontSize: '3rem',
          marginBottom: '12px',
          background: 'linear-gradient(135deg, #6366f1, #22c55e)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Turing Complete
      </h1>
      <p
        style={{
          fontSize: '1.1rem',
          color: '#94a3b8',
          marginBottom: '40px',
          textAlign: 'center',
          maxWidth: '480px',
        }}
      >
        Build a computer from logic gates. Start with NAND and work your way up
        to complex circuits.
      </p>
      <button
        onClick={() => navigate('/levels')}
        style={{
          padding: '14px 40px',
          fontSize: '1.1rem',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          background: '#6366f1',
          color: '#e2e8f0',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'opacity 0.15s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
      >
        Start Building
      </button>
    </div>
  );
}
