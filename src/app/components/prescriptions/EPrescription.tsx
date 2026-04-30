import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import {
  Search, Plus, X, FileText, ChevronDown, ChevronRight,
  User, Stethoscope, Pill, Calendar, Phone, Hash,
  Building2, AlertCircle, CheckCircle, Clock, Ban,
  Trash2, ShoppingCart, Eye, Filter, ClipboardList,
  AlertTriangle, Info, ArrowRight, Printer
} from 'lucide-react';
import {
  prescriptions as initialPrescriptions,
  products,
  type Prescription,
  type PrescriptionItem,
  type PrescriptionStatus,
} from '../../data/mockData';

// ─── STATUS CONFIG ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<PrescriptionStatus, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
  pending:   { label: 'Pending',   bg: 'bg-amber-100',  text: 'text-amber-700',  icon: <Clock size={12} /> },
  dispensed: { label: 'Dispensed', bg: 'bg-green-100',  text: 'text-green-700',  icon: <CheckCircle size={12} /> },
  partial:   { label: 'Partial',   bg: 'bg-blue-100',   text: 'text-blue-700',   icon: <Info size={12} /> },
  cancelled: { label: 'Cancelled', bg: 'bg-red-100',    text: 'text-red-600',    icon: <Ban size={12} /> },
  expired:   { label: 'Expired',   bg: 'bg-gray-100',   text: 'text-gray-500',   icon: <AlertTriangle size={12} /> },
};

const FREQUENCIES = ['Once daily', 'Twice daily', '3 times daily', '4 times daily', 'Every 8 hours', 'Every 6 hours', 'As needed', 'At bedtime', 'With meals', 'Single dose', '2 puffs as needed', 'Once at night'];
const DURATIONS   = ['1 day', '3 days', '5 days', '7 days', '10 days', '14 days', '21 days', '30 days', '60 days', '90 days'];

// ─── EMPTY FORM STATE ──────────────────────────────────────────────────────────

interface DrugFormItem {
  id: string;
  drugName: string;
  dosage: string;
  quantity: string;
  frequency: string;
  duration: string;
  instructions: string;
  productId: string;
}

interface PrescriptionForm {
  patientName: string;
  patientPhone: string;
  patientAge: string;
  patientGender: 'Male' | 'Female';
  prescriberName: string;
  prescriberLicense: string;
  hospital: string;
  prescriptionDate: string;
  expiryDate: string;
  notes: string;
  drugs: DrugFormItem[];
}

const emptyDrug = (): DrugFormItem => ({
  id: `d${Date.now()}${Math.random()}`,
  drugName: '',
  dosage: '',
  quantity: '',
  frequency: 'Once daily',
  duration: '7 days',
  instructions: '',
  productId: '',
});

const emptyForm = (): PrescriptionForm => ({
  patientName: '',
  patientPhone: '',
  patientAge: '',
  patientGender: 'Male',
  prescriberName: '',
  prescriberLicense: '',
  hospital: '',
  prescriptionDate: new Date().toISOString().split('T')[0],
  expiryDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
  notes: '',
  drugs: [emptyDrug()],
});

// ─── STATUS BADGE ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: PrescriptionStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────

