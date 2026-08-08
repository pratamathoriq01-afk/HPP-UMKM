/* ─────────────────── FINANCIAL MATH ENGINE (MARKDOWN REV SPEC) ─────────────────── */
window.AppMath = {
  formatIDR: function(val) {
    if (val === undefined || val === null || isNaN(val)) return 'Rp 0';
    const num = Math.round(val);
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(num);
  },

  formatDecimalIDR: function(val) {
    if (val === undefined || val === null || isNaN(val)) return 'Rp 0';
    const formatted = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(val);
    return 'Rp ' + formatted;
  },

  /* Modul 1: Biaya Produksi & HPP Murni per Porsi */
  calculateHPP: function(prod) {
    // A. Bahan Baku Utama
    let totalMainMaterials = 0;
    const mainList = (prod.mainMaterials || []).map(item => {
      const price = parseFloat(item.totalPrice) || 0;
      const portions = Math.max(1, parseFloat(item.portions) || 1);
      const hppPerPortion = price / portions;
      totalMainMaterials += hppPerPortion;
      return { ...item, hppPerPortion };
    });

    // B. Bahan Habis Pakai (BOP Variabel)
    let totalBopMaterials = 0;
    const bopList = (prod.bopMaterials || []).map(item => {
      const price = parseFloat(item.totalPrice) || 0;
      const capacity = Math.max(0.001, parseFloat(item.capacity) || 1);
      const usage = parseFloat(item.usage) || 0;
      const portions = Math.max(1, parseFloat(item.portions) || 1);
      
      const recipeCost = (price / capacity) * usage;
      const hppPerPortion = recipeCost / portions;
      totalBopMaterials += hppPerPortion;
      return { ...item, recipeCost, hppPerPortion };
    });

    // C. Kemasan (Packaging)
    let totalPackagings = 0;
    const packList = (prod.packagings || []).map(item => {
      const price = parseFloat(item.totalPrice) || 0;
      const itemsPerPack = Math.max(1, parseFloat(item.itemsPerPack) || 1);
      const hppPerPortion = price / itemsPerPack;
      totalPackagings += hppPerPortion;
      return { ...item, hppPerPortion };
    });

    // Total HPP Murni / Porsi
    const hppMurni = totalMainMaterials + totalBopMaterials + totalPackagings;

    // Proporsi Biaya (%)
    const mainPct = hppMurni > 0 ? (totalMainMaterials / hppMurni) * 100 : 0;
    const bopPct = hppMurni > 0 ? (totalBopMaterials / hppMurni) * 100 : 0;
    const packPct = hppMurni > 0 ? (totalPackagings / hppMurni) * 100 : 0;

    return {
      mainList,
      bopList,
      packList,
      totalMainMaterials,
      totalBopMaterials,
      totalPackagings,
      hppMurni,
      mainPct,
      bopPct,
      packPct
    };
  },

  /* Modul 2: Harga Jual Toko (Offline) */
  calculateOfflinePrice: function(hppMurni, prod) {
    const marginPercent = parseFloat(prod.marginPercent) || 0;
    const recommendedPriceRaw = hppMurni + (hppMurni * (marginPercent / 100));
    const recommendedPrice = Math.ceil(recommendedPriceRaw / 100) * 100; // Pembulatan terdekat

    const effectiveOfflinePrice = prod.customOfflinePrice && prod.customOfflinePrice > 0
      ? parseFloat(prod.customOfflinePrice)
      : recommendedPrice;

    const netOfflineMargin = effectiveOfflinePrice - hppMurni;
    const marginRatio = effectiveOfflinePrice > 0 ? (netOfflineMargin / effectiveOfflinePrice) * 100 : 0;

    let marginStatus = window.AppConfig.MARGIN_STATUS.CRITICAL;
    if (marginRatio >= window.AppConfig.MARGIN_STATUS.HEALTHY.min) {
      marginStatus = window.AppConfig.MARGIN_STATUS.HEALTHY;
    } else if (marginRatio >= window.AppConfig.MARGIN_STATUS.MODERATE.min) {
      marginStatus = window.AppConfig.MARGIN_STATUS.MODERATE;
    }

    return {
      marginPercent,
      recommendedPriceRaw,
      recommendedPrice,
      effectiveOfflinePrice,
      netOfflineMargin,
      marginRatio,
      marginStatus
    };
  },

  /* Modul 2B: Simulasi Promo Toko (Offline) */
  calculateOfflinePromo: function(basePrice, hppMurni, prod) {
    const isOfflinePromoActive = !!prod.offlinePromoEnabled;
    const mode = prod.offlineDiscountMode || 'percent';
    let discountPercent = parseFloat(prod.offlineDiscountPercent) || 0;
    let discountNominal = parseFloat(prod.offlineDiscountNominal) || 0;

    if (isOfflinePromoActive) {
      if (mode === 'percent') {
        discountNominal = basePrice * (discountPercent / 100);
      } else {
        discountPercent = basePrice > 0 ? (discountNominal / basePrice) * 100 : 0;
      }
    } else {
      discountNominal = 0;
      discountPercent = 0;
    }

    const priceAfterDiscount = Math.max(0, basePrice - discountNominal);
    const netMarginAfterDiscount = priceAfterDiscount - hppMurni;
    const isLosing = isOfflinePromoActive && (netMarginAfterDiscount < 0);

    return {
      isOfflinePromoActive,
      mode,
      discountPercent,
      discountNominal,
      priceAfterDiscount,
      netMarginAfterDiscount,
      isLosing
    };
  },

  /* Modul 3: Harga Aplikasi Online (Reverse-Margin) */
  calculateOnlinePrice: function(offlinePrice, prod) {
    const commPercent = parseFloat(prod.commissionPercent) || 0;
    const commFrac = commPercent / 100;
    const fixedFee = parseFloat(prod.fixedFee) || 0;

    let recommendedOnlineRaw = 0;
    if (commFrac < 1) {
      // Formula Reverse Margin: (Harga Offline + Biaya Tetap) / (1 - Komisi)
      recommendedOnlineRaw = (offlinePrice + fixedFee) / (1 - commFrac);
    }
    const recommendedOnline = Math.ceil(recommendedOnlineRaw / 500) * 500;

    const effectiveOnlinePrice = prod.customOnlinePrice && prod.customOnlinePrice > 0
      ? parseFloat(prod.customOnlinePrice)
      : recommendedOnline;

    const commissionAmount = effectiveOnlinePrice * commFrac;
    const simulatedPayout = effectiveOnlinePrice - commissionAmount - fixedFee;

    return {
      commPercent,
      commFrac,
      fixedFee,
      recommendedOnlineRaw,
      recommendedOnline,
      effectiveOnlinePrice,
      commissionAmount,
      simulatedPayout
    };
  },

  /* Modul 4: Pusat Simulasi Diskon & Promo Online */
  calculatePromoSim: function(hppMurni, onlinePrice, prod) {
    const orderQty = Math.max(1, parseInt(prod.simOrderQty, 10) || 1);
    const orderSubtotal = orderQty * onlinePrice;
    
    const minOrder = parseFloat(prod.promoMinOrder) || 0;
    const promoPercent = parseFloat(prod.promoPercent) || 0;
    const maxDiscountCap = parseFloat(prod.promoMaxDiscount) || 0;
    const isPromoActive = !!prod.promoEnabled;
    const deductionMode = prod.commissionDeductionMode || 'before_discount';

    const isMinOrderMet = isPromoActive && (orderSubtotal >= minOrder);
    const rawDiscount = isPromoActive ? orderSubtotal * (promoPercent / 100) : 0;
    const isDiscountCapped = isMinOrderMet && (rawDiscount > maxDiscountCap) && (maxDiscountCap > 0);
    const effectiveDiscount = isMinOrderMet ? (maxDiscountCap > 0 ? Math.min(rawDiscount, maxDiscountCap) : rawDiscount) : 0;
    
    const customerPays = Math.max(0, orderSubtotal - effectiveDiscount);

    // Potongan Komisi Aplikasi
    const commPercent = parseFloat(prod.commissionPercent) || 0;
    const commFrac = commPercent / 100;
    const fixedFee = parseFloat(prod.fixedFee) || 0;

    const commissionBase = deductionMode === 'after_discount' ? customerPays : orderSubtotal;
    const appCommissionTotal = (commissionBase * commFrac) + fixedFee;

    // Uang Cair ke Penjual (Net Payout)
    const netPayout = Math.max(0, customerPays - appCommissionTotal);
    
    // Beban HPP Total & Net Profit
    const totalHPPOrder = orderQty * hppMurni;
    const netProfit = netPayout - totalHPPOrder;
    const isBoncos = netProfit < 0;

    return {
      isPromoActive,
      orderQty,
      orderSubtotal,
      minOrder,
      promoPercent,
      maxDiscountCap,
      isMinOrderMet,
      rawDiscount,
      isDiscountCapped,
      effectiveDiscount,
      customerPays,
      deductionMode,
      commissionBase,
      appCommissionTotal,
      netPayout,
      totalHPPOrder,
      netProfit,
      isBoncos
    };
  }
};

