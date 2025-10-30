'use client';

import ChangePassword from '@/components/modules/settings/change-password';
import BusinessPreferences from './business-preferences';
import Notifications from '@/components/modules/settings/notifications';
import LanguageSettings from '@/components/modules/settings/language-settings';
import BankAccount from './bank-account';

const Settings = () => {
  return (
    <div className="max-w-4xl shadow p-4 lg:p-8 rounded-lg">
      <ChangePassword />
      <Notifications />
      <BusinessPreferences />
      <LanguageSettings />
      <BankAccount />
    </div>
  );
};

export default Settings;
