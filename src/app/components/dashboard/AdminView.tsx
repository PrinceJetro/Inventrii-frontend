import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowRight, X, Plus, MoreVertical, ChevronDown,
  Package, TrendingUp, AlertTriangle
} from 'lucide-react';
import {
  products, topSelling, outOfStockProducts, featuredApps,
  formatCurrency
} from '../../data/mockData';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

const RANK_DISPLAY = [
  { emoji: '🥇', label: '1st', color: 'text-amber-600 bg-amber-50' },
  { emoji: '🥈', label: '2nd', color: 'text-slate-600 bg-slate-100' },
  { emoji: '🥉', label: '3rd', color: 'text-amber-700 bg-orange-50' },
];

const inStockCount = products.reduce((sum, p) => sum + p.quantity, 0);

const weeklyData = [
  { day: 'Mon', sales: 820 },
  { day: 'Tue', sales: 932 },
  { day: 'Wed', sales: 1050 },
  { day: 'Thu', sales: 780 },
  { day: 'Fri', sales: 1149 },
  { day: 'Sat', sales: 945 },
  { day: 'Sun', sales: 610 },
];

export default function AdminView() {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(true);
  const [filterDate, setFilterDate] = useState('06/Apr/26');
  const [outOfStockList, setOutOfStockList] = useState(outOfStockProducts);

  const removeOutOfStock = (id: string) => {
    setOutOfStockList(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="flex gap-6">
      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 min-w-0 space-y-6">

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3 relative bg-[#EEF2FF] rounded-2xl p-6 overflow-hidden">
            <div className="absolute -top-6 right-16 w-28 h-36 bg-amber-400 rounded-[40%_60%_60%_40%/50%_30%_70%_50%] opacity-80" />
            <div className="absolute bottom-0 right-4 w-24 h-16 bg-[#F94F7B] rounded-[60%_40%_0_0/60%_60%_0_0] opacity-85" />
            <div className="relative z-10">
              <p className="text-[#4361EE] text-sm mb-1">In Stock</p>
              <p className="text-[#333333] text-4xl font-medium mb-4">{inStockCount.toLocaleString()}</p>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => navigate('/app/inventory')}
                  className="text-sm text-[#4361EE] border border-[#4361EE] rounded-full px-4 py-1.5 hover:bg-[#4361EE] hover:text-white transition-colors"
                >
                  View Products
                </button>
                <button
                  onClick={() => navigate('/app/inventory')}
                  className="w-9 h-9 rounded-full bg-[#4361EE] text-white flex items-center justify-center hover:bg-[#3451DE] transition-colors"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="bg-[#FFF6EC] rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="text-[#E08B31] text-sm mb-1">Today's Sales</p>
                <p className="text-[#333333] text-2xl font-medium">1,149</p>
              </div>
              <button
                onClick={() => navigate('/pos')}
                className="w-9 h-9 rounded-full bg-[#E08B31] text-white flex items-center justify-center hover:bg-[#C97A28] transition-colors shrink-0"
              >
                <ArrowRight size={16} />
              </button>
            </div>
            <div className="bg-[#ECFDF5] rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="text-[#059669] text-sm mb-1">Today's Revenue</p>
                <p className="text-[#333333] text-xl font-medium">₦2,558,830.96</p>
              </div>
              <button
                onClick={() => navigate('/app/inventory')}
                className="w-9 h-9 rounded-full bg-[#059669] text-white flex items-center justify-center hover:bg-[#047857] transition-colors shrink-0"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* ── ALERT BANNER ── */}
        {showAlert && (
          <div className="bg-[#FEF2F2] border border-red-200 rounded-2xl p-4 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shrink-0 mt-0.5">
                <X size={12} className="text-white" strokeWidth={3} />
              </div>
              <div>
                <p className="text-red-600 text-sm font-medium">Office Address Missing</p>
                <p className="text-red-500 text-sm mt-0.5">Some offices do not have address. Click on the button to add them</p>
                <button className="mt-3 text-sm border border-red-500 text-red-500 rounded-full px-4 py-1.5 hover:bg-red-500 hover:text-white transition-colors">
                  Add Address
                </button>
              </div>
            </div>
            <button onClick={() => setShowAlert(false)} className="text-red-400 hover:text-red-600 transition-colors shrink-0">
              <X size={18} />
            </button>
          </div>
        )}

        {/* ── LOW STOCK ALERT ── */}
        {products.filter(p => p.status === 'low-stock').length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <AlertTriangle size={15} className="text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-amber-800 text-sm font-medium">
                {products.filter(p => p.status === 'low-stock').length} products are running low on stock
              </p>
              <p className="text-amber-600 text-xs mt-0.5">
                {products.filter(p => p.status === 'low-stock').map(p => p.name).join(', ')}
              </p>
            </div>
            <button
              onClick={() => navigate('/app/inventory')}
              className="text-sm text-amber-700 border border-amber-300 rounded-xl px-3 py-1.5 hover:bg-amber-100 transition-colors shrink-0"
            >
              Restock
            </button>
          </div>
        )}

        {/* ── WEEKLY SALES CHART ── */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#333333]">Weekly Sales</h2>
            <span className="text-xs text-[#717182] bg-gray-100 px-3 py-1 rounded-full">This Week</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weeklyData} barSize={28}>
              <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis key="xaxis" dataKey="day" tick={{ fontSize: 12, fill: '#717182' }} axisLine={false} tickLine={false} />
              <YAxis key="yaxis" tick={{ fontSize: 11, fill: '#717182' }} axisLine={false} tickLine={false} width={30} />
              <Tooltip
                key="tooltip"
                contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', fontSize: 12, color: '#333333' }}
                cursor={{ fill: '#F3F4F6' }}
                formatter={(v: number) => [v.toLocaleString(), 'Sales']}
              />
              <Bar key="bar-sales" dataKey="sales" fill="#4361EE" radius={[6, 6, 0, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ── FEATURED APPS ── */}
        <div>
          <h2 className="text-[#333333] mb-4">Featured Apps &amp; Products</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {featuredApps.map(app => (
              <div
                key={app.id}
                className="flex items-center gap-3 bg-white rounded-2xl p-4 border border-gray-100 min-w-[260px] flex-shrink-0 hover:shadow-sm transition-shadow cursor-pointer"
                onClick={() => navigate('/app/apps')}
              >
                <img src={app.image} alt={app.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#333333] truncate">{app.name}</p>
                  <p className="text-xs text-[#717182] mt-0.5 line-clamp-2 leading-relaxed">{app.description}</p>
                </div>
                <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#4361EE] hover:border-[#4361EE] hover:text-white text-[#717182] transition-colors shrink-0">
                  <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── TOP SELLING ── */}
        <div className="bg-white rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-[#333333]">Top Selling</h2>
            <button className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-sm text-[#333333]">
              <span>Filter by</span>
              <span className="font-medium">{filterDate}</span>
              <ChevronDown size={14} className="text-[#717182]" />
            </button>
          </div>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs text-[#717182] uppercase tracking-wide">Product</th>
                  <th className="text-left px-4 py-3 text-xs text-[#717182] uppercase tracking-wide">
                    <div className="flex items-center gap-1">Qty Sold <TrendingUp size={11} className="text-[#717182]" /></div>
                  </th>
                  <th className="text-left px-4 py-3 text-xs text-[#717182] uppercase tracking-wide">
                    <div className="flex items-center gap-1">Qty Remaining <Package size={11} className="text-[#717182]" /></div>
                  </th>
                  <th className="text-left px-4 py-3 text-xs text-[#717182] uppercase tracking-wide">Ranking</th>
                  <th className="text-left px-4 py-3 text-xs text-[#717182] uppercase tracking-wide">Action</th>
                </tr>
              </thead>
              <tbody>
                {topSelling.map((item, i) => (
                  <tr key={item.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-[#333333]">{item.name}</p>
                      <p className="text-xs text-[#717182]">{formatCurrency(item.price)}</p>
                    </td>
                    <td className="px-4 py-4 text-sm text-[#333333]">{item.quantitySold}</td>
                    <td className="px-4 py-4 text-sm text-[#333333]">{item.quantityRemaining}</td>
                    <td className="px-4 py-4">
                      {i < 3 ? (
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${RANK_DISPLAY[i].color}`}>
                          {RANK_DISPLAY[i].emoji} {RANK_DISPLAY[i].label}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-[#717182] bg-gray-100 px-2.5 py-1 rounded-full">
                          ✓ {i + 1}th
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <button className="text-[#717182] hover:text-[#333333] transition-colors"><MoreVertical size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="md:hidden divide-y divide-gray-50">
            {topSelling.map((item, i) => (
              <div key={item.id} className="flex items-center justify-between px-4 py-4">
                <div className="flex items-center gap-3">
                  <div>
                    {i < 3 ? (
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full mb-1 ${RANK_DISPLAY[i].color}`}>
                        {RANK_DISPLAY[i].emoji} {RANK_DISPLAY[i].label}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-[#717182] bg-gray-100 px-2 py-0.5 rounded-full mb-1">✓ {i + 1}th</span>
                    )}
                    <p className="text-sm font-medium text-[#333333]">{item.name}</p>
                    <p className="text-xs text-[#717182]">{formatCurrency(item.price)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#717182]">Sold: <span className="text-[#333333] font-medium">{item.quantitySold}</span></p>
                  <p className="text-xs text-[#717182]">Left: <span className="text-[#333333] font-medium">{item.quantityRemaining}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL (xl only) ── */}
      <aside className="hidden xl:flex flex-col w-64 shrink-0">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="text-[#333333]">Out of Stock</h3>
            <button
              onClick={() => navigate('/app/inventory')}
              className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-[#717182] hover:bg-[#4361EE] hover:border-[#4361EE] hover:text-white transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {outOfStockList.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <Package size={32} className="text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-[#717182]">No out of stock items</p>
              </div>
            ) : (
              outOfStockList.map(product => (
                <div key={product.id} className="flex items-center justify-between px-5 py-4">
                  <div>
                    <p className="text-sm font-medium text-[#333333]">{product.name}</p>
                    <p className="text-xs text-[#717182] mt-0.5">{formatCurrency(product.price)}</p>
                  </div>
                  <button onClick={() => removeOutOfStock(product.id)} className="text-[#717182] hover:text-red-500 transition-colors">
                    <X size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
          {outOfStockList.length > 0 && (
            <div className="px-5 py-4 border-t border-gray-100">
              <button onClick={() => navigate('/app/inventory')} className="w-full text-sm text-[#4361EE] hover:underline text-center">
                View all in Inventory →
              </button>
            </div>
          )}
        </div>

        <div className="mt-4 bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <h3 className="text-[#333333] text-sm">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#717182]">Total Products</span>
              <span className="text-sm font-medium text-[#333333]">{products.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#717182]">Low Stock</span>
              <span className="text-sm font-medium text-amber-600">{products.filter(p => p.status === 'low-stock').length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#717182]">Out of Stock</span>
              <span className="text-sm font-medium text-red-500">{products.filter(p => p.status === 'out-of-stock').length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#717182]">Categories</span>
              <span className="text-sm font-medium text-[#333333]">{new Set(products.map(p => p.category)).size}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-[#FFF6EC] rounded-2xl border border-amber-200 p-5">
          <h3 className="text-[#E08B31] text-sm mb-3">Expiring Soon</h3>
          <div className="space-y-2">
            {products.filter(p => p.expiryDate < '2025-09-30').slice(0, 3).map(p => (
              <div key={p.id} className="flex items-center justify-between">
                <p className="text-xs text-[#333333] truncate flex-1">{p.name}</p>
                <span className="text-xs text-amber-600 ml-2 shrink-0">{p.expiryDate}</span>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/app/inventory')} className="mt-3 w-full text-xs text-[#E08B31] hover:underline text-center">
            View all expiring →
          </button>
        </div>
      </aside>
    </div>
  );
}
