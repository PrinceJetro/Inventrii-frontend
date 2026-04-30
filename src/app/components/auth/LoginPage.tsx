import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Shield, Stethoscope, ShoppingCart, Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { users, type AppUser } from '../../data/mockData';
import logoImg from '../../../imports/Logo.png';

const ROLE_CONFIG: Record<AppUser['role'], {
  icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
  desc: string;
  permissions: string[];
}> = {
  Admin: {
    icon: Shield,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    desc: 'Full system access — manage everything across all branches.',
    permissions: ['Full dashboard', 'All modules', 'User management', 'All reports'],
  },
  Pharmacist: {
    icon: Stethoscope,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    desc: 'Prescriptions, dispensing, and inventory management.',
    permissions: ['Prescription queue', 'Drug dispensing', 'Inventory view', 'Patient records'],
  },
  Cashier: {
    icon: ShoppingCart,
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
    desc: 'Sales, payments, and POS operations.',
    permissions: ['Point of Sale', 'Payment processing', 'Cart management', 'Sales overview'],
  },
  'Store Manager': {
    icon: Package,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    desc: 'Inventory oversight, stock management, and team coordination.',
    permissions: ['Stock management', 'Expiry tracking', 'Reorder alerts', 'Staff view'],
  },
};

const AVATAR_COLORS: Record<string, string> = {
  u1: 'bg-emerald-500',
  u2: 'bg-blue-500',
  u3: 'bg-violet-500',
  u4: 'bg-amber-500',
  u5: 'bg-pink-500',
  u6: 'bg-teal-500',
};

const ROLE_ORDER: AppUser['role'][] = ['Admin', 'Pharmacist', 'Cashier', 'Store Manager'];

export default function LoginPage() {
  const navigate = useNavigate();
  const { currentUser, login } = useAuth();

  useEffect(() => {
    if (currentUser) navigate('/app');
  }, [currentUser, navigate]);

  const handleLogin = (user: AppUser) => {
    login(user);
    navigate('/app');
  };

  // Group users by role
  const byRole = ROLE_ORDER.map(role => ({
    role,
    config: ROLE_CONFIG[role],
    members: users.filter(u => u.role === role),
  }));

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <img src={logoImg} alt="Inventrii" className="h-7 object-contain" />
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm text-[#717182] hover:text-[#333333] transition-colors"
        >
          <ArrowLeft size={15} />
          Back to Home
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-start py-10 px-4">
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-semibold text-[#333333] mb-2">Choose Your Account</h1>
          <p className="text-sm text-[#717182] max-w-md">
            Select a user profile to log in. Each role has a tailored dashboard with relevant tools and views.
          </p>
        </div>

        {/* Role groups */}
        <div className="w-full max-w-5xl space-y-8">
          {byRole.map(({ role, config, members }) => {
            if (members.length === 0) return null;
            const Icon = config.icon;
            return (
              <div key={role}>
                {/* Role header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-9 h-9 rounded-xl ${config.bg} flex items-center justify-center shrink-0`}>
                    <Icon size={18} className={config.color} />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-[#333333]">{role}</h2>
                    <p className="text-xs text-[#717182]">{config.desc}</p>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {config.permissions.map(p => (
                        <span key={p} className={`text-xs px-2 py-0.5 rounded-full ${config.bg} ${config.color} border ${config.border}`}>
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* User cards */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {members.map(user => (
                    <button
                      key={user.id}
                      onClick={() => handleLogin(user)}
                      className={`text-left bg-white rounded-2xl border p-4 hover:border-[#4361EE] hover:shadow-md transition-all duration-200 group ${
                        user.status === 'Inactive' ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-11 h-11 rounded-full ${AVATAR_COLORS[user.id] || 'bg-gray-400'} flex items-center justify-center text-white font-medium text-sm shrink-0`}>
                          {user.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#333333] truncate">{user.name}</p>
                          <p className="text-xs text-[#717182] truncate">{user.email}</p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                          user.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {user.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-[#717182] flex items-center gap-1">
                          Joined {new Date(user.joinedDate).toLocaleDateString('en-NG', { month: 'short', year: 'numeric' })}
                        </p>
                        <span className="text-xs text-[#4361EE] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          Log in <ArrowLeft size={11} className="rotate-180" />
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-10 text-xs text-gray-400 text-center max-w-sm">
          This is a demo environment. All data is mock data. No real credentials are required.
        </p>
      </div>
    </div>
  );
}
