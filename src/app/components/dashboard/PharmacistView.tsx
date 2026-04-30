import { useNavigate } from 'react-router';
import {
  ClipboardList, Pill, AlertTriangle, CheckCircle, Clock,
  ArrowRight, ShoppingCart, Package, Plus, TrendingUp
} from 'lucide-react';
import { prescriptions, products, formatCurrency } from '../../data/mockData';
import type { AppUser } from '../../data/mockData';

interface PharmacistViewProps {
  user: AppUser;
}

export default function PharmacistView({ user }: PharmacistViewProps) {
  const navigate = useNavigate();

  const pending   = prescriptions.filter(r => r.status === 'pending');
  const dispensedToday = prescriptions.filter(r => r.status === 'dispensed' && r.dispensedDate === '2026-04-26');
  const allDispensed   = prescriptions.filter(r => r.status === 'dispensed');
  const lowStock  = products.filter(p => p.status === 'low-stock');
  const outStock  = products.filter(p => p.status === 'out-of-stock');

  // Count total drugs dispensed today
  const drugsDispensedToday = dispensedToday.reduce((sum, r) => sum + r.items.reduce((s, i) => s + i.dispensedQuantity, 0), 0);

  return (
    <div className="space-y-6">
      {/* ── WELCOME ── */}
      <div className="bg-gradient-to-r from-[#EEF2FF] to-blue-50 rounded-2xl p-5 flex items-center justify-between">
        <div>
          <p className="text-[#4361EE] text-sm">Good morning,</p>
          <h2 className="text-[#333333] mt-0.5">{user.name}</h2>
          <p className="text-xs text-[#717182] mt-1">You have <strong className="text-amber-600">{pending.length} pending prescriptions</strong> to dispense today.</p>
        </div>
        <div className="hidden sm:block w-14 h-14 rounded-2xl bg-[#4361EE] flex items-center justify-center text-white text-xl font-medium shrink-0">
          {user.avatar}
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className="bg-white rounded-2xl border border-gray-100 p-4 cursor-pointer hover:border-[#4361EE]/40 transition-colors shadow-sm"
          onClick={() => navigate('/app/prescriptions')}
        >
          <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center mb-3">
            <Clock size={18} className="text-amber-600" />
          </div>
          <p className="text-2xl font-semibold text-[#333333]">{pending.length}</p>
          <p className="text-xs text-[#717182] mt-0.5">Pending Rx</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center mb-3">
            <CheckCircle size={18} className="text-green-600" />
          </div>
          <p className="text-2xl font-semibold text-[#333333]">{allDispensed.length}</p>
          <p className="text-xs text-[#717182] mt-0.5">Total Dispensed</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-[#EEF2FF] flex items-center justify-center mb-3">
            <Pill size={18} className="text-[#4361EE]" />
          </div>
          <p className="text-2xl font-semibold text-[#333333]">{drugsDispensedToday || 62}</p>
          <p className="text-xs text-[#717182] mt-0.5">Drugs Dispensed</p>
        </div>
        <div
          className="bg-white rounded-2xl border border-gray-100 p-4 cursor-pointer hover:border-amber-200 transition-colors shadow-sm"
          onClick={() => navigate('/app/inventory')}
        >
          <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center mb-3">
            <AlertTriangle size={18} className="text-red-500" />
          </div>
          <p className="text-2xl font-semibold text-[#333333]">{lowStock.length + outStock.length}</p>
          <p className="text-xs text-[#717182] mt-0.5">Stock Alerts</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── PENDING PRESCRIPTION QUEUE ── */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <ClipboardList size={16} className="text-[#4361EE]" />
              <h3 className="text-[#333333]">Prescription Queue</h3>
              {pending.length > 0 && (
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{pending.length} pending</span>
              )}
            </div>
            <button
              onClick={() => navigate('/app/prescriptions')}
              className="text-xs text-[#4361EE] hover:underline flex items-center gap-1"
            >
              View all <ArrowRight size={12} />
            </button>
          </div>

          {pending.length === 0 ? (
            <div className="py-12 text-center">
              <CheckCircle size={36} className="text-green-400 mx-auto mb-2" />
              <p className="text-sm text-[#717182]">All caught up! No pending prescriptions.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {pending.slice(0, 4).map(rx => (
                <div key={rx.id} className="flex items-start gap-3 px-5 py-4 hover:bg-gray-50/50 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-[#EEF2FF] flex items-center justify-center shrink-0 mt-0.5">
                    <ClipboardList size={15} className="text-[#4361EE]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-medium text-[#4361EE]">{rx.rxNumber}</span>
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Clock size={10} /> Pending
                      </span>
                    </div>
                    <p className="text-sm font-medium text-[#333333] mt-0.5">{rx.patientName}</p>
                    <p className="text-xs text-[#717182]">{rx.prescriberName} · {rx.items.length} drug{rx.items.length > 1 ? 's' : ''}</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {rx.items.slice(0, 2).map(item => (
                        <span key={item.id} className="text-xs bg-gray-100 text-[#717182] px-1.5 py-0.5 rounded-md">{item.drugName}</span>
                      ))}
                      {rx.items.length > 2 && <span className="text-xs text-[#717182]">+{rx.items.length - 2} more</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/app/prescriptions')}
                    className="flex items-center gap-1.5 text-xs text-white bg-[#4361EE] px-3 py-1.5 rounded-xl hover:bg-[#3451DE] transition-colors shrink-0"
                  >
                    <ShoppingCart size={12} />
                    Dispense
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="px-5 py-3 border-t border-gray-100 flex gap-3">
            <button
              onClick={() => navigate('/app/prescriptions')}
              className="flex-1 flex items-center justify-center gap-2 border border-[#4361EE] text-[#4361EE] py-2.5 rounded-xl text-sm hover:bg-[#EEF2FF] transition-colors"
            >
              <ClipboardList size={15} />
              All Prescriptions
            </button>
            <button
              onClick={() => navigate('/app/prescriptions')}
              className="flex-1 flex items-center justify-center gap-2 bg-[#4361EE] text-white py-2.5 rounded-xl text-sm hover:bg-[#3451DE] transition-colors"
            >
              <Plus size={15} />
              New Prescription
            </button>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="space-y-4">
          {/* Quick actions */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <h3 className="text-sm font-medium text-[#333333] mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: 'Go to POS', icon: ShoppingCart, path: '/pos', color: 'bg-[#4361EE] text-white' },
                { label: 'View Inventory', icon: Package, path: '/app/inventory', color: 'bg-gray-100 text-[#333333]' },
              ].map(action => (
                <button
                  key={action.label}
                  onClick={() => navigate(action.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm ${action.color} hover:opacity-90 transition-opacity`}
                >
                  <action.icon size={15} />
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Low stock drugs */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-medium text-[#333333] flex items-center gap-2">
                <AlertTriangle size={14} className="text-amber-500" />
                Low Stock Drugs
              </h3>
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{lowStock.length}</span>
            </div>
            <div className="divide-y divide-gray-50">
              {lowStock.map(p => (
                <div key={p.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-xs font-medium text-[#333333]">{p.name}</p>
                    <p className="text-xs text-[#717182]">{formatCurrency(p.price)}</p>
                  </div>
                  <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">{p.quantity} left</span>
                </div>
              ))}
            </div>
          </div>

          {/* Today's activity */}
          <div className="bg-[#EEF2FF] rounded-2xl p-4">
            <p className="text-xs font-medium text-[#4361EE] mb-2 flex items-center gap-1">
              <TrendingUp size={12} /> Today's Activity
            </p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-[#717182]">Prescriptions dispensed</span>
                <span className="text-xs font-medium text-[#333333]">{allDispensed.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-[#717182]">Pending queue</span>
                <span className="text-xs font-medium text-amber-600">{pending.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-[#717182]">Out of stock</span>
                <span className="text-xs font-medium text-red-500">{outStock.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
