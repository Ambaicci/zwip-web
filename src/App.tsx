// src/App.tsx - PROFESSIONAL CLEAN VERSION: No animations, lowercase balance, clean design
import { useEffect, useState, Suspense } from 'react';
import { useStore } from './store/useStore';
import {
  SendMoney,
  Recharge,
  ReceiveMoney,
  Pay,
  ScanQR,
  CashAtAgent,
  Transactions,
  Settings,
  Profile,
  MoreServices
} from './utils/lazyLoad';
import BottomNav from './components/Navigation/BottomNav';
import { THEME } from './theme';
import './App.css';

type ScreenType =
  | 'home'
  | 'send'
  | 'add'
  | 'receive'
  | 'pay'
  | 'scan'
  | 'cashAgent'
  | 'transactions'
  | 'settings'
  | 'profile'
  | 'menu'
  | 'more';

const TRANSITION_FAST = 'all 160ms cubic-bezier(0.22, 1, 0.36, 1)';
const TRANSITION_MED = 'all 320ms cubic-bezier(0.22, 1, 0.36, 1)';
const BLUR_GLASS = 'blur(18px)';
const CARD_SHADOW = '0 8px 28px rgba(0,0,0,0.45)';

function LoadingFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 200,
        color: THEME.muted,
        fontSize: 14,
        fontWeight: 600
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          border: '3px solid ' + THEME.border,
          borderTop: '3px solid ' + THEME.green,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginRight: 12
        }}
      />
      Loading...
    </div>
  );
}

function App() {
  const { balance, balanceIsVisible, showBalance, hideBalance } = useStore();
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleBalanceToggle = () => {
    if (!balanceIsVisible) {
      setShowPasscodeModal(true);
    } else {
      hideBalance();
    }
  };

  const handlePasscodeSubmit = (passcode: string) => {
    if (passcode === '1234') {
      showBalance();
      setShowPasscodeModal(false);
    } else {
      alert('Incorrect passcode');
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen
            balanceHidden={!balanceIsVisible}
            onBalanceToggle={handleBalanceToggle}
            setCurrentScreen={setCurrentScreen}
            balance={balance}
            mounted={mounted}
          />
        );
      case 'send':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <SendMoney setCurrentScreen={setCurrentScreen as any} />
          </Suspense>
        );
      case 'add':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <Recharge setCurrentScreen={setCurrentScreen as any} />
          </Suspense>
        );
      case 'receive':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <ReceiveMoney setCurrentScreen={setCurrentScreen as any} />
          </Suspense>
        );
      case 'pay':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <Pay setCurrentScreen={setCurrentScreen as any} />
          </Suspense>
        );
      case 'scan':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <ScanQR setCurrentScreen={setCurrentScreen as any} />
          </Suspense>
        );
      case 'cashAgent':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <CashAtAgent setCurrentScreen={setCurrentScreen as any} />
          </Suspense>
        );
      case 'transactions':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <Transactions setCurrentScreen={setCurrentScreen as any} />
          </Suspense>
        );
      case 'settings':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <Settings setCurrentScreen={setCurrentScreen as any} />
          </Suspense>
        );
      case 'profile':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <Profile setCurrentScreen={setCurrentScreen as any} />
          </Suspense>
        );
      case 'more':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <MoreServices setCurrentScreen={setCurrentScreen as any} />
          </Suspense>
        );
      case 'menu':
        return <MenuScreen setCurrentScreen={setCurrentScreen as any} />;
      default:
        return (
          <HomeScreen
            balanceHidden={!balanceIsVisible}
            onBalanceToggle={handleBalanceToggle}
            setCurrentScreen={setCurrentScreen}
            balance={balance}
            mounted={mounted}
          />
        );
    }
  };

  const showBottomNav = ['home', 'menu', 'scan', 'cashAgent', 'more'].includes(currentScreen);

  return (
    <div
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
        backgroundColor: THEME.black,
        minHeight: '100vh',
        color: THEME.white,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0 20px',
        position: 'relative',
        background: 'linear-gradient(135deg, #000000 0%, #071010 50%, #000000 100%)',     
        transition: TRANSITION_MED
      }}
    >
      <div
        style={{
          flex: 1,
          maxWidth: 400,
          width: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: 16
        }}
      >
        {renderScreen()}
      </div>

      {showBottomNav && <BottomNav currentScreen={currentScreen} onNavigate={setCurrentScreen} />}

      {showPasscodeModal && (
        <PasscodeModal onClose={() => setShowPasscodeModal(false)} onSubmit={handlePasscodeSubmit} />
      )}

      <style>{'@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } @keyframes pulse { 0% { opacity: 1 } 50% { opacity: 0.55 } 100% { opacity: 1 } }'}</style>
    </div>
  );
}

