import { Routes, Route } from 'react-router-dom';
import { ProtecterRoute } from './ProtecterRoute.jsx';
import { DashboardPage } from '../layouts/DashboardPage.jsx';
import { RoleGuard } from './RoleGuard.jsx';
import { LoginPage } from '../../features/auth/pages/LoginPage.jsx';
import { Users } from '../../features/users/components/Users.jsx';
import { VerifyEmailPage } from '../../features/auth/pages/VerifyEmailPage.jsx';
import { Accounts } from '../../features/accounts/components/Accounts.jsx';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path='/' element={<LoginPage />} />
      <Route path='/verify-email' element={<VerifyEmailPage />}></Route>
      <Route
        path='/dashboard/*'
        element={
          <ProtecterRoute>
            <RoleGuard allowedRoles={['ADMIN_ROLE']}>
              <DashboardPage />
            </RoleGuard>
          </ProtecterRoute>
        }
      >
        {/*
            Nota: Las rutas hijas faltantes, se colocaran aquí más adelante.
        */}

        <Route path='users' element={<Users />} />
        <Route path='accounts' element={<Accounts />} />
      </Route>
    </Routes>
  );
};
