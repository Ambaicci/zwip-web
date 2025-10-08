// src/ReceiveMoney.tsx - CORRECTED WITH RECIPIENT SELECTION & DUAL ACTIONS
import { useState, useEffect } from 'react';
import { useStore } from './store/useStore';
import { THEME } from './theme';
import BottomNav from './components/Navigation/BottomNav';

type ScreenType = 'home' | 'send' | 'add' | 'receive' | 'pay' | 'scan' | 'cashAgent' | 'transactions' | 'settings' | 'profile' | 'menu' | 'more';

type ReceiveStep = 'input' | 'qrDisplay' | 'success';

export default function ReceiveMoney({ setCurrentScreen }: { setCurrentScreen: (screen: ScreenType) => void }) {
  const { user, requestMoney } = useStore();
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [currentStep, setCurrentStep] = useState<ReceiveStep>('input');
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [isGenerating, setIsGenerating] = useState(false);
  const [qrAnimation, setQrAnimation] = useState(0);

  const quickAmounts = [10, 25, 50, 100, 200, 500];

  // contacts to request money FROM
  const contacts = [
    { id: '1', name: 'Sarah Wilson', phone: '+1 (555) 111-2222' },
    { id: '2', name: 'Mike Johnson', phone: '+1 (555) 222-3333' },
    { id: '3', name: 'Emily Davis', phone: '+1 (555) 333-4444' },
    { id: '4', name: 'Alex Brown', phone: '+1 (555) 444-5555' },
    { id: '5', name: 'Jessica Lee', phone: '+1 (555) 555-6666' }
  ];

  // Animated QR generation as user types
  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 2;
        setQrAnimation(progress);
        if (progress >= 100) {
          clearInterval(interval);
          const qrData = JSON.stringify({
            type: 'payment_request',
            amount: parseFloat(amount),
            currency: 'USD',
            from: selectedContact?.phone || 'anyone',
            to: user?.phoneNumber,
            note: note,
            timestamp: new Date().toISOString(),
            app: 'zwip'
          });

        }
      }, 30);
      
      return () => clearInterval(interval);
    }
  }, [amount, note, user, selectedContact]);

  const handleGenerateQR = () => {
    if (amount && parseFloat(amount) > 0) {
      setIsGenerating(true);
      setTimeout(() => {
        setIsGenerating(false);
        setCurrentStep('qrDisplay');
      }, 600);
    }
  };

  const handleSendRequest = async () => {
    if (!selectedContact && !amount) return;

    try {
      const numAmount = parseFloat(amount);

      const recipientPhone = selectedContact ? selectedContact.phone : 'unknown';
      
      await requestMoney(numAmount, recipientPhone, note);
      
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Zwip Payment Request',
            text: `Hi! Can you send me $${numAmount.toFixed(2)} via Zwip?${note ? ` For: ${note}` : ''}`,
            url: window.location.href,
          });
          setCurrentStep('success');
        } catch (err) {
          // Share cancelled, still show success
          setCurrentStep('success');
        }
      } else {
        // Fallback - copy to clipboard
        const message = `Hi! Can you send me $${numAmount.toFixed(2)} via Zwip?${note ? ` For: ${note}` : ''}`;
        navigator.clipboard.writeText(message);
        alert('Payment request copied to clipboard! You can paste it in any messaging app.');
        setCurrentStep('success');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to send request');
    }
  };

  const handleContactSelect = (contact: any) => {
    setSelectedContact(contact);
  };

  const filteredContacts = searchQuery
    ? contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phone.includes(searchQuery)
      )
    : contacts;

  const getStepTitle = () => {
    switch (currentStep) {
      case 'input': return 'Request Money';
      case 'qrDisplay': return 'Scan QR Code';
      case 'success': return 'Request Sent';
      default: return 'Request Money';
    }
  };

  const showBottomNav = currentStep === 'input';

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: THEME.black,
      color: THEME.white,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '0 20px',
      boxSizing: 'border-box',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif'
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
          marginBottom: '32px',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <button
            onClick={() => currentStep === 'input' ? setCurrentScreen('home') : setCurrentStep('input')}
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
          {currentStep === 'input' && (
            <div style={{ width: '100%', boxSizing: 'border-box' }}>
              {/* Contact Selection - Who to request from */}
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
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  color: THEME.muted,
                  marginBottom: '16px',
                  fontWeight: 600
                }}>
                  Request From (Optional)
                </label>
                
                {selectedContact ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: THEME.green,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: THEME.black,
                      flexShrink: 0
                    }}>
                      {selectedContact.name.charAt(0)}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: '16px', fontWeight: 600, color: THEME.white }}>
                        {selectedContact.name}
                      </div>
                      <div style={{ fontSize: '14px', color: THEME.muted }}>
                        {selectedContact.phone}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedContact(null)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: THEME.muted,
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 600,
                        padding: '8px 12px',
                        borderRadius: '8px'
                      }}
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="text"
                      placeholder="Search contacts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '10px',
                        color: THEME.white,
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        marginBottom: '12px'
                      }}
                    />
                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      {filteredContacts.map(contact => (
                        <button
                          key={contact.id}
                          onClick={() => handleContactSelect(contact)}
                          style={{
                            width: '100%',
                            padding: '12px',
                            background: 'transparent',
                            border: 'none',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                            color: THEME.white,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                          }}
                        >
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            background: THEME.green,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                            fontWeight: 700,
                            color: THEME.black,
                            flexShrink: 0
                          }}>
                            {contact.name.charAt(0)}
                          </div>
                          <div style={{ textAlign: 'left', flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '14px', fontWeight: 600 }}>
                              {contact.name}
                            </div>
                            <div style={{ fontSize: '12px', color: THEME.muted }}>
                              {contact.phone}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div style={{
                  fontSize: '12px',
                  color: THEME.muted,
                  marginTop: '12px',
                  fontStyle: 'italic'
                }}>
                  Leave empty to request from anyone
                </div>
              </div>

              {/* Amount Input */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.9) 0%, rgba(6, 46, 38, 0.3) 100%)',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: '16px',
                width: '100%',
                boxSizing: 'border-box',
                backdropFilter: 'blur(10px)'
              }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  color: THEME.muted,
                  marginBottom: '16px',
                  fontWeight: 600
                }}>
                  Amount to Receive
                </label>

                <div style={{
                  position: 'relative',
                  marginBottom: '24px',
                  border: `2px solid ${THEME.green}30`,
                  borderRadius: '12px',
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  transition: 'all 0.2s ease'
                }}>
                  <span style={{
                    position: 'absolute',
                    left: '20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '24px',
                    color: THEME.white,
                    fontWeight: 700,
                    zIndex: 1
                  }}>$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    min="1"
                    step="0.01"
                    style={{
                      width: '100%',
                      padding: '16px 16px 16px 50px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderRadius: '8px',
                      color: THEME.white,
                      fontSize: '28px',
                      fontWeight: 700,
                      outline: 'none',
                      boxSizing: 'border-box',
                      textAlign: 'center',
                      letterSpacing: '-0.5px'
                    }}
                    autoFocus
                  />
                </div>

                {/* Quick Amounts */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{
                    fontSize: '14px',
                    color: THEME.muted,
                    marginBottom: '12px',
                    fontWeight: 600
                  }}>
                    Quick Select
                  </div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '10px'
                  }}>
                    {quickAmounts.map(quickAmount => (
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

                {/* Note Input */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    color: THEME.muted,
                    marginBottom: '12px',
                    fontWeight: 600
                  }}>
                    Add a Note (Optional)
                  </label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="What's this for?"
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
              </div>

              {/* QR Generation Animation */}
              {amount && parseFloat(amount) > 0 && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.9) 0%, rgba(6, 46, 38, 0.2) 100%)',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  marginBottom: '16px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '12px',
                    color: THEME.green,
                    fontWeight: 600,
                    marginBottom: '8px'
                  }}>
                    {qrAnimation < 100 ? 'Generating QR Code...' : 'QR Code Ready!'}
                  </div>
                  <div style={{
                    width: '100%',
                    height: '4px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '2px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${qrAnimation}%`,
                      height: '100%',
                      background: THEME.green,
                      borderRadius: '2px',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
              )}

              {/* Dual Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                <button
                  onClick={handleGenerateQR}
                  disabled={!amount || parseFloat(amount) <= 0 || isGenerating}
                  style={{
                    flex: 1,
                    padding: '16px',
                    background: !amount || parseFloat(amount) <= 0 
                      ? 'rgba(255, 255, 255, 0.05)' 
                      : THEME.emeraldLight,
                    border: 'none',
                    borderRadius: '12px',
                    color: !amount || parseFloat(amount) <= 0 
                      ? THEME.muted 
                      : THEME.black,
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: !amount || parseFloat(amount) <= 0 
                      ? 'not-allowed' 
                      : 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {isGenerating ? 'Generating...' : 'Show QR Code'}
                </button>
                
                <button
                  onClick={handleSendRequest}
                  disabled={!amount || parseFloat(amount) <= 0}
                  style={{
                    flex: 1,
                    padding: '16px',
                    background: !amount || parseFloat(amount) <= 0 
                      ? 'rgba(255, 255, 255, 0.05)' 
                      : THEME.green,
                    border: 'none',
                    borderRadius: '12px',
                    color: !amount || parseFloat(amount) <= 0 
                      ? THEME.muted 
                      : THEME.black,
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: !amount || parseFloat(amount) <= 0 
                      ? 'not-allowed' 
                      : 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Send Request
                </button>
              </div>
            </div>
          )}

          {currentStep === 'qrDisplay' && (
            <div style={{ 
              width: '100%', 
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1
            }}>
              {/* QR Display Screen - Clean scanning interface */}
              <div style={{
                background: THEME.white,
                padding: '30px',
                borderRadius: '20px',
                textAlign: 'center',
                width: '100%',
                boxSizing: 'border-box',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
              }}>
                {/* Large QR Code */}
                <div style={{
                  width: '250px',
                  height: '250px',
                  margin: '0 auto 20px auto',
                  background: THEME.white,
                  borderRadius: '16px',
                  padding: '16px',
                  border: `3px solid ${THEME.green}`,
                  position: 'relative'
                }}>
                  {/* Animated QR Pattern */}
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: `
                      linear-gradient(45deg, #000 25%, transparent 25%), 
                      linear-gradient(-45deg, #000 25%, transparent 25%), 
                      linear-gradient(45deg, transparent 75%, #000 75%), 
                      linear-gradient(-45deg, transparent 75%, #000 75%)
                    `,
                    backgroundSize: '16px 16px',
                    backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <div style={{
                      fontSize: '14px',
                      color: THEME.white,
                      background: THEME.black,
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontWeight: 700
                    }}>
                      ZWIP PAYMENT
                    </div>
                    <div style={{
                      fontSize: '16px',
                      color: THEME.white,
                      background: THEME.black,
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontWeight: 700
                    }}>
                      $ {amount}
                    </div>
                  </div>
                  
                  {/* Zwip Branding */}
                  <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    background: THEME.green,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: THEME.black
                  }}>
                    Z
                  </div>
                </div>

                <h2 style={{ 
                  margin: '0 0 8px 0', 
                  color: THEME.black, 
                  fontSize: '18px',
                  fontWeight: 700
                }}>   
                  Scan to Pay
                </h2>
                <p style={{ 
                  color: '#666', 
                  fontSize: '14px', 
                  marginBottom: '8px',
                  lineHeight: '1.4'
                }}>    
                  Show this screen to scan
                </p>
                <div style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: THEME.green,
                  marginBottom: '20px'
                }}>
                  ${amount}
                </div>
                
                {note && (
                  <p style={{ 
                    color: '#666', 
                    fontSize: '12px', 
                    marginBottom: '20px',
                    fontStyle: 'italic'
                  }}>
                    "{note}"
                  </p>
                )}

                <div style={{ 
                  display: 'flex', 
                  gap: '12px',
                  marginTop: '24px'
                }}>
                  <button
                    onClick={() => setCurrentStep('input')}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: 'rgba(0, 0, 0, 0.1)',
                      border: '1px solid rgba(0, 0, 0, 0.2)',
                      borderRadius: '8px',
                      color: '#666',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSendRequest}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: THEME.green,
                      border: 'none',
                      borderRadius: '8px',
                      color: THEME.black,
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Send Request
                  </button>
                </div>
              </div>

              {/* Scan Instructions */}
              <div style={{
                marginTop: '20px',
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                width: '100%',
                boxSizing: 'border-box'
              }}>
                <div style={{
                  fontSize: '14px',
                  color: THEME.muted,
                  textAlign: 'center',
                  lineHeight: '1.5'
                }}>
                  Hold this screen for others to scan with their Zwip app
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
              {/* Success State */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.9) 0%, rgba(6, 46, 38, 0.4) 100%)',
                padding: '30px 24px',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                textAlign: 'center',
                width: '100%',
                boxSizing: 'border-box'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '12px',
                  background: THEME.green,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                  fontSize: '24px',
                  fontWeight: 700,
                  color: THEME.black
                }}>
                  
                </div>

                <h2 style={{
                  margin: '0 0 8px 0',
                  fontSize: '20px',
                  fontWeight: 700,
                  color: THEME.white
                }}>
                  Request Sent!
                </h2>

                <p style={{
                  margin: '0 0 24px 0',
                  color: THEME.muted,
                  fontSize: '14px',
                  lineHeight: '1.5'
                }}>
                  Your payment request for <strong style={{color: THEME.white}}>${amount}</strong> has been sent successfully.
                </p>

                <button
                  onClick={() => setCurrentScreen('home')}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: THEME.green,
                    border: 'none',
                    borderRadius: '12px',
                    color: THEME.black,
                    fontSize: '16px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
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
          currentScreen="receive"
          onNavigate={setCurrentScreen}
        />
      )}
    </div>
  );
}
