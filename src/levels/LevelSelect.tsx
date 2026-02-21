import { useNavigate } from 'react-router-dom';
import { levels } from './levels/index';
import { getCompletedLevels } from '../save/SaveManager';

export default function LevelSelect() {
  const navigate = useNavigate();
  const completed = getCompletedLevels();

  function isAvailable(levelId: string): boolean {
    if (levelId === '01-crude-awakening') return true;
    return levels.some(
      (l) =>
        completed.includes(l.id) &&
        l.unlocks !== undefined &&
        l.unlocks.includes(levelId),
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0f0f1a',
        color: '#e2e8f0',
        fontFamily: 'monospace',
        padding: '40px',
      }}
    >
      <h1
        style={{
          textAlign: 'center',
          marginBottom: '8px',
          fontSize: '2rem',
        }}
      >
        Select a Level
      </h1>
      <p
        style={{
          textAlign: 'center',
          color: '#94a3b8',
          marginBottom: '40px',
        }}
      >
        Complete levels to unlock new challenges
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '20px',
          maxWidth: '960px',
          margin: '0 auto',
        }}
      >
        {levels.map((level) => {
          const done = completed.includes(level.id);
          const available = isAvailable(level.id);
          const icon = done ? '✅' : available ? '🔓' : '🔒';

          return (
            <div
              key={level.id}
              onClick={() => available && navigate(`/play/${level.id}`)}
              style={{
                padding: '20px',
                background: '#1a1a2e',
                border: `1px solid ${done ? '#22c55e' : available ? '#4a4a6a' : '#2d2d44'}`,
                borderRadius: '10px',
                cursor: available ? 'pointer' : 'not-allowed',
                opacity: available ? 1 : 0.5,
                transition: 'border-color 0.15s, transform 0.1s',
              }}
              onMouseEnter={(e) => {
                if (available) e.currentTarget.style.borderColor = '#6366f1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = done
                  ? '#22c55e'
                  : available
                    ? '#4a4a6a'
                    : '#2d2d44';
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                }}
              >
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                  {level.name}
                </span>
                <span style={{ fontSize: '1.3rem' }}>{icon}</span>
              </div>
              <p
                style={{
                  fontSize: '0.85rem',
                  color: '#94a3b8',
                  margin: 0,
                  lineHeight: '1.4',
                }}
              >
                {level.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
