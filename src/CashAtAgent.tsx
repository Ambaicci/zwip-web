// src/CashAtAgent.tsx
import { useState } from 'react';

const THEME = {
  black: '#000000',
  panel: '#071010',
  card: '#0b0b0b',
  muted: '#9aa0a0',
  green: '#00674F',
  accentDark: '#062e26',
  border: '#121212',
  white: '#ffffff',
  emeraldLight: '#008F6B',
  emeraldDark: '#004D38'
};

type ScreenType = 'home' | 'send' | 'add' | 'receive' | 'pay' | 'scan' | 'cashAgent' | 'transactions' | 'settings' | 'profile' | 'menu' | 'more';

export default function CashAtAgent({ setCurrentScreen }: { setCurrentScreen: (screen: ScreenType) => void }) {
  const [amount, setAmount] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('');

  const quickAmounts = [50, 100, 200, 500];
  const agents = [
    { id: '1', name: 'ABC Supermarket', address: '123 Main St', distance: '0.5 miles' },
    { id: '2', name: 'XYZ Pharmacy', address: '456 Oak Ave', distance: '0.8 miles' },
    { id: '3', name: 'QuickMart', address: '789 Pine Rd', distance: '1.2 miles' },
    { id: '4', name: 'City Convenience', address: '321 Elm St', distance: '1.5 miles' }
  ];

  const handleWithdraw = () => {
    if (amount && parseFloat(amount) > 0 && selectedAgent) {
      const selected = agents.find(a => a.id === selectedAgent);
      alert(`Withdrawal request for $${amount} at ${selected?.name} has been created. Show this code to the agent: ZWIP${Math.random().toString().slice(2, 8)}`);
      setCurrentScreen('home');
    }
  };

  return (
    <div style={{
      flex: 1,
      paddingTop: '14px',
      maxWidth: '400px',
      width: '100%',
      minHeight: '100vh',
      backgroundColor: THEME.black
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        padding: '0 16px'
      }}>
        <button
          onClick={() => setCurrentScreen('home')}
          style={{
            background: 'none',
            border: `1px solid ${THEME.green}40`,
            color: THEME.green,
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600',
            padding: '8px 12px',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            minWidth: '60px'
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

        <h1 style={{
          margin: 0,
          fontSize: '20px',
          fontWeight: '700',
          color: THEME.white,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12H21M3 12C3 15.3137 5.68629 18 9 18H15C18.3137 18 21 15.3137 21 12C21 8.68629 18.3137 6 15 6H9C5.68629 6 3 8.68629 3 12Z"/>
          </svg>
          Cash at Agent
        </h1>

        <div style={{ width: '60px' }}></div>
      </div>

      <div style={{ padding: '0 16px' }}>
        {/* Amount Input */}
        <div style={{
          backgroundColor: THEME.card,
          padding: '20px',
          borderRadius: '16px',
          border: `1px solid ${THEME.border}`,
          marginBottom: '20px'
        }}>
          <label style={{
            display: 'block',
            fontSize: '16px',
            color: THEME.white,
            marginBottom: '20px',
            fontWeight: '700',
            textAlign: 'center'
          }}>
            Withdrawal Amount
          </label>
          
          <div style={{ 
            position: 'relative', 
            marginBottom: '24px',
            border: `3px solid ${THEME.green}`,
            borderRadius: '16px',
            padding: '12px',
            backgroundColor: THEME.panel
          }}>
            <span style={{
              position: 'absolute',
              left: '24px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '28px',
              color: THEME.white,
              fontWeight: '700'
            }}>$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="10"
              step="0.01"
              style={{
                width: '100%',
                padding: '24px 24px 24px 60px',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '8px',
                color: THEME.white,
                fontSize: '32px',
                fontWeight: '700',
                outline: 'none',
                boxSizing: 'border-box',
                textAlign: 'center'
              }}
              autoFocus
            />
          </div>

          {/* Quick Amount Buttons */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ 
              fontSize: '14px', 
              color: THEME.muted, 
              marginBottom: '12px',
              fontWeight: '600',
              textAlign: 'center'
            }}>
              Quick Select
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px'
            }}>
              {quickAmounts.map(quickAmount => (
                <button
                  key={quickAmount}
                  type="button"
                  onClick={() => setAmount(quickAmount.toString())}
                  style={{
                    padding: '14px 8px',
                    backgroundColor: THEME.panel,
                    border: `2px solid ${THEME.border}`,
                    borderRadius: '10px',
                    color: THEME.white,
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = THEME.green;
                    e.currentTarget.style.color = THEME.black;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = THEME.panel;
                    e.currentTarget.style.color = THEME.white;
                  }}
                >
                  ${quickAmount}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Agent Selection */}
        <div style={{
          backgroundColor: THEME.card,
          padding: '20px',
          borderRadius: '16px',
          border: `1px solid ${THEME.border}`,
          marginBottom: '20px'
        }}>
          <h3 style={{
            margin: '0 0 16px 0',
            fontSize: '16px',
            fontWeight: '700',
            color: THEME.white
          }}>
            Select Agent Location
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {agents.map(agent => (
              <button
                key={agent.id}
                onClick={() => setSelectedAgent(agent.id)}
                style={{
                  width: '100%',
                  padding: '16px',
                  backgroundColor: selectedAgent === agent.id ? THEME.green : THEME.panel,
                  border: `1px solid ${THEME.border}`,
                  borderRadius: '12px',
                  color: selectedAgent === agent.id ? THEME.black : THEME.white,
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '20px',
                  backgroundColor: selectedAgent === agent.id ? THEME.black : THEME.green,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: selectedAgent === agent.id ? THEME.green : THEME.black
                }}>
                  
                </div>
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div style={{ fontSize: '16px', fontWeight: '600' }}>{agent.name}</div>
                  <div style={{ fontSize: '12px', color: selectedAgent === agent.id ? THEME.black : THEME.muted }}>
                    {agent.address}
                  </div>
                  <div style={{ fontSize: '11px', color: selectedAgent === agent.id ? THEME.black : THEME.emeraldLight }}>
                    {agent.distance} away
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Withdraw Button */}
        <button
          onClick={handleWithdraw}
          disabled={!amount || parseFloat(amount) < 10 || !selectedAgent}
          style={{
            width: '100%',
            padding: '20px',
            backgroundColor: amount && parseFloat(amount) >= 10 && selectedAgent ? THEME.green : THEME.border,
            border: 'none',
            borderRadius: '16px',
            color: amount && parseFloat(amount) >= 10 && selectedAgent ? THEME.black : THEME.muted,        
            fontSize: '18px',
            fontWeight: '700',
            cursor: amount && parseFloat(amount) >= 10 && selectedAgent ? 'pointer' : 'not-allowed',       
            transition: 'all 0.3s ease',
            boxShadow: amount && parseFloat(amount) >= 10 && selectedAgent ? `0 4px 16px ${THEME.green}40` : 'none'
          }}
        >
          {amount && parseFloat(amount) < 10 ? 'Minimum $10.00' : 'Get Withdrawal Code'}
        </button>

        {/* Info */}
        <div style={{
          backgroundColor: THEME.accentDark,
          padding: '16px',
          borderRadius: '12px',
          border: `1px solid ${THEME.border}`,
          marginTop: '16px'
        }}>
          <div style={{ 
            fontSize: '12px', 
            color: THEME.muted,
            textAlign: 'center'
          }}>
             Visit the selected agent and show them your withdrawal code to receive cash
          </div>
        </div>
      </div>
    </div>
  );
}
