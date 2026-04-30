export type ProductStatus = 'in-stock' | 'low-stock' | 'out-of-stock' | 'expiring-soon';

export interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  quantity: number;
  price: number;
  expiryDate: string;
  status: ProductStatus;
  barcode: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Pharmacist' | 'Cashier' | 'Store Manager';
  status: 'Active' | 'Inactive';
  avatar: string;
  joinedDate: string;
  phone: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  barcode: string;
  sku: string;
  quantity: number;
  unitPrice: number;
}

export interface Cart {
  id: string;
  label: string;
  items: CartItem[];
  serviceCharge: number;
  discount: number;
  redemptionCode: string;
}

export interface FeaturedApp {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  rating: number;
  installed: boolean;
}

export interface Notification {
  id: string;
  message: string;
  type: 'danger' | 'warning' | 'info' | 'success';
  time: string;
  read: boolean;
}

export const STORES = [
  { id: '1', name: 'Spectrum Plaza, 18 Otigba St, Ikeja, Lagos 100' },
  { id: '2', name: 'Victoria Island Branch, 42 Adeola Odeku St' },
  { id: '3', name: 'Lekki Branch, 15 Admiralty Way' },
];

export const products: Product[] = [
  { id: 'p1', name: 'Amoxicillin 500mg', category: 'Antibiotics', sku: 'AMX500', quantity: 450, price: 2499.99, expiryDate: '2025-12-01', status: 'in-stock', barcode: '6154000359041' },
  { id: 'p2', name: 'Paracetamol 500mg', category: 'Analgesics', sku: 'PCM500', quantity: 1850, price: 500.00, expiryDate: '2026-06-15', status: 'in-stock', barcode: '6154000359042' },
  { id: 'p3', name: 'Ibuprofen 400mg', category: 'NSAIDs', sku: 'IBU400', quantity: 635, price: 750.00, expiryDate: '2025-09-30', status: 'in-stock', barcode: '6154000359043' },
  { id: 'p4', name: 'Vitamin C 1000mg', category: 'Vitamins', sku: 'VTC1000', quantity: 45, price: 1200.00, expiryDate: '2026-01-10', status: 'low-stock', barcode: '6154000359044' },
  { id: 'p5', name: 'Chloroquine 250mg', category: 'Antimalarials', sku: 'CLQ250', quantity: 0, price: 650.00, expiryDate: '2025-05-20', status: 'out-of-stock', barcode: '6154000359045' },
  { id: 'p6', name: 'Metformin 500mg', category: 'Antidiabetics', sku: 'MTF500', quantity: 0, price: 1800.00, expiryDate: '2025-11-15', status: 'out-of-stock', barcode: '6154000359046' },
  { id: 'p7', name: 'Omeprazole 20mg', category: 'Antacids', sku: 'OMP20', quantity: 52, price: 2100.00, expiryDate: '2025-08-22', status: 'low-stock', barcode: '6154000359047' },
  { id: 'p8', name: 'Ciprofloxacin 500mg', category: 'Antibiotics', sku: 'CIP500', quantity: 252, price: 3500.00, expiryDate: '2025-07-18', status: 'in-stock', barcode: '6154000359048' },
  { id: 'p9', name: 'Azithromycin 500mg', category: 'Antibiotics', sku: 'AZI500', quantity: 178, price: 4200.00, expiryDate: '2026-03-05', status: 'in-stock', barcode: '6154000359049' },
  { id: 'p10', name: 'Lisinopril 10mg', category: 'Antihypertensives', sku: 'LIS10', quantity: 320, price: 2200.00, expiryDate: '2025-10-15', status: 'in-stock', barcode: '6154000359050' },
  { id: 'p11', name: 'Atorvastatin 20mg', category: 'Statins', sku: 'ATV20', quantity: 215, price: 3800.00, expiryDate: '2026-02-28', status: 'in-stock', barcode: '6154000359051' },
  { id: 'p12', name: 'Salbutamol 100mcg', category: 'Bronchodilators', sku: 'SAL100', quantity: 42, price: 1950.00, expiryDate: '2025-11-30', status: 'low-stock', barcode: '6154000359052' },
  { id: 'p13', name: 'Amlodipine 5mg', category: 'Antihypertensives', sku: 'AML5', quantity: 280, price: 1700.00, expiryDate: '2026-04-15', status: 'in-stock', barcode: '6154000359053' },
  { id: 'p14', name: 'Doxycycline 100mg', category: 'Antibiotics', sku: 'DOX100', quantity: 130, price: 2800.00, expiryDate: '2025-08-10', status: 'in-stock', barcode: '6154000359054' },
  { id: 'p15', name: 'Fluconazole 150mg', category: 'Antifungals', sku: 'FLC150', quantity: 95, price: 1500.00, expiryDate: '2025-10-28', status: 'in-stock', barcode: '6154000359055' },
];

