import { Routes, Route } from 'react-router-dom';
import { ProtecterRoute } from './ProtecterRoute.jsx';
import { DashboardPage } from '../layouts/DashboardPage.jsx';
import { RoleGuard } from './RoleGuard.jsx';
import { LoginPage } from '../../features/auth/pages/LoginPage.jsx';
import { Users } from '../../features/users/components/Users.jsx';
import { VerifyEmailPage } from '../../features/auth/pages/VerifyEmailPage.jsx';
import { Movements } from '../../features/accounts/components/Movements.jsx';
import { Accounts } from '../../features/accounts/components/Accounts.jsx';
import { Transfers } from '../../features/transfers/components/Transfers.jsx';
import { Withdrawals } from '../../features/withdrawals/components/Withdrawals.jsx';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path='/' element={<LoginPage />} />
      <Route path='/verify-email' element={<VerifyEmailPage />}></Route>
      <Route
        path='/dashboard/*'
        element={
          <ProtecterRoute>
            <DashboardPage />
          </ProtecterRoute>
        }
      >
        {/*
            Nota: Las rutas hijas faltantes, se colocaran aquí más adelante.
        */}
        <Route
          path='users'
          element={
            <RoleGuard allowedRoles={['ADMIN_ROLE']}>
              <Users />
            </RoleGuard>
          }
        />

        <Route
          path='movements'
          element={
            <RoleGuard allowedRoles={['ADMIN_ROLE']}>
              <Movements />
            </RoleGuard>
          }
        />

        <Route
          path='accounts'
          element={
            <RoleGuard allowedRoles={['ADMIN_ROLE']}>
              <Accounts />
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
      </Route>
    </Routes>
  );
};
