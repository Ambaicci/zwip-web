// src/components/UI/Header.tsx
import { THEME } from '../../theme';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  rightAction?: {
    icon: string;
    onClick: () => void;
  };
}

export default function Header({ title, onBack, rightAction }: HeaderProps) {
  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 0',
      marginBottom: '24px',
      width: '100%'
    }}>
      {/* Back Button */}
      <div style={{ minWidth: '60px' }}>
        {onBack && (
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: `1px solid ${THEME.green}40`,
              color: THEME.green,
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              padding: '8px 12px',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = THEME.green;
              e.currentTarget.style.color = THEME.black;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'none';
              e.currentTarget.style.color = THEME.green;
            }}
          >
             Back
          </button>
        )}
      </div>

      {/* Title */}
      <h1 style={{
        margin: 0,
        fontSize: '20px',
        fontWeight: 700,
        color: THEME.white,
        textAlign: 'center'
      }}>
        {title}
      </h1>

      {/* Right Action */}
      <div style={{ minWidth: '60px', display: 'flex', justifyContent: 'flex-end' }}>
        {rightAction && (
          <button
            onClick={rightAction.onClick}
            style={{
              background: 'none',
              border: `1px solid ${THEME.border}`,
              color: THEME.white,
              cursor: 'pointer',
              fontSize: '16px',
              padding: '8px',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = THEME.panel;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'none';
            }}
          >
            {rightAction.icon}
          </button>
        )}
      </div>
    </header>
  );
}
