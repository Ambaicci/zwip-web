// src/Recharge.tsx - ENHANCED MONEY ADDING FLOWS
import { useState } from 'react';
import { useStore } from './store/useStore';
import { THEME } from './theme';
import BottomNav from './components/Navigation/BottomNav';

type ScreenType = 'home' | 'send' | 'add' | 'receive' | 'pay' | 'scan' | 'cashAgent' | 'transactions' | 'settings' | 'profile' | 'menu' | 'more';
type RechargeStep = 'method' | 'amount' | 'details' | 'processing' | 'success';

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'card' | 'bank' | 'mobile' | 'crypto' | 'cash';
  fee: number;
  processingTime: string;
  limits: { min: number; max: number };
}

export default function Recharge({ setCurrentScreen }: { setCurrentScreen: (screen: ScreenType) => void }) {
  const { addMoney, balance } = useStore();
  const [currentStep, setCurrentStep] = useState<RechargeStep>('method');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [amount, setAmount] = useState('');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [transactionId, setTransactionId] = useState('');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [bankDetails, setBankDetails] = useState({ account: '', routing: '' });
  const [mobileDetails, setMobileDetails] = useState({ provider: '', number: '' });

  // Enhanced payment methods with realistic data
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Visa, Mastercard, Amex',
      icon: '',
      type: 'card',
      fee: 0.029, // 2.9%
      processingTime: 'Instant',
      limits: { min: 5, max: 5000 }
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      description: 'ACH, Wire Transfer',
      icon: '',
      type: 'bank',
      fee: 0.00,
      processingTime: '1-3 business days',
      limits: { min: 10, max: 10000 }
    },
    {
      id: 'mobile',
      name: 'Mobile Money',
      description: 'M-Pesa, Orange Money',
      icon: '',
      type: 'mobile',
      fee: 0.015, // 1.5%
      processingTime: 'Instant',
      limits: { min: 1, max: 1000 }
    },
    {
      id: 'crypto',
      name: 'Cryptocurrency',
      description: 'Bitcoin, Ethereum, USDC',
      icon: '',
      type: 'crypto',
      fee: 0.01, // 1%
      processingTime: '10-30 minutes',
      limits: { min: 10, max: 50000 }
    },
    {
      id: 'cash',
      name: 'Cash Deposit',
      description: 'Agent locations, retail partners',
      icon: '',
      type: 'cash',
      fee: 1.50, // Fixed fee
      processingTime: 'Instant at location',
      limits: { min: 5, max: 1000 }
    }
  ];

  const quickAmounts = [10, 25, 50, 100, 200, 500, 1000];
  const mobileProviders = ['M-Pesa', 'Orange Money', 'MTN Mobile Money', 'Airtel Money', 'Tigo Pesa'];

  // Calculate fee and total
  const numAmount = parseFloat(amount) || 0;
  const fee = selectedMethod ? selectedMethod.fee * (selectedMethod.type === 'cash' ? 1 : numAmount) : 0;
  const totalAmount = numAmount + fee;

  // Validate amount against method limits
  const amountError = selectedMethod && numAmount > 0 ? 
    (numAmount < selectedMethod.limits.min ? `Minimum amount is $${selectedMethod.limits.min}` :
     numAmount > selectedMethod.limits.max ? `Maximum amount is $${selectedMethod.limits.max}` : '') : '';

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setCurrentStep('amount');
  };

  const handleAmountSubmit = () => {
    if (amount && parseFloat(amount) > 0 && !amountError) {
      setCurrentStep('details');
    }
  };

  const handleRecharge = async () => {
    if (!selectedMethod || !amount) return;

    setCurrentStep('processing');
    
    // Simulate payment processing
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setProcessingProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(async () => {
          try {
            const numAmount = parseFloat(amount);
            await addMoney(numAmount);
            
            // Generate transaction ID
            setTransactionId('ADD' + Math.random().toString(36).substr(2, 9).toUpperCase());
            setCurrentStep('success');
          } catch (err: any) {
            alert(err.message || 'Failed to add money');
            setCurrentStep('amount');
          }
        }, 500);
      }
    }, 100);
  };

  const getBackAction = () => {
    switch (currentStep) {
      case 'amount':
        return () => setCurrentStep('method');
      case 'details':
        return () => setCurrentStep('amount');
      case 'processing':
      case 'success':
        return () => setCurrentStep('method');
      default:
        return () => setCurrentScreen('home');
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'method': return 'Add Money';
      case 'amount': return 'Enter Amount';
      case 'details': return 'Payment Details';
      case 'processing': return 'Processing...';
      case 'success': return 'Success!';
      default: return 'Add Money';
    }
  };

  const showBottomNav = currentStep === 'method';

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: THEME.black,
      color: THEME.white,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '0 20px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        flex: 1,
        maxWidth: '400px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: '20px'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <button
            onClick={getBackAction()}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: THEME.green,
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              padding: '10px 16px',
              borderRadius: '10px',
              minWidth: '70px',
              flexShrink: 0,
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = THEME.green;
              e.currentTarget.style.color = THEME.black;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.color = THEME.green;
            }}
          >
             Back
          </button>

          <h1 style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: 700,
            color: THEME.white,
            textAlign: 'center',
            flex: 1
          }}>
            {getStepTitle()}
          </h1>

          <div style={{ width: '70px', flexShrink: 0 }}></div>
        </div>

        <div style={{ 
          flex: 1, 
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          paddingBottom: showBottomNav ? '100px' : '20px',
          boxSizing: 'border-box'
        }}>
          {currentStep === 'method' && (
            <div style={{ width: '100%', boxSizing: 'border-box' }}>
              {/* Current Balance */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.9) 0%, rgba(6, 46, 38, 0.4) 100%)',
                padding: '20px',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: '16px',
                width: '100%',
                boxSizing: 'border-box',
                backdropFilter: 'blur(10px)',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '14px',
                  color: THEME.muted,
                  marginBottom: '8px',
                  fontWeight: 600
                }}>
                  Current Balance
                </div>
                <div style={{
                  fontSize: '28px',
                  fontWeight: 700,
                  color: THEME.white,
                  marginBottom: '8px'
                }}>
                  ${balance.toFixed(2)}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: THEME.green,
                  fontWeight: 600
                }}>
                  Ready to use instantly
                </div>
              </div>

              {/* Payment Methods */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.9) 0%, rgba(6, 46, 38, 0.3) 100%)',
                padding: '20px',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: '16px',
                width: '100%',
                boxSizing: 'border-box',
                backdropFilter: 'blur(10px)'
              }}>
                <h3 style={{
                  margin: '0 0 16px 0',
                  fontSize: '16px',
                  fontWeight: 700,
                  color: THEME.white
                }}>
                  Choose Payment Method
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {paymentMethods.map(method => (
                    <button
                      key={method.id}
                      onClick={() => handleMethodSelect(method)}
                      style={{
                        width: '100%',
                        padding: '18px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        color: THEME.white,
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        transition: 'all 0.3s ease',
                        backdropFilter: 'blur(10px)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.borderColor = THEME.green;
                        e.currentTarget.style.transform = 'translateX(4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        background: THEME.green,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        fontWeight: 700,
                        color: THEME.black,
                        flexShrink: 0
                      }}>
                        {method.icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: '16px',
                          fontWeight: 600,
                          marginBottom: '4px'
                        }}>
                          {method.name}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: THEME.muted,
                          marginBottom: '4px'
                        }}>
                          {method.description}
                        </div>
                        <div style={{
                          fontSize: '11px',
                          color: THEME.muted,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px'
                        }}>
                          <span>Fee: {method.type === 'cash' ? `$${method.fee.toFixed(2)}` : `${(method.fee * 100).toFixed(1)}%`}</span>
                          <span></span>
                          <span>{method.processingTime}</span>
                        </div>
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: THEME.green,
                        fontWeight: 600,
                        flexShrink: 0
                      }}>
                        
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Security Notice */}
              <div style={{
                background: 'rgba(0, 103, 79, 0.1)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid rgba(0, 103, 79, 0.3)',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '12px',
                  color: THEME.green,
                  fontWeight: 600,
                  marginBottom: '4px'
                }}>
                   Secure & Encrypted
                </div>
                <div style={{
                  fontSize: '11px',
                  color: THEME.muted,
                  lineHeight: '1.4'
                }}>
                  All transactions are protected with bank-level security
                </div>
              </div>
            </div>
          )}

          {currentStep === 'amount' && selectedMethod && (
            <div style={{ width: '100%', boxSizing: 'border-box' }}>
              {/* Method Header */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.9) 0%, rgba(6, 46, 38, 0.4) 100%)',
                padding: '20px',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: '16px',
                width: '100%',
                boxSizing: 'border-box',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: THEME.green,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: THEME.black,
                    flexShrink: 0
                  }}>
                    {selectedMethod.icon}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: THEME.white }}>
                      {selectedMethod.name}
                    </div>
                    <div style={{ fontSize: '12px', color: THEME.muted }}>
                      {selectedMethod.description}
                    </div>
                  </div>
                </div>
                <div style={{
                  fontSize: '11px',
                  color: THEME.muted,
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span>Fee: {selectedMethod.type === 'cash' ? `$${selectedMethod.fee.toFixed(2)}` : `${(selectedMethod.fee * 100).toFixed(1)}%`}</span>
                  <span>Limit: ${selectedMethod.limits.min} - ${selectedMethod.limits.max}</span>
                  <span>{selectedMethod.processingTime}</span>
                </div>
              </div>

              {/* Amount Input */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.9) 0%, rgba(6, 46, 38, 0.4) 100%)',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: '16px',
                width: '100%',
                boxSizing: 'border-box',
                backdropFilter: 'blur(20px)'
              }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  color: THEME.muted,
                  marginBottom: '16px',
                  fontWeight: 600,
                  textAlign: 'center'
                }}>
                  Enter Amount to Add
                </label>

                <div style={{
                  position: 'relative',
                  marginBottom: '24px',
                  border: `2px solid ${amountError ? THEME.error : THEME.green}40`,
                  borderRadius: '16px',
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  transition: 'all 0.2s ease'
                }}>
                  <span style={{
                    position: 'absolute',
                    left: '24px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '28px',
                    color: THEME.white,
                    fontWeight: 700,
                    zIndex: 1
                  }}>$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    min={selectedMethod.limits.min}
                    max={selectedMethod.limits.max}
                    step="0.01"
                    style={{
                      width: '100%',
                      padding: '20px 20px 20px 60px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderRadius: '12px',
                      color: THEME.white,
                      fontSize: '32px',
                      fontWeight: 700,
                      outline: 'none',
                      boxSizing: 'border-box',
                      textAlign: 'center',
                      letterSpacing: '-1px'
                    }}
                    autoFocus
                  />
                </div>

                {amountError && (
                  <div style={{
                    color: THEME.error,
                    fontSize: '12px',
                    fontWeight: 600,
                    marginBottom: '16px',
                    padding: '8px 12px',
                    background: 'rgba(220, 38, 38, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(220, 38, 38, 0.2)',
                    textAlign: 'center'
                  }}>
                     {amountError}
                  </div>
                )}

                {/* Quick Amounts */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{
                    fontSize: '14px',
                    color: THEME.muted,
                    marginBottom: '12px',
                    fontWeight: 600,
                    textAlign: 'center'
                  }}>
                    Quick Amounts
                  </div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '10px'
                  }}>
                    {quickAmounts.filter(amt => 
                      amt >= selectedMethod.limits.min && amt <= selectedMethod.limits.max
                    ).map(quickAmount => (
                      <button
                        key={quickAmount}
                        type="button"
                        onClick={() => setAmount(quickAmount.toString())}
                        style={{
                          padding: '12px 8px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          color: THEME.white,
                          fontSize: '14px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = THEME.green;
                          e.currentTarget.style.color = THEME.black;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                          e.currentTarget.style.color = THEME.white;
                        }}
                      >
                        ${quickAmount}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fee Calculation Preview */}
                {numAmount > 0 && (
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <div style={{
                      fontSize: '12px',
                      color: THEME.muted,
                      marginBottom: '8px',
                      fontWeight: 600
                    }}>
                      Transaction Summary
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ color: THEME.white, fontSize: '13px' }}>Amount:</span>
                      <span style={{ color: THEME.white, fontSize: '13px', fontWeight: 600 }}>
                        ${numAmount.toFixed(2)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ color: THEME.muted, fontSize: '13px' }}>Fee:</span>
                      <span style={{ color: THEME.muted, fontSize: '13px' }}>
                        ${fee.toFixed(2)}
                      </span>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: '8px',
                      paddingTop: '8px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      <span style={{ color: THEME.white, fontSize: '14px', fontWeight: 600 }}>Total:</span>
                      <span style={{ color: THEME.white, fontSize: '14px', fontWeight: 600 }}>
                        ${totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleAmountSubmit}
                disabled={!amount || parseFloat(amount) <= 0 || !!amountError}
                style={{
                  width: '100%',
                  padding: '18px',
                  background: !amount || parseFloat(amount) <= 0 || !!amountError
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : THEME.green,
                  border: 'none',
                  borderRadius: '12px',
                  color: !amount || parseFloat(amount) <= 0 || !!amountError
                    ? THEME.muted 
                    : THEME.black,
                  fontSize: '16px',
                  fontWeight: 700,
                  cursor: !amount || parseFloat(amount) <= 0 || !!amountError
                    ? 'not-allowed' 
                    : 'pointer',
                  boxSizing: 'border-box',
                  transition: 'all 0.3s ease'
                }}
              >
                Continue to Payment
              </button>
            </div>
          )}

          {currentStep === 'details' && selectedMethod && (
            <div style={{ width: '100%', boxSizing: 'border-box' }}>
              {/* Payment Details Form */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.9) 0%, rgba(6, 46, 38, 0.4) 100%)',
                padding: '24px',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: '16px',
                width: '100%',
                boxSizing: 'border-box',
                backdropFilter: 'blur(20px)'
              }}>
                <h3 style={{
                  margin: '0 0 20px 0',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: THEME.white,
                  textAlign: 'center'
                }}>
                  Payment Details
                </h3>

                {/* Payment Summary */}
                <div style={{
                  background: 'rgba(0, 103, 79, 0.1)',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(0, 103, 79, 0.3)',
                  marginBottom: '20px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: THEME.muted, fontSize: '14px' }}>Method:</span>
                    <span style={{ color: THEME.white, fontSize: '14px', fontWeight: 600 }}>
                      {selectedMethod.name}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: THEME.muted, fontSize: '14px' }}>Amount:</span>
                    <span style={{ color: THEME.white, fontSize: '14px', fontWeight: 600 }}>
                      ${numAmount.toFixed(2)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: THEME.muted, fontSize: '14px' }}>Fee:</span>
                    <span style={{ color: THEME.muted, fontSize: '14px' }}>
                      ${fee.toFixed(2)}
                    </span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '8px',
                    paddingTop: '8px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <span style={{ color: THEME.white, fontSize: '16px', fontWeight: 600 }}>Total:</span>
                    <span style={{ color: THEME.white, fontSize: '16px', fontWeight: 600 }}>
                      ${totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Dynamic Form based on Payment Method */}
                {selectedMethod.type === 'card' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <input
                      type="text"
                      placeholder="Card Number"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '10px',
                        color: THEME.white,
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                        style={{
                          flex: 1,
                          padding: '14px 16px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '10px',
                          color: THEME.white,
                          fontSize: '14px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                        style={{
                          flex: 1,
                          padding: '14px 16px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '10px',
                          color: THEME.white,
                          fontSize: '14px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Cardholder Name"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '10px',
                        color: THEME.white,
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                )}

                {selectedMethod.type === 'bank' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <input
                      type="text"
                      placeholder="Account Number"
                      value={bankDetails.account}
                      onChange={(e) => setBankDetails({...bankDetails, account: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '10px',
                        color: THEME.white,
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Routing Number"
                      value={bankDetails.routing}
                      onChange={(e) => setBankDetails({...bankDetails, routing: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '10px',
                        color: THEME.white,
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                )}

                {selectedMethod.type === 'mobile' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <select
                      value={mobileDetails.provider}
                      onChange={(e) => setMobileDetails({...mobileDetails, provider: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '10px',
                        color: THEME.white,
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="">Select Provider</option>
                      {mobileProviders.map(provider => (
                        <option key={provider} value={provider}>{provider}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Mobile Number"
                      value={mobileDetails.number}
                      onChange={(e) => setMobileDetails({...mobileDetails, number: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '10px',
                        color: THEME.white,
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                )}

                {(selectedMethod.type === 'crypto' || selectedMethod.type === 'cash') && (
                  <div style={{
                    background: 'rgba(0, 103, 79, 0.1)',
                    padding: '20px',
                    borderRadius: '12px',
                    border: '1px solid rgba(0, 103, 79, 0.3)',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: THEME.white,
                      marginBottom: '8px'
                    }}>
                      {selectedMethod.type === 'crypto' ? 'Cryptocurrency Payment' : 'Cash Deposit'}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: THEME.muted,
                      lineHeight: '1.5'
                    }}>
                      {selectedMethod.type === 'crypto' 
                        ? 'You will be redirected to complete the cryptocurrency payment'
                        : 'Visit any agent location to complete your cash deposit'
                      }
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleRecharge}
                style={{
                  width: '100%',
                  padding: '18px',
                  background: THEME.green,
                  border: 'none',
                  borderRadius: '12px',
                  color: THEME.black,
                  fontSize: '16px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 103, 79, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Add ${numAmount.toFixed(2)}
              </button>
            </div>
          )}

          {currentStep === 'processing' && (
            <div style={{ 
              width: '100%', 
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1
            }}>
              {/* Processing Screen */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.9) 0%, rgba(6, 46, 38, 0.4) 100%)',
                padding: '40px 30px',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                textAlign: 'center',
                width: '100%',
                boxSizing: 'border-box'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '20px',
                  background: 'rgba(0, 103, 79, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px auto',
                  border: '2px solid rgba(0, 103, 79, 0.5)',
                  position: 'relative'
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '15px',
                    background: `conic-gradient(rgba(0, 103, 79, 0.3) 0%, #00674F ${processingProgress}%, rgba(0, 103, 79, 0.3) ${processingProgress}%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px'
                  }}>
                    
                  </div>
                </div>

                <h3 style={{
                  margin: '0 0 16px 0',
                  fontSize: '20px',
                  fontWeight: 700,
                  color: THEME.white
                }}>
                  Processing Payment
                </h3>

                <p style={{
                  margin: '0 0 24px 0',
                  color: THEME.muted,
                  fontSize: '14px',
                  lineHeight: '1.5'
                }}>
                  Adding ${amount} to your Zwip balance...
                </p>

                <div style={{
                  width: '100%',
                  height: '6px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '3px',
                  overflow: 'hidden',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    width: `${processingProgress}%`,
                    height: '100%',
                    background: THEME.green,
                    borderRadius: '3px',
                    transition: 'width 0.3s ease'
                  }} />
                </div>

                <div style={{
                  color: THEME.muted,
                  fontSize: '12px',
                  fontWeight: 600
                }}>
                  {processingProgress}% Complete
                </div>
              </div>
            </div>
          )}

          {currentStep === 'success' && (
            <div style={{ 
              width: '100%', 
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1
            }}>
              {/* Success Screen */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.9) 0%, rgba(6, 46, 38, 0.4) 100%)',
                padding: '40px 30px',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                textAlign: 'center',
                width: '100%',
                boxSizing: 'border-box'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '20px',
                  background: THEME.green,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px auto',
                  fontSize: '32px',
                  fontWeight: 700,
                  color: THEME.black
                }}>
                  
                </div>

                <h2 style={{
                  margin: '0 0 16px 0',
                  fontSize: '24px',
                  fontWeight: 700,
                  color: THEME.white
                }}>
                  Money Added!
                </h2>

                <p style={{
                  margin: '0 0 8px 0',
                  color: THEME.muted,
                  fontSize: '16px',
                  lineHeight: '1.5'
                }}>
                  You've successfully added
                </p>
                <div style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: THEME.green,
                  marginBottom: '16px'
                }}>
                  ${amount} to your balance
                </div>

                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  marginBottom: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div style={{
                    fontSize: '12px',
                    color: THEME.muted,
                    marginBottom: '4px'
                  }}>
                    Transaction ID
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: THEME.white,
                    fontWeight: 600,
                    fontFamily: 'monospace'
                  }}>
                    {transactionId}
                  </div>
                </div>

                <div style={{
                  background: 'rgba(0, 103, 79, 0.1)',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  marginBottom: '24px',
                  border: '1px solid rgba(0, 103, 79, 0.3)'
                }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: THEME.green,
                    marginBottom: '4px'
                  }}>
                    New Balance: ${(balance + numAmount).toFixed(2)}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: THEME.muted
                  }}>
                    Ready to use instantly
                  </div>
                </div>

                <button
                  onClick={() => setCurrentScreen('home')}
                  style={{
                    width: '100%',
                    padding: '18px',
                    background: THEME.green,
                    border: 'none',
                    borderRadius: '12px',
                    color: THEME.black,
                    fontSize: '16px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 103, 79, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Back to Home
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      {showBottomNav && (
        <BottomNav
          currentScreen="add"
          onNavigate={setCurrentScreen}
        />
      )}
    </div>
  );
}