export const topSelling = [
  { id: 'p1', name: 'Amoxicillin 500mg', price: 2499.99, quantitySold: 245, quantityRemaining: 255 },
  { id: 'p2', name: 'Paracetamol 500mg', price: 500.00, quantitySold: 198, quantityRemaining: 1802 },
  { id: 'p3', name: 'Ibuprofen 400mg', price: 750.00, quantitySold: 165, quantityRemaining: 635 },
  { id: 'p4', name: 'Vitamin C 1000mg', price: 1200.00, quantitySold: 132, quantityRemaining: 168 },
  { id: 'p8', name: 'Ciprofloxacin 500mg', price: 3500.00, quantitySold: 98, quantityRemaining: 152 },
];

export const outOfStockProducts = products.filter(p => p.status === 'out-of-stock');

export const users: AppUser[] = [
  { id: 'u1', name: 'Dr. Adaeze Okonkwo', email: 'adaeze@inventrii.ng', role: 'Admin', status: 'Active', avatar: 'A', joinedDate: '2024-01-15', phone: '+234 801 234 5678' },
  { id: 'u2', name: 'Chidi Okeke', email: 'chidi@inventrii.ng', role: 'Pharmacist', status: 'Active', avatar: 'C', joinedDate: '2024-02-20', phone: '+234 802 345 6789' },
  { id: 'u3', name: 'Ngozi Eze', email: 'ngozi@inventrii.ng', role: 'Cashier', status: 'Active', avatar: 'N', joinedDate: '2024-03-10', phone: '+234 803 456 7890' },
  { id: 'u4', name: 'Emeka Nwosu', email: 'emeka@inventrii.ng', role: 'Store Manager', status: 'Inactive', avatar: 'E', joinedDate: '2023-11-05', phone: '+234 804 567 8901' },
  { id: 'u5', name: 'Aisha Bello', email: 'aisha@inventrii.ng', role: 'Pharmacist', status: 'Active', avatar: 'A', joinedDate: '2024-04-18', phone: '+234 805 678 9012' },
  { id: 'u6', name: 'Babatunde Osei', email: 'babatunde@inventrii.ng', role: 'Cashier', status: 'Active', avatar: 'B', joinedDate: '2024-05-22', phone: '+234 806 789 0123' },
];

