import { useState, useMemo } from 'react';
import {
  Search, Plus, X, MoreVertical, ChevronDown,
  Package, AlertTriangle, AlertCircle, Calendar,
  Filter, Edit2, Trash2, Eye, Barcode
} from 'lucide-react';
import { products as initialProducts, formatCurrency, type Product, type ProductStatus } from '../../data/mockData';
import { BarcodeScanner } from '../BarcodeScanner';

type FilterTab = 'all' | 'in-stock' | 'low-stock' | 'out-of-stock';

const STATUS_STYLES: Record<ProductStatus, string> = {
  'in-stock': 'bg-green-100 text-green-700',
  'low-stock': 'bg-amber-100 text-amber-700',
  'out-of-stock': 'bg-red-100 text-red-600',
  'expiring-soon': 'bg-orange-100 text-orange-700',
};

const STATUS_LABELS: Record<ProductStatus, string> = {
  'in-stock': 'In Stock',
  'low-stock': 'Low Stock',
  'out-of-stock': 'Out of Stock',
  'expiring-soon': 'Expiring Soon',
};

const CATEGORIES = ['All Categories', 'Antibiotics', 'Analgesics', 'NSAIDs', 'Vitamins', 'Antimalarials', 'Antidiabetics', 'Antacids', 'Antihypertensives', 'Statins', 'Bronchodilators', 'Antifungals'];

interface ProductFormData {
  name: string;
  category: string;
  sku: string;
  quantity: string;
  price: string;
  expiryDate: string;
  barcode: string;
}

const emptyForm: ProductFormData = {
  name: '', category: '', sku: '', quantity: '', price: '', expiryDate: '', barcode: ''
};

