import { useAuthStore } from '../../features/auth/store/authStore';
import { Accounts } from '../../features/accounts/components/Accounts.jsx';
import { MyAccounts } from '../../features/accountsuser/components/MyAccounts.jsx';

export const AccountsContainer = () => {
  const { user } = useAuthStore();

  return user?.role === 'ADMIN_ROLE' ? <Accounts /> : <MyAccounts />;
};