export const initialCarts: Cart[] = [
  {
    id: 'cart1',
    label: 'Cart 1',
    items: [
      { id: 'ci1', productId: 'p1', name: 'Amoxicillin 500mg', barcode: '6154000359041', sku: 'amx007', quantity: 5, unitPrice: 2499.99 },
      { id: 'ci2', productId: 'p2', name: 'Paracetamol 500mg', barcode: '6154000359042', sku: 'pcm010', quantity: 10, unitPrice: 500.00 },
      { id: 'ci3', productId: 'p3', name: 'Ibuprofen 400mg', barcode: '6154000359043', sku: 'ibu452', quantity: 8, unitPrice: 750.00 },
      { id: 'ci4', productId: 'p8', name: 'Ciprofloxacin 500mg', barcode: '6154000359048', sku: 'cip112', quantity: 3, unitPrice: 3500.00 },
    ],
    serviceCharge: 330.75,
    discount: 0,
    redemptionCode: '',
  },
  {
    id: 'cart2',
    label: 'Cart 2',
    items: [
      { id: 'ci5', productId: 'p4', name: 'Vitamin C 1000mg', barcode: '6154000359044', sku: 'vtc015', quantity: 15, unitPrice: 1200.00 },
      { id: 'ci6', productId: 'p9', name: 'Azithromycin 500mg', barcode: '6154000359049', sku: 'azi003', quantity: 5, unitPrice: 4200.00 },
      { id: 'ci7', productId: 'p7', name: 'Omeprazole 20mg', barcode: '6154000359047', sku: 'omp022', quantity: 3, unitPrice: 2100.00 },
    ],
    serviceCharge: 349.23,
    discount: 0,
    redemptionCode: '',
  },
  {
    id: 'cart3',
    label: 'Cart 3',
    items: [
      { id: 'ci8', productId: 'p2', name: 'Paracetamol 500mg', barcode: '6154000359042', sku: 'pcm010', quantity: 5, unitPrice: 500.00 },
    ],
    serviceCharge: 12.50,
    discount: 0,
    redemptionCode: '',
  },
  {
    id: 'cart4',
    label: 'Cart 4',
    items: [
      { id: 'ci9', productId: 'p10', name: 'Lisinopril 10mg', barcode: '6154000359050', sku: 'lis006', quantity: 6, unitPrice: 2200.00 },
      { id: 'ci10', productId: 'p12', name: 'Salbutamol 100mcg', barcode: '6154000359052', sku: 'sal002', quantity: 2, unitPrice: 1950.00 },
    ],
    serviceCharge: 97.00,
    discount: 0,
    redemptionCode: '',
  },
];

export const featuredApps: FeaturedApp[] = [
  {
    id: 'app1',
    name: 'Inventrii POS Terminals',
    description: 'Manage sales with our powerful POS system designed for pharmacies and retail stores.',
    image: 'https://images.unsplash.com/photo-1648824571682-109acc138294?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    category: 'Sales',
    rating: 4.8,
    installed: true,
  },
  {
    id: 'app2',
    name: 'Medical Record Software',
    description: 'Digital patient records management for modern pharmacies and clinics.',
    image: 'https://images.unsplash.com/photo-1576669801775-ff43c5ab079d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    category: 'Records',
    rating: 4.6,
    installed: false,
  },
  {
    id: 'app3',
    name: 'Barcode Creator',
    description: 'Generate and print barcodes for all your pharmacy products with ease.',
    image: 'https://images.unsplash.com/photo-1758543102397-e14b5dfdd8bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    category: 'Tools',
    rating: 4.5,
    installed: false,
  },
  {
    id: 'app4',
    name: 'Smart Analytics',
    description: 'Advanced analytics and reporting for your pharmacy business insights.',
    image: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    category: 'Analytics',
    rating: 4.7,
    installed: true,
  },
  {
    id: 'app5',
    name: 'Pharmacy Stock Manager',
    description: 'Track medicine stock, manage expiry dates and automate reorder alerts.',
    image: 'https://images.unsplash.com/photo-1765031092161-a9ebe556117e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    category: 'HR',
    rating: 4.3,
    installed: false,
  },
];

export const notifications: Notification[] = [
  { id: 'n1', message: 'Chloroquine 250mg is out of stock', type: 'danger', time: '2 min ago', read: false },
  { id: 'n2', message: 'Metformin 500mg is out of stock', type: 'danger', time: '10 min ago', read: false },
  { id: 'n3', message: 'Vitamin C 1000mg is running low (45 left)', type: 'warning', time: '1 hr ago', read: false },
  { id: 'n4', message: 'New sale: Cart 3 completed — ₦2,512.50', type: 'success', time: '2 hr ago', read: true },
  { id: 'n5', message: 'Office address missing for some locations', type: 'warning', time: '1 day ago', read: true },
];