export default function Inventory() {
  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(emptyForm);
  const [actionMenu, setActionMenu] = useState<string | null>(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [scannerTarget, setScannerTarget] = useState<'search' | 'form'>('search');
  const [scanFeedback, setScanFeedback] = useState<{ type: 'found' | 'notfound'; msg: string } | null>(null);

  const filteredProducts = useMemo(() => {
    return productList.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchTab = activeTab === 'all' || p.status === activeTab;
      const matchCat = selectedCategory === 'All Categories' || p.category === selectedCategory;
      return matchSearch && matchTab && matchCat;
    });
  }, [productList, searchQuery, activeTab, selectedCategory]);

  const openAddModal = () => {
    setFormData(emptyForm);
    setEditProduct(null);
    setShowAddModal(true);
  };

  const openEditModal = (product: Product) => {
    setFormData({
      name: product.name,
      category: product.category,
      sku: product.sku,
      quantity: product.quantity.toString(),
      price: product.price.toString(),
      expiryDate: product.expiryDate,
      barcode: product.barcode,
    });
    setEditProduct(product);
    setShowAddModal(true);
    setActionMenu(null);
  };

  const handleDelete = (id: string) => {
    setProductList(prev => prev.filter(p => p.id !== id));
    setDeleteConfirm(null);
    setActionMenu(null);
  };

  const getStatus = (qty: number): ProductStatus => {
    if (qty === 0) return 'out-of-stock';
    if (qty <= 50) return 'low-stock';
    return 'in-stock';
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.category || !formData.sku || !formData.quantity || !formData.price) return;
    const qty = parseInt(formData.quantity);
    if (editProduct) {
      setProductList(prev => prev.map(p =>
        p.id === editProduct.id
          ? { ...p, ...formData, quantity: qty, price: parseFloat(formData.price), status: getStatus(qty) }
          : p
      ));
    } else {
      const newProduct: Product = {
        id: `p${Date.now()}`,
        name: formData.name,
        category: formData.category,
        sku: formData.sku,
        quantity: qty,
        price: parseFloat(formData.price),
        expiryDate: formData.expiryDate,
        status: getStatus(qty),
        barcode: formData.barcode || `6154${Math.floor(Math.random() * 1e9)}`,
      };
      setProductList(prev => [newProduct, ...prev]);
    }
    setShowAddModal(false);
  };

  const tabCounts = {
    all: productList.length,
    'in-stock': productList.filter(p => p.status === 'in-stock').length,
    'low-stock': productList.filter(p => p.status === 'low-stock').length,
    'out-of-stock': productList.filter(p => p.status === 'out-of-stock').length,
  };

  const handleInventoryScan = (barcode: string) => {
    setShowScanner(false);
    if (scannerTarget === 'form') {
      // Pre-fill barcode field in the add/edit form
      setFormData(prev => ({ ...prev, barcode }));
      return;
    }
    // Search mode: find existing product
    const found = productList.find(p => p.barcode === barcode);
    if (found) {
      setSearchQuery(found.name);
      setScanFeedback({ type: 'found', msg: `Found: ${found.name}` });
    } else {
      setScanFeedback({ type: 'notfound', msg: `No product for barcode ${barcode}. You can add it below.` });
      // Pre-fill barcode and open add modal
      setFormData({ ...emptyForm, barcode });
      setEditProduct(null);
      setShowAddModal(true);
    }
    setTimeout(() => setScanFeedback(null), 4000);
  };

  const openScannerForSearch = () => {
    setScannerTarget('search');
    setScanFeedback(null);
    setShowScanner(true);
  };

  const openScannerForForm = () => {
    setScannerTarget('form');
    setShowScanner(true);
  };

  return (
    <div className="space-y-5">
      {/* ── PAGE HEADER ── */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-[#333333]">Inventory</h1>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-[#4361EE] text-white px-4 py-2.5 rounded-xl hover:bg-[#3451DE] transition-colors text-sm shrink-0"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Add Product</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* ── SEARCH & FILTER BAR ── */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#717182]" />
          <input
            type="text"
            placeholder="Search by name, SKU or category..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-[#333333] placeholder-[#717182] outline-none focus:border-[#4361EE] transition-colors"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X size={14} className="text-[#717182]" />
            </button>
          )}
        </div>

        {/* Barcode scan button */}
        <button
          onClick={openScannerForSearch}
          className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#333333] hover:border-[#4361EE] hover:text-[#4361EE] transition-colors shrink-0"
          title="Scan barcode to find product"
        >
          <Barcode size={16} />
          <span className="hidden sm:inline">Scan</span>
        </button>

        {/* Category Filter */}
        <div className="relative">
          <button
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#333333] hover:border-[#4361EE] transition-colors whitespace-nowrap"
          >
            <Filter size={14} className="text-[#717182]" />
            <span className="hidden sm:inline">{selectedCategory === 'All Categories' ? 'Category' : selectedCategory}</span>
            <ChevronDown size={13} className="text-[#717182]" />
          </button>
          {showCategoryDropdown && (
            <div className="absolute top-full right-0 mt-2 w-52 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 z-20 max-h-64 overflow-y-auto">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setShowCategoryDropdown(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${selectedCategory === cat ? 'text-[#4361EE] font-medium' : 'text-[#333333]'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Scan feedback banner */}
      {scanFeedback && (
        <div className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm ${
          scanFeedback.type === 'found'
            ? 'bg-green-50 border border-green-200 text-green-700'
            : 'bg-amber-50 border border-amber-200 text-amber-700'
        }`}>
          <Barcode size={15} className="shrink-0" />
          <span className="flex-1">{scanFeedback.msg}</span>
          <button onClick={() => setScanFeedback(null)} className="opacity-60 hover:opacity-100">
            <X size={13} />
          </button>
        </div>
      )}

      {/* ── STATUS TABS ── */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {(['all', 'in-stock', 'low-stock', 'out-of-stock'] as FilterTab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              activeTab === tab
                ? 'bg-[#4361EE] text-white'
                : 'bg-white border border-gray-200 text-[#717182] hover:border-[#4361EE] hover:text-[#4361EE]'
            }`}
          >
            {tab === 'out-of-stock' && <AlertCircle size={13} />}
            {tab === 'low-stock' && <AlertTriangle size={13} />}
            <span className="capitalize">{tab === 'all' ? 'All' : STATUS_LABELS[tab as ProductStatus]}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab ? 'bg-white/25 text-white' : 'bg-gray-100 text-[#717182]'}`}>
              {tabCounts[tab]}
            </span>
          </button>
        ))}
      </div>

      {/* ── PRODUCT TABLE (Desktop) ── */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center">
            <Package size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-[#717182]">No products found</p>
            <button onClick={() => { setSearchQuery(''); setActiveTab('all'); setSelectedCategory('All Categories'); }} className="text-[#4361EE] text-sm mt-2 hover:underline">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-5 py-3.5 text-xs text-[#717182] uppercase tracking-wide font-medium">Product</th>
                  <th className="text-left px-4 py-3.5 text-xs text-[#717182] uppercase tracking-wide font-medium">Category</th>
                  <th className="text-left px-4 py-3.5 text-xs text-[#717182] uppercase tracking-wide font-medium">SKU</th>
                  <th className="text-left px-4 py-3.5 text-xs text-[#717182] uppercase tracking-wide font-medium">Quantity</th>
                  <th className="text-left px-4 py-3.5 text-xs text-[#717182] uppercase tracking-wide font-medium">Price</th>
                  <th className="text-left px-4 py-3.5 text-xs text-[#717182] uppercase tracking-wide font-medium">Expiry Date</th>
                  <th className="text-left px-4 py-3.5 text-xs text-[#717182] uppercase tracking-wide font-medium">Status</th>
                  <th className="px-4 py-3.5" />
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors relative">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] flex items-center justify-center shrink-0">
                          <Package size={14} className="text-[#4361EE]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#333333]">{product.name}</p>
                          <p className="text-xs text-[#717182]">{product.barcode}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-[#717182]">{product.category}</td>
                    <td className="px-4 py-4 text-sm text-[#333333] font-mono">{product.sku}</td>
                    <td className="px-4 py-4 text-sm text-[#333333]">{product.quantity.toLocaleString()}</td>
                    <td className="px-4 py-4 text-sm text-[#333333]">{formatCurrency(product.price)}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-[#717182]">
                        <Calendar size={12} />
                        {product.expiryDate}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_STYLES[product.status]}`}>
                        {STATUS_LABELS[product.status]}
                      </span>
                    </td>
                    <td className="px-4 py-4 relative">
                      <button
                        onClick={() => setActionMenu(actionMenu === product.id ? null : product.id)}
                        className="text-[#717182] hover:text-[#333333] transition-colors"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {actionMenu === product.id && (
                        <div className="absolute right-4 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20 w-40">
                          <button
                            onClick={() => openEditModal(product)}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#333333] hover:bg-gray-50"
                          >
                            <Edit2 size={14} /> Edit Product
                          </button>
                          <button
                            onClick={() => { setDeleteConfirm(product.id); setActionMenu(null); }}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── PRODUCT CARDS (Mobile) ── */}
      <div className="md:hidden space-y-3">
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
            <Package size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-[#717182]">No products found</p>
          </div>
        ) : (
          filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-2xl border border-gray-100 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] flex items-center justify-center shrink-0">
                    <Package size={16} className="text-[#4361EE]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#333333]">{product.name}</p>
                    <p className="text-xs text-[#717182] mt-0.5">{product.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${STATUS_STYLES[product.status]}`}>
                    {STATUS_LABELS[product.status]}
                  </span>
                  <button
                    onClick={() => setActionMenu(actionMenu === product.id ? null : product.id)}
                    className="text-[#717182]"
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3">
                <div>
                  <p className="text-xs text-[#717182]">SKU</p>
                  <p className="text-sm text-[#333333] font-mono mt-0.5">{product.sku}</p>
                </div>
                <div>
                  <p className="text-xs text-[#717182]">Quantity</p>
                  <p className="text-sm text-[#333333] mt-0.5">{product.quantity.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-[#717182]">Price</p>
                  <p className="text-sm text-[#333333] mt-0.5">{formatCurrency(product.price)}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-[#717182]">
                <Calendar size={12} />
                <span>Expires: {product.expiryDate}</span>
              </div>

              {actionMenu === product.id && (
                <div className="mt-3 pt-3 border-t border-gray-100 flex gap-3">
                  <button
                    onClick={() => openEditModal(product)}
                    className="flex-1 flex items-center justify-center gap-2 text-sm text-[#4361EE] border border-[#4361EE] rounded-xl py-2"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => { setDeleteConfirm(product.id); setActionMenu(null); }}
                    className="flex-1 flex items-center justify-center gap-2 text-sm text-red-500 border border-red-300 rounded-xl py-2"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* ── ADD/EDIT PRODUCT MODAL ── */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-[#333333]">{editProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#717182] hover:text-[#333333]">
                <X size={20} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm text-[#717182] mb-1.5">Product Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Amoxicillin 500mg"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-[#333333] outline-none focus:border-[#4361EE] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#717182] mb-1.5">Category *</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-[#333333] outline-none focus:border-[#4361EE] transition-colors appearance-none bg-white"
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[#717182] mb-1.5">SKU *</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={e => setFormData(prev => ({ ...prev, sku: e.target.value.toUpperCase() }))}
                    placeholder="e.g. AMX500"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-[#333333] outline-none focus:border-[#4361EE] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#717182] mb-1.5">Quantity *</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.quantity}
                    onChange={e => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                    placeholder="0"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-[#333333] outline-none focus:border-[#4361EE] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#717182] mb-1.5">Unit Price (₦) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0.00"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-[#333333] outline-none focus:border-[#4361EE] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#717182] mb-1.5">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={e => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-[#333333] outline-none focus:border-[#4361EE] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#717182] mb-1.5">Barcode</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={formData.barcode}
                      onChange={e => setFormData(prev => ({ ...prev, barcode: e.target.value }))}
                      placeholder="Auto-generated if empty"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-[#333333] outline-none focus:border-[#4361EE] transition-colors"
                    />
                    <button
                      onClick={openScannerForForm}
                      className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#333333] hover:border-[#4361EE] hover:text-[#4361EE] transition-colors"
                      title="Scan barcode to pre-fill"
                    >
                      <Barcode size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 border border-gray-200 text-[#717182] rounded-xl py-2.5 text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!formData.name || !formData.category || !formData.sku || !formData.quantity || !formData.price}
                className="flex-1 bg-[#4361EE] text-white rounded-xl py-2.5 text-sm hover:bg-[#3451DE] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editProduct ? 'Save Changes' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM MODAL ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
              <Trash2 size={20} className="text-red-500" />
            </div>
            <h3 className="text-center text-[#333333] mb-2">Delete Product</h3>
            <p className="text-center text-sm text-[#717182] mb-6">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 border border-gray-200 text-[#717182] rounded-xl py-2.5 text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-500 text-white rounded-xl py-2.5 text-sm hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── BARCODE SCANNER MODAL ── */}
      {showScanner && (
        <BarcodeScanner
          title={scannerTarget === 'form' ? 'Scan Product Barcode' : 'Find Product by Barcode'}
          hint={scannerTarget === 'form' ? 'Scan to auto-fill the barcode field' : 'Scan to search or add a product'}
          onScan={handleInventoryScan}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}