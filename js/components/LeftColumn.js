/* ─────────────────── SABLE BROWN & SANDCASTLE MINIMALIST LEFT COLUMN ─────────────────── */
(function() {
  const h = React.createElement;

  window.LeftColumnComponent = function LeftColumn({
    products,
    activeId,
    activeTab: externalActiveTab,
    setActiveTab: externalSetActiveTab,
    onSelectProduct,
    onAddProduct,
    onDeleteProduct,
    prod,
    onUpdateProduct,
    onOpenAI
  }) {
    const [activeTab, setActiveTab] = React.useState(externalActiveTab || 'hpp');

    /* Sync with external prop if provided */
    React.useEffect(() => {
      if (externalActiveTab) {
        setActiveTab(externalActiveTab);
      }
    }, [externalActiveTab]);

    const handleTabChange = (tabId) => {
      setActiveTab(tabId);
      if (externalSetActiveTab) {
        externalSetActiveTab(tabId);
      }
    };

    /* Navigation Tabs Config */
    const TABS = [
      { id: 'dashboard', icon: '🏠', label: 'Dashboard Menu' },
      { id: 'hpp', icon: '📦', label: '1. HPP' },
      { id: 'offline', icon: '🏪', label: '2. Harga Toko' },
      { id: 'online', icon: '📱', label: '3. Harga Online' },
      { id: 'promo', icon: '🏷️', label: '4. Simulasi Promo' },
      { id: 'summarize', icon: '📊', label: '5. Summarize & AI' }
    ];

    return h('div', { className: 'space-y-6 animate-fade-in pb-12' },

      /* Page Heading */
      h('div', { className: 'flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2' },
        h('div', null,
          h('h2', { className: 'text-2xl sm:text-3xl font-black text-[#241710] font-heading tracking-tight' }, 'Kalkulator Keuangan UMKM Pintar'),
          h('p', { className: 'text-xs text-[#6B5541] font-bold mt-1' },
            'Pilih modul pada Touch Bar di bawah untuk mengelola kalkulasi HPP, Harga Jual, & Diskon secara terpisah.'
          )
        ),
        h('button', {
          onClick: onOpenAI,
          className: 'btn-secondary-taupe px-4 py-2.5 rounded-xl text-white font-extrabold text-xs flex items-center gap-2 cursor-pointer shadow-xs self-start md:self-auto'
        },
          '🤖 Konsultasi Juragan AI Advisor'
        )
      ),

      /* ─────────────────── TOUCH BAR WITH VISIBLE HORIZONTAL SCROLLBAR ─────────────────── */
      h('div', { className: 'touch-bar-container' },
        TABS.map(t =>
          h('button', {
            key: t.id,
            onClick: () => handleTabChange(t.id),
            className: `touch-bar-pill ${activeTab === t.id ? 'active' : ''}`
          },
            h('span', null, t.icon),
            h('span', null, t.label)
          )
        )
      ),

      /* ─────────────────── HALAMAN 1: DASHBOARD MANAJEMEN MENU ─────────────────── */
      activeTab === 'dashboard' &&
      h(window.DashboardMenuComponent, {
        products,
        activeId,
        onSelectProduct,
        onAddProduct,
        onDeleteProduct,
        onNavigateTab: (tabId) => handleTabChange(tabId)
      }),

      /* ─────────────────── MODUL 1: BIAYA PRODUKSI & HPP MURNI ─────────────────── */
      activeTab === 'hpp' &&
      h(window.TabHPPComponent, {
        prod,
        onUpdateProduct,
        onNavigateTab: (tabId) => handleTabChange(tabId)
      }),

      /* ─────────────────── MODUL 2: HARGA JUAL TOKO (OFFLINE) ─────────────────── */
      activeTab === 'offline' &&
      h(window.TabOfflineComponent, {
        prod,
        onUpdateProduct,
        onNavigateTab: (tabId) => handleTabChange(tabId)
      }),

      /* ─────────────────── MODUL 3: HARGA APLIKASI ONLINE (REVERSE-MARGIN) ─────────────────── */
      activeTab === 'online' &&
      h(window.TabOnlineComponent, {
        prod,
        onUpdateProduct,
        onNavigateTab: (tabId) => handleTabChange(tabId)
      }),

      /* ─────────────────── MODUL 4: PUSAT SIMULASI DISKON & PROMO ─────────────────── */
      activeTab === 'promo' &&
      h(window.TabPromoComponent, {
        prod,
        onUpdateProduct
      }),

      /* ─────────────────── MODUL 5: SUMMARIZE & INTEGRASI AI ADVISOR ─────────────────── */
      (activeTab === 'summarize' || activeTab === 'all') &&
      h(window.TabSummarizeComponent, {
        prod,
        onOpenAI
      })

    );
  };
})();
