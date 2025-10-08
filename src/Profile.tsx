// src/Profile.tsx - POLISHED VERSION
import { useState, useRef } from 'react';

interface ProfileProps {
  setCurrentScreen: (screen: any) => void;
}

type ProfileTab = 'personal' | 'business' | 'security' | 'preferences';

const THEME = {
  black: '#000000',
  panel: '#071010',
  card: '#0b0b0b',
  muted: '#9aa0a0',
  green: '#00674F',
  accentDark: '#062e26',
  border: '#121212',
  white: '#ffffff'
};

export default function Profile({ setCurrentScreen }: ProfileProps) {    
  const [activeTab, setActiveTab] = useState<ProfileTab>('personal');
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Personal Profile Data
  const [personalInfo, setPersonalInfo] = useState({
    name: 'Alex Johnson',
    phone: '+1234567890',
    email: 'alex.johnson@example.com',
    bio: 'Digital entrepreneur and coffee enthusiast ?',
    status: 'Available for transactions',
    location: 'New York, NY'
  });

  // Business Profile Data
  const [businessInfo, setBusinessInfo] = useState({
    businessName: 'Tech Solutions LLC',
    businessType: 'Technology Services',
    description: 'Providing cutting-edge software solutions for modern businesses',       
    website: 'www.techsolutions.example',
    hours: '9:00 AM - 6:00 PM EST',
    address: '123 Business Ave, New York, NY'
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    biometricLogin: true,
    transactionAlerts: true,
    loginNotifications: false
  });

  // Preferences
  const [preferences, setPreferences] = useState({
    currency: 'USD',
    language: 'English',
    theme: 'dark',
    defaultTransactionView: 'list'
  });

  const handleSave = () => {
    alert('Profile updated successfully!');
    setIsEditing(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      alert(`Avatar selected: ${file.name}`);
      // In real app: upload to server and update profile
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  const ProfileAvatar = () => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '30px'
    }}>
      <div 
        onClick={handleAvatarClick}
        style={{
          width: '120px',
          height: '120px',
          backgroundColor: THEME.green + '20',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '42px',
          fontWeight: '600',
          color: THEME.green,
          marginBottom: '15px',
          border: `2px solid ${THEME.green}40`,
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = THEME.green + '30';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = THEME.green + '20';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {getInitials(personalInfo.name)}
        <div style={{
          position: 'absolute',
          bottom: '8px',
          right: '8px',
          width: '24px',
          height: '24px',
          backgroundColor: THEME.green,
          borderRadius: '50%',
          border: `2px solid ${THEME.black}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          color: THEME.black,
          fontWeight: 'bold'
        }}>
          ?
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '15px' }}>
        <div style={{ 
          fontSize: '24px', 
          fontWeight: '700', 
          marginBottom: '5px',
          color: THEME.white 
        }}>        
          {personalInfo.name}
        </div>
        <div style={{ 
          color: THEME.green, 
          fontSize: '14px', 
          fontWeight: '600',
          marginBottom: '4px'
        }}>
          {personalInfo.status}
        </div>
        <div style={{ 
          color: THEME.muted, 
          fontSize: '14px' 
        }}>
          Member since 2024
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        style={{ display: 'none' }}
      />

      <button
        onClick={handleAvatarClick}
        style={{
          padding: '10px 20px',
          backgroundColor: THEME.card,
          color: THEME.green,
          border: `1px solid ${THEME.green}40`,
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = THEME.green;
          e.currentTarget.style.color = THEME.black;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = THEME.card;
          e.currentTarget.style.color = THEME.green;
        }}
      >
        ?? Change Avatar
      </button>
    </div>
  );

  const TabButton = ({ tab, label, icon }: { tab: ProfileTab; label: string; icon: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      style={{
        flex: 1,
        padding: '12px 8px',
        backgroundColor: activeTab === tab ? THEME.green + '20' : 'transparent',
        border: `1px solid ${activeTab === tab ? THEME.green + '40' : 'transparent'}`,
        borderRadius: '12px',
        color: activeTab === tab ? THEME.green : THEME.muted,
        fontSize: '12px',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        if (activeTab !== tab) {
          e.currentTarget.style.backgroundColor = THEME.border;
          e.currentTarget.style.color = THEME.white;
        }
      }}
      onMouseLeave={(e) => {
        if (activeTab !== tab) {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = THEME.muted;
        }
      }}
    >
      <span style={{ fontSize: '16px' }}>{icon}</span>
      <span>{label}</span>
    </button>
  );

  const InputField = ({ label, value, onChange, type = 'text', disabled = false }: any) => (   
    <div style={{ marginBottom: '20px' }}>
      <label style={{
        display: 'block',
        marginBottom: '8px',
        fontWeight: '600',
        fontSize: '14px',
        color: THEME.muted
      }}>
        {label}
      </label>
      {isEditing && !disabled ? (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={inputStyle}
        />
      ) : (
        <div style={{
          fontSize: '16px',
          color: THEME.white,
          padding: '12px',
          backgroundColor: THEME.card,
          borderRadius: '12px',
          border: `1px solid ${THEME.border}`,
          minHeight: '44px',
          display: 'flex',
          alignItems: 'center'
        }}>
          {value || 'Not set'}
        </div>
      )}
    </div>
  );

  const ToggleSwitch = ({ label, checked, onChange }: any) => (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      padding: '16px',
      backgroundColor: THEME.card,
      border: `1px solid ${THEME.border}`,
      borderRadius: '12px',
      transition: 'all 0.3s ease'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = THEME.border;
      e.currentTarget.style.borderColor = THEME.green;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = THEME.card;
      e.currentTarget.style.borderColor = THEME.border;
    }}
    >
      <span style={{ 
        fontSize: '16px', 
        fontWeight: '600',
        color: THEME.white 
      }}>{label}</span>
      <button
        onClick={() => onChange(!checked)}
        style={{
          width: '50px',
          height: '28px',
          backgroundColor: checked ? THEME.green : THEME.border,
          borderRadius: '14px',
          position: 'relative',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
      >
        <div
          style={{
            width: '22px',
            height: '22px',
            backgroundColor: THEME.white,
            borderRadius: '50%',
            position: 'absolute',
            top: '3px',
            left: checked ? '25px' : '3px',
            transition: 'left 0.3s ease'
          }}
        ></div>
      </button>
    </div>
  );

  return (
    <div style={{
      flex: 1,
      paddingTop: '14px'
    }}>
      {/* HEADER WITH BACK BUTTON - MATCHING OUR STANDARDS */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <button
          onClick={() => setCurrentScreen('menu')}
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
          ? Back
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
          ?? Profile
        </h1>

        <div style={{ width: '90px' }}></div> {/* Balance the header */}
      </div>

      {/* Profile Content */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {/* Profile Avatar Section */}
        <div style={{
          backgroundColor: THEME.card,
          padding: '25px',
          borderRadius: '16px',
          border: `1px solid ${THEME.border}`,
          textAlign: 'center'
        }}>
          <ProfileAvatar />
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          backgroundColor: THEME.card,
          borderRadius: '16px',
          padding: '8px',
          border: `1px solid ${THEME.border}`,
          gap: '4px'
        }}>
          <TabButton tab="personal" label="Personal" icon="??" />
          <TabButton tab="business" label="Business" icon="??" />
          <TabButton tab="security" label="Security" icon="??" />
          <TabButton tab="preferences" label="Prefs" icon="??" />
        </div>

        {/* Tab Content */}
        <div style={{
          backgroundColor: THEME.card,
          padding: '25px',
          borderRadius: '16px',
          border: `1px solid ${THEME.border}`,
          minHeight: '400px'
        }}>
          {/* Personal Tab */}
          {activeTab === 'personal' && (
            <div>
              <h3 style={{ 
                marginBottom: '25px', 
                fontSize: '20px', 
                fontWeight: '700',
                color: THEME.white
              }}>  
                Personal Information
              </h3>

              <InputField
                label="Full Name"
                value={personalInfo.name}
                onChange={(value: string) => setPersonalInfo(prev => ({ ...prev, name: value }))} 
              />

              <InputField
                label="Phone Number"
                value={personalInfo.phone}
                onChange={(value: string) => setPersonalInfo(prev => ({ ...prev, phone: value }))}
                type="tel"
              />

              <InputField
                label="Email Address"
                value={personalInfo.email}
                onChange={(value: string) => setPersonalInfo(prev => ({ ...prev, email: value }))}
                type="email"
              />

              <InputField
                label="Bio"
                value={personalInfo.bio}
                onChange={(value: string) => setPersonalInfo(prev => ({ ...prev, bio: value }))}  
              />

              <InputField
                label="Status"
                value={personalInfo.status}
                onChange={(value: string) => setPersonalInfo(prev => ({ ...prev, status: value }))}
              />

              <InputField
                label="Location"
                value={personalInfo.location}
                onChange={(value: string) => setPersonalInfo(prev => ({ ...prev, location: value }))}
              />
            </div>
          )}

          {/* Business Tab */}
          {activeTab === 'business' && (
            <div>
              <h3 style={{ 
                marginBottom: '25px', 
                fontSize: '20px', 
                fontWeight: '700',
                color: THEME.white
              }}>  
                Business Profile
              </h3>

              <InputField
                label="Business Name"
                value={businessInfo.businessName}
                onChange={(value: string) => setBusinessInfo(prev => ({ ...prev, businessName: value }))}
              />

              <InputField
                label="Business Type"
                value={businessInfo.businessType}
                onChange={(value: string) => setBusinessInfo(prev => ({ ...prev, businessType: value }))}
              />

              <InputField
                label="Description"
                value={businessInfo.description}
                onChange={(value: string) => setBusinessInfo(prev => ({ ...prev, description: value }))}
              />

              <InputField
                label="Website"
                value={businessInfo.website}
                onChange={(value: string) => setBusinessInfo(prev => ({ ...prev, website: value }))}
                type="url"
              />

              <InputField
                label="Business Hours"
                value={businessInfo.hours}
                onChange={(value: string) => setBusinessInfo(prev => ({ ...prev, hours: value }))}
              />

              <InputField
                label="Address"
                value={businessInfo.address}
                onChange={(value: string) => setBusinessInfo(prev => ({ ...prev, address: value }))}
              />
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div>
              <h3 style={{ 
                marginBottom: '25px', 
                fontSize: '20px', 
                fontWeight: '700',
                color: THEME.white
              }}>  
                Security Settings
              </h3>

              <ToggleSwitch
                label="Two-Factor Authentication"
                checked={securitySettings.twoFactorAuth}
                onChange={(value: boolean) => setSecuritySettings(prev => ({ ...prev, twoFactorAuth: value }))}
              />

              <ToggleSwitch
                label="Biometric Login"
                checked={securitySettings.biometricLogin}
                onChange={(value: boolean) => setSecuritySettings(prev => ({ ...prev, biometricLogin: value }))}
              />

              <ToggleSwitch
                label="Transaction Alerts"
                checked={securitySettings.transactionAlerts}
                onChange={(value: boolean) => setSecuritySettings(prev => ({ ...prev, transactionAlerts: value }))}
              />

              <ToggleSwitch
                label="Login Notifications"
                checked={securitySettings.loginNotifications}
                onChange={(value: boolean) => setSecuritySettings(prev => ({ ...prev, loginNotifications: value }))}
              />

              <button
                onClick={() => alert('Change Password')}
                style={{
                  padding: '16px',
                  backgroundColor: THEME.card,
                  color: THEME.green,
                  border: `1px solid ${THEME.green}40`,
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  width: '100%',
                  marginTop: '10px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = THEME.green;
                  e.currentTarget.style.color = THEME.black;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = THEME.card;
                  e.currentTarget.style.color = THEME.green;
                }}
              >
                ?? Change Password
              </button>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div>
              <h3 style={{ 
                marginBottom: '25px', 
                fontSize: '20px', 
                fontWeight: '700',
                color: THEME.white
              }}>  
                Preferences
              </h3>

              <InputField
                label="Currency"
                value={preferences.currency}
                onChange={(value: string) => setPreferences(prev => ({ ...prev, currency: value }))}
              />

              <InputField
                label="Language"
                value={preferences.language}
                onChange={(value: string) => setPreferences(prev => ({ ...prev, language: value }))}
              />

              <InputField
                label="Theme"
                value={preferences.theme}
                onChange={(value: string) => setPreferences(prev => ({ ...prev, theme: value }))} 
                disabled
              />

              <InputField
                label="Default View"
                value={preferences.defaultTransactionView}
                onChange={(value: string) => setPreferences(prev => ({ ...prev, defaultTransactionView: value }))}
              />
            </div>
          )}
        </div>

        {/* Edit/Save Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                style={{
                  flex: 1,
                  padding: '18px',
                  backgroundColor: THEME.card,
                  color: THEME.muted,
                  border: `1px solid ${THEME.border}`,
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = THEME.border;
                  e.currentTarget.style.color = THEME.white;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = THEME.card;
                  e.currentTarget.style.color = THEME.muted;
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                style={{
                  flex: 1,
                  padding: '18px',
                  backgroundColor: THEME.green,
                  color: THEME.black,
                  border: `1px solid ${THEME.green}`,
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = THEME.green + 'CC';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = THEME.green;
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              style={{
                padding: '18px',
                backgroundColor: THEME.card,
                color: THEME.green,
                border: `1px solid ${THEME.green}40`,
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                width: '100%',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = THEME.green;
                e.currentTarget.style.color = THEME.black;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = THEME.card;
                e.currentTarget.style.color = THEME.green;
              }}
            >
              ?? Edit Profile
            </button>
          )}
        </div>

        {/* Quick Actions */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginTop: '10px'
        }}>
          <button
            onClick={() => alert('Share your profile QR code')}
            style={{
              flex: 1,
              padding: '16px',
              backgroundColor: THEME.card,
              color: THEME.green,
              border: `1px solid ${THEME.green}40`,
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = THEME.green;
              e.currentTarget.style.color = THEME.black;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = THEME.card;
              e.currentTarget.style.color = THEME.green;
            }}
          >
            ?? Share Profile
          </button>
          <button
            onClick={() => setCurrentScreen('transactions')}
            style={{
              flex: 1,
              padding: '16px',
              backgroundColor: THEME.card,
              color: THEME.green,
              border: `1px solid ${THEME.green}40`,
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = THEME.green;
              e.currentTarget.style.color = THEME.black;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = THEME.card;
              e.currentTarget.style.color = THEME.green;
            }}
          >
            ?? View Transactions
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '12px',
  backgroundColor: THEME.card,
  border: `1px solid ${THEME.border}`,
  borderRadius: '12px',
  color: THEME.white,
  fontSize: '16px',
  boxSizing: 'border-box' as const,
  transition: 'all 0.3s ease'
};

