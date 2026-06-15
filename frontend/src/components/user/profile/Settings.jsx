import React, { useState } from 'react';
import { Bell, Shield, Globe, CreditCard, Eye, Save } from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: false,
      push: true,
      marketing: false
    },
    privacy: {
      profileVisible: true,
      showReviews: true,
      shareActivity: false
    },
    preferences: {
      currency: 'USD',
      language: 'en',
      timezone: 'America/New_York'
    }
  });

  const [hasChanges, setHasChanges] = useState(false);

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const saveSettings = () => {
    // Mock save action
    console.log('Settings saved:', settings);
    setHasChanges(false);
  };

  const ToggleSwitch = ({ checked, onChange, label, description }) => (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="font-medium text-gray-900">{label}</p>
        {description && <p className="text-sm text-gray-600">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${checked ? 'bg-blue-600' : 'bg-gray-300'}
        `}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
            ${checked ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account preferences and privacy settings</p>
        </div>
        {hasChanges && (
          <button
            onClick={saveSettings}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <Save size={16} />
            <span>Save Changes</span>
          </button>
        )}
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Bell className="text-blue-600" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
              <p className="text-sm text-gray-600">Choose how you want to be notified</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-1">
          <ToggleSwitch
            checked={settings.notifications.email}
            onChange={(value) => updateSetting('notifications', 'email', value)}
            label="Email Notifications"
            description="Receive booking confirmations and updates via email"
          />
          <ToggleSwitch
            checked={settings.notifications.sms}
            onChange={(value) => updateSetting('notifications', 'sms', value)}
            label="SMS Notifications"
            description="Get text messages for urgent updates"
          />
          <ToggleSwitch
            checked={settings.notifications.push}
            onChange={(value) => updateSetting('notifications', 'push', value)}
            label="Push Notifications"
            description="Receive notifications through your browser"
          />
          <ToggleSwitch
            checked={settings.notifications.marketing}
            onChange={(value) => updateSetting('notifications', 'marketing', value)}
            label="Marketing Communications"
            description="Get special offers and travel recommendations"
          />
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Shield className="text-green-600" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Privacy</h2>
              <p className="text-sm text-gray-600">Control what information is visible to others</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-1">
          <ToggleSwitch
            checked={settings.privacy.profileVisible}
            onChange={(value) => updateSetting('privacy', 'profileVisible', value)}
            label="Profile Visibility"
            description="Allow hosts to view your profile information"
          />
          <ToggleSwitch
            checked={settings.privacy.showReviews}
            onChange={(value) => updateSetting('privacy', 'showReviews', value)}
            label="Show Reviews"
            description="Display your reviews on your public profile"
          />
          <ToggleSwitch
            checked={settings.privacy.shareActivity}
            onChange={(value) => updateSetting('privacy', 'shareActivity', value)}
            label="Share Activity"
            description="Allow friends to see your recent bookings"
          />
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Globe className="text-purple-600" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Preferences</h2>
              <p className="text-sm text-gray-600">Customize your experience</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
            <select
              value={settings.preferences.currency}
              onChange={(e) => updateSetting('preferences', 'currency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="USD">US Dollar (USD)</option>
              <option value="EUR">Euro (EUR)</option>
              <option value="GBP">British Pound (GBP)</option>
              <option value="CAD">Canadian Dollar (CAD)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select
              value={settings.preferences.language}
              onChange={(e) => updateSetting('preferences', 'language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
            <select
              value={settings.preferences.timezone}
              onChange={(e) => updateSetting('preferences', 'timezone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Account Management */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <CreditCard className="text-gray-600" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Account Management</h2>
              <p className="text-sm text-gray-600">Manage your account and data</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900">Change Password</p>
              <p className="text-sm text-gray-600">Update your account password</p>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              Change
            </button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900">Download Your Data</p>
              <p className="text-sm text-gray-600">Export all your account information</p>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              Export
            </button>
          </div>
          <div className="flex items-center justify-between py-3 border-t border-gray-200">
            <div>
              <p className="font-medium text-red-600">Delete Account</p>
              <p className="text-sm text-gray-600">Permanently delete your account and data</p>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;