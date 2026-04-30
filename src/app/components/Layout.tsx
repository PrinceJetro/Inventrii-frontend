import { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import {
  Home, Package, LayoutGrid, Users, LogOut,
  Search, Bell, ChevronDown, Building2, Plus,
  X, CheckCircle, AlertTriangle, Info, AlertCircle,
  ClipboardList, ShoppingCart, Shield, Stethoscope
} from 'lucide-react';
import logoImg from '../../imports/Logo.png';
import { STORES, notifications as initialNotifications, type Notification } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

type Role = 'Admin' | 'Pharmacist' | 'Cashier' | 'Store Manager';

const ALL_NAV = [
  { path: '/app', label: 'Home', icon: Home, roles: ['Admin', 'Pharmacist', 'Cashier', 'Store Manager'] },
  { path: '/app/inventory', label: 'Inventory', icon: Package, roles: ['Admin', 'Pharmacist', 'Store Manager'] },
  { path: '/app/prescriptions', label: 'Prescriptions', icon: ClipboardList, roles: ['Admin', 'Pharmacist'] },
  { path: '/app/apps', label: 'Apps & Products', icon: LayoutGrid, roles: ['Admin', 'Store Manager'] },
  { path: '/app/users', label: 'Manage Users', icon: Users, roles: ['Admin', 'Store Manager'] },
];

const ROLE_CONFIG: Record<Role, { badge: string; badgeBg: string; icon: React.ElementType }> = {
  Admin:           { badge: 'Admin',         badgeBg: 'bg-purple-100 text-purple-700', icon: Shield },
  Pharmacist:      { badge: 'Pharmacist',     badgeBg: 'bg-blue-100 text-blue-700',    icon: Stethoscope },
  Cashier:         { badge: 'Cashier',        badgeBg: 'bg-green-100 text-green-700',  icon: ShoppingCart },
  'Store Manager': { badge: 'Store Manager',  badgeBg: 'bg-amber-100 text-amber-700',  icon: Package },
};

const AVATAR_COLORS: Record<string, string> = {
  u1: 'bg-emerald-500',
  u2: 'bg-blue-500',
  u3: 'bg-violet-500',
  u4: 'bg-amber-500',
  u5: 'bg-pink-500',
  u6: 'bg-teal-500',
};

const notifIcon = (type: Notification['type']) => {
  if (type === 'danger')  return <AlertCircle  size={16} className="text-red-500 shrink-0 mt-0.5" />;
  if (type === 'warning') return <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />;
  if (type === 'success') return <CheckCircle  size={16} className="text-green-500 shrink-0 mt-0.5" />;
  return <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />;
};

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  const [selectedStore, setSelectedStore] = useState(STORES[0]);
  const [showStoreDropdown, setShowStoreDropdown]   = useState(false);
  const [showNotifications, setShowNotifications]   = useState(false);
  const [showUserMenu, setShowUserMenu]             = useState(false);
  const [showSearch, setShowSearch]                 = useState(false);
  const [searchQuery, setSearchQuery]               = useState('');
  const [notifList, setNotifList]                   = useState(initialNotifications);

  const storeRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef  = useRef<HTMLDivElement>(null);

  const unreadCount = notifList.filter(n => !n.read).length;

  // Auth guard
  useEffect(() => {
    if (!currentUser) navigate('/login');
  }, [currentUser, navigate]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (storeRef.current && !storeRef.current.contains(e.target as Node)) setShowStoreDropdown(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
      if (userRef.current  && !userRef.current.contains(e.target as Node))  setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAllRead = () => setNotifList(prev => prev.map(n => ({ ...n, read: true })));

  const isActive = (path: string) => {
    if (path === '/app') return location.pathname === '/app';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!currentUser) return null;

  const role = currentUser.role as Role;
  const roleCfg = ROLE_CONFIG[role];
  const navItems = ALL_NAV.filter(n => n.roles.includes(role));
  const avatarColor = AVATAR_COLORS[currentUser.id] || 'bg-gray-400';

  // Mobile bottom nav items (max 4 + POS button)
  const mobileNavItems = navItems.slice(0, 4);

  return (
    <div className="flex h-screen bg-[#F8F9FB] overflow-hidden">
      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden md:flex flex-col w-56 lg:w-60 bg-white border-r border-gray-100 shrink-0">
        {/* Logo */}
        <div className="px-6 pt-6 pb-4">
          <img src={logoImg} alt="Inventrii" className="h-7 object-contain object-left" />
        </div>

        {/* Role badge */}
        <div className="px-4 pb-3">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${roleCfg.badgeBg.split(' ')[0]}/30`}>
            <roleCfg.icon size={13} className={roleCfg.badgeBg.split(' ')[1]} />
            <span className={`text-xs font-medium ${roleCfg.badgeBg.split(' ')[1]}`}>{roleCfg.badge}</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map(({ path, label, icon: Icon }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                isActive(path)
                  ? 'bg-[#F0F3FF] text-[#4361EE]'
                  : 'text-[#717182] hover:bg-gray-50 hover:text-[#333333]'
              }`}
            >
              <Icon size={18} className={isActive(path) ? 'text-[#4361EE]' : ''} />
              <span className={`text-sm ${isActive(path) ? 'font-medium' : ''}`}>{label}</span>
              {isActive(path) && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#4361EE]" />}
            </button>
          ))}

          {/* POS shortcut for Cashier */}
          {(role === 'Cashier' || role === 'Admin') && (
            <button
              onClick={() => navigate('/pos')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-[#717182] hover:bg-gray-50 hover:text-[#333333] transition-colors"
            >
              <ShoppingCart size={18} />
              <span className="text-sm">Point of Sale</span>
            </button>
          )}
        </nav>

        {/* User info + Logout */}
        <div className="px-3 pb-6 space-y-1">
          {/* User card */}
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gray-50">
            <div className={`w-7 h-7 rounded-full ${avatarColor} flex items-center justify-center text-white text-xs font-medium shrink-0`}>
              {currentUser.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[#333333] truncate">{currentUser.name}</p>
              <p className="text-xs text-[#717182] truncate">{currentUser.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN AREA ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* ── HEADER ── */}
        <header className="bg-white border-b border-gray-100 px-4 md:px-6 py-3 md:py-4 flex items-center gap-3 shrink-0 z-20">
          {/* Mobile: Logo */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <img src={logoImg} alt="Inventrii" className="h-6 object-contain object-left md:hidden" />

            {/* Desktop: Store Selector */}
            <div ref={storeRef} className="relative hidden md:block flex-1 max-w-xs lg:max-w-sm">
              <button
                onClick={() => setShowStoreDropdown(!showStoreDropdown)}
                className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl px-4 py-2 w-full text-left transition-colors"
              >
                <Building2 size={16} className="text-[#4361EE] shrink-0" />
                <span className="text-sm text-[#333333] truncate flex-1">{selectedStore.name}</span>
                <ChevronDown size={14} className="text-[#717182] shrink-0" />
              </button>
              {showStoreDropdown && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 z-50">
                  {STORES.map(store => (
                    <button
                      key={store.id}
                      onClick={() => { setSelectedStore(store); setShowStoreDropdown(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${selectedStore.id === store.id ? 'text-[#4361EE]' : 'text-[#333333]'}`}
                    >
                      <Building2 size={15} className="shrink-0" />
                      <span className="text-sm">{store.name}</span>
                      {selectedStore.id === store.id && <CheckCircle size={15} className="ml-auto text-[#4361EE]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            {showSearch ? (
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                <Search size={16} className="text-[#717182]" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="text-sm bg-transparent outline-none w-40 text-[#333333]"
                />
                <button onClick={() => { setShowSearch(false); setSearchQuery(''); }}>
                  <X size={14} className="text-[#717182]" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSearch(true)}
                className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
              >
                <Search size={18} className="text-[#717182]" />
              </button>
            )}

            {/* Notifications */}
            <div ref={notifRef} className="relative">
              <button
                onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
                className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors relative"
              >
                <Bell size={18} className="text-[#717182]" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>
              {showNotifications && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-lg border border-gray-100 z-50">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <span className="text-sm font-medium text-[#333333]">Notifications</span>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-xs text-[#4361EE] hover:underline">Mark all as read</button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifList.map(n => (
                      <div
                        key={n.id}
                        className={`flex gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 ${!n.read ? 'bg-blue-50/40' : ''}`}
                        onClick={() => setNotifList(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
                      >
                        {notifIcon(n.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-[#333333] leading-relaxed">{n.message}</p>
                          <p className="text-xs text-[#717182] mt-0.5">{n.time}</p>
                        </div>
                        {!n.read && <span className="w-2 h-2 bg-[#4361EE] rounded-full shrink-0 mt-1" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar */}
            <div ref={userRef} className="relative">
              <button
                onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
                className={`w-9 h-9 flex items-center justify-center rounded-full ${avatarColor} text-white text-sm font-medium hover:opacity-90 transition-opacity`}
              >
                {currentUser.avatar}
              </button>
              {showUserMenu && (
                <div className="absolute top-full right-0 mt-2 w-60 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-[#333333]">{currentUser.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${roleCfg.badgeBg}`}>{roleCfg.badge}</span>
                    </div>
                    <p className="text-xs text-[#717182] mt-0.5">{currentUser.email}</p>
                  </div>
                  {role === 'Admin' && (
                    <button
                      onClick={() => { navigate('/app/users'); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#333333] hover:bg-gray-50 transition-colors"
                    >
                      <Users size={15} />
                      Manage Users
                    </button>
                  )}
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={15} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── MOBILE STORE SELECTOR ── */}
        <div className="md:hidden bg-white border-b border-gray-100 px-4 py-2 shrink-0">
          <div ref={storeRef} className="relative">
            <button
              onClick={() => setShowStoreDropdown(!showStoreDropdown)}
              className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-full text-left"
            >
              <Building2 size={15} className="text-[#4361EE] shrink-0" />
              <span className="text-sm text-[#333333] truncate flex-1">{selectedStore.name}</span>
              <ChevronDown size={14} className="text-[#717182] shrink-0" />
            </button>
            {showStoreDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 z-50">
                {STORES.map(store => (
                  <button
                    key={store.id}
                    onClick={() => { setSelectedStore(store); setShowStoreDropdown(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 ${selectedStore.id === store.id ? 'text-[#4361EE]' : 'text-[#333333]'}`}
                  >
                    <Building2 size={15} className="shrink-0" />
                    <span className="text-sm">{store.name}</span>
                    {selectedStore.id === store.id && <CheckCircle size={15} className="ml-auto text-[#4361EE]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── PAGE CONTENT ── */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6">
          <Outlet />
        </main>

        {/* ── MOBILE BOTTOM NAV ── */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 py-2 z-30 flex items-center justify-around">
          {mobileNavItems.map(({ path, label, icon: Icon }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-colors ${
                isActive(path)
                  ? 'bg-[#333333] text-white'
                  : 'text-[#717182]'
              }`}
            >
              <Icon size={18} />
              <span className="text-xs">{label === 'Apps & Products' ? 'Apps' : label === 'Manage Users' ? 'Users' : label}</span>
            </button>
          ))}
          {/* POS Button */}
          <button
            onClick={() => navigate('/pos')}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-[#4361EE] text-white shadow-lg hover:bg-[#3451DE] transition-colors"
          >
            <Plus size={22} />
          </button>
        </nav>
      </div>
    </div>
  );
}
