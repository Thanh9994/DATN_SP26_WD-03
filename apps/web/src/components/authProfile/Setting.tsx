import { useState } from 'react';
// import "./Setting.css";
import '../../styles/profile/Setting.css';
interface ToggleSetting {
  id: string;
  label: string;
  description: string;
  icon: string;
  enabled: boolean;
}

interface RadioOption {
  id: string;
  label: string;
}

export const Setting = (): JSX.Element => {
  const [appearance, setAppearance] = useState<string>('dark');
  const [videoQuality, setVideoQuality] = useState<string>('auto');
  const [language, setLanguage] = useState<string>('en');
  const [region, setRegion] = useState<string>('us');
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({
    captions: true,
    contrast: false,
    visibility: true,
    sharing: true,
    offers: true,
    alerts: true,
  });

  const appearanceOptions = [
    { id: 'dark', label: 'Dark Mode' },
    { id: 'light', label: 'Light Mode' },
    { id: 'system', label: 'System Default' },
  ];

  const videoQualityOptions = [
    { id: 'auto', label: 'Auto' },
    { id: 'fullhd', label: 'Full HD' },
    { id: '4k', label: 'Ultra 4K' },
  ];

  const languageOptions = [
    { id: 'en', label: 'English(USD)' },
    { id: 'es', label: 'Español(EUR)' },
    { id: 'fr', label: 'Français(EUR)' },
  ];

  const regionOptions = [
    { id: 'us', label: 'United States' },
    { id: 'uk', label: 'United Kingdom' },
    { id: 'ca', label: 'Canada' },
  ];

  const accessibilityToggles: ToggleSetting[] = [
    {
      id: 'captions',
      label: 'Always Show Captions',
      description: 'Display captions in all supported content',
      icon: '📝',
      enabled: toggleStates.captions,
    },
    {
      id: 'contrast',
      label: 'High Contrast Mode',
      description: 'Enhance visibility with high contrast colors',
      icon: '👁️',
      enabled: toggleStates.contrast,
    },
  ];

  const privacyToggles: ToggleSetting[] = [
    {
      id: 'visibility',
      label: 'Public Profile Visibility',
      description: 'Allow others to find and view your profile',
      icon: '🔓',
      enabled: toggleStates.visibility,
    },
    {
      id: 'sharing',
      label: 'Data Sharing',
      description: 'Share viewing analytics and improve recommendations',
      icon: '📊',
      enabled: toggleStates.sharing,
    },
  ];

  const notificationToggles: ToggleSetting[] = [
    {
      id: 'offers',
      label: 'Promotional Offers',
      description: 'Receive offers and updates about events',
      icon: '🎁',
      enabled: toggleStates.offers,
    },
    {
      id: 'alerts',
      label: 'Booking Alerts',
      description: 'Get notified about upcoming bookings',
      icon: '🔔',
      enabled: toggleStates.alerts,
    },
  ];

  const handleToggle = (id: string): void => {
    setToggleStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderButton = (text: string, isSelected: boolean, onClick?: () => void): JSX.Element => (
    <button className={`btn-option ${isSelected ? 'selected' : ''}`} onClick={onClick}>
      {text}
    </button>
  );

  const renderToggle = (setting: ToggleSetting): JSX.Element => (
    <div key={setting.id} className="toggle-item">
      <div className="toggle-left">
        <span className="toggle-icon">{setting.icon}</span>
        <div className="toggle-info">
          <h4 className="toggle-label">{setting.label}</h4>
          <p className="toggle-description">{setting.description}</p>
        </div>
      </div>
      <label className="toggle-switch">
        <input
          type="checkbox"
          checked={setting.enabled}
          onChange={() => handleToggle(setting.id)}
        />
        <span className="toggle-slider"></span>
      </label>
    </div>
  );

  const renderRadioGroup = (
    options: RadioOption[],
    selected: string,
    onChange: (id: string) => void,
  ): JSX.Element => (
    <div className="radio-group">
      {options.map((option) => (
        <div key={option.id} className="radio-item">
          <input
            type="radio"
            id={option.id}
            checked={selected === option.id}
            onChange={() => onChange(option.id)}
            className="radio-input"
          />
          <label htmlFor={option.id} className="radio-label">
            {option.label}
          </label>
        </div>
      ))}
    </div>
  );

  return (
    <div className="setting-page">
      <main className="setting-main">
        <div className="settings-header">
          <h1 className="settings-title">Application Settings</h1>
          <button className="btn-apply">Apply Changes</button>
        </div>

        <div className="settings-grid">
          <section className="settings-section">
            <div className="section-title-wrapper">
              <span className="section-icon">🎨</span>
              <h2 className="section-title">Appearance</h2>
            </div>
            <div className="button-row">
              {appearanceOptions.map((opt) =>
                renderButton(opt.label, appearance === opt.id, () => setAppearance(opt.id)),
              )}
            </div>
          </section>

          <section className="settings-section">
            <div className="section-title-wrapper">
              <span className="section-icon">📺</span>
              <h2 className="section-title">Video Quality</h2>
            </div>
            <div className="button-row">
              {videoQualityOptions.map((opt) =>
                renderButton(opt.label, videoQuality === opt.id, () => setVideoQuality(opt.id)),
              )}
            </div>
          </section>

          <section className="settings-section">
            <div className="section-title-wrapper">
              <span className="section-icon">♿</span>
              <h2 className="section-title">Accessibility</h2>
            </div>
            <div className="toggles-column">
              {accessibilityToggles.map((toggle) => renderToggle(toggle))}
            </div>
          </section>

          <section className="settings-section">
            <div className="section-title-wrapper">
              <span className="section-icon">🔒</span>
              <h2 className="section-title">Privacy & Data</h2>
            </div>
            <div className="toggles-column">
              {privacyToggles.map((toggle) => renderToggle(toggle))}
            </div>
          </section>

          <section className="settings-section">
            <div className="section-title-wrapper">
              <span className="section-icon">🌍</span>
              <h2 className="section-title">Localization</h2>
            </div>
            <div className="localization-grid">
              <div className="localization-column">
                <h4 className="localization-label">Interface Language</h4>
                {renderRadioGroup(languageOptions, language, setLanguage)}
              </div>
              <div className="localization-column">
                <h4 className="localization-label">Store Region</h4>
                {renderRadioGroup(regionOptions, region, setRegion)}
              </div>
            </div>
          </section>

          <section className="settings-section">
            <div className="section-title-wrapper">
              <span className="section-icon">📧</span>
              <h2 className="section-title">Email Notifications</h2>
            </div>
            <div className="toggles-column">
              {notificationToggles.map((toggle) => renderToggle(toggle))}
            </div>
          </section>
        </div>
      </main>

      <aside className="setting-sidebar-right">
        <div className="member-card">
          <span className="card-badge">Membership Tier</span>
          <h3 className="card-title">VIP Member</h3>
          <p className="card-description">Access to premium services</p>
          <div className="card-divider"></div>
          <div className="card-points">
            <span className="points-label">Total Points</span>
            <span className="points-value">12,450</span>
          </div>
          <p className="card-note">Points can be used to unlock content</p>
        </div>

        <div className="sidebar-card">
          <h3 className="card-title">Connected Accounts</h3>
          <div className="accounts-list">
            <div className="account-item">
              <span className="account-name">Google</span>
              <button className="btn-remove">Remove</button>
            </div>
            <div className="account-item">
              <span className="account-name">Apple ID</span>
              <button className="btn-remove">Remove</button>
            </div>
          </div>
        </div>

        <div className="sidebar-card">
          <h3 className="card-title">Quick Links</h3>
          <nav className="links-list">
            <a href="#" className="link-item">
              <span className="link-icon">📋</span>
              <span>Transaction History</span>
            </a>
            <a href="#" className="link-item">
              <span className="link-icon">💬</span>
              <span>Support Center</span>
            </a>
          </nav>
        </div>
      </aside>
    </div>
  );
};
