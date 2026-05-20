import { Routes, Route } from 'react-router-dom';
import { ProtecterRoute } from './ProtecterRoute.jsx';
import { DashboardPage } from '../layouts/DashboardPage.jsx';
import { RoleGuard } from './RoleGuard.jsx';
import { LoginPage } from '../../features/auth/pages/LoginPage.jsx';
import { Users } from '../../features/users/components/Users.jsx';
import { VerifyEmailPage } from '../../features/auth/pages/VerifyEmailPage.jsx';
import { Transfers } from '../../features/transfers/components/Transfers.jsx';
import { Withdrawals } from '../../features/withdrawals/components/Withdrawals.jsx';
import { AccountsContainer } from './AccountsContainer.jsx';
import { Movements } from '../../features/accounts/components/Movements.jsx';
import { MovementsUser } from '../../features/accountsuser/components/MovementsUser.jsx';
import { Deposits } from '../../features/deposits/components/Deposits.jsx';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path='/' element={<LoginPage />} />
      <Route path='/verify-email' element={<VerifyEmailPage />} />

      <Route
        path='/dashboard/*'
        element={
          <ProtecterRoute>
            <DashboardPage />
          </ProtecterRoute>
        }
      >
        <Route
          path='movements'
          element={
            <RoleGuard allowedRoles={['ADMIN_ROLE']}>
              <Movements />
            </RoleGuard>
          }
        />

        <Route
          path='movements-user/:id'
          element={
            <RoleGuard allowedRoles={['ADMIN_ROLE', 'USER_ROLE']}>
              <MovementsUser />
            </RoleGuard>
          }
        />

        <Route
          path='users'
          element={
            <RoleGuard allowedRoles={['ADMIN_ROLE']}>
              <Users />
            </RoleGuard>
          }
        />

        <Route
          path='accounts'
          element={
            <RoleGuard allowedRoles={['ADMIN_ROLE', 'USER_ROLE']}>
              <AccountsContainer />
            </RoleGuard>
          }
        />

        <Route
          path='transfers'
          element={
            <RoleGuard allowedRoles={['ADMIN_ROLE', 'USER_ROLE']}>
              <Transfers />
            </RoleGuard>
          }
        />

        <Route
          path='withdrawals'
          element={
            <RoleGuard allowedRoles={['ADMIN_ROLE']}>
              <Withdrawals />
            </RoleGuard>
          }
        />

        <Route
          path='deposits'
          element={
            <RoleGuard allowedRoles={['ADMIN_ROLE']}>
              <Deposits />
            </RoleGuard>
          }
        />
      </Route>
    </Routes>
  );
};
