// src/components/Navigation/BottomNav.tsx - UPDATED WITH NEW NAMING
import { THEME } from '../../theme';

type ScreenType = 'home' | 'send' | 'add' | 'receive' | 'pay' | 'scan' | 'cashAgent' | 'transactions' | 'settings' | 'profile' | 'menu' | 'more';

interface BottomNavProps {
  currentScreen: string;
  onNavigate: (screen: ScreenType) => void;
}

export default function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  const navItems = [
    { id: 'home', icon: '', label: 'Home', screen: 'home' as ScreenType },
    { id: 'scan', icon: '', label: 'Zwip.it', screen: 'scan' as ScreenType },
    { id: 'cash', icon: '', label: 'Cash', screen: 'cashAgent' as ScreenType },
    { id: 'more', icon: '', label: 'More', screen: 'more' as ScreenType }
  ];

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '16px 0',
      backgroundColor: THEME.card,
      borderRadius: '22px',
      border: `1px solid ${THEME.border}`,
      height: '74px',
      boxSizing: 'border-box',
      margin: '8px 0 20px 0',
      maxWidth: '400px',
      width: '100%'
    }}>
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.screen)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            color: currentScreen === item.screen ? THEME.green : '#8a8f8f',
            fontSize: '11px',
            fontWeight: '600',
            padding: '8px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'color 0.2s ease'
          }}
        >
          <span style={{ fontSize: '18px' }}>{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
