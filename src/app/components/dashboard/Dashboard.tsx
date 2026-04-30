import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminView from './AdminView';
import PharmacistView from './PharmacistView';
import CashierView from './CashierView';
import StoreManagerView from './StoreManagerView';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) navigate('/login');
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  switch (currentUser.role) {
    case 'Admin':
      return <AdminView />;
    case 'Pharmacist':
      return <PharmacistView user={currentUser} />;
    case 'Cashier':
      return <CashierView user={currentUser} />;
    case 'Store Manager':
      return <StoreManagerView user={currentUser} />;
    default:
      return <AdminView />;
  }
}
