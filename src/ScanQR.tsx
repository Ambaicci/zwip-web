// src/ScanQR.tsx - ENHANCED QR SCANNING EXPERIENCE
import { useState, useRef } from 'react';
import { useStore } from './store/useStore';
import { THEME } from './theme';


type ScreenType = 'home' | 'send' | 'add' | 'receive' | 'pay' | 'scan' | 'cashAgent' | 'transactions' | 'settings' | 'profile' | 'menu' | 'more';
type ScanMode = 'scan' | 'result' | 'manual' | 'processing' | 'success' | 'error';

interface ScanResult {
  type: 'payment' | 'user' | 'url' | 'invalid';
  data: any;
  amount?: number;
  recipient?: string;
  note?: string;
  timestamp: Date;
}

export default function ScanQR({ setCurrentScreen }: { setCurrentScreen: (screen: ScreenType) => void }) {
  const { balance, sendMoney } = useStore();
  const [currentMode, setCurrentMode] = useState<ScanMode>('scan');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [manualCode, setManualCode] = useState('');
  const [scanError, setScanError] = useState('');
  const [cameraActive, setCameraActive] = useState(true);
  const scanTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Simulate different QR code types
  const mockQRCodes = [
    {
      type: 'payment' as const,
      data: { amount: 25.00, recipient: 'Coffee Shop', note: 'Morning coffee' },
      amount: 25.00,
      recipient: 'Coffee Shop',
      note: 'Morning coffee',
      timestamp: new Date()
    },
    {
      type: 'payment' as const,
      data: { amount: 50.00, recipient: 'Restaurant', note: 'Dinner' },
      amount: 50.00,
      recipient: 'Restaurant',
      note: 'Dinner',
      timestamp: new Date()
    },
    {
      type: 'user' as const,
      data: { userId: 'user123', name: 'Sarah Wilson', phone: '+1 (555) 111-2222' },
      recipient: 'Sarah Wilson',
      timestamp: new Date()
    },
    {
      type: 'url' as const,
      data: 'https://zwip.com/promo/special-offer',
      timestamp: new Date()
    },
    {
      type: 'invalid' as const,
      data: null,
      timestamp: new Date()
    }
  ];

  // Simulate QR code scanning
  const simulateScan = () => {
    setScanProgress(0);
    setCameraActive(true);
    setScanError('');

    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setScanProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          // Pick a random QR code result
          const randomQR = mockQRCodes[Math.floor(Math.random() * mockQRCodes.length)];
          setScanResult(randomQR);
          setCurrentMode('result');
          setCameraActive(false);
        }, 500);
      }
    }, 100);
  };

  const handleProcessPayment = async () => {
    if (!scanResult || scanResult.type !== 'payment' || !scanResult.amount) return;

    setCurrentMode('processing');
    setProcessingProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setProcessingProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(async () => {
          try {
            await sendMoney(scanResult.amount!, scanResult.recipient || 'Unknown', scanResult.note);
            setCurrentMode('success');
          } catch (error) {
            setScanError('Payment failed. Please try again.');
            setCurrentMode('error');
          }
        }, 500);
      }
    }, 150);
  };

  const handleManualSubmit = () => {
    if (!manualCode.trim()) {
      setScanError('Please enter a QR code');
      return;
    }

    setCurrentMode('processing');
    setProcessingProgress(0);

    // Simulate processing manual code
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setProcessingProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          const mockResult: ScanResult = {
            type: 'payment',
            data: { amount: 30.00, recipient: 'Manual Entry', note: 'From manual code' },
            amount: 30.00,
            recipient: 'Manual Entry',
            note: 'From manual code',
            timestamp: new Date()
          };
          setScanResult(mockResult);
          setCurrentMode('result');
        }, 500);
      }
    }, 100);
  };

  const handleFlashToggle = () => {
    setIsFlashOn(!isFlashOn);
    // In a real app, this would control the camera flash
  };

  const resetScanner = () => {
    setCurrentMode('scan');
    setScanResult(null);
    setScanProgress(0);
    setProcessingProgress(0);
    setManualCode('');
    setScanError('');
    setCameraActive(true);
    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current);
    }
  };

  const getScanTitle = () => {
    switch (currentMode) {
      case 'scan': return 'Scan QR Code';
      case 'result': return 'Scan Result';
      case 'manual': return 'Enter Code Manually';
      case 'processing': return 'Processing...';
      case 'success': return 'Payment Successful!';
      case 'error': return 'Scan Error';
      default: return 'Scan QR Code';
    }
  };



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
            onClick={() => currentMode === 'scan' ? setCurrentScreen('home') : resetScanner()}
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
            {currentMode === 'scan' ? 'Close' : 'Back'}
          </button>

          <h1 style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: 700,
            color: THEME.white,
            textAlign: 'center',
            flex: 1
          }}>
            {getScanTitle()}
          </h1>

          <div style={{ width: '70px', flexShrink: 0 }}></div>
        </div>

        {/* Main Content */}
        <div style={{
          flex: 1,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          paddingBottom: '20px',
          boxSizing: 'border-box'
        }}>
          {currentMode === 'scan' && (
            <div style={{ width: '100%', boxSizing: 'border-box' }}>
              {/* Scanner Preview */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.9) 0%, rgba(6, 46, 38, 0.3) 100%)',
                padding: '30px',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: '20px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(20px)'
              }}>
                {/* Scanner Animation */}
                <div style={{
                  width: '200px',
                  height: '200px',
                  margin: '0 auto 20px auto',
                  position: 'relative',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}>
                  {/* Scanner overlay */}
                  <div style={{
                    position: 'absolute',
                    top: '0%',
                    left: '0',
                    right: '0',
                    height: '2px',
                    background: THEME.green,
                    animation: 'scanLine 2s ease-in-out infinite'
                  }}></div>

                  {/* Camera feed simulation */}
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(45deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    color: THEME.muted
                  }}>
                    {cameraActive ? 'Camera Active' : 'Camera Off'}
                  </div>

                  {/* Corner borders */}
                  <div style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '20px',
                    height: '20px',
                    borderTop: '2px solid ' + THEME.green,
                    borderLeft: '2px solid ' + THEME.green
                  }}></div>
                  <div style={{
                    position: 'absolute',
                    top: '0',
                    right: '0',
                    width: '20px',
                    height: '20px',
                    borderTop: '2px solid ' + THEME.green,
                    borderRight: '2px solid ' + THEME.green
                  }}></div>
                  <div style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    width: '20px',
                    height: '20px',
                    borderBottom: '2px solid ' + THEME.green,
                    borderLeft: '2px solid ' + THEME.green
                  }}></div>
                  <div style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    width: '20px',
                    height: '20px',
                    borderBottom: '2px solid ' + THEME.green,
                    borderRight: '2px solid ' + THEME.green
                  }}></div>
                </div>

                <h3 style={{
                  margin: '0 0 12px 0',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: THEME.white
                }}>
                  Position QR Code in Frame
                </h3>

                <p style={{
                  margin: '0 0 24px 0',
                  fontSize: '14px',
                  color: THEME.muted,
                  lineHeight: '1.5'
                }}>
                  Align the QR code within the frame to scan automatically
                </p>

                {/* Progress Bar */}
                <div style={{
                  width: '100%',
                  height: '4px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '2px',
                  overflow: 'hidden',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    width: scanProgress + '%',
                    height: '100%',
                    background: THEME.green,
                    borderRadius: '2px',
                    transition: 'width 0.3s ease'
                  }} />
                </div>

                <div style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'center'
                }}>
                  <button
                    onClick={simulateScan}
                    style={{
                      padding: '14px 24px',
                      background: THEME.green,
                      border: 'none',
                      borderRadius: '12px',
                      color: THEME.black,
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      flex: 1
                    }}
                  >
                    Simulate Scan
                  </button>

                  <button
                    onClick={handleFlashToggle}
                    style={{
                      padding: '14px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      color: THEME.white,
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      minWidth: '60px'
                    }}
                  >
                    {isFlashOn ? '' : ''}
                  </button>
                </div>
              </div>

              {/* Manual Entry Option */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.9) 0%, rgba(6, 46, 38, 0.3) 100%)',
                padding: '20px',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: '20px'
              }}>
                <h3 style={{
                  margin: '0 0 12px 0',
                  fontSize: '16px',
                  fontWeight: 700,
                  color: THEME.white
                }}>
                  Manual Entry
                </h3>

                <p style={{
                  margin: '0 0 16px 0',
                  fontSize: '14px',
                  color: THEME.muted
                }}>
                  Can't scan? Enter the QR code manually
                </p>

                <button
                  onClick={() => setCurrentMode('manual')}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    color: THEME.white,
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Enter Code Manually
                </button>
              </div>

              {/* Scan Tips */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.9) 0%, rgba(6, 46, 38, 0.3) 100%)',
                padding: '20px',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <h3 style={{
                  margin: '0 0 12px 0',
                  fontSize: '16px',
                  fontWeight: 700,
                  color: THEME.white
                }}>
                  Scan Tips
                </h3>

                <ul style={{
                  margin: 0,
                  paddingLeft: '20px',
                  color: THEME.muted,
                  fontSize: '14px',
                  lineHeight: '1.6'
                }}>
                  <li>Ensure good lighting</li>
                  <li>Hold steady and align with frame</li>
                  <li>Keep QR code clean and undamaged</li>
                  <li>Use manual entry if scanning fails</li>
                </ul>
              </div>
            </div>
          )}

          {currentMode === 'manual' && (
            <div style={{ width: '100%', boxSizing: 'border-box' }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.9) 0%, rgba(6, 46, 38, 0.3) 100%)',
                padding: '24px',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: '20px'
              }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  color: THEME.muted,
                  marginBottom: '16px',
                  fontWeight: 600
                }}>
                  Enter QR Code Data
                </label>

                <textarea
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="Paste QR code content here..."
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: '16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: THEME.white,
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                    fontFamily: 'monospace'
                  }}
                />

                {scanError && (
                  <div style={{
                    color: THEME.error,
                    fontSize: '12px',
                    fontWeight: 600,
                    marginTop: '12px',
                    padding: '8px 12px',
                    background: 'rgba(220, 38, 38, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(220, 38, 38, 0.2)'
                  }}>
                    {scanError}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setCurrentMode('scan')}
                  style={{
                    flex: 1,
                    padding: '16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: THEME.white,
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Back to Scanner
                </button>

                <button
                  onClick={handleManualSubmit}
                  disabled={!manualCode.trim()}
                  style={{
                    flex: 1,
                    padding: '16px',
                    background: !manualCode.trim() ? 'rgba(255, 255, 255, 0.05)' : THEME.green,
                    border: 'none',
                    borderRadius: '12px',
                    color: !manualCode.trim() ? THEME.muted : THEME.black,
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: !manualCode.trim() ? 'not-allowed' : 'pointer'
                  }}
                >
                  Process Code
                </button>
              </div>
            </div>
          )}

          {currentMode === 'result' && scanResult && (
            <div style={{ width: '100%', boxSizing: 'border-box' }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.9) 0%, rgba(6, 46, 38, 0.3) 100%)',
                padding: '24px',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                {/* Result Icon */}
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '20px',
                  background: scanResult.type === 'invalid' 
                    ? 'rgba(220, 38, 38, 0.2)' 
                    : 'rgba(0, 103, 79, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px auto',
                  border: '2px solid ' + (scanResult.type === 'invalid' ? THEME.error : THEME.green),
                  fontSize: '24px',
                  fontWeight: 700,
                  color: scanResult.type === 'invalid' ? THEME.error : THEME.green
                }}>
                  {scanResult.type === 'payment' ? '' : 
                   scanResult.type === 'user' ? '' : 
                   scanResult.type === 'url' ? '' : ''}
                </div>

                <h3 style={{
                  margin: '0 0 12px 0',
                  fontSize: '20px',
                  fontWeight: 700,
                  color: THEME.white
                }}>
                  {scanResult.type === 'payment' ? 'Payment Request' :
                   scanResult.type === 'user' ? 'User Profile' :
                   scanResult.type === 'url' ? 'Website Link' :
                   'Invalid QR Code'}
                </h3>

                <p style={{
                  margin: '0 0 20px 0',
                  fontSize: '14px',
                  color: THEME.muted,
                  lineHeight: '1.5'
                }}>
                  {scanResult.type === 'payment' ? 'Ready to process payment' :
                   scanResult.type === 'user' ? 'User contact information' :
                   scanResult.type === 'url' ? 'External website link' :
                   'This QR code cannot be processed'}
                </p>

                {/* Result Details */}
                {scanResult.type === 'payment' && (
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    padding: '20px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    marginBottom: '20px'
                  }}>
                    <div style={{
                      fontSize: '28px',
                      fontWeight: 700,
                      color: THEME.white,
                      marginBottom: '8px'
                    }}>
                      ${scanResult.amount?.toFixed(2)}
                    </div>
                    <div style={{ fontSize: '14px', color: THEME.muted, marginBottom: '16px' }}>
                      to {scanResult.recipient}
                    </div>
                    {scanResult.note && (
                      <div style={{
                        fontSize: '12px',
                        color: THEME.muted,
                        fontStyle: 'italic'
                      }}>
                        Note: {scanResult.note}
                      </div>
                    )}
                  </div>
                )}

                {scanResult.type === 'user' && (
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    padding: '20px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    marginBottom: '20px'
                  }}>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: 700,
                      color: THEME.white,
                      marginBottom: '8px'
                    }}>
                      {scanResult.recipient}
                    </div>
                    <div style={{ fontSize: '14px', color: THEME.muted }}>
                      {scanResult.data?.phone}
                    </div>
                  </div>
                )}

                {scanResult.type === 'url' && (
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    padding: '20px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    marginBottom: '20px',
                    wordBreak: 'break-all'
                  }}>
                    <div style={{ fontSize: '12px', color: THEME.muted, marginBottom: '8px' }}>
                      URL:
                    </div>
                    <div style={{ fontSize: '14px', color: THEME.white }}>
                      {scanResult.data}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={resetScanner}
                  style={{
                    flex: 1,
                    padding: '16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: THEME.white,
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Scan Another
                </button>

                {scanResult.type === 'payment' && (
                  <button
                    onClick={handleProcessPayment}
                    disabled={!!(scanResult.amount && scanResult.amount > balance)}
                    style={{
                      flex: 1,
                      padding: '16px',
                      background: (scanResult.amount && scanResult.amount > balance) 
                        ? 'rgba(255, 255, 255, 0.05)' 
                        : THEME.green,
                      border: 'none',
                      borderRadius: '12px',
                      color: (scanResult.amount && scanResult.amount > balance) 
                        ? THEME.muted 
                        : THEME.black,
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: (scanResult.amount && scanResult.amount > balance) 
                        ? 'not-allowed' 
                        : 'pointer'
                    }}
                  >
                    Pay Now
                  </button>
                )}

                {(scanResult.type === 'user' || scanResult.type === 'url') && (
                  <button
                    onClick={() => {
                      if (scanResult.type === 'url') {
                        window.open(scanResult.data, '_blank');
                      } else {
                        alert('User profile would open here');
                      }
                    }}
                    style={{
                      flex: 1,
                      padding: '16px',
                      background: THEME.green,
                      border: 'none',
                      borderRadius: '12px',
                      color: THEME.black,
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {scanResult.type === 'url' ? 'Open Link' : 'View Profile'}
                  </button>
                )}
              </div>
            </div>
          )}

          {currentMode === 'processing' && (
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
                background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.9) 0%, rgba(6, 46, 38, 0.3) 100%)',
                padding: '40px 30px',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                textAlign: 'center',
                width: '100%'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
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
                    borderRadius: '50%',
                    background: 'conic-gradient(rgba(0, 103, 79, 0.3) 0%, #00674F ' + processingProgress + '%, rgba(0, 103, 79, 0.3) ' + processingProgress + '%)',
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
                  Processing...
                </h3>

                <p style={{
                  margin: '0 0 24px 0',
                  color: THEME.muted,
                  fontSize: '14px',
                  lineHeight: '1.5'
                }}>
                  {scanResult?.type === 'payment' 
                    ? 'Completing your payment transaction' 
                    : 'Processing your request...'
                  }
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
                    width: processingProgress + '%',
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

          {currentMode === 'success' && (
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
                background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.9) 0%, rgba(6, 46, 38, 0.3) 100%)',
                padding: '40px 30px',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                textAlign: 'center',
                width: '100%'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'rgba(0, 103, 79, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px auto',
                  border: '2px solid ' + THEME.green,
                  fontSize: '32px',
                  fontWeight: 700,
                  color: THEME.green
                }}>
                  
                </div>

                <h3 style={{
                  margin: '0 0 12px 0',
                  fontSize: '24px',
                  fontWeight: 700,
                  color: THEME.white
                }}>
                  Payment Successful!
                </h3>

                <p style={{
                  margin: '0 0 24px 0',
                  color: THEME.muted,
                  fontSize: '14px',
                  lineHeight: '1.5'
                }}>
                  Your payment has been processed successfully
                </p>

                {scanResult?.type === 'payment' && (
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    padding: '20px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    marginBottom: '24px'
                  }}>
                    <div style={{
                      fontSize: '20px',
                      fontWeight: 700,
                      color: THEME.white,
                      marginBottom: '8px'
                    }}>
                      ${scanResult.amount?.toFixed(2)}
                    </div>
                    <div style={{ fontSize: '14px', color: THEME.muted }}>
                      to {scanResult.recipient}
                    </div>
                  </div>
                )}

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
                    cursor: 'pointer'
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {currentMode === 'error' && (
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
                background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.9) 0%, rgba(6, 46, 38, 0.3) 100%)',
                padding: '40px 30px',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                textAlign: 'center',
                width: '100%'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'rgba(220, 38, 38, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px auto',
                  border: '2px solid ' + THEME.error,
                  fontSize: '32px',
                  fontWeight: 700,
                  color: THEME.error
                }}>
                  
                </div>

                <h3 style={{
                  margin: '0 0 12px 0',
                  fontSize: '20px',
                  fontWeight: 700,
                  color: THEME.white
                }}>
                  Processing Error
                </h3>

                <p style={{
                  margin: '0 0 24px 0',
                  color: THEME.muted,
                  fontSize: '14px',
                  lineHeight: '1.5'
                }}>
                  {scanError || 'An error occurred while processing your request'}
                </p>

                <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                  <button
                    onClick={resetScanner}
                    style={{
                      flex: 1,
                      padding: '16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      color: THEME.white,
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Try Again
                  </button>

                  <button
                    onClick={() => setCurrentScreen('home')}
                    style={{
                      flex: 1,
                      padding: '16px',
                      background: THEME.green,
                      border: 'none',
                      borderRadius: '12px',
                      color: THEME.black,
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Go Home
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes scanLine {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
      `}</style>
    </div>
  );
}

