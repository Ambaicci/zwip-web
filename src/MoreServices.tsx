// src/MoreServices.tsx


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

export default function MoreServices({ setCurrentScreen }: { setCurrentScreen: (screen: ScreenType) => void }) {
  const services = [
    { 
      id: 'billPay', 
      name: 'Bill Pay', 
      description: 'Pay utilities, internet, and more',
      icon: '',
      comingSoon: false
    },
    { 
      id: 'mobileTopup', 
      name: 'Mobile Top-up', 
      description: 'Recharge any mobile number',
      icon: '',
      comingSoon: false
    },
    { 
      id: 'giftCards', 
      name: 'Gift Cards', 
      description: 'Buy and send digital gift cards',
      icon: '',
      comingSoon: true
    },
    { 
      id: 'insurance', 
      name: 'Insurance', 
      description: 'Get insured in minutes',
      icon: '',
      comingSoon: true
    },
    { 
      id: 'investments', 
      name: 'Investments', 
      description: 'Start investing with small amounts',
      icon: '',
      comingSoon: true
    },
    { 
      id: 'loans', 
      name: 'Quick Loans', 
      description: 'Apply for instant loans',
      icon: '',
      comingSoon: true
    },
    { 
      id: 'charity', 
      name: 'Donations', 
      description: 'Support your favorite causes',
      icon: '',
      comingSoon: false
    },
    { 
      id: 'travel', 
      name: 'Travel Booking', 
      description: 'Book flights and hotels',
      icon: '',
      comingSoon: true
    }
  ];

  const handleServiceClick = (serviceId: string, comingSoon: boolean) => {
    if (comingSoon) {
      alert('This service is coming soon!');
      return;
    }

    switch (serviceId) {
      case 'billPay':
        alert('Bill Pay feature opening...');
        break;
      case 'mobileTopup':
        alert('Mobile Top-up feature opening...');
        break;
      case 'charity':
        alert('Donations feature opening...');
        break;
      default:
        alert('Service coming soon!');
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
            <path d="M12 5V19M5 12H19"/>
          </svg>
          More Services
        </h1>

        <div style={{ width: '60px' }}></div>
      </div>

      <div style={{ padding: '0 16px' }}>
        {/* Services Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          marginBottom: '20px'
        }}>
          {services.map(service => (
            <button
              key={service.id}
              onClick={() => handleServiceClick(service.id, service.comingSoon)}
              style={{
                padding: '20px 16px',
                backgroundColor: THEME.card,
                border: `1px solid ${THEME.border}`,
                borderRadius: '16px',
                color: THEME.white,
                cursor: service.comingSoon ? 'default' : 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s ease',
                position: 'relative',
                opacity: service.comingSoon ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!service.comingSoon) {
                  e.currentTarget.style.backgroundColor = THEME.green;
                  e.currentTarget.style.color = THEME.black;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!service.comingSoon) {
                  e.currentTarget.style.backgroundColor = THEME.card;
                  e.currentTarget.style.color = THEME.white;
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {service.comingSoon && (
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  backgroundColor: THEME.muted,
                  color: THEME.black,
                  fontSize: '10px',
                  fontWeight: '700',
                  padding: '2px 6px',
                  borderRadius: '8px'
                }}>
                  SOON
                </div>
              )}
              
              <div style={{ 
                fontSize: '24px', 
                marginBottom: '8px',
                opacity: service.comingSoon ? 0.7 : 1
              }}>
                {service.icon}
              </div>
              
              <div style={{ 
                fontSize: '14px', 
                fontWeight: '700',
                marginBottom: '4px',
                opacity: service.comingSoon ? 0.7 : 1
              }}>
                {service.name}
              </div>
              
              <div style={{ 
                fontSize: '11px', 
                color: service.comingSoon ? THEME.muted : 'inherit',
                opacity: service.comingSoon ? 0.7 : 0.8
              }}>
                {service.description}
              </div>
            </button>
          ))}
        </div>

        {/* Promotional Banner */}
        <div style={{
          backgroundColor: THEME.accentDark,
          padding: '20px',
          borderRadius: '16px',
          border: `1px solid ${THEME.border}`,
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <div style={{ 
            fontSize: '16px', 
            fontWeight: '700', 
            color: THEME.white,
            marginBottom: '8px'
          }}>
             New Features Coming Soon!
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: THEME.muted 
          }}>
            We're constantly adding new services to make Zwip even better for you.
          </div>
        </div>

        {/* Support Section */}
        <div style={{
          backgroundColor: THEME.card,
          padding: '20px',
          borderRadius: '16px',
          border: `1px solid ${THEME.border}`
        }}>
          <h3 style={{
            margin: '0 0 16px 0',
            fontSize: '16px',
            fontWeight: '700',
            color: THEME.white
          }}>
            Need Help?
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={() => alert('Customer support opening...')}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: THEME.panel,
                border: `1px solid ${THEME.border}`,
                borderRadius: '12px',
                color: THEME.white,
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
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
              <div style={{ fontSize: '16px' }}></div>
              <div>Contact Support</div>
            </button>

            <button
              onClick={() => alert('FAQ opening...')}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: THEME.panel,
                border: `1px solid ${THEME.border}`,
                borderRadius: '12px',
                color: THEME.white,
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
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
              <div style={{ fontSize: '16px' }}></div>
              <div>FAQ & Help Center</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
