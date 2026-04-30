import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Package, ShoppingCart, ClipboardList, BarChart2,
  Users, Building2, ArrowRight, Check, Star, Shield,
  Zap, Globe, ChevronRight, Clock, TrendingUp, Bell
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logoImg from '../../../imports/Logo.png';

const FEATURES = [
  {
    icon: Package,
    title: 'Smart Inventory',
    desc: 'Track stock levels, expiry dates and get automatic low-stock alerts across all your branches.',
    color: 'bg-blue-50 text-[#4361EE]',
  },
  {
    icon: ShoppingCart,
    title: 'Point of Sale',
    desc: 'Fast, intuitive POS with barcode scanning, multiple payment methods, and multi-cart support.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: ClipboardList,
    title: 'E-Prescriptions',
    desc: 'Manage digital prescriptions end-to-end — capture, verify, dispense, and track every Rx.',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: BarChart2,
    title: 'Analytics & Reports',
    desc: 'Real-time sales charts, revenue tracking, and top-selling product insights at a glance.',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: Users,
    title: 'Multi-User Access',
    desc: 'Role-based access for Admins, Pharmacists, Cashiers and Store Managers. Everyone sees what they need.',
    color: 'bg-pink-50 text-pink-600',
  },
  {
    icon: Building2,
    title: 'Multi-Branch',
    desc: 'Manage multiple pharmacy locations from a single dashboard with per-store inventory control.',
    color: 'bg-teal-50 text-teal-600',
  },
];

const STATS = [
  { value: '500+', label: 'Pharmacies' },
  { value: '₦2B+', label: 'Transactions Processed' },
  { value: '50K+', label: 'Products Tracked' },
  { value: '99.9%', label: 'Uptime' },
];

const TESTIMONIALS = [
  {
    name: 'Dr. Adaeze Nwosu',
    title: 'Owner, MedPlus Pharmacy, Lagos',
    text: 'Inventrii transformed how we run our pharmacy. The e-prescription module alone has cut our dispensing errors by 80%. Highly recommended for any serious pharmacy.',
    rating: 5,
    avatar: 'A',
    bg: 'bg-emerald-500',
  },
  {
    name: 'Chukwuemeka Obi',
    title: 'Store Manager, HealthMart, Abuja',
    text: 'We went from spreadsheets to Inventrii in a weekend. Our stock management is now seamless and the low-stock alerts have saved us from running out of critical drugs.',
    rating: 5,
    avatar: 'C',
    bg: 'bg-blue-500',
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Set Up Your Pharmacy',
    desc: 'Add your products, branches, and team members in minutes. Import your existing inventory with ease.',
  },
  {
    step: '02',
    title: 'Start Selling & Dispensing',
    desc: 'Use the POS to process sales and the e-prescription module to manage patient prescriptions seamlessly.',
  },
  {
    step: '03',
    title: 'Track & Grow',
    desc: 'Monitor real-time analytics, get stock alerts, and make data-driven decisions to grow your business.',
  },
];