export const formatCurrency = (amount: number): string => {
  return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const getCartTotal = (cart: Cart): number => {
  const subtotal = cart.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  return subtotal + cart.serviceCharge - cart.discount;
};

export const getCartSubtotal = (cart: Cart): number => {
  return cart.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
};

// ─── E-PRESCRIPTION TYPES ────────────────────────────────────────────────────

export type PrescriptionStatus = 'pending' | 'dispensed' | 'partial' | 'cancelled' | 'expired';

export interface PrescriptionItem {
  id: string;
  drugName: string;
  productId?: string; // optional link to inventory product
  dosage: string;
  quantity: number;
  frequency: string; // e.g. "3 times daily"
  duration: string;  // e.g. "7 days"
  dispensedQuantity: number;
  instructions?: string;
}

export interface Prescription {
  id: string;
  rxNumber: string;
  patientName: string;
  patientPhone: string;
  patientAge: number;
  patientGender: 'Male' | 'Female';
  prescriberName: string;
  prescriberLicense: string;
  hospital: string;
  prescriptionDate: string;
  expiryDate: string;
  status: PrescriptionStatus;
  notes: string;
  items: PrescriptionItem[];
  dispensedDate?: string;
  dispensedBy?: string;
}

export const prescriptions: Prescription[] = [
  {
    id: 'rx1',
    rxNumber: 'RX-2026-0041',
    patientName: 'Chinonso Okafor',
    patientPhone: '+234 810 234 5678',
    patientAge: 34,
    patientGender: 'Male',
    prescriberName: 'Dr. Ifeoma Adeleke',
    prescriberLicense: 'MDCN/2019/12345',
    hospital: 'Lagos University Teaching Hospital',
    prescriptionDate: '2026-04-22',
    expiryDate: '2026-05-22',
    status: 'pending',
    notes: 'Patient allergic to Penicillin. Monitor BP weekly.',
    items: [
      { id: 'rxi1', drugName: 'Amoxicillin 500mg', productId: 'p1', dosage: '500mg', quantity: 21, frequency: '3 times daily', duration: '7 days', dispensedQuantity: 0 },
      { id: 'rxi2', drugName: 'Paracetamol 500mg', productId: 'p2', dosage: '500mg', quantity: 15, frequency: 'As needed', duration: '5 days', dispensedQuantity: 0, instructions: 'Take after meals' },
    ],
  },
  {
    id: 'rx2',
    rxNumber: 'RX-2026-0040',
    patientName: 'Amaka Nwosu',
    patientPhone: '+234 802 345 6789',
    patientAge: 58,
    patientGender: 'Female',
    prescriberName: 'Dr. Bashir Musa',
    prescriberLicense: 'MDCN/2015/67890',
    hospital: 'Reddington Hospital, VI',
    prescriptionDate: '2026-04-20',
    expiryDate: '2026-05-20',
    status: 'dispensed',
    notes: 'Chronic hypertension management. Patient on long-term therapy.',
    items: [
      { id: 'rxi3', drugName: 'Lisinopril 10mg', productId: 'p10', dosage: '10mg', quantity: 30, frequency: 'Once daily', duration: '30 days', dispensedQuantity: 30 },
      { id: 'rxi4', drugName: 'Amlodipine 5mg', productId: 'p13', dosage: '5mg', quantity: 30, frequency: 'Once daily', duration: '30 days', dispensedQuantity: 30 },
      { id: 'rxi5', drugName: 'Atorvastatin 20mg', productId: 'p11', dosage: '20mg', quantity: 30, frequency: 'Once at night', duration: '30 days', dispensedQuantity: 30 },
    ],
    dispensedDate: '2026-04-21',
    dispensedBy: 'Chidi Okeke',
  },
  {
    id: 'rx3',
    rxNumber: 'RX-2026-0039',
    patientName: 'Oluwaseun Adeyemi',
    patientPhone: '+234 803 456 7891',
    patientAge: 27,
    patientGender: 'Female',
    prescriberName: 'Dr. Emeka Obi',
    prescriberLicense: 'MDCN/2018/54321',
    hospital: 'Eko Hospital, Ikeja',
    prescriptionDate: '2026-04-19',
    expiryDate: '2026-05-19',
    status: 'partial',
    notes: 'UTI treatment. Repeat urine culture after course.',
    items: [
      { id: 'rxi6', drugName: 'Ciprofloxacin 500mg', productId: 'p8', dosage: '500mg', quantity: 14, frequency: 'Twice daily', duration: '7 days', dispensedQuantity: 14 },
      { id: 'rxi7', drugName: 'Metformin 500mg', productId: 'p6', dosage: '500mg', quantity: 30, frequency: 'Twice daily', duration: '30 days', dispensedQuantity: 0, instructions: 'Take with meals' },
    ],
    dispensedDate: '2026-04-20',
    dispensedBy: 'Aisha Bello',
  },
  {
    id: 'rx4',
    rxNumber: 'RX-2026-0038',
    patientName: 'Tunde Fashola',
    patientPhone: '+234 814 567 8902',
    patientAge: 45,
    patientGender: 'Male',
    prescriberName: 'Dr. Ngozi Uchenna',
    prescriberLicense: 'MDCN/2010/11111',
    hospital: 'St. Nicholas Hospital, Lagos',
    prescriptionDate: '2026-04-15',
    expiryDate: '2026-05-15',
    status: 'pending',
    notes: 'Type 2 diabetes. First-line therapy initiation.',
    items: [
      { id: 'rxi8', drugName: 'Metformin 500mg', productId: 'p6', dosage: '500mg', quantity: 60, frequency: 'Twice daily', duration: '30 days', dispensedQuantity: 0, instructions: 'Take with food' },
      { id: 'rxi9', drugName: 'Vitamin C 1000mg', productId: 'p4', dosage: '1000mg', quantity: 30, frequency: 'Once daily', duration: '30 days', dispensedQuantity: 0 },
    ],
  },
  {
    id: 'rx5',
    rxNumber: 'RX-2026-0037',
    patientName: 'Blessing Okonkwo',
    patientPhone: '+234 805 678 9013',
    patientAge: 22,
    patientGender: 'Female',
    prescriberName: 'Dr. Yakubu Abdullahi',
    prescriberLicense: 'MDCN/2020/99999',
    hospital: 'National Hospital Abuja',
    prescriptionDate: '2026-04-12',
    expiryDate: '2026-05-12',
    status: 'cancelled',
    notes: 'Patient relocated. Prescription voided.',
    items: [
      { id: 'rxi10', drugName: 'Azithromycin 500mg', productId: 'p9', dosage: '500mg', quantity: 3, frequency: 'Once daily', duration: '3 days', dispensedQuantity: 0 },
    ],
  },
  {
    id: 'rx6',
    rxNumber: 'RX-2026-0036',
    patientName: 'Gbenga Adewale',
    patientPhone: '+234 806 789 0124',
    patientAge: 61,
    patientGender: 'Male',
    prescriberName: 'Dr. Ifeoma Adeleke',
    prescriberLicense: 'MDCN/2019/12345',
    hospital: 'Lagos University Teaching Hospital',
    prescriptionDate: '2026-04-10',
    expiryDate: '2026-05-10',
    status: 'dispensed',
    notes: 'COPD maintenance therapy.',
    items: [
      { id: 'rxi11', drugName: 'Salbutamol 100mcg', productId: 'p12', dosage: '100mcg', quantity: 2, frequency: '2 puffs as needed', duration: '30 days', dispensedQuantity: 2 },
      { id: 'rxi12', drugName: 'Omeprazole 20mg', productId: 'p7', dosage: '20mg', quantity: 30, frequency: 'Once daily', duration: '30 days', dispensedQuantity: 30 },
    ],
    dispensedDate: '2026-04-11',
    dispensedBy: 'Chidi Okeke',
  },
  {
    id: 'rx7',
    rxNumber: 'RX-2026-0035',
    patientName: 'Fatimah Garba',
    patientPhone: '+234 807 890 1235',
    patientAge: 30,
    patientGender: 'Female',
    prescriberName: 'Dr. Bashir Musa',
    prescriberLicense: 'MDCN/2015/67890',
    hospital: 'Reddington Hospital, VI',
    prescriptionDate: '2026-03-25',
    expiryDate: '2026-04-24',
    status: 'expired',
    notes: 'Prescription expired. Patient did not collect.',
    items: [
      { id: 'rxi13', drugName: 'Doxycycline 100mg', productId: 'p14', dosage: '100mg', quantity: 14, frequency: 'Twice daily', duration: '7 days', dispensedQuantity: 0 },
      { id: 'rxi14', drugName: 'Fluconazole 150mg', productId: 'p15', dosage: '150mg', quantity: 1, frequency: 'Single dose', duration: '1 day', dispensedQuantity: 0 },
    ],
  },
];