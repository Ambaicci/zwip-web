// src/SendMoney.tsx - COMPLETE WORKING VERSION
import { useState, useEffect } from 'react';
import { useStore } from './store/useStore';
import { THEME } from './theme';
import BottomNav from './components/Navigation/BottomNav';

type ScreenType = 'home' | 'send' | 'add' | 'receive' | 'pay' | 'scan' | 'cashAgent' | 'transactions' | 'settings' | 'profile' | 'menu' | 'more';
type SendStep = 'input' | 'contacts' | 'amount' | 'confirm' | 'scanning';

export default function SendMoney({ setCurrentScreen }: { setCurrentScreen: (screen: ScreenType) => void }) {
  const { sendMoney, balance } = useStore();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [currentStep, setCurrentStep] = useState<SendStep>('input');
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [fee, setFee] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [amountError, setAmountError] = useState('');

  const [scanProgress, setScanProgress] = useState(0);
  const [nearbyUsers, setNearbyUsers] = useState<any[]>([]);

  // Mock data for contacts
  const contacts = [
    { id: '1', name: 'Sarah Wilson', phone: '+1 (555) 111-2222' },
    { id: '2', name: 'Mike Johnson', phone: '+1 (555) 222-3333' },
    { id: '3', name: 'Emily Davis', phone: '+1 (555) 333-4444' },
    { id: '4', name: 'Alex Brown', phone: '+1 (555) 444-5555' },
    { id: '5', name: 'Jessica Lee', phone: '+1 (555) 555-6666' },
    { id: '6', name: 'David Miller', phone: '+1 (555) 666-7777' }
  ];

  // Mock data for nearby users
  const mockNearbyUsers = [
    { id: 'n1', name: 'James Wilson', phone: '+1 (555) 777-8888', distance: '15m away' },
    { id: 'n2', name: 'Lisa Garcia', phone: '+1 (555) 888-9999', distance: '25m away' },
    { id: 'n3', name: 'Robert Chen', phone: '+1 (555) 999-0000', distance: '40m away' }
  ];

  // Enhanced fee calculation
  useEffect(() => {
    const numAmount = parseFloat(amount) || 0;

    let calculatedFee = 0;
    if (numAmount > 0) {
      if (numAmount <= 100) {
        calculatedFee = 1.50;
      } else if (numAmount <= 1000) {
        calculatedFee = numAmount * 0.015;
      } else {
        calculatedFee = numAmount * 0.01;
      }
      calculatedFee = Math.max(calculatedFee, 0.50);
    }

    const calculatedTotal = numAmount + calculatedFee;

    setFee(calculatedFee);
    setTotalAmount(calculatedTotal);

    if (numAmount > 0) {
      if (calculatedTotal > balance) {
        setAmountError('Insufficient balance for this transfer');
      } else if (numAmount > 5000) {
        setAmountError('Maximum send limit is $5,000 per transaction');
      } else if (numAmount < 5) {
        setAmountError('Minimum send amount is $5.00');
      } else {
        setAmountError('');
      }
    } else {
      setAmountError('');
    }
  }, [amount, balance]);

  const handleSendMoney = async () => {
    if (!selectedContact && !phoneNumber) return;

    try {
      const numAmount = parseFloat(amount);
      if (numAmount <= 0) {
        alert('Amount must be greater than 0');
        return;
      }

      if (totalAmount > balance) {
        alert('Insufficient balance');
        return;
      }

      const recipient = selectedContact ? selectedContact.phone : phoneNumber;
      const recipientName = selectedContact ? selectedContact.name : phoneNumber;
      
      await sendMoney(numAmount, recipient, note);
      
      alert(' Money Sent Successfully!\n\n$' + numAmount.toFixed(2) + ' has been sent to ' + recipientName + '\nTransaction completed.');
      
      setCurrentScreen('home');
    } catch (err: any) {
      alert(err.message || 'Failed to send money');
    }
  };

  const handleContactSelect = (contact: any) => {
    setSelectedContact(contact);
    setPhoneNumber(contact.phone);
    setCurrentStep('amount');
  };

  const handleNearbyUserSelect = (user: any) => {
    setSelectedContact(user);
    setPhoneNumber(user.phone);
    setCurrentStep('amount');
  };

  const handleAmountSubmit = () => {
    if (amount && parseFloat(amount) > 0 && !amountError) {
      setCurrentStep('confirm');
    }
  };

  const handleScanForUsers = () => {

    setCurrentStep('scanning');

    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setScanProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {

          setNearbyUsers(mockNearbyUsers);
          setCurrentStep('contacts');
        }, 1000);
      }
    }, 100);
  };

  const filteredContacts = searchQuery
    ? contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phone.includes(searchQuery)
      )
    : contacts;

  const getBackAction = () => {
    switch (currentStep) {
      case 'contacts':
        return () => setCurrentStep('input');
      case 'amount':
        return () => setCurrentStep(selectedContact ? 'contacts' : 'input');
      case 'confirm':
        return () => setCurrentStep('amount');
      case 'scanning':
        return () => {

          setCurrentStep('input');
        };
      default:
        return () => setCurrentScreen('home');
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'input': return 'Send Money';
      case 'contacts': return 'Select Contact';
      case 'amount': return 'Enter Amount';
      case 'confirm': return 'Confirm Payment';
      case 'scanning': return 'Finding Users';
      default: return 'Send Money';
    }
  };

  const quickAmounts = [10, 25, 50, 100, 250, 500];
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
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
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
              <div style={{
                background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.9) 0%, rgba(6, 46, 38, 0.3) 100%)',
                padding: '24px',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: '20px',
                width: '100%',
                boxSizing: 'border-box'
              }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  color: THEME.muted,
                  marginBottom: '16px',
                  fontWeight: 600
                }}>
                  Enter Phone Number or Zwip ID
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 (555) 123-4567"
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
                />
              </div>

              <div style={{
                background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.9) 0%, rgba(6, 46, 38, 0.3) 100%)',
                padding: '24px',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: '20px',
                width: '100%',
                boxSizing: 'border-box'
              }}>
                <h3 style={{
                  margin: '0 0 20px 0',
                  fontSize: '16px',
                  fontWeight: 700,
                  color: THEME.white
                }}>
                  Find Recipient
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>       
                  <button
                    onClick={() => setCurrentStep('contacts')}
                    style={{
                      width: '100%',
                      padding: '18px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      color: THEME.white,
                      fontSize: '16px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: THEME.green,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      fontWeight: 600,
                      color: THEME.black,
                      flexShrink: 0
                    }}>
                      
                    </div>
                    <div>Select from Contacts</div>
                  </button>

                  <button
                    onClick={handleScanForUsers}
                    style={{
                      width: '100%',
                      padding: '18px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      color: THEME.white,
                      fontSize: '16px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: THEME.emeraldLight,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      fontWeight: 600,
                      color: THEME.black,
                      flexShrink: 0
                    }}>
                      
                    </div>
                    <div>Find Nearby Zwip Users</div>
                  </button>
                </div>
              </div>

              <button
                onClick={() => setCurrentStep('amount')}
                disabled={!phoneNumber.trim()}
                style={{
                  width: '100%',
                  padding: '20px',
                  background: !phoneNumber.trim() ? 'rgba(255, 255, 255, 0.05)' : THEME.green,
                  border: 'none',
                  borderRadius: '16px',
                  color: !phoneNumber.trim() ? THEME.muted : THEME.black,
                  fontSize: '18px',
                  fontWeight: 700,
                  cursor: !phoneNumber.trim() ? 'not-allowed' : 'pointer',
                  boxSizing: 'border-box'
                }}
              >
                Continue
              </button>
            </div>
          )}

          {currentStep === 'contacts' && (
            <div style={{ width: '100%', boxSizing: 'border-box' }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.9) 0%, rgba(6, 46, 38, 0.3) 100%)',
                padding: '20px',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: '20px',
                width: '100%',
                boxSizing: 'border-box'
              }}>
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                />
              </div>

              {nearbyUsers.length > 0 && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.9) 0%, rgba(6, 46, 38, 0.3) 100%)',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  overflow: 'hidden',
                  marginBottom: '20px',
                  width: '100%',
                  boxSizing: 'border-box'
                }}>
                  <div style={{
                    padding: '16px 20px',
                    background: 'rgba(0, 103, 79, 0.2)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: THEME.green
                  }}>
                     Nearby Zwip Users
                  </div>
                  {nearbyUsers.map(user => (
                    <button
                      key={user.id}
                      onClick={() => handleNearbyUserSelect(user)}
                      style={{
                        width: '100%',
                        padding: '18px',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        color: THEME.white,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        boxSizing: 'border-box'
                      }}
                    >
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: THEME.emeraldLight,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        fontWeight: 600,
                        color: THEME.black,
                        flexShrink: 0
                      }}>
                        {user.name.charAt(0)}
                      </div>
                      <div style={{ textAlign: 'left', flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '16px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {user.name}
                        </div>
                        <div style={{ fontSize: '14px', color: THEME.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {user.distance}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <div style={{
                background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.9) 0%, rgba(6, 46, 38, 0.3) 100%)',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                overflow: 'hidden',
                marginBottom: '20px',
                width: '100%',
                boxSizing: 'border-box'
              }}>
                <div style={{
                  padding: '16px 20px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: THEME.muted
                }}>
                   Your Contacts
                </div>
                {filteredContacts.map(contact => (
                  <button
                    key={contact.id}
                    onClick={() => handleContactSelect(contact)}
                    style={{
                      width: '100%',
                      padding: '18px',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      color: THEME.white,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      boxSizing: 'border-box'
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
                      fontSize: '16px',
                      fontWeight: 600,
                      color: THEME.black,
                      flexShrink: 0
                    }}>
                      {contact.name.charAt(0)}
                    </div>
                    <div style={{ textAlign: 'left', flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '16px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {contact.name}
                      </div>
                      <div style={{ fontSize: '14px', color: THEME.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {contact.phone}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 'amount' && (
            <div style={{ width: '100%', boxSizing: 'border-box' }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.9) 0%, rgba(6, 46, 38, 0.3) 100%)',
                padding: '20px',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: '20px',
                width: '100%',
                boxSizing: 'border-box'
              }}>
                <div style={{ fontSize: '14px', color: THEME.muted, marginBottom: '12px', fontWeight: 600 }}>
                  Sending to:
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: THEME.green,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: THEME.black,
                    flexShrink: 0
                  }}>
                    {selectedContact ? selectedContact.name.charAt(0) : '?'}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: THEME.white, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {selectedContact ? selectedContact.name : phoneNumber}
                    </div>
                    <div style={{ fontSize: '14px', color: THEME.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {selectedContact ? selectedContact.phone : phoneNumber}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.9) 0%, rgba(6, 46, 38, 0.3) 100%)',
                padding: '24px',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: '20px',
                width: '100%',
                boxSizing: 'border-box'
              }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  color: THEME.muted,
                  marginBottom: '16px',
                  fontWeight: 600
                }}>
                  Enter Amount
                </label>
                
                <div style={{ position: 'relative', marginBottom: '20px' }}>
                  <span style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '20px',
                    color: THEME.white,
                    fontWeight: 600
                  }}>$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    style={{
                      width: '100%',
                      padding: '16px 16px 16px 40px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: amountError ? '1px solid ' + THEME.error : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      color: THEME.white,
                      fontSize: '18px',
                      fontWeight: 600,
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
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
                    border: '1px solid rgba(220, 38, 38, 0.2)'
                  }}>
                     {amountError}
                  </div>
                )}

                <div style={{ marginBottom: '20px' }}>
                  <div style={{
                    fontSize: '14px',
                    color: THEME.muted,
                    marginBottom: '12px',
                    fontWeight: 600
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
                          borderRadius: '10px',
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
                    placeholder="What'\''s this for?"
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

              {parseFloat(amount) > 0 && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.9) 0%, rgba(6, 46, 38, 0.3) 100%)',
                  padding: '20px',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  marginBottom: '20px',
                  width: '100%',
                  boxSizing: 'border-box'
                }}>
                  <div style={{
                    fontSize: '14px',
                    color: THEME.muted,
                    marginBottom: '16px',
                    fontWeight: 600
                  }}>
                    Transaction Summary
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: THEME.white, fontSize: '14px' }}>Amount:</span>
                    <span style={{ color: THEME.white, fontSize: '14px', fontWeight: 600 }}>
                      ${parseFloat(amount).toFixed(2)}
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
                    marginTop: '12px',
                    paddingTop: '12px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <span style={{ color: THEME.white, fontSize: '16px', fontWeight: 600 }}>Total:</span>
                    <span style={{ color: THEME.white, fontSize: '16px', fontWeight: 600 }}>
                      ${totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={handleAmountSubmit}
                disabled={!amount || parseFloat(amount) <= 0 || !!amountError}
                style={{
                  width: '100%',
                  padding: '20px',
                  background: (!amount || parseFloat(amount) <= 0 || !!amountError) 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : THEME.green,
                  border: 'none',
                  borderRadius: '16px',
                  color: (!amount || parseFloat(amount) <= 0 || !!amountError) 
                    ? THEME.muted 
                    : THEME.black,
                  fontSize: '18px',
                  fontWeight: 700,
                  cursor: (!amount || parseFloat(amount) <= 0 || !!amountError) 
                    ? 'not-allowed' 
                    : 'pointer',
                  boxSizing: 'border-box'
                }}
              >
                Continue to Review
              </button>
            </div>
          )}

          {currentStep === 'confirm' && (
            <div style={{ width: '100%', boxSizing: 'border-box' }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.9) 0%, rgba(6, 46, 38, 0.3) 100%)',
                padding: '24px',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: '20px',
                width: '100%',
                boxSizing: 'border-box'
              }}>
                <h3 style={{
                  margin: '0 0 20px 0',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: THEME.white,
                  textAlign: 'center'
                }}>
                  Review Payment
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
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: THEME.green,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    fontWeight: 600,
                    color: THEME.black,
                    flexShrink: 0
                  }}>
                    {selectedContact ? selectedContact.name.charAt(0) : '?'}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: THEME.white, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {selectedContact ? selectedContact.name : phoneNumber}
                    </div>
                    <div style={{ fontSize: '14px', color: THEME.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {selectedContact ? selectedContact.phone : phoneNumber}
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
                    ${parseFloat(amount).toFixed(2)}
                  </div>
                  <div style={{ fontSize: '14px', color: THEME.muted }}>
                    Total amount to send
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: THEME.muted, fontSize: '14px' }}>Transfer Amount:</span>
                    <span style={{ color: THEME.white, fontSize: '14px', fontWeight: 600 }}>
                      ${parseFloat(amount).toFixed(2)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: THEME.muted, fontSize: '14px' }}>Processing Fee:</span>
                    <span style={{ color: THEME.muted, fontSize: '14px' }}>
                      ${fee.toFixed(2)}
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
                    <span style={{ color: THEME.white, fontSize: '16px', fontWeight: 600 }}>Total:</span>
                    <span style={{ color: THEME.white, fontSize: '16px', fontWeight: 600 }}>
                      ${totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{
                background: totalAmount > balance 
                  ? 'linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(197, 48, 48, 0.05) 100%)'
                  : 'linear-gradient(135deg, rgba(11, 11, 11, 0.9) 0%, rgba(6, 46, 38, 0.3) 100%)',
                padding: '16px',
                borderRadius: '12px',
                border: totalAmount > balance 
                  ? '1px solid rgba(220, 38, 38, 0.3)'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: '20px',
                width: '100%',
                boxSizing: 'border-box'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ 
                    color: totalAmount > balance ? THEME.error : THEME.muted, 
                    fontSize: '14px',
                    fontWeight: 600
                  }}>
                    Available Balance:
                  </span>
                  <span style={{ 
                    color: totalAmount > balance ? THEME.error : THEME.white, 
                    fontSize: '14px',
                    fontWeight: 600
                  }}>
                    ${balance.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleSendMoney}
                disabled={totalAmount > balance}
                style={{
                  width: '100%',
                  padding: '20px',
                  background: totalAmount > balance 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : THEME.green,
                  border: 'none',
                  borderRadius: '16px',
                  color: totalAmount > balance 
                    ? THEME.muted 
                    : THEME.black,
                  fontSize: '18px',
                  fontWeight: 700,
                  cursor: totalAmount > balance 
                    ? 'not-allowed' 
                    : 'pointer',
                  boxSizing: 'border-box'
                }}
              >
                Send ${parseFloat(amount).toFixed(2)}
              </button>
            </div>
          )}

          {currentStep === 'scanning' && (
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
                width: '100%',
                boxSizing: 'border-box'
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
                    background: 'conic-gradient(rgba(0, 103, 79, 0.3) 0%, #00674F ' + scanProgress + '%, rgba(0, 103, 79, 0.3) ' + scanProgress + '%)',
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
                  Finding Nearby Users
                </h3>

                <p style={{
                  margin: '0 0 24px 0',
                  color: THEME.muted,
                  fontSize: '14px',
                  lineHeight: '1.5'
                }}>
                  Scanning for Zwip users in your vicinity...
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
                    width: scanProgress + '%',
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
                  {scanProgress}% Complete
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showBottomNav && (
        <BottomNav
          currentScreen="send"
          onNavigate={setCurrentScreen}
        />
      )}
    </div>
  );
}