/* -----------------------------
   PROFESSIONAL HOMESCREEN: Stable, clean, no animations
   -----------------------------*/
function HomeScreen({ balanceHidden, onBalanceToggle, setCurrentScreen, balance, mounted }: any) {
  return (
    <div style={{ flex: 1, paddingTop: 6 }}>
      {/* Clean header without "Digital Wallet" */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 28,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(6px)',
          transition: TRANSITION_MED
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 32,
              fontWeight: 800,
              color: THEME.white,
              letterSpacing: '-0.5px',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #E9F2EE 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Zwip
          </h1>
        </div>

        <button
          onClick={() => setCurrentScreen('menu')}
          aria-label="Menu"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            color: THEME.white,
            cursor: 'pointer',
            fontSize: 16,
            padding: 12,
            borderRadius: 12,
            transition: TRANSITION_FAST,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: BLUR_GLASS,
            boxShadow: '0 6px 24px rgba(0,0,0,0.45)'
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = THEME.green;        
            (e.currentTarget as HTMLButtonElement).style.color = THEME.black;
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.04)';       
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.03)';
            (e.currentTarget as HTMLButtonElement).style.color = THEME.white;
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ width: 18, height: 2, backgroundColor: 'currentColor', borderRadius: 1 }} />
            <div style={{ width: 18, height: 2, backgroundColor: 'currentColor', borderRadius: 1 }} />
            <div style={{ width: 18, height: 2, backgroundColor: 'currentColor', borderRadius: 1 }} />
          </div>
        </button>
      </div>

      {/* STABLE BALANCE CARD: No mouse movement effects, lowercase label */}
      <div
        style={{
          position: 'relative',
          marginBottom: 28,
          borderRadius: 22,
          overflow: 'hidden',
          boxShadow: CARD_SHADOW,
          transition: TRANSITION_MED,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(10px)'
        }}
      >
        {/* Clean background - NO GLOW effects */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(11,11,11,0.9) 0%, rgba(6,46,38,0.8) 100%)',
            backdropFilter: BLUR_GLASS,
            WebkitBackdropFilter: BLUR_GLASS,
            pointerEvents: 'none'
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            padding: 24,
            border: '1px solid rgba(255,255,255,0.06)'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: 18
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 12,
                  color: THEME.muted,
                  fontWeight: 600,
                  marginBottom: 6,
                  letterSpacing: 0.6
                }}
              >
                available balance
              </div>

              <div
                style={{
                  fontSize: 36,
                  fontWeight: 700,
                  color: THEME.white,
                  letterSpacing: '-0.8px',
                  transition: 'opacity 300ms ease'
                }}
              >
                {balanceHidden
                  ? ''
                  : '$' + Number(balance).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
              </div>
            </div>

            {/* Balance toggle on the right */}
            <BalanceSwitch isOn={!balanceHidden} onToggle={onBalanceToggle} />        
          </div>

          <div
            style={{
              fontSize: 11,
              color: THEME.muted,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontWeight: 500
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: THEME.green
              }}
            />
            {balanceHidden ? 'Balance hidden for security' : 'Live  Updated just now'}   
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
        <QuickAction icon={<IconArrowUp />} label="Send" onClick={() => setCurrentScreen('send')} />
        <QuickAction icon={<IconArrowDown />} label="Receive" onClick={() => setCurrentScreen('receive')} />
        <QuickAction icon={<IconCard />} label="Pay" onClick={() => setCurrentScreen('pay')} />
        <QuickAction icon={<IconBolt />} label="Recharge" onClick={() => setCurrentScreen('add')} />
      </div>

      {/* Professional transactions section */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.9) 0%, rgba(6, 46, 38, 0.3) 100%)',
          padding: '24px',
          borderRadius: '24px',
          border: '1px solid rgba(0, 103, 79, 0.3)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(0, 103, 79, 0.15)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, #00674F 0%, #008F6B 50%, #00674F 100%)'
        }}></div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          position: 'relative',
          zIndex: 1
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: 700,
            color: THEME.white,
            letterSpacing: '-0.3px'
          }}>
            My Transactions
          </h2>
          <button
            onClick={() => setCurrentScreen('transactions')}
            style={{
              background: 'rgba(0, 103, 79, 0.2)',
              border: '1px solid rgba(0, 103, 79, 0.4)',
              color: THEME.green,
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '8px 16px',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              letterSpacing: '0.3px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = THEME.green;
              e.currentTarget.style.color = THEME.black;
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0, 103, 79, 0.2)';
              e.currentTarget.style.color = THEME.green;
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            view all
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative', zIndex: 1 }}>
          <TransactionItem
            type="received"
            name="Sarah Wilson"
            amount={50.00}
            date="Today, 14:30"
          />
          <TransactionItem
            type="sent"
            name="Coffee Shop"
            amount={8.50}
            date="Today, 12:15"
          />
          <TransactionItem
            type="received"
            name="Mike Johnson"
            amount={100.00}
            date="Yesterday, 16:45"
          />
        </div>
      </div>
    </div>
  );
}