// ── Mini dashboard mockup for hero ──────────────────────────────────────────
function DashboardMockup() {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Floating cards */}
      <div className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-2.5 z-10 border border-gray-100">
        <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center">
          <TrendingUp size={15} className="text-green-600" />
        </div>
        <div>
          <p className="text-xs text-gray-400">Today's Revenue</p>
          <p className="text-sm font-semibold text-gray-800">₦2,558,830</p>
        </div>
      </div>
      <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-2.5 z-10 border border-gray-100">
        <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
          <Bell size={15} className="text-amber-600" />
        </div>
        <div>
          <p className="text-xs text-gray-400">Low Stock Alert</p>
          <p className="text-sm font-semibold text-gray-800">3 products</p>
        </div>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header bar */}
        <div className="bg-[#F8F9FB] px-5 py-3 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
          </div>
          <div className="text-xs text-gray-400">Inventrii Pharmacy Dashboard</div>
          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs">A</div>
        </div>

        <div className="p-5 space-y-4">
          {/* Stat cards row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#EEF2FF] rounded-2xl p-3">
              <p className="text-xs text-[#4361EE]">In Stock</p>
              <p className="text-lg font-semibold text-gray-800 mt-0.5">6,304</p>
            </div>
            <div className="bg-[#FFF6EC] rounded-2xl p-3">
              <p className="text-xs text-amber-600">Sales Today</p>
              <p className="text-lg font-semibold text-gray-800 mt-0.5">1,149</p>
            </div>
            <div className="bg-[#ECFDF5] rounded-2xl p-3">
              <p className="text-xs text-green-600">Revenue</p>
              <p className="text-sm font-semibold text-gray-800 mt-0.5">₦2.5M</p>
            </div>
          </div>

          {/* Fake chart */}
          <div className="bg-gray-50 rounded-2xl p-3">
            <p className="text-xs text-gray-500 mb-3">Weekly Sales</p>
            <div className="flex items-end gap-1.5 h-14">
              {[40, 65, 80, 55, 90, 70, 48].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-md"
                    style={{
                      height: `${h}%`,
                      background: i === 4 ? '#4361EE' : '#C7D2FE',
                    }}
                  />
                  <span className="text-[8px] text-gray-400">{['M','T','W','T','F','S','S'][i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Fake table rows */}
          <div className="space-y-2">
            <p className="text-xs text-gray-500 font-medium">Top Selling</p>
            {['Amoxicillin 500mg', 'Paracetamol 500mg', 'Ciprofloxacin 500mg'].map((name, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#EEF2FF] flex items-center justify-center text-[9px] text-[#4361EE] font-medium">{i+1}</div>
                  <p className="text-xs text-gray-700">{name}</p>
                </div>
                <div className="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full rounded-full bg-[#4361EE]" style={{ width: `${[90, 72, 45][i]}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── MAIN LANDING PAGE ────────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) navigate('/app');
  }, [currentUser, navigate]);

  return (
    <div className="min-h-screen bg-white text-gray-800 overflow-x-hidden">

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <img src={logoImg} alt="Inventrii" className="h-7 object-contain" />
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'Pricing', 'Support'].map(link => (
              <a key={link} href={`#${link.toLowerCase()}`} className="text-sm text-gray-500 hover:text-gray-800 transition-colors">{link}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="text-sm text-[#4361EE] border border-[#4361EE] rounded-full px-5 py-2 hover:bg-[#EEF2FF] transition-colors"
            >
              Log In
            </button>
            <button
              onClick={() => navigate('/login')}
              className="text-sm bg-[#4361EE] text-white rounded-full px-5 py-2 hover:bg-[#3451DE] transition-colors shadow-sm"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-24 lg:pt-24 lg:pb-32">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#EEF2FF] rounded-full blur-3xl opacity-40 -z-10 translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-50 rounded-full blur-3xl opacity-60 -z-10 -translate-x-1/3 translate-y-1/4" />

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-[#EEF2FF] text-[#4361EE] text-xs font-medium px-3 py-1.5 rounded-full mb-6">
              <Zap size={12} />
              Trusted by 500+ Pharmacies across Nigeria
            </div>
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-semibold text-gray-900 leading-tight mb-6">
              The Complete<br />
              <span className="text-[#4361EE]">Pharmacy</span><br />
              Management Platform
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-md">
              Streamline your inventory, sales, prescriptions, and team management — all in one powerful, easy-to-use platform built for Nigerian pharmacies.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate('/login')}
                className="flex items-center justify-center gap-2 bg-[#4361EE] text-white rounded-2xl px-7 py-3.5 hover:bg-[#3451DE] transition-colors shadow-lg shadow-blue-200 text-sm"
              >
                Start Managing Your Pharmacy
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="flex items-center justify-center gap-2 border border-gray-200 text-gray-700 rounded-2xl px-7 py-3.5 hover:bg-gray-50 transition-colors text-sm"
              >
                View Demo
                <ChevronRight size={16} />
              </button>
            </div>
            {/* Trust badges */}
            <div className="flex items-center gap-5 mt-8">
              {[
                { icon: Shield, text: 'NDPC Compliant' },
                { icon: Zap, text: 'No Setup Fee' },
                { icon: Globe, text: 'Works Offline' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Icon size={13} className="text-[#4361EE]" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Dashboard mockup */}
          <div className="hidden lg:block">
            <DashboardMockup />
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="bg-[#4361EE] py-12">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {STATS.map(s => (
            <div key={s.label}>
              <p className="text-3xl lg:text-4xl font-semibold text-white">{s.value}</p>
              <p className="text-blue-200 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-[#EEF2FF] text-[#4361EE] text-xs font-medium px-3 py-1.5 rounded-full mb-4">
            Features
          </div>
          <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900 mb-4">Everything your pharmacy needs</h2>
          <p className="text-gray-500 max-w-xl mx-auto">From inventory to prescriptions, POS to analytics — Inventrii covers every corner of your pharmacy operations.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(f => (
            <div key={f.title} className="bg-white rounded-3xl border border-gray-100 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className={`w-12 h-12 rounded-2xl ${f.color} flex items-center justify-center mb-4`}>
                <f.icon size={22} />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="bg-[#F8F9FB] py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-white text-[#4361EE] text-xs font-medium px-3 py-1.5 rounded-full mb-4 border border-blue-100">
              How It Works
            </div>
            <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900 mb-4">Up and running in minutes</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Getting started with Inventrii is simple. No long onboarding. No technical expertise required.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} className="relative">
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-px bg-gradient-to-r from-[#4361EE]/30 to-transparent z-0" />
                )}
                <div className="relative bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                  <div className="w-14 h-14 rounded-2xl bg-[#4361EE] text-white flex items-center justify-center text-lg font-semibold mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-[#EEF2FF] text-[#4361EE] text-xs font-medium px-3 py-1.5 rounded-full mb-4">
            Testimonials
          </div>
          <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900 mb-4">Loved by pharmacy owners</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="bg-white rounded-3xl border border-gray-100 p-7 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={14} fill="#F59E0B" className="text-amber-400" />
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-5">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${t.bg} flex items-center justify-center text-white font-medium`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#0F1628] py-20 mx-6 lg:mx-8 mb-16 rounded-3xl max-w-7xl lg:mx-auto">
        <div className="text-center px-6">
          <div className="w-16 h-16 rounded-2xl bg-[#4361EE] flex items-center justify-center mx-auto mb-6">
            <Zap size={28} className="text-white" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-semibold text-white mb-4">
            Ready to transform your pharmacy?
          </h2>
          <p className="text-blue-200 max-w-md mx-auto mb-8 text-sm leading-relaxed">
            Join hundreds of pharmacies already managing their operations smarter with Inventrii.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="flex items-center justify-center gap-2 bg-white text-[#4361EE] rounded-2xl px-8 py-3.5 hover:bg-blue-50 transition-colors font-medium text-sm"
            >
              Get Started Free
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="flex items-center justify-center gap-2 border border-white/20 text-white rounded-2xl px-8 py-3.5 hover:bg-white/10 transition-colors text-sm"
            >
              <Clock size={16} />
              Schedule a Demo
            </button>
          </div>
          {/* checkmarks */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            {['Free setup', 'No credit card required', 'Cancel anytime'].map(item => (
              <div key={item} className="flex items-center gap-2 text-blue-200 text-xs">
                <Check size={14} className="text-green-400" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="max-w-7xl mx-auto px-6 lg:px-8 pb-10">
        <div className="grid md:grid-cols-4 gap-8 pb-8 border-b border-gray-100">
          <div className="md:col-span-2">
            <img src={logoImg} alt="Inventrii" className="h-7 mb-3 object-contain object-left" />
            <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
              The all-in-one pharmacy management platform built for Nigerian pharmacies and clinics.
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 mb-3">Product</p>
            <div className="space-y-2">
              {['Features', 'Pricing', 'Changelog', 'Roadmap'].map(l => (
                <a key={l} href="#" className="block text-sm text-gray-400 hover:text-gray-700 transition-colors">{l}</a>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 mb-3">Company</p>
            <div className="space-y-2">
              {['About Us', 'Blog', 'Contact', 'Privacy Policy'].map(l => (
                <a key={l} href="#" className="block text-sm text-gray-400 hover:text-gray-700 transition-colors">{l}</a>
              ))}
            </div>
          </div>
        </div>
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">© 2026 Inventrii Ltd. All rights reserved.</p>
          <p className="text-xs text-gray-400">Made with ❤️ for Nigerian pharmacies</p>
        </div>
      </footer>
    </div>
  );
}
