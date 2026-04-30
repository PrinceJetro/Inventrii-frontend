import { createBrowserRouter } from 'react-router';
import LandingPage from './components/landing/LandingPage';
import LoginPage from './components/auth/LoginPage';
import Layout from './components/Layout';
import Dashboard from './components/dashboard/Dashboard';
import Inventory from './components/inventory/Inventory';
import POS from './components/pos/POS';
import AppsProducts from './components/apps/AppsProducts';
import ManageUsers from './components/users/ManageUsers';
import EPrescription from './components/prescriptions/EPrescription';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-6xl font-medium text-gray-200 mb-4">404</p>
      <h2 className="text-[#333333] mb-2">Page not found</h2>
      <p className="text-sm text-[#717182]">The page you're looking for doesn't exist.</p>
    </div>
  );
}

export const router = createBrowserRouter([
  { path: '/', Component: LandingPage },
  { path: '/login', Component: LoginPage },
  { path: '/pos', Component: POS },
  {
    path: '/app',
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: 'inventory', Component: Inventory },
      { path: 'prescriptions', Component: EPrescription },
      { path: 'apps', Component: AppsProducts },
      { path: 'users', Component: ManageUsers },
      { path: '*', Component: NotFound },
    ],
  },
]);
