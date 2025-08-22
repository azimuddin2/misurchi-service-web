'use client';

import BusinessPreferences from './business-preferences';
import ChangePassword from './change-password';
import LanguageSwitcher from './language-settings';
import Notifications from './notifications';

const Settings = () => {
  return (
    <div className="max-w-4xl shadow p-4 lg:p-8 rounded-lg">
      <ChangePassword />
      <Notifications />
      <BusinessPreferences />
      <LanguageSwitcher />
    </div>
  );
};

export default Settings;