/* -----------------------------
   BalanceSwitch (clean professional version)
   -----------------------------*/
function BalanceSwitch({ isOn, onToggle }: { isOn: boolean; onToggle: () => void }) {     
  return (
    <div
      role="switch"
      aria-checked={isOn}
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onToggle();
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        flexShrink: 0
      }}
    >
      <div
        aria-hidden
        style={{
          width: 48,
          height: 28,
          borderRadius: 16,
          backgroundColor: isOn ? THEME.green : 'rgba(255,255,255,0.08)',
          padding: 3,
          display: 'flex',
          alignItems: 'center',
          boxShadow: isOn ? '0 8px 22px rgba(0,167,112,0.14)' : '0 6px 16px rgba(0,0,0,0.45)',
          transition: 'background 260ms cubic-bezier(0.4,0,0.2,1), box-shadow 260ms'      
        }}
      >
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: 11,
            backgroundColor: THEME.white,
            transform: isOn ? 'translateX(20px)' : 'translateX(0)',
            transition: 'transform 260ms cubic-bezier(0.4,0,0.2,1)',
            boxShadow: '0 3px 9px rgba(0,0,0,0.28)'
          }}
        />
      </div>
    </div>
  );
}

/* -----------------------------
   Other components (unchanged)
   -----------------------------*/

function QuickAction({ icon, label, onClick }: any) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        padding: '18px 8px',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.04)',
        borderRadius: 14,
        color: THEME.white,
        cursor: 'pointer',
        transition: TRANSITION_FAST,
        minHeight: 90,
        backdropFilter: BLUR_GLASS,
        boxShadow: '0 8px 20px rgba(0,0,0,0.45)'
      }}
      onMouseEnter={(e) => {
        const t = e.currentTarget as HTMLButtonElement;
        t.style.background = THEME.green;
        t.style.color = THEME.black;
        t.style.transform = 'translateY(-6px) scale(1.03)';
        t.style.boxShadow = '0 20px 50px rgba(0,103,79,0.18)';
        (t.style as any).borderColor = THEME.green;
      }}
      onMouseLeave={(e) => {
        const t = e.currentTarget as HTMLButtonElement;
        t.style.background = 'rgba(255,255,255,0.02)';
        t.style.color = THEME.white;
        t.style.transform = 'translateY(0) scale(1)';
        t.style.boxShadow = '0 8px 20px rgba(0,0,0,0.45)';
        (t.style as any).borderColor = 'rgba(255,255,255,0.04)';
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 22,
          fontWeight: 700,
          transition: TRANSITION_FAST,
          filter: 'drop-shadow(0 6px 18px rgba(0,0,0,0.45))'
        }}
      >
        {icon}
      </div>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.3 }}>{label}</div>    
    </button>
  );
}

function TransactionItem({ type, name, amount, date }: any) {
  const isReceived = type === 'received';
  return (
    <div
      role="button"
      tabIndex={0}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: 14,
        background: 'rgba(255,255,255,0.02)',
        borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.04)',
        transition: TRANSITION_FAST,
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.background = 'rgba(255,255,255,0.06)';
        el.style.transform = 'translateX(6px)';
        (el.style as any).borderColor = 'rgba(255,255,255,0.09)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.background = 'rgba(255,255,255,0.02)';
        el.style.transform = 'translateX(0)';
        (el.style as any).borderColor = 'rgba(255,255,255,0.04)';
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          background: isReceived
            ? 'linear-gradient(135deg, rgba(40,167,69,0.12) 0%, rgba(30,126,52,0.06) 100%)'
            : 'linear-gradient(135deg, rgba(220,38,38,0.12) 0%, rgba(197,48,48,0.06) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
          fontWeight: 700,
          color: isReceived ? '#28A745' : '#DC2626',
          border: '1px solid ' + (isReceived ? 'rgba(40,167,69,0.18)' : 'rgba(220,38,38,0.18)'),
          boxShadow: '0 6px 18px rgba(0,0,0,0.35)'
        }}
      >
        {isReceived ? '' : ''}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: THEME.white, marginBottom: 4 }}>{name}</div>
        <div style={{ fontSize: 11, color: THEME.muted, fontWeight: 500 }}>{date}</div>   
      </div>

      <div style={{ fontSize: 14, fontWeight: 700, color: isReceived ? '#28A745' : THEME.white }}>
        {(isReceived ? '+' : '-') + '$' + amount.toFixed(2)}
      </div>
    </div>
  );
}

