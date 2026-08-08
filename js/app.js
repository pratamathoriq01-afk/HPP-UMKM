/* ─────────────────── MAIN APP ORCHESTRATOR (V5 MARKDOWN REV SPEC) ─────────────────── */
(function() {
  const h = React.createElement;

  window.AppComponent = function App() {
    const [products, setProducts] = React.useState(() => window.AppStorage.loadProducts());
    const [activeId, setActiveId] = React.useState(() => window.AppStorage.loadActiveId(products));
    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
    const [isAIModalOpen, setIsAIModalOpen] = React.useState(false);

    /* Sync with LocalStorage */
    React.useEffect(() => {
      window.AppStorage.saveProducts(products);
    }, [products]);

    React.useEffect(() => {
      window.AppStorage.saveActiveId(activeId);
    }, [activeId]);

    /* Current Active Product */
    const prod = products.find(p => p.id === activeId) || products[0] || window.AppConfig.DEFAULT_PRESETS[0];

    /* Helper to update fields on active product */
    const updateActiveProduct = React.useCallback((field, val) => {
      setProducts(prevProducts =>
        prevProducts.map(p => (p.id === activeId ? { ...p, [field]: val } : p))
      );
    }, [activeId]);

    /* Add Product Handler */
    const handleAddProduct = () => {
      const nextId = products.reduce((max, p) => (p.id > max ? p.id : max), 0) + 1;
      const newP = {
        id: nextId,
        name: 'Resep Spesial Baru ' + nextId,
        mainMaterials: [
          { id: 1, name: 'Bahan Utama A', totalPrice: 20000, portions: 5, unit: 'porsi' }
        ],
        bopMaterials: [
          { id: 1, name: 'Minyak / Gas', totalPrice: 15000, capacity: 1000, capUnit: 'ml', usage: 250, usageUnit: 'ml', portions: 5 }
        ],
        packagings: [
          { id: 1, name: 'Box Makanan', totalPrice: 25000, itemsPerPack: 50, unit: 'pcs' }
        ],
        marginPercent: 40,
        customOfflinePrice: null,
        commissionPercent: 20,
        fixedFee: 1000,
        customOnlinePrice: null,
        simOrderQty: 2,
        promoEnabled: false,
        promoMinOrder: 30000,
        promoPercent: 20,
        promoMaxDiscount: 10000,
        commissionDeductionMode: 'before_discount'
      };
      setProducts([...products, newP]);
      setActiveId(newP.id);
    };

    /* Delete Product Handler */
    const handleDeleteProduct = (id) => {
      if (products.length <= 1) return;
      const filtered = products.filter(p => p.id !== id);
      setProducts(filtered);
      if (activeId === id) {
        setActiveId(filtered[0].id);
      }
    };

    return h('div', { className: 'min-h-screen flex flex-col bg-[#f8f9ff] text-slate-900 font-sans' },
      
      /* Header Top Bar */
      h(window.HeaderComponent, {
        productName: prod.name,
        onUpdateProductName: (val) => updateActiveProduct('name', val),
        onToggleDrawer: () => setIsDrawerOpen(true),
        onAddProduct: handleAddProduct,
        onOpenAI: () => setIsAIModalOpen(true)
      }),

      /* Slide-over Product Drawer */
      h(window.DrawerComponent, {
        isOpen: isDrawerOpen,
        onClose: () => setIsDrawerOpen(false),
        products: products,
        activeId: activeId,
        onSelectProduct: (id) => setActiveId(id),
        onAddProduct: handleAddProduct,
        onDeleteProduct: handleDeleteProduct,
        onUpdateProductCommission: (val) => updateActiveProduct('commissionPercent', val),
        onUpdateProductFixedFee: (val) => updateActiveProduct('fixedFee', val),
        commissionPercent: prod.commissionPercent || 0,
        fixedFee: prod.fixedFee || 0
      }),

      /* System AI Modal: Juragan AI Advisor */
      h(window.AIAssistantModalComponent, {
        isOpen: isAIModalOpen,
        onClose: () => setIsAIModalOpen(false),
        prod: prod
      }),

      /* Main Split-View Dashboard Layout */
      h('main', { className: 'flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full' },
        h('div', { className: 'grid grid-cols-1 lg:grid-cols-12 gap-8' },
          
          /* Left Column: Touch Bar & Module Orchestrator (lg:col-span-8) */
          h('div', { className: 'lg:col-span-8' },
            h(window.LeftColumnComponent, {
              prod: prod,
              products: products,
              activeId: activeId,
              onSelectProduct: (id) => setActiveId(id),
              onAddProduct: handleAddProduct,
              onDeleteProduct: handleDeleteProduct,
              onUpdateProduct: updateActiveProduct,
              onOpenAI: () => setIsAIModalOpen(true)
            })
          ),

          /* Right Column: Sticky Summary Panel & Receipt (lg:col-span-4) */
          h('div', { className: 'lg:col-span-4 hidden lg:block' },
            h('div', { className: 'sticky top-20' },
              h(window.RightSummaryComponent, {
                prod: prod,
                onOpenAI: () => setIsAIModalOpen(true)
              })
            )
          )

        )
      ),

      /* Footer */
      h('footer', { className: 'py-4 border-t border-slate-200 text-center text-xs text-slate-400 bg-white font-extrabold space-y-1' },
        h('p', null, 'Kalkulator Keuangan UMKM Pintar v5.0 • Standar SAK EMKM & Reverse-Margin Presisi'),
        h('p', { className: 'text-[10px] text-slate-300 font-normal' }, 'Terintegrasi dengan Juragan AI Advisor & Modul Proteksi Promo Boncos')
      )
    );
  };
})();
