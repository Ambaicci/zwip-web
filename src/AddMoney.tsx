// src/AddMoney.tsx - REMOVED UNUSED BALANCE VARIABLE
import { useState } from 'react';
import { useStore } from './store/useStore';

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

type ScreenType = 'home' | 'send' | 'add' | 'receive' | 'scan' | 'cashAgent' | 'transactions' | 'settings' | 'profile' | 'menu';

export default function AddMoney({ setCurrentScreen }: { setCurrentScreen: (screen: ScreenType) => void }) {
  const { addMoney } = useStore(); // REMOVED UNUSED BALANCE
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('bank');

  const handleAddMoney = () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    addMoney(numAmount);
    setCurrentScreen('home');
  };

  const paymentMethods = [
    { id: 'bank', name: 'Bank Transfer', icon: '', fee: 0 },
    { id: 'card', name: 'Credit/Debit Card', icon: '', fee: 0.5 },
    { id: 'agent', name: 'Cash at Agent', icon: '', fee: 1.0 }
  ];

  const selectedMethodData = paymentMethods.find(method => method.id === selectedMethod);
  const fee = selectedMethodData?.fee || 0;
  const totalAmount = parseFloat(amount) + fee;

  return (
    <div style={{
      flex: 1,
      paddingTop: '14px',
      maxWidth: '400px',
      width: '100%'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <button
          onClick={() => setCurrentScreen('home')}
          style={{
            background: 'none',
            border: `1px solid ${THEME.green}40`,
            color: THEME.green,
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            padding: '10px 16px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.3s ease'
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
          Add Money
        </h1>

        <div style={{ width: '90px' }}></div>
      </div>

      {/* Add Money Form */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {/* Amount Input */}
        <div style={{
          backgroundColor: THEME.card,
          padding: '20px',
          borderRadius: '16px',
          border: `1px solid ${THEME.border}`
        }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            color: THEME.muted,
            marginBottom: '8px',
            fontWeight: '600'
          }}>
            Amount to Add
          </label>
          <div style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '18px',
              color: THEME.white,
              fontWeight: '600'
            }}>$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              style={{
                width: '100%',
                padding: '16px 16px 16px 40px',
                backgroundColor: THEME.panel,
                border: `1px solid ${THEME.border}`,
                borderRadius: '12px',
                color: THEME.white,
                fontSize: '24px',
                fontWeight: '700',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* Payment Methods */}
        <div style={{
          backgroundColor: THEME.card,
          padding: '20px',
          borderRadius: '16px',
          border: `1px solid ${THEME.border}`
        }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            color: THEME.muted,
            marginBottom: '16px',
            fontWeight: '600'
          }}>
            Payment Method
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                style={{
                  width: '100%',
                  padding: '16px',
                  backgroundColor: selectedMethod === method.id ? THEME.emeraldDark : THEME.panel,
                  border: `1px solid ${selectedMethod === method.id ? THEME.green : THEME.border}`,
                  borderRadius: '12px',
                  color: THEME.white,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (selectedMethod !== method.id) {
                    e.currentTarget.style.backgroundColor = THEME.border;
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedMethod !== method.id) {
                    e.currentTarget.style.backgroundColor = THEME.panel;
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '20px' }}>{method.icon}</span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '16px', fontWeight: '600' }}>{method.name}</div>
                    <div style={{ fontSize: '12px', color: THEME.muted }}>
                      Fee: ${method.fee.toFixed(2)}
                    </div>
                  </div>
                </div>
                {selectedMethod === method.id && (
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: THEME.green,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: THEME.black
                    }}></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        {amount && (
          <div style={{
            backgroundColor: THEME.accentDark,
            padding: '20px',
            borderRadius: '16px',
            border: `1px solid ${THEME.green}40`
          }}>
            <div style={{
              fontSize: '14px',
              color: THEME.muted,
              marginBottom: '12px',
              fontWeight: '600'
            }}>
              Transaction Summary
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: THEME.white, fontSize: '14px' }}>Amount:</span>
                <span style={{ color: THEME.white, fontSize: '16px', fontWeight: '600' }}>${parseFloat(amount).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: THEME.muted, fontSize: '14px' }}>Fee:</span>
                <span style={{ color: THEME.muted, fontSize: '14px' }}>${fee.toFixed(2)}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                paddingTop: '8px',
                borderTop: `1px solid ${THEME.border}`
              }}>
                <span style={{ color: THEME.green, fontSize: '16px', fontWeight: '700' }}>Total:</span>
                <span style={{ color: THEME.green, fontSize: '18px', fontWeight: '700' }}>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Add Money Button */}
        <button
          onClick={handleAddMoney}
          disabled={!amount}
          style={{
            width: '100%',
            padding: '20px',
            backgroundColor: amount ? THEME.green : THEME.border,
            border: 'none',
            borderRadius: '16px',
            color: amount ? THEME.black : THEME.muted,
            fontSize: '18px',
            fontWeight: '700',
            cursor: amount ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s ease',
            marginTop: '10px'
          }}
          onMouseEnter={(e) => {
            if (amount) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 8px 25px ${THEME.green}40`;
            }
          }}
          onMouseLeave={(e) => {
            if (amount) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }
          }}
        >
          Add Money
        </button>
      </div>
    </div>
  );
}
