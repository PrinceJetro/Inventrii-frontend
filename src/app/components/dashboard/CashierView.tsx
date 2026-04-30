import { useNavigate } from 'react-router';
import {
  ShoppingCart, CreditCard, Banknote, Building2,
  ArrowRight, Plus, Package, TrendingUp, Barcode
} from 'lucide-react';
import {
  initialCarts, products, formatCurrency,
  getCartTotal, getCartSubtotal
} from '../../data/mockData';
import type { AppUser } from '../../data/mockData';

interface CashierViewProps {
  user: AppUser;
}

const PAYMENT_ICONS = { card: CreditCard, cash: Banknote, transfer: Building2 };

// Mock recent transactions
const recentTransactions = [
  { id: 'tx1', cart: 'Cart 1', amount: 30649.87, method: 'transfer' as const, time: '10:42 AM', items: 4 },
  { id: 'tx2', cart: 'Cart 2', amount: 28649.23, method: 'card' as const,     time: '09:31 AM', items: 3 },
  { id: 'tx3', cart: 'Cart 3', amount: 2512.50,  method: 'cash' as const,     time: '09:15 AM', items: 1 },
  { id: 'tx4', cart: 'Cart 4', amount: 17297.00, method: 'transfer' as const, time: '08:58 AM', items: 2 },
];

export default function CashierView({ user }: CashierViewProps) {
  const navigate = useNavigate();

  const todaySales = 1149;
  const todayRevenue = 2558830.96;
  const activeCarts = initialCarts.filter(c => c.items.length > 0).length;
  const totalItems = initialCarts.reduce((sum, c) => sum + c.items.reduce((s, i) => s + i.quantity, 0), 0);

  return (
    <div className="space-y-6">
      {/* ── WELCOME HERO ── */}
      <div className="bg-gradient-to-br from-[#4361EE] to-[#3451DE] rounded-2xl p-6 text-white overflow-hidden relative">
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute -bottom-10 -right-2 w-28 h-28 bg-white/5 rounded-full" />
        <div className="relative z-10">
          <p className="text-blue-200 text-sm">Welcome back,</p>
          <h2 className="text-white mt-0.5 mb-3">{user.name}</h2>
          <p className="text-blue-100 text-sm mb-5">You're all set to process sales today. Your POS is ready.</p>
          <button
            onClick={() => navigate('/pos')}
            className="flex items-center gap-2.5 bg-white text-[#4361EE] px-6 py-2.5 rounded-xl text-sm hover:bg-blue-50 transition-colors font-medium"
          >
            <ShoppingCart size={16} />
            Open POS Terminal
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today's Sales", value: todaySales.toLocaleString(), unit: 'transactions', color: 'text-amber-600', bg: 'bg-amber-50', icon: TrendingUp },
          { label: "Today's Revenue", value: `₦${(todayRevenue / 1000000).toFixed(1)}M`, unit: 'earned today', color: 'text-green-600', bg: 'bg-green-50', icon: Banknote },
          { label: 'Active Carts', value: activeCarts.toString(), unit: 'open carts', color: 'text-[#4361EE]', bg: 'bg-[#EEF2FF]', icon: ShoppingCart },
          { label: 'Items in Carts', value: totalItems.toString(), unit: 'total units', color: 'text-purple-600', bg: 'bg-purple-50', icon: Package },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon size={18} className={s.color} />
            </div>
            <p className={`text-xl font-semibold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-[#717182] mt-0.5">{s.label}</p>
            <p className="text-xs text-gray-400">{s.unit}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── ACTIVE CARTS ── */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShoppingCart size={16} className="text-[#4361EE]" />
                <h3 className="text-[#333333]">Active Carts</h3>
              </div>
              <button
                onClick={() => navigate('/pos')}
                className="flex items-center gap-1.5 text-xs text-[#4361EE] hover:underline"
              >
                Manage in POS <ArrowRight size={12} />
              </button>
            </div>
            <div className="divide-y divide-gray-50">
              {initialCarts.map(cart => {
                const subtotal = getCartSubtotal(cart);
                const total = getCartTotal(cart);
                return (
                  <div key={cart.id} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#EEF2FF] flex items-center justify-center text-[#4361EE] text-xs font-medium shrink-0">
                        {cart.label.replace('Cart ', '')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#333333]">{cart.label}</p>
                        <p className="text-xs text-[#717182]">{cart.items.length} item{cart.items.length !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-[#333333]">{formatCurrency(total)}</p>
                      <p className="text-xs text-[#717182]">subtotal {formatCurrency(subtotal)}</p>
                    </div>
                    <button
                      onClick={() => navigate('/pos')}
                      className="ml-4 text-xs text-[#4361EE] border border-[#4361EE]/30 px-3 py-1.5 rounded-xl hover:bg-[#EEF2FF] transition-colors shrink-0"
                    >
                      Checkout
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="px-5 py-3 border-t border-gray-100">
              <button
                onClick={() => navigate('/pos')}
                className="w-full flex items-center justify-center gap-2 bg-[#4361EE] text-white py-2.5 rounded-xl text-sm hover:bg-[#3451DE] transition-colors"
              >
                <Plus size={15} />
                New Cart / Sale
              </button>
            </div>
          </div>

          {/* Recent transactions */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-[#333333]">Recent Transactions</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {recentTransactions.map(tx => {
                const Icon = PAYMENT_ICONS[tx.method];
                return (
                  <div key={tx.id} className="flex items-center gap-3 px-5 py-3.5">
                    <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                      <Icon size={14} className="text-[#717182]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#333333]">{tx.cart}</p>
                      <p className="text-xs text-[#717182]">{tx.items} items · {tx.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">+{formatCurrency(tx.amount)}</p>
                      <p className="text-xs text-[#717182] capitalize">{tx.method}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Quick tools ── */}
        <div className="space-y-4">
          {/* Payment breakdown */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <h3 className="text-sm font-medium text-[#333333] mb-3">Payment Methods Today</h3>
            <div className="space-y-3">
              {[
                { label: 'Bank Transfer', count: 2, pct: 50, color: 'bg-[#4361EE]' },
                { label: 'Card', count: 1, pct: 25, color: 'bg-green-500' },
                { label: 'Cash', count: 1, pct: 25, color: 'bg-amber-500' },
              ].map(m => (
                <div key={m.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-[#717182]">{m.label}</span>
                    <span className="text-xs text-[#333333]">{m.count} txns</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${m.color}`} style={{ width: `${m.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <h3 className="text-sm font-medium text-[#333333] mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: 'Scan Barcode', icon: Barcode, path: '/pos', color: 'bg-[#4361EE] text-white' },
                { label: 'Open POS', icon: ShoppingCart, path: '/pos', color: 'bg-gray-100 text-[#333333]' },
                { label: 'View Products', icon: Package, path: '/app/inventory', color: 'bg-gray-100 text-[#333333]' },
              ].map(a => (
                <button
                  key={a.label}
                  onClick={() => navigate(a.path)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm ${a.color} hover:opacity-90 transition-opacity`}
                >
                  <a.icon size={15} />
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* Revenue target */}
          <div className="bg-[#ECFDF5] rounded-2xl p-4 border border-green-100">
            <p className="text-xs font-medium text-green-700 mb-1 flex items-center gap-1">
              <TrendingUp size={12} /> Daily Revenue Target
            </p>
            <p className="text-lg font-semibold text-green-800">₦2.56M / ₦3M</p>
            <div className="mt-2 h-2 bg-green-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: '85%' }} />
            </div>
            <p className="text-xs text-green-600 mt-1">85% of daily target reached</p>
          </div>
        </div>
      </div>
    </div>
  );
}
