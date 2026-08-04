/* ─────────────────── STORAGE MANAGER ─────────────────── */
window.AppStorage = {
  KEYS: {
    PRODUCTS: 'umkm_cogs_products_v4',
    ACTIVE_ID: 'umkm_cogs_active_id_v4'
  },

  loadProducts: function() {
    try {
      const saved = localStorage.getItem(this.KEYS.PRODUCTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Migration: Ensure all products have complete structures
          return parsed.map(p => ({
            ...p,
            labors: p.labors || [{ id: 1, name: 'Upah Tenaga Kerja', price: 0 }],
            offlineDiscountMode: p.offlineDiscountMode || 'percent',
            offlineDiscountPercent: p.offlineDiscountPercent ?? 0,
            offlineDiscountNominal: p.offlineDiscountNominal ?? 0,
            promoEnabled: p.promoEnabled ?? false,
            promoPercent: p.promoPercent ?? 20,
            promoMinOrder: p.promoMinOrder ?? 40000,
            promoMaxDiscount: p.promoMaxDiscount ?? 15000
          }));
        }
      }
    } catch (e) {
      console.error('Storage load failed, restoring default presets:', e);
    }
    return window.AppConfig.DEFAULT_PRESETS;
  },

  saveProducts: function(products) {
    try {
      localStorage.setItem(this.KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Storage save products failed:', e);
    }
  },

  loadActiveId: function(products) {
    try {
      const saved = localStorage.getItem(this.KEYS.ACTIVE_ID);
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (products.some(p => p.id === parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Storage load active ID failed:', e);
    }
    return products[0] ? products[0].id : 1;
  },

  saveActiveId: function(activeId) {
    try {
      localStorage.setItem(this.KEYS.ACTIVE_ID, String(activeId));
    } catch (e) {
      console.error('Storage save active ID failed:', e);
    }
  }
};
