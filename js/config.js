/* ─────────────────── CONFIG & PRESET DATA ─────────────────── */
window.AppConfig = {
  UNITS: [
    'gram', 'kg', 'ml', 'liter', 'butir', 'sendok', 'sdm', 'sdt', 
    'porsi', 'bungkus', 'pcs', 'buah', 'lembar', 'ikat', 'siung', 'batang'
  ],

  DEFAULT_PRESETS: [
    {
      id: 1,
      name: 'Nasi Goreng Spesial',
      targetQty: 50,
      materials: [
        { id: 1, name: 'Beras Bulog Pulen', qty: 5, unit: 'kg', unitPrice: 13500 },
        { id: 2, name: 'Telur Ayam Negeri', qty: 10, unit: 'butir', unitPrice: 2800 },
        { id: 3, name: 'Daging Ayam Fillet', qty: 1500, unit: 'gram', unitPrice: 42 },
        { id: 4, name: 'Minyak Goreng Sawit', qty: 500, unit: 'ml', unitPrice: 18 },
        { id: 5, name: 'Bumbu Racikan Utama', qty: 1, unit: 'bungkus', unitPrice: 15000 }
      ],
      labors: [
        { id: 1, name: 'Upah Asisten Masak per Batch', price: 45000 }
      ],
      overheads: [
        { id: 1, name: 'Gas Melon LPG 3kg', price: 22000 },
        { id: 2, name: 'Mika Box Premium + Sendok (50 pcs)', price: 45000 },
        { id: 3, name: 'Listrik & Air Bersih', price: 8000 }
      ],
      marginMode: 'percent',
      marginPercent: 40,
      marginNominal: 5000,
      commissionPercent: 20,
      fixedFee: 1000,
      // Offline promo settings
      offlinePromoEnabled: false,
      offlineDiscountMode: 'percent',
      offlineDiscountPercent: 10,
      offlineDiscountNominal: 2000,
      // Online promo settings
      promoEnabled: false,
      simOrderQty: 2,
      promoPercent: 30,
      promoMinOrder: 40000,
      promoMaxDiscount: 20000
    },
    {
      id: 2,
      name: 'Es Kopi Susu Aren',
      targetQty: 30,
      materials: [
        { id: 1, name: 'Biji Kopi Arabika', qty: 500, unit: 'gram', unitPrice: 150 },
        { id: 2, name: 'Susu UHT Full Cream', qty: 3, unit: 'liter', unitPrice: 18500 },
        { id: 3, name: 'Gula Aren Cair', qty: 1, unit: 'liter', unitPrice: 25000 },
        { id: 4, name: 'Es Batu Kristal', qty: 1, unit: 'bungkus', unitPrice: 10000 }
      ],
      labors: [
        { id: 1, name: 'Upah Barista per Shift (Proporsional)', price: 30000 }
      ],
      overheads: [
        { id: 1, name: 'Cup Plastik + Sedotan + Seal (30 pcs)', price: 27000 },
        { id: 2, name: 'Listrik & Utilitas Mesin Kopi', price: 15000 }
      ],
      marginMode: 'percent',
      marginPercent: 50,
      marginNominal: 4000,
      commissionPercent: 20,
      fixedFee: 1000,
      // Offline promo settings
      offlinePromoEnabled: false,
      offlineDiscountMode: 'percent',
      offlineDiscountPercent: 0,
      offlineDiscountNominal: 0,
      // Online promo settings
      promoEnabled: false,
      simOrderQty: 2,
      promoPercent: 25,
      promoMinOrder: 30000,
      promoMaxDiscount: 15000
    }
  ]
};
