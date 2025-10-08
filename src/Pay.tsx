// src/Pay.tsx - ENHANCED: Real-time fee display + Friendly loading animation
import { useState, useEffect } from 'react';
import { useStore } from './store/useStore';
import { THEME } from './theme';
import BottomNav from './components/Navigation/BottomNav';

type ScreenType = 'home' | 'send' | 'add' | 'receive' | 'pay' | 'scan' | 'cashAgent' | 'transactions' | 'settings' | 'profile' | 'menu' | 'more';
type PayStep = 'main' | 'amount' | 'confirm' | 'processing' | 'success' | 'scan';

interface Business {
  id: string;
  name: string;
  code: string;
  category: string;
  logo: string;
  verified: boolean;
}

export default function Pay({ setCurrentScreen }: { setCurrentScreen: (screen: ScreenType) => void }) {
  const { payContact, balance } = useStore();
  const [currentStep, setCurrentStep] = useState<PayStep>('main');
  const [searchInput, setSearchInput] = useState('');
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [transactionId, setTransactionId] = useState('');
  const [scanResult, setScanResult] = useState('');
  const [searchMode, setSearchMode] = useState<'name' | 'code'>('name');
  const [loadingDots, setLoadingDots] = useState('');

  // Sample businesses using Zwip
  const businesses: Business[] = [
    { id: '1', name: 'Dovey Pharmacy', code: 'DOVEY001', category: 'Healthcare', logo: '', verified: true },
    { id: '2', name: 'Fresh Veggies Market', code: 'VEGGIE002', category: 'Groceries', logo: '', verified: true },
    { id: '3', name: 'Tech Gadgets Store', code: 'TECH003', category: 'Electronics', logo: '', verified: true },
    { id: '4', name: 'City Supermarket', code: 'CITY004', category: 'Supermarket', logo: '', verified: true },
    { id: '5', name: 'Quick Ride Taxi', code: 'TAXI005', category: 'Transport', logo: '', verified: true },
    { id: '6', name: 'Coffee Corner', code: 'COFFEE006', category: 'Cafe', logo: '', verified: true },
    { id: '7', name: 'Book Haven', code: 'BOOK007', category: 'Books', logo: '', verified: true },
    { id: '8', name: 'Fashion Boutique', code: 'FASH008', category: 'Clothing', logo: '', verified: true },
  ];

  // Calculate transaction fee (1.5% with $0.50 minimum)
  const calculateFee = (amount: number) => {
    const percentageFee = amount * 0.015; // 1.5%
    return Math.max(percentageFee, 0.50); // Minimum $0.50
  };

  const totalAmount = parseFloat(amount) || 0;
  const transactionFee = calculateFee(totalAmount);
  const finalTotal = totalAmount + transactionFee;

  // Animated loading dots for processing screen
  useEffect(() => {
    if (currentStep === 'processing') {
      const interval = setInterval(() => {
        setLoadingDots(prev => {
          if (prev === '...') return '';
          return prev + '.';
        });
      }, 500);
      return () => clearInterval(interval);
    } else {
      setLoadingDots('');
    }
  }, [currentStep]);

  // Filter businesses based on search
  const filteredBusinesses = businesses.filter(business => {
    if (!searchInput) return false;
    
    if (searchMode === 'name') {
      return business.name.toLowerCase().includes(searchInput.toLowerCase());
    } else {
      return business.code.toLowerCase().includes(searchInput.toLowerCase());
    }
  });

  const handleBusinessSelect = (business: Business) => {
    setSelectedBusiness(business);
    setCurrentStep('amount');
  };

  const handleAmountSubmit = () => {
    if (amount && parseFloat(amount) > 0 && selectedBusiness) {
      setCurrentStep('confirm');
    }
  };

  const handlePayment = async () => {
    if (!selectedBusiness || !amount) return;
    
    setCurrentStep('processing');
    setProcessingProgress(0);
    
    // Simulate payment processing with friendly animation
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          const newTransactionId = 'TXN' + Date.now().toString().slice(-8);
          setTransactionId(newTransactionId);
          
          setTimeout(() => {
            payContact(parseFloat(amount), selectedBusiness.name, note || 'Payment to ' + selectedBusiness.name);
            setCurrentStep('success');
          }, 1000);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  const handleScanQR = () => {
    setCurrentStep('scan');
    // Simulate QR scanning
    setTimeout(() => {
      const randomBusiness = businesses[Math.floor(Math.random() * businesses.length)];
      setScanResult(JSON.stringify({
        business: randomBusiness.name,
        code: randomBusiness.code,
        amount: '50.00'
      }));
      alert('QR Code scanned! Business: ' + randomBusiness.name);
    }, 1500);
  };

  const processScannedPayment = () => {
    if (scanResult) {
      try {
        const scannedData = JSON.parse(scanResult);
        const business = businesses.find(b => b.name === scannedData.business) || businesses[0];
        
        setSelectedBusiness(business);
        setAmount(scannedData.amount || '');
        setCurrentStep('confirm');
      } catch {
        // If not JSON, treat as simple business name
        const business = businesses.find(b => b.name.toLowerCase().includes('pharmacy')) || businesses[0];
        setSelectedBusiness(business);
        setCurrentStep('amount');
      }
    }
  };

  const quickAmounts = [10, 25, 50, 100, 250, 500];

  const getBackAction = () => {
    switch (currentStep) {
      case 'amount':
        return () => {
          setSelectedBusiness(null);
          setAmount('');
          setNote('');
          setCurrentStep('main');
        };
      case 'confirm':
        return () => setCurrentStep('amount');
      case 'processing':
      case 'success':
      case 'scan':
        return () => {
          setSelectedBusiness(null);
          setAmount('');
          setNote('');
          setScanResult('');
          setCurrentStep('main');
        };
      default:
        return () => setCurrentScreen('home');
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'main': return 'Pay';
      case 'amount': return 'Enter Amount';
      case 'confirm': return 'Confirm Payment';
      case 'processing': return 'Processing';
      case 'success': return 'Payment Complete';
      case 'scan': return 'Scan QR Code';
      default: return 'Pay';
    }
  };

  const showBottomNav = currentStep === 'main';

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
              flexShrink: 0
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

        {/* Main Payment Screen */}
        {currentStep === 'main' && (
          <div style={{ width: '100%', boxSizing: 'border-box' }}>
            {/* Search Mode Toggle */}
            <div style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '4px',
              marginBottom: '20px'
            }}>
              <button
                onClick={() => setSearchMode('name')}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  background: searchMode === 'name' ? THEME.green : 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  color: searchMode === 'name' ? THEME.black : THEME.white,
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Search by Name
              </button>
              <button
                onClick={() => setSearchMode('code')}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  background: searchMode === 'code' ? THEME.green : 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  color: searchMode === 'code' ? THEME.black : THEME.white,
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Search by Code
              </button>
            </div>

            {/* Search Input */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.9) 0%, rgba(6, 46, 38, 0.3) 100%)',
              padding: '16px',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              marginBottom: '16px',
              backdropFilter: 'blur(10px)'
            }}>
              <input
                type="text"
                placeholder={searchMode === 'name' ? 'Enter business name (e.g., Dovey Pharmacy)' : 'Enter business code (e.g., DOVEY001)'}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: THEME.white,
                  fontSize: '16px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                autoFocus
              />
            </div>

            {/* Search Results */}
            {searchInput && filteredBusinesses.length > 0 && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.9) 0%, rgba(6, 46, 38, 0.3) 100%)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: '20px',
                overflow: 'hidden',
                backdropFilter: 'blur(10px)'
              }}>
                {filteredBusinesses.map((business, index) => (
                  <button
                    key={business.id}
                    onClick={() => handleBusinessSelect(business)}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: index < filteredBusinesses.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                      color: THEME.white,
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: THEME.green,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      fontWeight: 700,
                      color: THEME.black,
                      flexShrink: 0
                    }}>
                      {business.logo}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: 600,
                        marginBottom: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        {business.name}
                        {business.verified && (
                          <span style={{ color: THEME.green, fontSize: '12px' }}></span>
                        )}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: THEME.muted,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <span>Code: {business.code}</span>
                        <span></span>
                        <span>{business.category}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* No Results */}
            {searchInput && filteredBusinesses.length === 0 && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.9) 0%, rgba(6, 46, 38, 0.3) 100%)',
                padding: '30px 20px',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                textAlign: 'center',
                marginBottom: '20px',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}></div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: THEME.white, marginBottom: '8px' }}>
                  Business Not Found
                </div>
                <div style={{ fontSize: '14px', color: THEME.muted }}>
                  {searchMode === 'name' 
                    ? 'No business found with that name. Try searching by code instead.'
                    : 'No business found with that code. Try searching by name instead.'
                  }
                </div>
              </div>
            )}

            {/* QR Scan Option */}
            <button
              onClick={handleScanQR}
              style={{
                width: '100%',
                padding: '20px',
                background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.9) 0%, rgba(6, 46, 38, 0.4) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                color: THEME.white,
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = THEME.green;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '12px' }}></div>
              <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
                Scan QR Code to Pay
              </div>
              <div style={{ fontSize: '14px', color: THEME.muted }}>
                Instant payment by scanning a Zwip QR code
              </div>
            </button>
          </div>
        )}

        {/* QR Scanning Screen */}
        {currentStep === 'scan' && (
          <div style={{
            width: '100%',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1
          }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.9) 0%, rgba(6, 46, 38, 0.4) 100%)',
              padding: '40px 30px',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center',
              width: '100%',
              backdropFilter: 'blur(20px)'
            }}>
              <div style={{
                width: '200px',
                height: '200px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '2px dashed ' + THEME.green,
                borderRadius: '16px',
                margin: '0 auto 24px auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px'
              }}>
                {scanResult ? '' : ''}
              </div>

              <h3 style={{
                margin: '0 0 16px 0',
                fontSize: '20px',
                fontWeight: 700,
                color: THEME.white
              }}>
                {scanResult ? 'QR Code Scanned!' : 'Scan QR Code'}
              </h3>

              <p style={{
                margin: '0 0 24px 0',
                color: THEME.muted,
                fontSize: '14px',
                lineHeight: '1.5'
              }}>
                {scanResult 
                  ? 'Business found! Ready to process payment.'
                  : 'Point your camera at a Zwip QR code to pay instantly'
                }
              </p>

              {scanResult ? (
                <button
                  onClick={processScannedPayment}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: THEME.green,
                    border: 'none',
                    borderRadius: '12px',
                    color: THEME.black,
                    fontSize: '16px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Process Payment
                </button>
              ) : (
                <div style={{
                  color: THEME.muted,
                  fontSize: '12px',
                  fontStyle: 'italic'
                }}>
                  Scanning simulation in progress...
                </div>
              )}
            </div>
          </div>
        )}

        {/* Amount Input Screen with Real-time Fee Display */}
        {currentStep === 'amount' && selectedBusiness && (
          <div style={{ width: '100%', boxSizing: 'border-box' }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.9) 0%, rgba(6, 46, 38, 0.4) 100%)',
              padding: '24px',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              marginBottom: '16px',
              backdropFilter: 'blur(20px)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px',
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '12px'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: THEME.green,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: 700,
                  color: THEME.black
                }}>
                  {selectedBusiness.logo}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: THEME.white, marginBottom: '4px' }}>
                    {selectedBusiness.name}
                  </div>
                  <div style={{ fontSize: '14px', color: THEME.muted }}>
                    {selectedBusiness.category}  Code: {selectedBusiness.code}
                  </div>
                </div>
              </div>

              <label style={{
                display: 'block',
                fontSize: '16px',
                color: THEME.muted,
                marginBottom: '16px',
                fontWeight: 600,
                textAlign: 'center'
              }}>
                Enter Payment Amount
              </label>

              <div style={{
                position: 'relative',
                marginBottom: '24px',
                border: '2px solid ' + THEME.green + '40',
                borderRadius: '16px',
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.03)'
              }}>
                <span style={{
                  position: 'absolute',
                  left: '24px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '28px',
                  color: THEME.white,
                  fontWeight: 700
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
                    padding: '20px 20px 20px 60px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '12px',
                    color: THEME.white,
                    fontSize: '32px',
                    fontWeight: 700,
                    outline: 'none',
                    textAlign: 'center',
                    letterSpacing: '-1px'
                  }}
                  autoFocus
                />
              </div>

              {/* Real-time Fee Display */}
              {totalAmount > 0 && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  marginBottom: '20px'
                }}>
                  <div style={{
                    fontSize: '14px',
                    color: THEME.muted,
                    fontWeight: 600,
                    marginBottom: '12px',
                    textAlign: 'center'
                  }}>
                    Transaction Summary
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: THEME.white, fontSize: '14px' }}>Payment Amount:</span>
                    <span style={{ color: THEME.white, fontSize: '14px', fontWeight: 600 }}>
                      ${totalAmount.toFixed(2)}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: THEME.muted, fontSize: '14px' }}>Transaction Fee:</span>
                    <span style={{ color: THEME.muted, fontSize: '14px' }}>
                      ${transactionFee.toFixed(2)}
                    </span>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '12px',
                    paddingTop: '12px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <span style={{ color: THEME.white, fontSize: '16px', fontWeight: 700 }}>Total:</span>
                    <span style={{ color: THEME.white, fontSize: '16px', fontWeight: 700 }}>
                      ${finalTotal.toFixed(2)}
                    </span>
                  </div>
                  
                  <div style={{
                    fontSize: '11px',
                    color: THEME.muted,
                    textAlign: 'center',
                    marginTop: '8px',
                    fontStyle: 'italic'
                  }}>
                    Fee: 1.5% (min $0.50)
                  </div>
                </div>
              )}

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
                  {quickAmounts.map(quickAmount => (
                    <button
                      key={quickAmount}
                      onClick={() => setAmount(quickAmount.toString())}
                      style={{
                        padding: '12px 8px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: THEME.white,
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      ${quickAmount}
                    </button>
                  ))}
                </div>
              </div>

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
                  placeholder="What'\''s this payment for?"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    color: THEME.white,
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <button
              onClick={handleAmountSubmit}
              disabled={!amount || parseFloat(amount) <= 0}
              style={{
                width: '100%',
                padding: '18px',
                background: !amount || parseFloat(amount) <= 0
                  ? 'rgba(255, 255, 255, 0.05)'
                  : THEME.green,
                border: 'none',
                borderRadius: '12px',
                color: !amount || parseFloat(amount) <= 0
                  ? THEME.muted
                  : THEME.black,
                fontSize: '16px',
                fontWeight: 700,
                cursor: !amount || parseFloat(amount) <= 0
                  ? 'not-allowed'
                  : 'pointer'
              }}
            >
              Continue to Review
            </button>
          </div>
        )}

        {/* Confirmation Screen */}
        {currentStep === 'confirm' && selectedBusiness && (
          <div style={{ width: '100%', boxSizing: 'border-box' }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.9) 0%, rgba(6, 46, 38, 0.4) 100%)',
              padding: '24px',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              marginBottom: '16px',
              backdropFilter: 'blur(20px)',
              textAlign: 'center'
            }}>
              <h3 style={{
                margin: '0 0 20px 0',
                fontSize: '20px',
                fontWeight: 700,
                color: THEME.white
              }}>
                Confirm Payment
              </h3>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px',
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '12px'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: THEME.green,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: 700,
                  color: THEME.black
                }}>
                  {selectedBusiness.logo}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: THEME.white, marginBottom: '4px' }}>
                    {selectedBusiness.name}
                  </div>
                  <div style={{ fontSize: '14px', color: THEME.muted }}>
                    {selectedBusiness.category}
                  </div>
                </div>
              </div>

              <div style={{
                textAlign: 'center',
                marginBottom: '20px',
                padding: '20px',
                background: 'rgba(0, 103, 79, 0.1)',
                borderRadius: '16px',
                border: '1px solid rgba(0, 103, 79, 0.3)'
              }}>
                <div style={{
                  fontSize: '32px',
                  fontWeight: 700,
                  color: THEME.white,
                  marginBottom: '8px'
                }}>
                  ${totalAmount.toFixed(2)}
                </div>
                <div style={{ fontSize: '14px', color: THEME.muted }}>
                  Payment amount
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>      
                  <span style={{ color: THEME.muted, fontSize: '14px' }}>Payment Amount:</span> 
                  <span style={{ color: THEME.white, fontSize: '14px', fontWeight: 600 }}>
                    ${totalAmount.toFixed(2)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>      
                  <span style={{ color: THEME.muted, fontSize: '14px' }}>Transaction Fee:</span>
                  <span style={{ color: THEME.muted, fontSize: '14px' }}>
                    ${transactionFee.toFixed(2)}
                  </span>
                </div>
                {note && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>    
                    <span style={{ color: THEME.muted, fontSize: '14px' }}>Note:</span> 
                    <span style={{ color: THEME.white, fontSize: '14px' }}>{note}</span>
                  </div>
                )}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '8px',
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <span style={{ color: THEME.white, fontSize: '16px', fontWeight: 700 }}>Total Charged:</span>
                  <span style={{ color: THEME.white, fontSize: '16px', fontWeight: 700 }}>
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <div style={{
                background: finalTotal > balance
                  ? 'linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(197, 48, 48, 0.05) 100%)'
                  : 'linear-gradient(135deg, rgba(11, 11, 11, 0.9) 0%, rgba(6, 46, 38, 0.3) 100%)',
                padding: '16px',
                borderRadius: '12px',
                border: finalTotal > balance
                  ? '1px solid rgba(220, 38, 38, 0.3)'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    color: finalTotal > balance ? THEME.error : THEME.muted,    
                    fontSize: '14px',
                    fontWeight: 600
                  }}>
                    Available Balance:
                  </span>
                  <span style={{
                    color: finalTotal > balance ? THEME.error : THEME.white,    
                    fontSize: '14px',
                    fontWeight: 600
                  }}>
                    ${balance.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={finalTotal > balance}
              style={{
                width: '100%',
                padding: '18px',
                background: finalTotal > balance
                  ? 'rgba(255, 255, 255, 0.05)'
                  : THEME.green,
                border: 'none',
                borderRadius: '12px',
                color: finalTotal > balance
                  ? THEME.muted
                  : THEME.black,
                fontSize: '16px',
                fontWeight: 700,
                cursor: finalTotal > balance
                  ? 'not-allowed'
                  : 'pointer'
              }}
            >
              Confirm Payment
            </button>
          </div>
        )}

        {/* Processing Screen with Friendly Animation */}
        {currentStep === 'processing' && (
          <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1
          }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.9) 0%, rgba(6, 46, 38, 0.4) 100%)',
              padding: '40px 30px',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center',
              width: '100%',
              backdropFilter: 'blur(20px)'
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
                border: '2px solid rgba(0, 103, 79, 0.5)'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '15px',
                  background: 'conic-gradient(rgba(0, 103, 79, 0.3) 0%, #00674F ' + processingProgress + '%, rgba(0, 103, 79, 0.3) ' + processingProgress + '%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: 700,
                  color: THEME.white
                }}>
                  {processingProgress}%
                </div>
              </div>

              <h3 style={{
                margin: '0 0 16px 0',
                fontSize: '20px',
                fontWeight: 700,
                color: THEME.white
              }}>
                Processing Payment{loadingDots}
              </h3>

              <p style={{
                margin: '0 0 24px 0',
                color: THEME.muted,
                fontSize: '14px'
              }}>
                Sending ${totalAmount.toFixed(2)} to {selectedBusiness?.name}...
              </p>
            </div>
          </div>
        )}

        {/* Success Screen */}
        {currentStep === 'success' && (
          <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1
          }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.9) 0%, rgba(6, 46, 38, 0.4) 100%)',
              padding: '40px 30px',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center',
              width: '100%',
              backdropFilter: 'blur(20px)'
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
                Payment Complete!
              </h2>

              <p style={{
                margin: '0 0 8px 0',
                color: THEME.muted,
                fontSize: '16px'
              }}>
                You'\''ve successfully paid
              </p>
              <div style={{
                fontSize: '20px',
                fontWeight: 700,
                color: THEME.green,
                marginBottom: '16px'
              }}>
                ${totalAmount.toFixed(2)} to {selectedBusiness?.name}
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
                  cursor: 'pointer'
                }}
              >
                Back to Home
              </button>
            </div>
          </div>
        )}
      </div>

      {showBottomNav && (
        <BottomNav
          currentScreen="pay"
          onNavigate={setCurrentScreen}
        />
      )}
    </div>
  );
}