export default function EPrescription() {
  const navigate = useNavigate();
  const [rxList, setRxList]           = useState<Prescription[]>(initialPrescriptions);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PrescriptionStatus>('all');
  const [showCreateModal, setShowCreateModal]   = useState(false);
  const [viewRx, setViewRx]                     = useState<Prescription | null>(null);
  const [formStep, setFormStep]                 = useState<1 | 2 | 3>(1);
  const [form, setForm]                         = useState<PrescriptionForm>(emptyForm());
  const [dispensePreview, setDispensePreview]   = useState<Prescription | null>(null);
  const [formErrors, setFormErrors]             = useState<Partial<Record<string, string>>>({});
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  // ── DERIVED DATA ─────────────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    return rxList.filter(rx => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        rx.rxNumber.toLowerCase().includes(q) ||
        rx.patientName.toLowerCase().includes(q) ||
        rx.prescriberName.toLowerCase().includes(q) ||
        rx.hospital.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'all' || rx.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [rxList, searchQuery, statusFilter]);

  const stats = useMemo(() => ({
    total:     rxList.length,
    pending:   rxList.filter(r => r.status === 'pending').length,
    dispensed: rxList.filter(r => r.status === 'dispensed').length,
    partial:   rxList.filter(r => r.status === 'partial').length,
  }), [rxList]);

  // ── CREATE HELPERS ────────────────────────────────────────────────────────────

  const updateForm = (key: keyof PrescriptionForm, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setFormErrors(prev => ({ ...prev, [key]: '' }));
  };

  const updateDrug = (drugId: string, key: keyof DrugFormItem, value: string) => {
    setForm(prev => ({
      ...prev,
      drugs: prev.drugs.map(d => d.id === drugId ? { ...d, [key]: value } : d),
    }));
  };

  const addDrug = () => setForm(prev => ({ ...prev, drugs: [...prev.drugs, emptyDrug()] }));

  const removeDrug = (drugId: string) => {
    setForm(prev => ({ ...prev, drugs: prev.drugs.filter(d => d.id !== drugId) }));
  };

  const validateStep = (step: 1 | 2 | 3): boolean => {
    const errors: Partial<Record<string, string>> = {};
    if (step === 1) {
      if (!form.patientName.trim()) errors.patientName = 'Patient name is required';
      if (!form.patientAge.trim())  errors.patientAge  = 'Age is required';
    }
    if (step === 2) {
      if (!form.prescriberName.trim()) errors.prescriberName = 'Prescriber name is required';
    }
    if (step === 3) {
      form.drugs.forEach((d, i) => {
        if (!d.drugName.trim())  errors[`drug_name_${i}`]  = 'Drug name required';
        if (!d.quantity.trim())  errors[`drug_qty_${i}`]   = 'Quantity required';
      });
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (formStep === 1 && validateStep(1)) setFormStep(2);
    else if (formStep === 2 && validateStep(2)) setFormStep(3);
  };

  const submitForm = () => {
    if (!validateStep(3)) return;
    const rxNumber = `RX-2026-${String(rxList.length + 42).padStart(4, '0')}`;
    const newRx: Prescription = {
      id: `rx${Date.now()}`,
      rxNumber,
      patientName: form.patientName,
      patientPhone: form.patientPhone,
      patientAge: parseInt(form.patientAge) || 0,
      patientGender: form.patientGender,
      prescriberName: form.prescriberName,
      prescriberLicense: form.prescriberLicense,
      hospital: form.hospital,
      prescriptionDate: form.prescriptionDate,
      expiryDate: form.expiryDate,
      status: 'pending',
      notes: form.notes,
      items: form.drugs.map((d, idx) => ({
        id: `rxi_new_${idx}`,
        drugName: d.drugName,
        productId: d.productId || undefined,
        dosage: d.dosage,
        quantity: parseInt(d.quantity) || 0,
        frequency: d.frequency,
        duration: d.duration,
        dispensedQuantity: 0,
        instructions: d.instructions || undefined,
      })),
    };
    setRxList(prev => [newRx, ...prev]);
    setShowCreateModal(false);
    setForm(emptyForm());
    setFormStep(1);
  };

  const openCreate = () => {
    setForm(emptyForm());
    setFormStep(1);
    setFormErrors({});
    setShowCreateModal(true);
  };

  // ── DISPENSE TO POS ───────────────────────────────────────────────────────────

  const dispenseToPos = (rx: Prescription) => {
    // Build cart items from prescription, matching to inventory
    const cartItems = rx.items
      .filter(item => item.productId)
      .map(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product || product.quantity === 0) return null;
        return {
          productId: item.productId!,
          name: product.name,
          quantity: item.quantity,
          unitPrice: product.price,
          barcode: product.barcode,
          sku: product.sku,
        };
      })
      .filter(Boolean);

    localStorage.setItem('prescriptionCart', JSON.stringify({
      rxNumber: rx.rxNumber,
      patientName: rx.patientName,
      items: cartItems,
    }));

    // Update status to partial/dispensed
    setRxList(prev => prev.map(r =>
      r.id === rx.id
        ? { ...r, status: 'dispensed' as PrescriptionStatus, dispensedDate: new Date().toISOString().split('T')[0], dispensedBy: 'Dr. Adaeze Okonkwo' }
        : r
    ));

    setDispensePreview(null);
    setViewRx(null);
    navigate('/pos');
  };

  // ── CANCEL RX ─────────────────────────────────────────────────────────────────

  const cancelRx = (id: string) => {
    setRxList(prev => prev.map(r => r.id === id ? { ...r, status: 'cancelled' as PrescriptionStatus } : r));
    setViewRx(null);
  };

  // ── DISPENSE PREVIEW DATA ─────────────────────────────────────────────────────

  const getDispenseAnalysis = (rx: Prescription) => {
    return rx.items.map(item => {
      const product = item.productId ? products.find(p => p.id === item.productId) : null;
      return {
        item,
        product,
        canDispense: !!product && product.quantity > 0,
        reason: !product ? 'Drug not in inventory' : product.quantity === 0 ? 'Out of stock' : null,
      };
    });
  };

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* ── PAGE HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[#333333] flex items-center gap-2">
            <ClipboardList size={22} className="text-[#4361EE]" />
            E-Prescriptions
          </h1>
          <p className="text-sm text-[#717182] mt-0.5">Manage and dispense patient prescriptions</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#4361EE] text-white px-5 py-2.5 rounded-xl text-sm hover:bg-[#3451DE] transition-colors shrink-0 shadow-sm"
        >
          <Plus size={16} />
          New Prescription
        </button>
      </div>

      {/* ── STATS CARDS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: stats.total, color: 'text-[#4361EE]', bg: 'bg-[#EEF2FF]' },
          { label: 'Pending', value: stats.pending, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Dispensed', value: stats.dispensed, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Partial', value: stats.partial, color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <div className={`inline-flex w-9 h-9 items-center justify-center rounded-xl ${s.bg} mb-2`}>
              <FileText size={16} className={s.color} />
            </div>
            <p className={`text-xl font-semibold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-[#717182] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── SEARCH & FILTER ── */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#717182]" />
          <input
            type="text"
            placeholder="Search by patient name, RX number, or doctor..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-[#333333] placeholder-[#717182] outline-none focus:border-[#4361EE] transition-colors shadow-sm"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X size={14} className="text-[#717182]" />
            </button>
          )}
        </div>
        {/* Status filter */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowStatusDropdown(v => !v)}
            className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#333333] hover:border-[#4361EE] transition-colors shadow-sm"
          >
            <Filter size={14} className="text-[#717182]" />
            <span className="hidden sm:inline">{statusFilter === 'all' ? 'All Status' : STATUS_CONFIG[statusFilter].label}</span>
            <ChevronDown size={14} className="text-[#717182]" />
          </button>
          {showStatusDropdown && (
            <div className="absolute top-full right-0 mt-2 w-44 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 z-20">
              {(['all', 'pending', 'dispensed', 'partial', 'cancelled', 'expired'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => { setStatusFilter(s); setShowStatusDropdown(false); }}
                  className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left hover:bg-gray-50 transition-colors ${statusFilter === s ? 'text-[#4361EE] font-medium' : 'text-[#333333]'}`}
                >
                  {s === 'all' ? 'All Status' : STATUS_CONFIG[s].label}
                  {statusFilter === s && <CheckCircle size={14} className="ml-auto text-[#4361EE]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── PRESCRIPTION LIST ── */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 text-center">
          <ClipboardList size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-[#717182] text-sm">No prescriptions found</p>
          <p className="text-xs text-gray-400 mt-1">Try a different search or create a new prescription</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(rx => (
            <div
              key={rx.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-5 hover:border-[#4361EE]/30 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                {/* Left: RX icon */}
                <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] flex items-center justify-center shrink-0">
                  <FileText size={18} className="text-[#4361EE]" />
                </div>

                {/* Middle: main info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-[#4361EE] bg-[#EEF2FF] px-2 py-0.5 rounded-lg">{rx.rxNumber}</span>
                    <StatusBadge status={rx.status} />
                  </div>
                  <p className="text-sm font-medium text-[#333333]">{rx.patientName}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
                    <span className="text-xs text-[#717182] flex items-center gap-1">
                      <Stethoscope size={11} /> {rx.prescriberName}
                    </span>
                    <span className="text-xs text-[#717182] flex items-center gap-1">
                      <Building2 size={11} /> {rx.hospital}
                    </span>
                    <span className="text-xs text-[#717182] flex items-center gap-1">
                      <Calendar size={11} /> {rx.prescriptionDate}
                    </span>
                    <span className="text-xs text-[#717182]">
                      {rx.items.length} {rx.items.length === 1 ? 'drug' : 'drugs'}
                    </span>
                  </div>
                  {/* Drug pills */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {rx.items.slice(0, 3).map(item => (
                      <span key={item.id} className="text-xs bg-gray-100 text-[#717182] px-2 py-0.5 rounded-full">
                        {item.drugName}
                      </span>
                    ))}
                    {rx.items.length > 3 && (
                      <span className="text-xs bg-gray-100 text-[#717182] px-2 py-0.5 rounded-full">+{rx.items.length - 3} more</span>
                    )}
                  </div>
                </div>

                {/* Right: actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setViewRx(rx)}
                    className="flex items-center gap-1.5 text-sm text-[#4361EE] border border-[#4361EE]/30 px-3 py-1.5 rounded-xl hover:bg-[#EEF2FF] transition-colors"
                  >
                    <Eye size={14} />
                    <span className="hidden sm:inline">View</span>
                  </button>
                  {(rx.status === 'pending' || rx.status === 'partial') && (
                    <button
                      onClick={() => setDispensePreview(rx)}
                      className="flex items-center gap-1.5 text-sm text-white bg-[#4361EE] px-3 py-1.5 rounded-xl hover:bg-[#3451DE] transition-colors"
                    >
                      <ShoppingCart size={14} />
                      <span className="hidden sm:inline">Dispense</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          VIEW PRESCRIPTION MODAL
      ══════════════════════════════════════════════════════════════════════════ */}
      {viewRx && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl my-4">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-[#333333]">{viewRx.rxNumber}</h3>
                  <StatusBadge status={viewRx.status} />
                </div>
                <p className="text-xs text-[#717182]">Issued: {viewRx.prescriptionDate} · Expires: {viewRx.expiryDate}</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 text-[#717182] transition-colors">
                  <Printer size={16} />
                </button>
                <button onClick={() => setViewRx(null)} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 text-[#717182] transition-colors">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="px-6 py-5 space-y-5 overflow-y-auto max-h-[70vh]">
              {/* Patient + Prescriber grid */}
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Patient */}
                <div className="bg-gray-50 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-[#EEF2FF] flex items-center justify-center">
                      <User size={14} className="text-[#4361EE]" />
                    </div>
                    <span className="text-xs font-medium text-[#717182] uppercase tracking-wide">Patient</span>
                  </div>
                  <p className="text-sm font-medium text-[#333333]">{viewRx.patientName}</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-[#717182]">{viewRx.patientAge} yrs · {viewRx.patientGender}</p>
                    {viewRx.patientPhone && (
                      <p className="text-xs text-[#717182] flex items-center gap-1">
                        <Phone size={10} /> {viewRx.patientPhone}
                      </p>
                    )}
                  </div>
                </div>
                {/* Prescriber */}
                <div className="bg-gray-50 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-[#EEF2FF] flex items-center justify-center">
                      <Stethoscope size={14} className="text-[#4361EE]" />
                    </div>
                    <span className="text-xs font-medium text-[#717182] uppercase tracking-wide">Prescriber</span>
                  </div>
                  <p className="text-sm font-medium text-[#333333]">{viewRx.prescriberName}</p>
                  <div className="mt-2 space-y-1">
                    {viewRx.prescriberLicense && (
                      <p className="text-xs text-[#717182] flex items-center gap-1">
                        <Hash size={10} /> {viewRx.prescriberLicense}
                      </p>
                    )}
                    {viewRx.hospital && (
                      <p className="text-xs text-[#717182] flex items-center gap-1">
                        <Building2 size={10} /> {viewRx.hospital}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Drugs table */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Pill size={15} className="text-[#4361EE]" />
                  <span className="text-sm font-medium text-[#333333]">Prescribed Drugs ({viewRx.items.length})</span>
                </div>
                <div className="space-y-2">
                  {viewRx.items.map((item, idx) => {
                    const product = item.productId ? products.find(p => p.id === item.productId) : null;
                    const inStock = product && product.quantity > 0;
                    return (
                      <div key={item.id} className="border border-gray-100 rounded-xl p-3.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="w-5 h-5 rounded-full bg-[#EEF2FF] text-[#4361EE] text-xs flex items-center justify-center font-medium shrink-0">{idx + 1}</span>
                              <p className="text-sm font-medium text-[#333333]">{item.drugName}</p>
                              {item.dosage && <span className="text-xs bg-gray-100 text-[#717182] px-2 py-0.5 rounded-full">{item.dosage}</span>}
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 ml-7">
                              <span className="text-xs text-[#717182]">Qty: <strong className="text-[#333333]">{item.quantity}</strong></span>
                              <span className="text-xs text-[#717182]">{item.frequency}</span>
                              <span className="text-xs text-[#717182]">{item.duration}</span>
                              {item.dispensedQuantity > 0 && (
                                <span className="text-xs text-green-600">Dispensed: {item.dispensedQuantity}</span>
                              )}
                            </div>
                            {item.instructions && (
                              <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-2 py-1 mt-2 ml-7">{item.instructions}</p>
                            )}
                          </div>
                          {product !== undefined && (
                            <span className={`text-xs px-2 py-1 rounded-lg shrink-0 ${inStock ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                              {inStock ? `${product.quantity} in stock` : 'Out of stock'}
                            </span>
                          )}
                          {product === undefined && item.productId === undefined && (
                            <span className="text-xs px-2 py-1 rounded-lg bg-gray-100 text-gray-400 shrink-0">Not in inventory</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dispensed info */}
              {viewRx.dispensedDate && (
                <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                  <p className="text-xs text-green-700">
                    <strong>Dispensed on</strong> {viewRx.dispensedDate}
                    {viewRx.dispensedBy && <> · <strong>by</strong> {viewRx.dispensedBy}</>}
                  </p>
                </div>
              )}

              {/* Notes */}
              {viewRx.notes && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                  <p className="text-xs font-medium text-amber-700 mb-1 flex items-center gap-1"><AlertCircle size={12} /> Clinical Notes</p>
                  <p className="text-xs text-amber-700">{viewRx.notes}</p>
                </div>
              )}
            </div>

            {/* Footer actions */}
            <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
              {(viewRx.status === 'pending' || viewRx.status === 'partial') && (
                <>
                  <button
                    onClick={() => { setDispensePreview(viewRx); setViewRx(null); }}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#4361EE] text-white py-2.5 rounded-xl text-sm hover:bg-[#3451DE] transition-colors"
                  >
                    <ShoppingCart size={15} />
                    Dispense to POS
                  </button>
                  <button
                    onClick={() => cancelRx(viewRx.id)}
                    className="flex items-center justify-center gap-2 border border-red-200 text-red-500 py-2.5 px-4 rounded-xl text-sm hover:bg-red-50 transition-colors"
                  >
                    <Ban size={15} />
                    Cancel Rx
                  </button>
                </>
              )}
              <button
                onClick={() => setViewRx(null)}
                className="flex items-center justify-center gap-2 border border-gray-200 text-[#717182] py-2.5 px-4 rounded-xl text-sm hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          DISPENSE PREVIEW MODAL
      ══════════════════════════════════════════════════════════════════════════ */}
      {dispensePreview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-[#333333]">Dispense Preview</h3>
              <button onClick={() => setDispensePreview(null)} className="text-[#717182]"><X size={18} /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="bg-[#EEF2FF] rounded-xl px-4 py-3">
                <p className="text-sm font-medium text-[#4361EE]">{dispensePreview.rxNumber} · {dispensePreview.patientName}</p>
                <p className="text-xs text-[#717182] mt-0.5">Items will be sent to a new POS cart for checkout</p>
              </div>

              <div className="space-y-2">
                {getDispenseAnalysis(dispensePreview).map(({ item, product, canDispense, reason }) => (
                  <div key={item.id} className={`flex items-center gap-3 px-3 py-3 rounded-xl border ${canDispense ? 'border-green-100 bg-green-50/50' : 'border-red-100 bg-red-50/50'}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${canDispense ? 'bg-green-100' : 'bg-red-100'}`}>
                      {canDispense ? <CheckCircle size={14} className="text-green-600" /> : <AlertCircle size={14} className="text-red-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#333333]">{item.drugName}</p>
                      <p className="text-xs text-[#717182]">Qty: {item.quantity} · {item.dosage}</p>
                    </div>
                    {canDispense && product && (
                      <span className="text-xs text-green-600 shrink-0">₦{product.price.toLocaleString()}</span>
                    )}
                    {!canDispense && (
                      <span className="text-xs text-red-500 shrink-0">{reason}</span>
                    )}
                  </div>
                ))}
              </div>

              {getDispenseAnalysis(dispensePreview).some(a => !a.canDispense) && (
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                  <AlertTriangle size={15} className="text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-amber-700">Some items cannot be added to the cart. Only available drugs will be sent to POS.</p>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => dispenseToPos(dispensePreview)}
                className="flex-1 flex items-center justify-center gap-2 bg-[#4361EE] text-white py-2.5 rounded-xl text-sm hover:bg-[#3451DE] transition-colors"
              >
                <ShoppingCart size={15} />
                Send to POS
                <ArrowRight size={14} />
              </button>
              <button
                onClick={() => setDispensePreview(null)}
                className="px-5 border border-gray-200 text-[#717182] py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          CREATE PRESCRIPTION MODAL (3-step wizard)
      ══════════════════════════════════════════════════════════════════════════ */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl my-4">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h3 className="text-[#333333]">New Prescription</h3>
                <p className="text-xs text-[#717182] mt-0.5">Step {formStep} of 3</p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-[#717182]"><X size={18} /></button>
            </div>

            {/* Step progress */}
            <div className="px-6 pt-4 pb-2">
              <div className="flex items-center gap-2">
                {[
                  { step: 1, label: 'Patient', icon: <User size={13} /> },
                  { step: 2, label: 'Prescriber', icon: <Stethoscope size={13} /> },
                  { step: 3, label: 'Drugs', icon: <Pill size={13} /> },
                ].map(({ step, label, icon }, idx) => (
                  <div key={step} className="flex items-center flex-1">
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                      formStep === step ? 'bg-[#4361EE] text-white' :
                      formStep > step ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-[#717182]'
                    }`}>
                      {formStep > step ? <CheckCircle size={13} /> : icon}
                      {label}
                    </div>
                    {idx < 2 && <ChevronRight size={14} className="text-gray-300 mx-1 shrink-0" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Form content */}
            <div className="px-6 py-4 space-y-4 max-h-[55vh] overflow-y-auto">
              {/* ─ STEP 1: Patient ─ */}
              {formStep === 1 && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-xs text-[#717182] mb-1.5">Patient Full Name *</label>
                      <input
                        type="text"
                        value={form.patientName}
                        onChange={e => updateForm('patientName', e.target.value)}
                        placeholder="e.g. Chinonso Okafor"
                        className={`w-full px-4 py-2.5 border rounded-xl text-sm text-[#333333] outline-none focus:border-[#4361EE] transition-colors ${formErrors.patientName ? 'border-red-300' : 'border-gray-200'}`}
                      />
                      {formErrors.patientName && <p className="text-xs text-red-500 mt-1">{formErrors.patientName}</p>}
                    </div>
                    <div>
                      <label className="block text-xs text-[#717182] mb-1.5">Age *</label>
                      <input
                        type="number"
                        value={form.patientAge}
                        onChange={e => updateForm('patientAge', e.target.value)}
                        placeholder="Age"
                        min="0"
                        className={`w-full px-4 py-2.5 border rounded-xl text-sm text-[#333333] outline-none focus:border-[#4361EE] transition-colors ${formErrors.patientAge ? 'border-red-300' : 'border-gray-200'}`}
                      />
                      {formErrors.patientAge && <p className="text-xs text-red-500 mt-1">{formErrors.patientAge}</p>}
                    </div>
                    <div>
                      <label className="block text-xs text-[#717182] mb-1.5">Gender</label>
                      <select
                        value={form.patientGender}
                        onChange={e => updateForm('patientGender', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-[#333333] outline-none focus:border-[#4361EE] transition-colors bg-white"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs text-[#717182] mb-1.5">Phone Number</label>
                      <input
                        type="tel"
                        value={form.patientPhone}
                        onChange={e => updateForm('patientPhone', e.target.value)}
                        placeholder="+234 800 000 0000"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-[#333333] outline-none focus:border-[#4361EE] transition-colors"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* ─ STEP 2: Prescriber ─ */}
              {formStep === 2 && (
                <>
                  <div>
                    <label className="block text-xs text-[#717182] mb-1.5">Doctor / Prescriber Name *</label>
                    <input
                      type="text"
                      value={form.prescriberName}
                      onChange={e => updateForm('prescriberName', e.target.value)}
                      placeholder="e.g. Dr. Ifeoma Adeleke"
                      className={`w-full px-4 py-2.5 border rounded-xl text-sm text-[#333333] outline-none focus:border-[#4361EE] transition-colors ${formErrors.prescriberName ? 'border-red-300' : 'border-gray-200'}`}
                    />
                    {formErrors.prescriberName && <p className="text-xs text-red-500 mt-1">{formErrors.prescriberName}</p>}
                  </div>
                  <div>
                    <label className="block text-xs text-[#717182] mb-1.5">MDCN License Number</label>
                    <input
                      type="text"
                      value={form.prescriberLicense}
                      onChange={e => updateForm('prescriberLicense', e.target.value)}
                      placeholder="e.g. MDCN/2019/12345"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-[#333333] outline-none focus:border-[#4361EE] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#717182] mb-1.5">Hospital / Clinic</label>
                    <input
                      type="text"
                      value={form.hospital}
                      onChange={e => updateForm('hospital', e.target.value)}
                      placeholder="e.g. Lagos University Teaching Hospital"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-[#333333] outline-none focus:border-[#4361EE] transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-[#717182] mb-1.5">Prescription Date</label>
                      <input
                        type="date"
                        value={form.prescriptionDate}
                        onChange={e => updateForm('prescriptionDate', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-[#333333] outline-none focus:border-[#4361EE] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#717182] mb-1.5">Expiry Date</label>
                      <input
                        type="date"
                        value={form.expiryDate}
                        onChange={e => updateForm('expiryDate', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-[#333333] outline-none focus:border-[#4361EE] transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-[#717182] mb-1.5">Clinical Notes</label>
                    <textarea
                      value={form.notes}
                      onChange={e => updateForm('notes', e.target.value)}
                      placeholder="Allergies, special instructions, follow-up notes..."
                      rows={3}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-[#333333] outline-none focus:border-[#4361EE] transition-colors resize-none"
                    />
                  </div>
                </>
              )}

              {/* ─ STEP 3: Drugs ─ */}
              {formStep === 3 && (
                <div className="space-y-4">
                  {form.drugs.map((drug, idx) => (
                    <div key={drug.id} className="border border-gray-200 rounded-2xl p-4 space-y-3 relative">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-[#717182] uppercase tracking-wide">Drug {idx + 1}</span>
                        {form.drugs.length > 1 && (
                          <button onClick={() => removeDrug(drug.id)} className="text-red-400 hover:text-red-600">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs text-[#717182] mb-1">Drug Name *</label>
                        <input
                          type="text"
                          value={drug.drugName}
                          onChange={e => updateDrug(drug.id, 'drugName', e.target.value)}
                          placeholder="e.g. Amoxicillin 500mg"
                          className={`w-full px-3 py-2 border rounded-xl text-sm text-[#333333] outline-none focus:border-[#4361EE] transition-colors ${formErrors[`drug_name_${idx}`] ? 'border-red-300' : 'border-gray-200'}`}
                        />
                        {formErrors[`drug_name_${idx}`] && <p className="text-xs text-red-500 mt-1">{formErrors[`drug_name_${idx}`]}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-[#717182] mb-1">Dosage</label>
                          <input
                            type="text"
                            value={drug.dosage}
                            onChange={e => updateDrug(drug.id, 'dosage', e.target.value)}
                            placeholder="e.g. 500mg"
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm text-[#333333] outline-none focus:border-[#4361EE] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-[#717182] mb-1">Quantity *</label>
                          <input
                            type="number"
                            value={drug.quantity}
                            onChange={e => updateDrug(drug.id, 'quantity', e.target.value)}
                            placeholder="0"
                            min="1"
                            className={`w-full px-3 py-2 border rounded-xl text-sm text-[#333333] outline-none focus:border-[#4361EE] transition-colors ${formErrors[`drug_qty_${idx}`] ? 'border-red-300' : 'border-gray-200'}`}
                          />
                          {formErrors[`drug_qty_${idx}`] && <p className="text-xs text-red-500 mt-1">{formErrors[`drug_qty_${idx}`]}</p>}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-[#717182] mb-1">Frequency</label>
                          <select
                            value={drug.frequency}
                            onChange={e => updateDrug(drug.id, 'frequency', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm text-[#333333] outline-none focus:border-[#4361EE] transition-colors bg-white"
                          >
                            {FREQUENCIES.map(f => <option key={f} value={f}>{f}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-[#717182] mb-1">Duration</label>
                          <select
                            value={drug.duration}
                            onChange={e => updateDrug(drug.id, 'duration', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm text-[#333333] outline-none focus:border-[#4361EE] transition-colors bg-white"
                          >
                            {DURATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-[#717182] mb-1">Special Instructions</label>
                        <input
                          type="text"
                          value={drug.instructions}
                          onChange={e => updateDrug(drug.id, 'instructions', e.target.value)}
                          placeholder="e.g. Take after meals"
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm text-[#333333] outline-none focus:border-[#4361EE] transition-colors"
                        />
                      </div>
                      {/* Link to product */}
                      <div>
                        <label className="block text-xs text-[#717182] mb-1">Link to Inventory Product (optional)</label>
                        <select
                          value={drug.productId}
                          onChange={e => updateDrug(drug.id, 'productId', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm text-[#333333] outline-none focus:border-[#4361EE] transition-colors bg-white"
                        >
                          <option value="">— Select product —</option>
                          {products.map(p => (
                            <option key={p.id} value={p.id} disabled={p.quantity === 0}>
                              {p.name} {p.quantity === 0 ? '(Out of stock)' : `(${p.quantity} in stock)`}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={addDrug}
                    className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-300 rounded-2xl text-sm text-[#717182] hover:border-[#4361EE] hover:text-[#4361EE] transition-colors"
                  >
                    <Plus size={16} />
                    Add Another Drug
                  </button>
                </div>
              )}
            </div>

            {/* Footer nav */}
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              {formStep > 1 && (
                <button
                  onClick={() => setFormStep(prev => (prev - 1) as 1 | 2 | 3)}
                  className="px-5 border border-gray-200 text-[#717182] py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
              )}
              {formStep < 3 ? (
                <button
                  onClick={nextStep}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#4361EE] text-white py-2.5 rounded-xl text-sm hover:bg-[#3451DE] transition-colors"
                >
                  Continue
                  <ChevronRight size={15} />
                </button>
              ) : (
                <button
                  onClick={submitForm}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#4361EE] text-white py-2.5 rounded-xl text-sm hover:bg-[#3451DE] transition-colors"
                >
                  <CheckCircle size={15} />
                  Create Prescription
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
