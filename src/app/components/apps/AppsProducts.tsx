import { useState } from 'react';
import { Search, Star, Check, Plus, X, ArrowRight, LayoutGrid, List } from 'lucide-react';
import { featuredApps, type FeaturedApp } from '../../data/mockData';

const CATEGORIES = ['All', 'Sales', 'Records', 'Tools', 'Analytics', 'HR'];

export default function AppsProducts() {
  const [apps, setApps] = useState<FeaturedApp[]>(featuredApps);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedApp, setSelectedApp] = useState<FeaturedApp | null>(null);

  const filteredApps = apps.filter(app => {
    const matchSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = activeCategory === 'All' || app.category === activeCategory;
    return matchSearch && matchCat;
  });

  const toggleInstall = (appId: string) => {
    setApps(prev => prev.map(app =>
      app.id === appId ? { ...app, installed: !app.installed } : app
    ));
    if (selectedApp?.id === appId) {
      setSelectedApp(prev => prev ? { ...prev, installed: !prev.installed } : null);
    }
  };

  const installedCount = apps.filter(a => a.installed).length;

  return (
    <div className="space-y-6">
      {/* ── PAGE HEADER ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[#333333]">Apps &amp; Products</h1>
          <p className="text-sm text-[#717182] mt-1">
            Extend your pharmacy with powerful integrations
          </p>
        </div>
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[#4361EE] text-white' : 'text-[#717182] hover:bg-gray-100'}`}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#4361EE] text-white' : 'text-[#717182] hover:bg-gray-100'}`}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* ── INSTALLED BANNER ── */}
      {installedCount > 0 && (
        <div className="bg-[#EEF2FF] rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#4361EE] flex items-center justify-center">
              <Check size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#333333]">{installedCount} App{installedCount > 1 ? 's' : ''} Installed</p>
              <p className="text-xs text-[#717182]">Your apps are active and running</p>
            </div>
          </div>
          <button className="text-sm text-[#4361EE] hover:underline">Manage</button>
        </div>
      )}

      {/* ── SEARCH ── */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#717182]" />
        <input
          type="text"
          placeholder="Search apps and products..."
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

      {/* ── CATEGORY CHIPS ── */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'bg-[#4361EE] text-white'
                : 'bg-white border border-gray-200 text-[#717182] hover:border-[#4361EE] hover:text-[#4361EE]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── FEATURED SECTION ── */}
      {activeCategory === 'All' && !searchQuery && (
        <div>
          <h2 className="text-[#333333] mb-4">Featured</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {apps.slice(0, 3).map(app => (
              <div
                key={app.id}
                onClick={() => setSelectedApp(app)}
                className="flex items-center gap-3 bg-white rounded-2xl p-4 border border-gray-100 min-w-[260px] flex-shrink-0 hover:shadow-md transition-shadow cursor-pointer"
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
      )}

      {/* ── ALL APPS ── */}
      <div>
        {(activeCategory !== 'All' || searchQuery) ? null : <h2 className="text-[#333333] mb-4">All Apps</h2>}
        {filteredApps.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
            <LayoutGrid size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-[#717182]">No apps found</p>
            <button onClick={() => { setSearchQuery(''); setActiveCategory('All'); }} className="text-[#4361EE] text-sm mt-2 hover:underline">
              Clear filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredApps.map(app => (
              <div
                key={app.id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedApp(app)}
              >
                <div className="relative">
                  <img src={app.image} alt={app.name} className="w-full h-36 object-cover" />
                  {app.installed && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-green-500 text-white text-xs px-2.5 py-1 rounded-full">
                      <Check size={11} /> Installed
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs text-[#717182] px-2.5 py-1 rounded-full">
                    {app.category}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-sm text-[#333333] truncate">{app.name}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        <Star size={11} className="text-amber-400 fill-amber-400" />
                        <span className="text-xs text-[#717182]">{app.rating}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-[#717182] mt-2 line-clamp-2 leading-relaxed">{app.description}</p>
                  <button
                    onClick={e => { e.stopPropagation(); toggleInstall(app.id); }}
                    className={`w-full mt-3 py-2 rounded-xl text-sm transition-colors ${
                      app.installed
                        ? 'border border-gray-200 text-[#717182] hover:border-red-300 hover:text-red-500'
                        : 'bg-[#4361EE] text-white hover:bg-[#3451DE]'
                    }`}
                  >
                    {app.installed ? 'Uninstall' : 'Install'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredApps.map(app => (
              <div
                key={app.id}
                className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4 hover:shadow-sm transition-shadow cursor-pointer"
                onClick={() => setSelectedApp(app)}
              >
                <img src={app.image} alt={app.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm text-[#333333]">{app.name}</h3>
                    {app.installed && (
                      <span className="flex items-center gap-1 bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                        <Check size={10} /> Installed
                      </span>
                    )}
                    <span className="bg-gray-100 text-[#717182] text-xs px-2 py-0.5 rounded-full">{app.category}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 mb-1.5">
                    <Star size={11} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs text-[#717182]">{app.rating}</span>
                  </div>
                  <p className="text-xs text-[#717182] line-clamp-1">{app.description}</p>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); toggleInstall(app.id); }}
                  className={`shrink-0 px-4 py-2 rounded-xl text-sm transition-colors ${
                    app.installed
                      ? 'border border-gray-200 text-[#717182] hover:border-red-300 hover:text-red-500'
                      : 'bg-[#4361EE] text-white hover:bg-[#3451DE]'
                  }`}
                >
                  {app.installed ? 'Uninstall' : 'Install'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── APP DETAIL MODAL ── */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedApp(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="relative">
              <img src={selectedApp.image} alt={selectedApp.name} className="w-full h-48 object-cover" />
              <button
                onClick={() => setSelectedApp(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors"
              >
                <X size={16} />
              </button>
              <div className="absolute top-4 left-4 bg-white/90 text-xs text-[#717182] px-2.5 py-1 rounded-full">
                {selectedApp.category}
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-[#333333]">{selectedApp.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        className={i < Math.floor(selectedApp.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300 fill-gray-300'}
                      />
                    ))}
                    <span className="text-sm text-[#717182] ml-1">{selectedApp.rating}</span>
                  </div>
                </div>
                {selectedApp.installed && (
                  <span className="flex items-center gap-1 bg-green-100 text-green-700 text-xs px-3 py-1.5 rounded-full shrink-0">
                    <Check size={12} /> Installed
                  </span>
                )}
              </div>
              <p className="text-sm text-[#717182] leading-relaxed mb-6">{selectedApp.description}</p>
              <button
                onClick={() => toggleInstall(selectedApp.id)}
                className={`w-full py-3 rounded-xl text-sm transition-colors ${
                  selectedApp.installed
                    ? 'border border-gray-200 text-[#717182] hover:border-red-300 hover:text-red-500'
                    : 'bg-[#4361EE] text-white hover:bg-[#3451DE]'
                }`}
              >
                {selectedApp.installed ? 'Uninstall App' : 'Install App'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
