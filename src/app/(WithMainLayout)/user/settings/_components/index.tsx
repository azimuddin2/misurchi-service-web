import AccountDelete from '@/components/modules/settings/account-delete';
import ChangePassword from '@/components/modules/settings/change-password';
import LanguageSettings from '@/components/modules/settings/language-settings';
import Notifications from '@/components/modules/settings/notifications';

const Settings = () => {
  return (
    <div className="max-w-5xl mx-auto mb-12 shadow p-8 rounded-lg">
      <ChangePassword />
      <Notifications />
      <LanguageSettings />
      <AccountDelete />
    </div>
  );
};

export default Settings;
