'use client';

import ChangePassword from '@/components/modules/settings/change-password';
import Notifications from '@/components/modules/settings/notifications';
import LanguageSettings from '@/components/modules/settings/language-settings';
import BankAccount from './bank-account';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import BusinessPreferences from './business-preferences';

const Settings = () => {
  const user = useAppSelector(selectCurrentUser);
  const isTeamMember = user?.teamRole === 'team_member';

  return (
    <div className="max-w-5xl shadow p-4 lg:p-8 rounded-lg">
      <ChangePassword />
      <Notifications />
      <BusinessPreferences />
      <LanguageSettings />
      {!isTeamMember && <BankAccount />}
    </div>
  );
};

export default Settings;
