import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowLeft, Search, Trash2, Plus, X, Percent,
  Building2, CreditCard, Banknote, CheckCircle,
  Barcode, ShoppingBag, AlertCircle, ClipboardList
} from 'lucide-react';
import {
  initialCarts, products, formatCurrency, getCartTotal, getCartSubtotal,
  type Cart, type CartItem
} from '../../data/mockData';
import { BarcodeScanner } from '../BarcodeScanner';
import { useAuth } from '../../context/AuthContext';

export default function POS() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [carts, setCarts] = useState<Cart[]>(initialCarts);
  const [activeCartId, setActiveCartId] = useState(initialCarts[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [paymentModal, setPaymentModal] = useState<PaymentMethod | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scanError, setScanError] = useState('');
  const [rxBanner, setRxBanner] = useState<{ rxNumber: string; patientName: string } | null>(null);

  // Auth guard
  useEffect(() => {
    if (!currentUser) navigate('/login');
  }, [currentUser, navigate]);

  // ── Load prescription cart from localStorage (set by EPrescription dispense flow) ──
  useEffect(() => {
    const raw = localStorage.getItem('prescriptionCart');
    if (!raw) return;
    try {
      const data = JSON.parse(raw) as {
        rxNumber: string;
        patientName: string;
        items: { productId: string; name: string; quantity: number; unitPrice: number; barcode: string; sku: string }[];
      };
      localStorage.removeItem('prescriptionCart');

      if (!data.items?.length) return;

      const rxCartItems: CartItem[] = data.items.map((item, idx) => ({
        id: `rx_ci_${Date.now()}_${idx}`,
        productId: item.productId,
        name: item.name,
        barcode: item.barcode,
        sku: item.sku,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      }));

      const subtotal = rxCartItems.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
      const rxCart: Cart = {
        id: `cart_rx_${Date.now()}`,
        label: `Rx: ${data.rxNumber}`,
        items: rxCartItems,
        serviceCharge: Math.max(subtotal * 0.009, 0),
        discount: 0,
        redemptionCode: '',
      };

      setCarts(prev => [rxCart, ...prev]);
      setActiveCartId(rxCart.id);
      setRxBanner({ rxNumber: data.rxNumber, patientName: data.patientName });
    } catch {
      localStorage.removeItem('prescriptionCart');
    }
  }, []);

  const activeCart = carts.find(c => c.id === activeCartId) || carts[0];

  const searchResults = searchQuery.length > 1
    ? products.filter(p =>
        p.quantity > 0 &&
        (p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         p.sku.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 6)
    : [];

  const addNewCart = () => {
    const newCart: Cart = {
      id: `cart${Date.now()}`,
      label: `Cart ${carts.length + 1}`,
      items: [],
      serviceCharge: 0,
      discount: 0,
      redemptionCode: '',
    };
    setCarts(prev => [...prev, newCart]);
    setActiveCartId(newCart.id);
  };

  const addItemToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setCarts(prev => prev.map(cart => {
      if (cart.id !== activeCartId) return cart;
      const existing = cart.items.find(i => i.productId === productId);
      let newItems: CartItem[];
      if (existing) {
        newItems = cart.items.map(i =>
          i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        const newItem: CartItem = {
          id: `ci${Date.now()}`,
          productId: product.id,
          name: product.name,
          barcode: product.barcode,
          sku: product.sku,
          quantity: 1,
          unitPrice: product.price,
        };
        newItems = [...cart.items, newItem];
      }
      const subtotal = newItems.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
      return { ...cart, items: newItems, serviceCharge: Math.max(subtotal * 0.009, 0) };
    }));

    setSearchQuery('');
    setShowSearchResults(false);
  };

  const removeItem = (itemId: string) => {
    setCarts(prev => prev.map(cart => {
      if (cart.id !== activeCartId) return cart;
      const newItems = cart.items.filter(i => i.id !== itemId);
      const subtotal = newItems.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
      return { ...cart, items: newItems, serviceCharge: Math.max(subtotal * 0.009, 0) };
    }));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCarts(prev => prev.map(cart => {
      if (cart.id !== activeCartId) return cart;
      const newItems = cart.items.map(i => {
        if (i.id !== itemId) return i;
        const newQty = i.quantity + delta;
        return newQty <= 0 ? null : { ...i, quantity: newQty };
      }).filter(Boolean) as CartItem[];
      const subtotal = newItems.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
      return { ...cart, items: newItems, serviceCharge: Math.max(subtotal * 0.009, 0) };
    }));
  };

  const applyRedemptionCode = (code: string) => {
    setCarts(prev => prev.map(cart => {
      if (cart.id !== activeCartId) return cart;
      const discount = code === 'SAVE10' ? getCartSubtotal(cart) * 0.1 : 0;
      return { ...cart, redemptionCode: code, discount };
    }));
  };

  const processPayment = () => {
    setPaymentModal(null);
    setPaymentSuccess(true);
    // Remove the paid cart and create a fresh one
    setTimeout(() => {
      setCarts(prev => {
        const remaining = prev.filter(c => c.id !== activeCartId);
        if (remaining.length === 0) {
          const fresh: Cart = { id: `cart${Date.now()}`, label: 'Cart 1', items: [], serviceCharge: 0, discount: 0, redemptionCode: '' };
          setActiveCartId(fresh.id);
          setPaymentSuccess(false);
          return [fresh];
        }
        setActiveCartId(remaining[0].id);
        setPaymentSuccess(false);
        return remaining;
      });
    }, 2500);
  };

  const cartSummary = (cart: Cart) => {
    const desc = cart.items.map(i => i.name).join(', ');
    return desc.length > 30 ? desc.substring(0, 30) + '...' : desc || 'Empty cart';
  };

  const handleBarcodeScan = (barcode: string) => {
    setShowScanner(false);
    setScanError('');
    const product = products.find(p => p.barcode === barcode);
    if (product) {
      if (product.quantity === 0) {
        setScanError(`"${product.name}" is out of stock.`);
        return;
      }
      addItemToCart(product.id);
    } else {
      setScanError(`No product found for barcode: ${barcode}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col">
      {/* ─ TOP BAR ── */}
      <div className="bg-white border-b border-gray-100 px-4 md:px-8 py-4 flex items-center gap-4 shrink-0">
        <button
          onClick={() => navigate('/app')}
          className="flex items-center gap-2 text-sm text-[#333333] border border-gray-200 rounded-full px-4 py-2 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={15} />
          Back
        </button>
        <h2 className="text-[#333333]">Point of Sale</h2>
        <button
          onClick={() => navigate('/app/prescriptions')}
          className="ml-auto flex items-center gap-2 text-sm text-[#4361EE] border border-[#4361EE]/30 rounded-full px-4 py-2 hover:bg-[#EEF2FF] transition-colors"
        >
          <ClipboardList size={15} />
          <span className="hidden sm:inline">Prescriptions</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full px-4 md:px-8 py-6 gap-5">

        {/* ── RX BANNER ── */}
        {rxBanner && (
          <div className="flex items-center gap-3 bg-[#EEF2FF] border border-[#4361EE]/20 rounded-xl px-4 py-3">
            <ClipboardList size={16} className="text-[#4361EE] shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#4361EE] font-medium">Prescription Loaded</p>
              <p className="text-xs text-[#717182]">{rxBanner.rxNumber} · Patient: {rxBanner.patientName}</p>
            </div>
            <button onClick={() => setRxBanner(null)} className="text-[#717182]"><X size={14} /></button>
          </div>
        )}

        {/* ── SEARCH & SCAN ── */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#717182]" />
            <input
              type="text"
              placeholder="Search by item name or SKU..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setShowSearchResults(true); }}
              onFocus={() => setShowSearchResults(true)}
              className="w-full pl-9 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-[#333333] placeholder-[#717182] outline-none focus:border-[#4361EE] transition-colors shadow-sm"
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(''); setShowSearchResults(false); }} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X size={14} className="text-[#717182]" />
              </button>
            )}
            {/* Search Results */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 z-20">
                {searchResults.map(p => (
                  <button
                    key={p.id}
                    onClick={() => addItemToCart(p.id)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 text-left transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-[#333333]">{p.name}</p>
                      <p className="text-xs text-[#717182]">SKU: {p.sku} · {p.quantity} in stock</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-[#4361EE]">{formatCurrency(p.price)}</p>
                      <p className="text-xs text-green-600">Add to cart</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => { setScanError(''); setShowScanner(true); }}
            className="flex items-center gap-2 bg-[#4361EE] text-white px-4 py-3 rounded-xl text-sm hover:bg-[#3451DE] transition-colors shrink-0"
          >
            <Barcode size={16} />
            <span className="hidden sm:inline">Scan Barcode</span>
          </button>
        </div>

        {/* Scan error banner */}
        {scanError && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
            <AlertCircle size={16} className="shrink-0 text-red-500" />
            <span className="flex-1">{scanError}</span>
            <button onClick={() => setScanError('')} className="text-red-400 hover:text-red-600">
              <X size={14} />
            </button>
          </div>
        )}

        {/* ── CART TABS ── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {carts.map(cart => (
            <button
              key={cart.id}
              onClick={() => setActiveCartId(cart.id)}
              className={`flex flex-col items-start px-4 py-3 rounded-2xl text-left shrink-0 min-w-[180px] transition-colors border ${
                activeCartId === cart.id
                  ? 'bg-[#333333] text-white border-[#333333]'
                  : 'bg-white text-[#717182] border-gray-200 hover:border-[#4361EE]'
              }`}
            >
              <div className="flex items-center justify-between w-full gap-2 mb-1">
                <span className="text-sm font-medium">{cart.label}</span>
                <span className={`text-sm font-medium ${activeCartId === cart.id ? 'text-white' : 'text-[#4361EE]'}`}>
                  {formatCurrency(getCartTotal(cart))}
                </span>
              </div>
              <p className={`text-xs truncate w-full ${activeCartId === cart.id ? 'text-white/70' : 'text-[#717182]'}`}>
                {cartSummary(cart)}
              </p>
            </button>
          ))}
          <button
            onClick={addNewCart}
            className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl border-2 border-dashed border-gray-300 text-[#717182] hover:border-[#4361EE] hover:text-[#4361EE] transition-colors"
          >
            <Plus size={18} />
          </button>
        </div>

        {/* ── CART DETAIL ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          {/* Cart Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="text-[#333333]">{activeCart.label}</h3>
            <div className="flex-1 max-w-xs ml-4">
              <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2">
                <Percent size={14} className="text-[#717182] shrink-0" />
                <input
                  type="text"
                  placeholder="Enter redemption code"
                  value={activeCart.redemptionCode}
                  onChange={e => applyRedemptionCode(e.target.value)}
                  className="flex-1 text-sm text-[#333333] outline-none bg-transparent placeholder-[#717182]"
                />
              </div>
            </div>
          </div>

          {/* Items Table Header */}
          <div className="hidden md:grid grid-cols-[1fr_auto_auto] px-5 py-3 bg-gray-50/50 border-b border-gray-100">
            <span className="text-xs text-[#717182] uppercase tracking-wide font-medium">Item</span>
            <span className="text-xs text-[#717182] uppercase tracking-wide font-medium mr-16">Amount</span>
            <span className="text-xs text-[#717182] uppercase tracking-wide font-medium">Action</span>
          </div>

          {/* Items */}
          {activeCart.items.length === 0 ? (
            <div className="py-16 text-center">
              <ShoppingBag size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-[#717182] text-sm">Cart is empty</p>
              <p className="text-xs text-gray-400 mt-1">Search for products above to add them</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {activeCart.items.map(item => (
                <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#333333]">{item.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-[#717182] flex items-center gap-1">
                        <Barcode size={11} /> {item.barcode}
                      </span>
                      <span className="text-xs text-[#717182]">◇ {item.sku}</span>
                    </div>
                  </div>
                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-[#717182] hover:border-red-300 hover:text-red-500 transition-colors"
                    >
                      <span className="text-base leading-none">−</span>
                    </button>
                    <span className="text-sm text-[#333333] w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-[#717182] hover:border-[#4361EE] hover:text-[#4361EE] transition-colors"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                  <div className="text-sm font-medium text-[#333333] w-28 text-right shrink-0">
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-400 hover:text-red-600 transition-colors shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Cart Summary */}
          {activeCart.items.length > 0 && (
            <div className="border-t border-gray-100 px-5 py-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#717182]">Subtotal</span>
                <span className="text-[#333333]">{formatCurrency(getCartSubtotal(activeCart))}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#717182]">Service charge</span>
                <span className="text-[#333333]">{formatCurrency(activeCart.serviceCharge)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#717182]">Discount</span>
                <div className="flex items-center gap-2">
                  <span className="text-[#333333]">
                    {activeCart.discount > 0 ? `-${formatCurrency(activeCart.discount)}` : `-${formatCurrency(0)}`}
                  </span>
                  {activeCart.discount === 0 && (
                    <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">No Cash-back</span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-[#333333] text-lg font-medium">Total</span>
                <span className="text-[#333333] text-xl font-medium">{formatCurrency(getCartTotal(activeCart))}</span>
              </div>
            </div>
          )}
        </div>

        {/* ── PAYMENT BUTTONS ── */}
        {activeCart.items.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setPaymentModal('transfer')}
              className="flex-1 flex items-center justify-center gap-2.5 bg-[#4361EE] text-white py-3.5 rounded-2xl text-sm hover:bg-[#3451DE] transition-colors shadow-sm"
            >
              <Building2 size={17} />
              Pay with Transfer
            </button>
            <button
              onClick={() => setPaymentModal('card')}
              className="flex-1 sm:flex-none sm:px-6 flex items-center justify-center gap-2.5 bg-white border border-gray-200 text-[#333333] py-3.5 rounded-2xl text-sm hover:bg-gray-50 transition-colors"
            >
              <CreditCard size={17} />
              Pay with Card
            </button>
            <button
              onClick={() => setPaymentModal('cash')}
              className="flex-1 sm:flex-none sm:px-6 flex items-center justify-center gap-2.5 bg-white border border-gray-200 text-[#333333] py-3.5 rounded-2xl text-sm hover:bg-gray-50 transition-colors"
            >
              <Banknote size={17} />
              Pay with Cash
            </button>
          </div>
        )}
      </div>

      {/* ── BARCODE SCANNER ── */}
      {showScanner && (
        <BarcodeScanner
          title="Scan Product Barcode"
          hint="Point camera at a product barcode to add it to the cart"
          onScan={handleBarcodeScan}
          onClose={() => setShowScanner(false)}
        />
      )}

      {/* ── PAYMENT MODAL ── */}
      {paymentModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[#333333]">
                {paymentModal === 'transfer' ? 'Bank Transfer' : paymentModal === 'card' ? 'Card Payment' : 'Cash Payment'}
              </h3>
              <button onClick={() => setPaymentModal(null)} className="text-[#717182]">
                <X size={20} />
              </button>
            </div>

            {paymentModal === 'transfer' && (
              <div className="space-y-4">
                <div className="bg-[#EEF2FF] rounded-xl p-4">
                  <p className="text-xs text-[#4361EE] mb-1">Bank Name</p>
                  <p className="text-sm font-medium text-[#333333]">Providus Bank</p>
                </div>
                <div className="bg-[#EEF2FF] rounded-xl p-4">
                  <p className="text-xs text-[#4361EE] mb-1">Account Number</p>
                  <p className="text-xl font-medium text-[#333333] tracking-widest">5200 7834 91</p>
                </div>
                <div className="bg-[#EEF2FF] rounded-xl p-4">
                  <p className="text-xs text-[#4361EE] mb-1">Account Name</p>
                  <p className="text-sm font-medium text-[#333333]">Inventrii Pharmacy Ltd</p>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                  <span className="text-sm text-[#717182]">Amount to Transfer</span>
                  <span className="text-sm font-medium text-[#333333]">{formatCurrency(getCartTotal(activeCart))}</span>
                </div>
              </div>
            )}

            {paymentModal === 'card' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[#717182] mb-1.5">Card Number</label>
                  <input type="text" placeholder="•••• •••• •••• ••••" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#4361EE]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[#717182] mb-1.5">Expiry</label>
                    <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#4361EE]" />
                  </div>
                  <div>
                    <label className="block text-sm text-[#717182] mb-1.5">CVV</label>
                    <input type="text" placeholder="•••" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#4361EE]" />
                  </div>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                  <span className="text-sm text-[#717182]">Amount</span>
                  <span className="text-sm font-medium text-[#333333]">{formatCurrency(getCartTotal(activeCart))}</span>
                </div>
              </div>
            )}

            {paymentModal === 'cash' && (
              <div className="space-y-4">
                <div className="text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <Banknote size={28} className="text-green-600" />
                  </div>
                  <p className="text-2xl font-medium text-[#333333]">{formatCurrency(getCartTotal(activeCart))}</p>
                  <p className="text-sm text-[#717182] mt-1">Amount to collect from customer</p>
                </div>
                <div>
                  <label className="block text-sm text-[#717182] mb-1.5">Cash Received (₦)</label>
                  <input type="number" placeholder="Enter amount received" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#4361EE]" />
                </div>
              </div>
            )}

            <button
              onClick={processPayment}
              className="w-full mt-6 bg-[#4361EE] text-white py-3.5 rounded-xl text-sm hover:bg-[#3451DE] transition-colors"
            >
              Confirm Payment
            </button>
          </div>
        </div>
      )}

      {/* ── PAYMENT SUCCESS ── */}
      {paymentSuccess && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-8 shadow-2xl text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <h3 className="text-[#333333] mb-2">Payment Successful!</h3>
            <p className="text-sm text-[#717182]">The transaction has been processed successfully.</p>
            <p className="text-lg font-medium text-[#333333] mt-4">{formatCurrency(getCartTotal(activeCart))}</p>
          </div>
        </div>
      )}
    </div>
  );
}