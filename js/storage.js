/* ─────────────────── STORAGE MANAGER (V5 MARKDOWN REV SPEC) ─────────────────── */
window.AppStorage = {
  KEYS: {
    PRODUCTS: 'umkm_cogs_products_v5',
    ACTIVE_ID: 'umkm_cogs_active_id_v5',
    AI_KEY: 'umkm_cogs_ai_key_v5',
    AI_MODEL: 'umkm_cogs_ai_model_v5'
  },

  loadProducts: function() {
    try {
      const saved = localStorage.getItem(this.KEYS.PRODUCTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(p => this.normalizeProduct(p));
        }
      }
    } catch (e) {
      console.error('Storage load failed, restoring default presets:', e);
    }
    return window.AppConfig.DEFAULT_PRESETS.map(p => this.normalizeProduct(p));
  },

  normalizeProduct: function(p) {
    // Migration helper to ensure mainMaterials, bopMaterials, packagings exist
    const mainMaterials = Array.isArray(p.mainMaterials) ? p.mainMaterials : (
      Array.isArray(p.materials) ? p.materials.map(m => ({
        id: m.id || Date.now(),
        name: m.name || '',
        totalPrice: (m.qty || 1) * (m.unitPrice || 0),
        portions: p.targetQty || 8,
        unit: m.unit || 'porsi'
      })) : [{ id: 1, name: 'Bahan Utama', totalPrice: 0, portions: 8, unit: 'porsi' }]
    );

    const bopMaterials = Array.isArray(p.bopMaterials) ? p.bopMaterials : [
      { id: 1, name: 'Minyak / Gas', totalPrice: 0, capacity: 1000, capUnit: 'ml', usage: 250, usageUnit: 'ml', portions: 8 }
    ];

    const packagings = Array.isArray(p.packagings) ? p.packagings : [
      { id: 1, name: 'Kemasan / Mika', totalPrice: 0, itemsPerPack: 50, unit: 'pcs' }
    ];

    return {
      ...p,
      mainMaterials,
      bopMaterials,
      packagings,
      marginPercent: p.marginPercent ?? 40,
      customOfflinePrice: p.customOfflinePrice ?? null,
      commissionPercent: p.commissionPercent ?? 20,
      fixedFee: p.fixedFee ?? 1000,
      customOnlinePrice: p.customOnlinePrice ?? null,
      simOrderQty: p.simOrderQty ?? 2,
      promoEnabled: p.promoEnabled ?? false,
      promoMinOrder: p.promoMinOrder ?? 40000,
      promoPercent: p.promoPercent ?? 20,
      promoMaxDiscount: p.promoMaxDiscount ?? 15000,
      commissionDeductionMode: p.commissionDeductionMode || 'before_discount'
    };
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
  },

  loadAIConfig: function() {
    return {
      apiKey: localStorage.getItem(this.KEYS.AI_KEY) || '',
      model: localStorage.getItem(this.KEYS.AI_MODEL) || 'gemini-2.5-flash'
    };
  },

  saveAIConfig: function(apiKey, model) {
    try {
      if (apiKey !== undefined) localStorage.setItem(this.KEYS.AI_KEY, apiKey);
      if (model !== undefined) localStorage.setItem(this.KEYS.AI_MODEL, model);
    } catch (e) {
      console.error('Storage save AI config failed:', e);
    }
  }
};

