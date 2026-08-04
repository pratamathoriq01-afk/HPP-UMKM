/* ─────────────────── MAIN APP ORCHESTRATOR (POS SPLIT-VIEW) ─────────────────── */
(function() {
  const h = React.createElement;

  window.AppComponent = function App() {
    const [products, setProducts] = React.useState(() => window.AppStorage.loadProducts());
    const [activeId, setActiveId] = React.useState(() => window.AppStorage.loadActiveId(products));
    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

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

    /* Product Management handlers */
    const handleAddProduct = () => {
      const nextId = products.reduce((max, p) => (p.id > max ? p.id : max), 0) + 1;
      const newP = {
        id: nextId,
        name: 'Produk Baru ' + nextId,
        targetQty: 50,
        materials: [{ id: 1, name: '', qty: 1, unit: 'gram', unitPrice: 0 }],
        labors: [{ id: 1, name: '', price: 0 }],
        overheads: [{ id: 1, name: '', price: 0 }],
        marginMode: 'percent',
        marginPercent: 40,
        marginNominal: 5000,
        commissionPercent: 20,
        fixedFee: 1000,
        offlineDiscountMode: 'percent',
        offlineDiscountPercent: 0,
        offlineDiscountNominal: 0,
        promoEnabled: false,
        promoPercent: 20,
        promoMinOrder: 40000,
        promoMaxDiscount: 15000
      };
      setProducts([...products, newP]);
      setActiveId(newP.id);
    };

    const handleDeleteProduct = (id) => {
      if (products.length <= 1) return;
      const filtered = products.filter(p => p.id !== id);
      setProducts(filtered);
      if (activeId === id) {
        setActiveId(filtered[0].id);
      }
    };

    return h('div', { className: 'min-h-screen flex flex-col bg-slate-50 text-slate-900' },
      /* Header Top Bar */
      h(window.HeaderComponent, {
        productName: prod.name,
        onUpdateProductName: (val) => updateActiveProduct('name', val),
        onToggleDrawer: () => setIsDrawerOpen(true),
        onAddProduct: handleAddProduct
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

      /* Main Split-View POS Dashboard Layout */
      h('main', { className: 'flex-1 p-6 md:p-8' },
        h('div', { className: 'grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto' },
          
          /* Kolom Kiri: Area Kerja Input & Operasional (65% Lebar - lg:col-span-8) */
          h('div', { className: 'lg:col-span-8' },
            h(window.LeftColumnComponent, {
              prod: prod,
              onUpdateProduct: updateActiveProduct
            })
          ),

          /* Kolom Kanan: Panel Ringkasan Struk Digital Sticky (35% Lebar - lg:col-span-4) */
          h('div', { className: 'lg:col-span-4' },
            h(window.RightSummaryComponent, {
              prod: prod
            })
          )

        )
      ),

      /* Footer */
      h('footer', { className: 'py-4 border-t border-slate-200 text-center text-[10px] text-slate-400 bg-white font-extrabold' },
        'Kalkulator Keuangan UMKM v5.0 • POS Split-View Dashboard • Standar SAK EMKM & Reverse-Margin Presisi'
      )
    );
  };
})();