function PasscodeModal({ onClose, onSubmit }: any) {
  const [passcode, setPasscode] = useState('');

  useEffect(() => {
    if (passcode.length === 4) {
      const t = setTimeout(() => {
        onSubmit(passcode);
        setPasscode('');
      }, 140);
      return () => clearTimeout(t);
    }
    return;
  }, [passcode, onSubmit]);

  const handleNumberClick = (num: string) => {
    setPasscode((p) => (p.length < 4 ? p + num : p));
  };

  const handleBackspace = () => setPasscode((p) => p.slice(0, -1));

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, padding: 20 }}>  
      <div style={{ backgroundColor: 'rgba(9,9,9,0.96)', borderRadius: 18, border: '1px solid rgba(255,255,255,0.06)', padding: 28, maxWidth: 340, width: '100%', textAlign: 'center', backdropFilter: BLUR_GLASS, boxShadow: '0 26px 60px rgba(0,0,0,0.6)' }}>
        <h2 style={{ margin: '0 0 10px 0', color: THEME.white, fontSize: 20, fontWeight: 700 }}>Enter Passcode</h2>
        <p style={{ color: THEME.muted, fontSize: 14, marginBottom: 22 }}>Enter your 4-digit passcode to view balance</p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 20 }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ width: 18, height: 18, borderRadius: '50%', backgroundColor: i < passcode.length ? THEME.green : 'rgba(255,255,255,0.08)', transition: TRANSITION_FAST, border: i < passcode.length ? 'none' : '1px solid rgba(255,255,255,0.08)' }} />     
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}> 
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <button key={n} onClick={() => handleNumberClick(String(n))} style={{ padding: 16, backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, color: THEME.white, fontSize: 18, fontWeight: 700, cursor: 'pointer' }} onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = THEME.green; (e.currentTarget as HTMLButtonElement).style.color = THEME.black; }} onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.03)'; (e.currentTarget as HTMLButtonElement).style.color = THEME.white; }}>{n}</button>
          ))}

          <div />
          <button onClick={() => handleNumberClick('0')} style={{ padding: 16, backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, color: THEME.white, fontSize: 18, fontWeight: 700, cursor: 'pointer' }} onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = THEME.green; (e.currentTarget as HTMLButtonElement).style.color = THEME.black; }} onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.03)'; (e.currentTarget as HTMLButtonElement).style.color = THEME.white; }}>0</button>
          <button onClick={handleBackspace} style={{ padding: 16, backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, color: THEME.white, fontSize: 18, fontWeight: 700, cursor: 'pointer' }} onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#b91c1c'; (e.currentTarget as HTMLButtonElement).style.color = THEME.white; }} onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.03)'; (e.currentTarget as HTMLButtonElement).style.color = THEME.white; }}></button>
        </div>

        <button onClick={onClose} style={{ marginTop: 18, padding: '12px 20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, color: THEME.muted, fontSize: 14, fontWeight: 600, cursor: 'pointer', width: '100%' }}>Cancel</button>
      </div>
    </div>
  );
}

function MenuScreen({ setCurrentScreen }: any) {
  return (
    <div style={{ flex: 1, paddingTop: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 26 }}>
        <button onClick={() => setCurrentScreen('home')} style={{ background: 'none', border: '1px solid ' + THEME.green + '40', color: THEME.green, cursor: 'pointer', fontSize: 14, fontWeight: 600, padding: '10px 14px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back
        </button>

        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: THEME.white }}>Menu</h1>

        <div style={{ width: 90 }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <MenuButton label="Settings" description="App preferences" onClick={() => setCurrentScreen('settings')} />
        <MenuButton label="Profile" description="Manage account" onClick={() => setCurrentScreen('profile')} />
        <MenuButton label="Help & Support" description="Get help" onClick={() => alert('Help coming soon!')} />
      </div>
    </div>
  );
}

function MenuButton({ label, description, onClick }: any) {
  return (
    <button onClick={onClick} style={{ width: '100%', padding: 18, backgroundColor: THEME.card, border: '1px solid ' + THEME.border, borderRadius: 14, color: THEME.white, cursor: 'pointer', textAlign: 'left', transition: TRANSITION_FAST }} onMouseEnter={(e) => { const t = e.currentTarget as HTMLButtonElement; t.style.backgroundColor = THEME.green; t.style.color = THEME.black; }} onMouseLeave={(e) => { const t = e.currentTarget as HTMLButtonElement; t.style.backgroundColor = THEME.card; t.style.color = THEME.white; }}>
      <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>{label}</div>       
      <div style={{ fontSize: 14, color: 'inherit', opacity: 0.85 }}>{description}</div>  
    </button>
  );
}

/* Minimal inline icons */
function IconArrowUp() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19V6M5 13l7-7 7 7" /></svg>;
}
function IconArrowDown() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v13M19 11l-7 7-7-7" /></svg>;
}
function IconCard() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg>;
}
function IconBolt() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>;
}

export default App;
