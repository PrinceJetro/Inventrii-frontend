import { useNavigate } from 'react-router';
import {
  Package, AlertTriangle, AlertCircle, Calendar, ArrowRight,
  TrendingUp, CheckCircle, RefreshCw, BarChart2, ShoppingCart
} from 'lucide-react';
import { products, topSelling, formatCurrency } from '../../data/mockData';
import type { AppUser } from '../../data/mockData';

interface StoreManagerViewProps {
  user: AppUser;
}

export default function StoreManagerView({ user }: StoreManagerViewProps) {
  const navigate = useNavigate();

  const inStock   = products.filter(p => p.status === 'in-stock');
  const lowStock  = products.filter(p => p.status === 'low-stock');
  const outStock  = products.filter(p => p.status === 'out-of-stock');
  const totalQty  = products.reduce((s, p) => s + p.quantity, 0);

  // Categories breakdown
  const categories = Array.from(new Set(products.map(p => p.category)));
  const categoryData = categories.map(cat => {
    const items = products.filter(p => p.category === cat);
    const qty   = items.reduce((s, p) => s + p.quantity, 0);
    return { cat, qty, count: items.length };
  }).sort((a, b) => b.qty - a.qty).slice(0, 6);

  const maxQty = Math.max(...categoryData.map(c => c.qty));

  // Expiring soon (within 6 months)
  const expiringProducts = products
    .filter(p => p.expiryDate < '2025-10-01')
    .sort((a, b) => a.expiryDate.localeCompare(b.expiryDate));

  return (
    <div className="space-y-6">
      {/* ── WELCOME ── */}
      <div className="bg-gradient-to-r from-amber-50 to-[#FFF6EC] border border-amber-200 rounded-2xl p-5 flex items-center justify-between">
        <div>
          <p className="text-amber-600 text-sm">Welcome,</p>
          <h2 className="text-[#333333] mt-0.5">{user.name}</h2>
          <p className="text-xs text-[#717182] mt-1">
            Stock health: <strong className="text-green-600">{inStock.length} categories healthy</strong>
            {lowStock.length > 0 && <>, <strong className="text-amber-600">{lowStock.length} low</strong></>}
            {outStock.length > 0 && <>, <strong className="text-red-500">{outStock.length} out of stock</strong></>}
          </p>
        </div>
        <div className="hidden sm:block w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center text-white text-xl font-medium shrink-0">
          {user.avatar}
        </div>
      </div>

      {/* ── STOCK HEALTH CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Products', value: products.length, sub: `${totalQty.toLocaleString()} units`, icon: Package, color: 'text-[#4361EE]', bg: 'bg-[#EEF2FF]' },
          { label: 'In Stock', value: inStock.length, sub: 'healthy products', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Low Stock', value: lowStock.length, sub: 'need restocking', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Out of Stock', value: outStock.length, sub: 'critical — reorder now', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
        ].map(s => (
          <div
            key={s.label}
            className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm cursor-pointer hover:border-[#4361EE]/30 transition-colors"
            onClick={() => navigate('/app/inventory')}
          >
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon size={18} className={s.color} />
            </div>
            <p className={`text-2xl font-semibold ${s.color}`}>{s.value}</p>
            <p className="text-xs font-medium text-[#333333] mt-0.5">{s.label}</p>
            <p className="text-xs text-[#717182]">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── MAIN PANEL ── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Stock by category */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart2 size={16} className="text-[#4361EE]" />
                <h3 className="text-[#333333]">Stock by Category</h3>
              </div>
              <button onClick={() => navigate('/app/inventory')} className="text-xs text-[#4361EE] hover:underline flex items-center gap-1">
                View all <ArrowRight size={12} />
              </button>
            </div>
            <div className="space-y-3">
              {categoryData.map(({ cat, qty, count }) => (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[#333333]">{cat}</span>
                    <span className="text-xs text-[#717182]">{qty.toLocaleString()} units · {count} product{count > 1 ? 's' : ''}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#4361EE] transition-all"
                      style={{ width: `${(qty / maxQty) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Low / out of stock table */}
          {(lowStock.length > 0 || outStock.length > 0) && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-[#333333] flex items-center gap-2">
                  <AlertTriangle size={15} className="text-amber-500" />
                  Restock Alerts
                </h3>
                <button onClick={() => navigate('/app/inventory')} className="text-xs text-[#4361EE] hover:underline">Manage inventory</button>
              </div>
              <div className="divide-y divide-gray-50">
                {[...outStock, ...lowStock].slice(0, 6).map(p => (
                  <div key={p.id} className="flex items-center justify-between px-5 py-3.5">
                    <div>
                      <p className="text-sm text-[#333333]">{p.name}</p>
                      <p className="text-xs text-[#717182]">{p.category} · {formatCurrency(p.price)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        p.status === 'out-of-stock' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {p.quantity === 0 ? 'Out of stock' : `${p.quantity} left`}
                      </span>
                      <button
                        onClick={() => navigate('/app/inventory')}
                        className="w-7 h-7 rounded-lg bg-[#EEF2FF] text-[#4361EE] flex items-center justify-center hover:bg-[#4361EE] hover:text-white transition-colors"
                      >
                        <RefreshCw size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top selling summary */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-[#333333] flex items-center gap-2">
                <TrendingUp size={15} className="text-green-600" />
                Top Selling Products
              </h3>
            </div>
            <div className="divide-y divide-gray-50">
              {topSelling.map((item, i) => (
                <div key={item.id} className="flex items-center gap-3 px-5 py-3.5">
                  <span className="w-6 h-6 rounded-full bg-[#EEF2FF] text-[#4361EE] text-xs flex items-center justify-center font-medium shrink-0">{i+1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#333333] truncate">{item.name}</p>
                    <p className="text-xs text-[#717182]">{item.quantitySold} sold · {item.quantityRemaining} remaining</p>
                  </div>
                  <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-green-500"
                      style={{ width: `${(item.quantitySold / (item.quantitySold + item.quantityRemaining)) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Expiry + actions ── */}
        <div className="space-y-4">
          {/* Quick actions */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <h3 className="text-sm font-medium text-[#333333] mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: 'Manage Inventory', icon: Package, path: '/app/inventory', color: 'bg-[#4361EE] text-white' },
                { label: 'View POS Sales', icon: ShoppingCart, path: '/pos', color: 'bg-gray-100 text-[#333333]' },
                { label: 'Manage Users', icon: null, path: '/app/users', color: 'bg-gray-100 text-[#333333]', label2: 'Manage Users' },
              ].map(a => (
                <button
                  key={a.label}
                  onClick={() => navigate(a.path)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm ${a.color} hover:opacity-90 transition-opacity`}
                >
                  {a.icon && <a.icon size={15} />}
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* Expiry alerts */}
          <div className="bg-[#FFF6EC] rounded-2xl border border-amber-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-amber-200 flex items-center gap-2">
              <Calendar size={14} className="text-amber-600" />
              <h3 className="text-sm font-medium text-amber-700">Expiring Soon</h3>
            </div>
            <div className="divide-y divide-amber-100 max-h-64 overflow-y-auto">
              {expiringProducts.slice(0, 6).map(p => (
                <div key={p.id} className="flex items-center justify-between px-4 py-3">
                  <p className="text-xs text-[#333333] truncate flex-1">{p.name}</p>
                  <span className="text-xs text-amber-600 ml-2 shrink-0">{p.expiryDate}</span>
                </div>
              ))}
              {expiringProducts.length === 0 && (
                <div className="px-4 py-6 text-center">
                  <p className="text-xs text-amber-600">No products expiring soon</p>
                </div>
              )}
            </div>
            <div className="px-4 py-3 border-t border-amber-200">
              <button
                onClick={() => navigate('/app/inventory')}
                className="w-full text-xs text-amber-700 hover:underline text-center"
              >
                View all expiry dates →
              </button>
            </div>
          </div>

          {/* Inventory health summary */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <h3 className="text-sm font-medium text-[#333333] mb-3">Inventory Health</h3>
            <div className="space-y-2.5">
              {[
                { label: 'Healthy', value: inStock.length, total: products.length, color: 'bg-green-500' },
                { label: 'Low Stock', value: lowStock.length, total: products.length, color: 'bg-amber-500' },
                { label: 'Out of Stock', value: outStock.length, total: products.length, color: 'bg-red-500' },
              ].map(s => (
                <div key={s.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-[#717182]">{s.label}</span>
                    <span className="text-xs text-[#333333] font-medium">{s.value}/{products.length}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${s.color}`} style={{ width: `${(s.value / s.total) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
