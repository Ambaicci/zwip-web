// src/Settings.tsx - MOBILE OPTIMIZED: Touch-friendly, proper mobile navigation
import { useState } from 'react';
import { useStore } from './store/useStore';
import { THEME } from './theme';

interface SettingsProps {
  setCurrentScreen: (screen: any) => void;
}

type SettingsCategory = 'account' | 'security' | 'notifications' | 'appearance' | 'privacy' | 'about' | 'preferences';

export default function Settings({ setCurrentScreen }: SettingsProps) {
  const { logout } = useStore();
  const [activeCategory, setActiveCategory] = useState<SettingsCategory>('account');

  // Mobile-appropriate back navigation - goes to home for now
  const handleBack = () => {
    setCurrentScreen('home');
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
      setCurrentScreen('home');
    }
  };

  // Mobile-optimized category button with proper touch targets
  const CategoryButton = ({ category, label, icon }: { category: SettingsCategory; label: string; icon: string }) => (
    <button
      onClick={() => setActiveCategory(category)}
      style={{
        flex: 1,
        padding: '16px 8px', // Increased padding for better touch
        backgroundColor: activeCategory === category ? THEME.green + '20' : 'transparent',
        border: '1px solid ' + (activeCategory === category ? THEME.green + '40' : 'transparent'),
        borderRadius: '12px',
        color: activeCategory === category ? THEME.green : THEME.muted,
        fontSize: '12px',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        transition: 'all 0.2s ease',
        minWidth: '0', // Better mobile flex behavior
        minHeight: '70px' // Minimum touch target height
      }}
    >
      <span style={{ fontSize: '20px' }}>{icon}</span> {/* Larger icons for mobile */}
      <span style={{ fontSize: '11px', lineHeight: '1.2' }}>{label}</span>
    </button>
  );

  // Mobile-optimized toggle switch
  const ToggleSwitch = ({ label, description, checked, onChange }: { label: string; description?: string; checked: boolean; onChange: (checked: boolean) => void }) => (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px',
      padding: '20px 16px', // More padding for touch
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '16px',
      minHeight: '72px' // Minimum touch area
    }}>
      <div style={{ flex: 1, paddingRight: '16px' }}>
        <div style={{
          fontSize: '16px', // Slightly larger text for mobile
          fontWeight: '600',
          color: THEME.white,
          marginBottom: description ? '6px' : '0'
        }}>{label}</div>
        {description && (
          <div style={{
            fontSize: '13px',
            color: THEME.muted,
            lineHeight: '1.4'
          }}>{description}</div>
        )}
      </div>
      <button
        onClick={() => onChange(!checked)}
        style={{
          width: '52px', // Larger toggle for mobile
          height: '32px',
          backgroundColor: checked ? THEME.green : 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          position: 'relative',
          border: 'none',
          cursor: 'pointer',
          flexShrink: 0
        }}
      >
        <div
          style={{
            width: '24px', // Larger thumb
            height: '24px',
            backgroundColor: THEME.white,
            borderRadius: '50%',
            position: 'absolute',
            top: '4px',
            left: checked ? '24px' : '4px',
            transition: 'left 0.2s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        ></div>
      </button>
    </div>
  );

  // Mobile-optimized action button
  const ActionButton = ({ label, onClick, variant = 'default' }: { label: string; onClick: () => void; variant?: 'default' | 'danger' }) => (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        padding: '18px 16px', // Larger touch target
        background: variant === 'danger' ? 'rgba(220, 38, 38, 0.1)' : 'rgba(255, 255, 255, 0.05)',
        border: variant === 'danger' ? '1px solid rgba(220, 38, 38, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        color: variant === 'danger' ? '#dc2626' : THEME.white,
        fontSize: '16px', // Larger text for mobile
        fontWeight: '600',
        cursor: 'pointer',
        marginBottom: '12px',
        minHeight: '56px', // Minimum touch target
        transition: 'all 0.2s ease'
      }}
      onTouchStart={(e) => {
        e.currentTarget.style.transform = 'scale(0.98)';
      }}
      onTouchEnd={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {label}
    </button>
  );

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
      WebkitOverflowScrolling: 'touch' // Smooth scrolling on iOS
    }}>
      <div style={{
        flex: 1,
        maxWidth: 400,
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: '20px',
        paddingBottom: '20px' // Bottom padding for mobile safe area
      }}>
        {/* Mobile-optimized header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          padding: '8px 0'
        }}>
          <button
            onClick={handleBack}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: THEME.green,
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 600,
              padding: '12px 20px', // Larger touch target
              borderRadius: '12px',
              minWidth: '80px',
              minHeight: '44px' // Minimum iOS touch target
            }}
          >
            Back
          </button>

          <h1 style={{
            margin: 0,
            fontSize: '22px', // Slightly larger for mobile
            fontWeight: 700,
            color: THEME.white,
            textAlign: 'center'
          }}>
            Settings
          </h1>

          <div style={{ width: '80px' }}></div>
        </div>

        {/* Mobile-optimized category navigation */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          padding: '8px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          gap: '6px',
          marginBottom: '24px',
          overflowX: 'auto', // Horizontal scroll if needed
          WebkitOverflowScrolling: 'touch'
        }}>
          <CategoryButton category='account' label='Account' icon='' />
          <CategoryButton category='security' label='Security' icon='' />
          <CategoryButton category='notifications' label='Alerts' icon='' />
          <CategoryButton category='appearance' label='Display' icon='' />
          <CategoryButton category='preferences' label='Prefs' icon='' />
          <CategoryButton category='privacy' label='Privacy' icon='' />
          <CategoryButton category='about' label='About' icon='?' />
        </div>

        {/* Mobile-optimized content area */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '24px',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '20px',
          flex: 1,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch' // Smooth scrolling
        }}>
          {activeCategory === 'account' && (
            <div>
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: THEME.white,
                  marginBottom: '20px'
                }}>Account Management</h3>
                <ActionButton 
                  label="Edit Profile" 
                  onClick={() => alert('Edit profile coming soon')} 
                />
                <ActionButton 
                  label="Change Password" 
                  onClick={() => alert('Change password coming soon')} 
                />
                <ActionButton 
                  label="Payment Methods" 
                  onClick={() => alert('Payment methods coming soon')} 
                />
              </div>

              <div style={{ marginBottom: '28px' }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: THEME.white,
                  marginBottom: '20px'
                }}>Account Actions</h3>
                <ActionButton 
                  label="Log Out" 
                  onClick={handleLogout} 
                  variant="danger"
                />
                <ActionButton 
                  label="Delete Account" 
                  onClick={() => alert('Account deletion coming soon')} 
                  variant="danger"
                />
              </div>
            </div>
          )}

          {activeCategory === 'security' && (
            <div>
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: THEME.white,
                  marginBottom: '20px'
                }}>Authentication</h3>
                <ToggleSwitch
                  label="Biometric Authentication"
                  description="Use fingerprint or face ID to log in"
                  checked={true}
                  onChange={() => {}}
                />
                <ToggleSwitch
                  label="Two-Factor Authentication"
                  description="Extra security with SMS or authenticator app"
                  checked={false}
                  onChange={() => {}}
                />
                <ToggleSwitch
                  label="Transaction PIN"
                  description="Require PIN for all transactions"
                  checked={true}
                  onChange={() => {}}
                />
              </div>
            </div>
          )}

          {/* Add other categories similarly with mobile optimizations */}
          {activeCategory === 'notifications' && (
            <div>
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: THEME.white,
                  marginBottom: '20px'
                }}>Notifications</h3>
                <ToggleSwitch
                  label="Push Notifications"
                  description="Receive app notifications"
                  checked={true}
                  onChange={() => {}}
                />
                <ToggleSwitch
                  label="Email Notifications"
                  description="Receive email updates"
                  checked={false}
                  onChange={() => {}}
                />
                <ToggleSwitch
                  label="SMS Alerts"
                  description="Important alerts via SMS"
                  checked={true}
                  onChange={() => {}}
                />
              </div>
            </div>
          )}

          {activeCategory === 'about' && (
            <div>
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: THEME.white,
                  marginBottom: '20px'
                }}>About</h3>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '20px',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  marginBottom: '20px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ color: THEME.muted, fontSize: '15px' }}>Version</span> 
                    <span style={{ color: THEME.white, fontSize: '15px', fontWeight: 600 }}>1.2.0</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: THEME.muted, fontSize: '15px' }}>Build</span>   
                    <span style={{ color: THEME.white, fontSize: '15px', fontWeight: 600 }}>2024.10.1</span>
                  </div>
                </div>
                <ActionButton 
                  label="Help Center" 
                  onClick={() => alert('Help center coming soon')} 
                />
                <ActionButton 
                  label="Contact Support" 
                  onClick={() => alert('Contact support coming soon')} 
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
