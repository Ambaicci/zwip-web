// src/PinLock.tsx
import { useState } from 'react';

interface PinLockProps {
  onUnlock: () => void;
}

export default function PinLock({ onUnlock }: PinLockProps) {
  const [pin, setPin] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple pin validation (in real app, this would be secure)
    if (pin === '1234') {
      onUnlock();
    } else {
      setAttempts(prev => prev + 1);
      setPin('');
      if (attempts >= 2) {
        setIsLocked(true);
        setTimeout(() => {
          setIsLocked(false);
          setAttempts(0);
        }, 30000); // 30 second lockout
      }
    }
  };

  if (isLocked) {
    return (
      <div style={containerStyle}>
        <div style={lockScreenStyle}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}></div>
          <h2>Too Many Attempts</h2>
          <p>Please wait 30 seconds before trying again.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={pinScreenStyle}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}></div>
        <h2>Enter Your PIN</h2>
        <p style={{ color: '#aaa', marginBottom: '30px' }}>Secure access to your Zwip account</p>
        
        <form onSubmit={handlePinSubmit}>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
            maxLength={4}
            style={pinInputStyle}
            autoFocus
          />
          <button type="submit" style={unlockButtonStyle}>
            Unlock
          </button>
        </form>
        
        {attempts > 0 && (
          <p style={{ color: '#ff6b6b', marginTop: '20px' }}>
            Incorrect PIN. {3 - attempts} attempts remaining.
          </p>
        )}
      </div>
    </div>
  );
}

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: '#000',
  color: 'white',
  fontFamily: 'system-ui, sans-serif'
};

const pinScreenStyle = {
  textAlign: 'center' as const,
  padding: '40px',
  backgroundColor: '#111',
  borderRadius: '20px',
  border: '1px solid #333',
  maxWidth: '400px',
  width: '100%'
};

const lockScreenStyle = {
  textAlign: 'center' as const,
  padding: '40px',
  backgroundColor: '#111',
  borderRadius: '20px',
  border: '1px solid #333',
  maxWidth: '400px',
  width: '100%'
};

const pinInputStyle = {
  width: '100%',
  padding: '15px',
  fontSize: '24px',
  textAlign: 'center' as const,
  backgroundColor: '#222',
  border: '1px solid #444',
  borderRadius: '10px',
  color: 'white',
  marginBottom: '20px',
  letterSpacing: '10px'
};

const unlockButtonStyle = {
  width: '100%',
  padding: '15px',
  backgroundColor: '#007AFF',
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  fontSize: '18px',
  cursor: 'pointer'
};
