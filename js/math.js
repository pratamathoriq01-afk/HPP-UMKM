/* ─────────────────── FINANCIAL MATH ENGINE (PRO-GROWTH LEDGER) ─────────────────── */
window.AppMath = {
  formatIDR: function(val) {
    const num = Math.round(val || 0);
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(num);
  },

  calculateHPP: function(prod) {
    const totalMaterials = (prod.materials || []).reduce(
      (sum, m) => sum + (parseFloat(m.qty) || 0) * (parseFloat(m.unitPrice) || 0), 0
    );
    const totalLabors = (prod.labors || []).reduce(
      (sum, l) => sum + (parseFloat(l.price) || 0), 0
    );
    const totalOverheads = (prod.overheads || []).reduce(
      (sum, o) => sum + (parseFloat(o.price) || 0), 0
    );

    const totalProductionCost = totalMaterials + totalLabors + totalOverheads;
    const qty = Math.max(1, parseInt(prod.targetQty, 10) || 1);
    const hppPerUnit = totalProductionCost / qty;

    return {
      totalMaterials,
      totalLabors,
      totalOverheads,
      totalProductionCost,
      qty,
      hppPerUnit
    };
  },

  calculateBaseSellingPrice: function(hpp, prod) {
    let computedMarginNominal = 0;
    let computedMarginPercent = 0;

    if (prod.marginMode === 'percent') {
      computedMarginPercent = prod.marginPercent || 0;
      computedMarginNominal = hpp * (computedMarginPercent / 100);
    } else {
      computedMarginNominal = prod.marginNominal || 0;
      computedMarginPercent = hpp > 0 ? (computedMarginNominal / hpp) * 100 : 0;
    }

    const basePrice = hpp + computedMarginNominal;
    const hppRatio = basePrice > 0 ? (hpp / basePrice) * 100 : 0;
    const marginRatio = basePrice > 0 ? (computedMarginNominal / basePrice) * 100 : 0;

    return {
      marginNominal: computedMarginNominal,
      marginPercent: computedMarginPercent,
      basePrice,
      hppRatio,
      marginRatio
    };
  },

  calculateOfflineDiscount: function(basePrice, hpp, prod) {
    const isOfflinePromoActive = !!prod.offlinePromoEnabled;
    let discountNominal = 0;
    let discountPercent = 0;

    if (isOfflinePromoActive) {
      if (prod.offlineDiscountMode === 'percent') {
        discountPercent = prod.offlineDiscountPercent || 0;
        discountNominal = basePrice * (discountPercent / 100);
      } else {
        discountNominal = prod.offlineDiscountNominal || 0;
        discountPercent = basePrice > 0 ? (discountNominal / basePrice) * 100 : 0;
      }
    }

    const finalOfflinePrice = Math.max(0, basePrice - discountNominal);
    const netOfflineMargin = finalOfflinePrice - hpp;
    const isOfflineLosing = netOfflineMargin < 0;

    return {
      isOfflinePromoActive,
      discountNominal,
      discountPercent,
      finalOfflinePrice,
      netOfflineMargin,
      isOfflineLosing
    };
  },

  calculateAppSellingPrice: function(basePrice, prod) {
    const commFrac = (prod.commissionPercent || 0) / 100;
    const fixedFee = prod.fixedFee || 0;

    if (commFrac >= 1) return { appPrice: 0, commFrac, fixedFee };

    // Reverse-Margin formula
    const appPrice = (basePrice + fixedFee) / (1 - commFrac);
    return {
      appPrice,
      commFrac,
      fixedFee
    };
  },

  /* Precise Customer Order Simulation for Online App Promos */
  calculateOnlinePromo: function(appPrice, hpp, prod, orderQtyParam) {
    const isOnlinePromoActive = !!prod.promoEnabled;
    const orderQty = Math.max(1, parseInt(orderQtyParam || prod.simOrderQty || 2, 10));
    const commPercent = prod.commissionPercent || 0;
    const commFrac = commPercent / 100;
    const fixedFee = prod.fixedFee || 0;
    const promoPercent = prod.promoPercent || 0;
    const minOrder = prod.promoMinOrder || 0;
    const maxDiscountCap = prod.promoMaxDiscount || 0;

    const orderSubtotal = orderQty * appPrice;
    const isPromoValid = isOnlinePromoActive && (orderSubtotal >= minOrder);

    const rawDiscount = isOnlinePromoActive ? orderSubtotal * (promoPercent / 100) : 0;
    const effectiveDiscount = isPromoValid ? Math.min(rawDiscount, maxDiscountCap) : 0;
    const finalCustomerPays = Math.max(0, orderSubtotal - effectiveDiscount);

    // Platform commission and fee deducted from payout
    const appCommissionAmount = (finalCustomerPays * commFrac) + fixedFee;
    const netPayoutOnline = Math.max(0, finalCustomerPays - appCommissionAmount);
    
    const totalHPPOrder = orderQty * hpp;
    const netMarginOnlineTotal = netPayoutOnline - totalHPPOrder;
    const netMarginOnlinePerUnit = netMarginOnlineTotal / orderQty;
    const isOnlineLosing = isOnlinePromoActive && isPromoValid && (netMarginOnlineTotal < 0);

    // Per-unit breakdown values for clean receipt rendering
    const discountPerUnit = effectiveDiscount / orderQty;
    const customerPaysPerUnit = finalCustomerPays / orderQty;
    const appCommissionPerUnit = appCommissionAmount / orderQty;
    const netPayoutPerUnit = netPayoutOnline / orderQty;

    // BEP Limit Calculation per transaction order
    let bepDiscountNominal = 0;
    if (commFrac < 1) {
      const minPayoutRequiredTotal = (totalHPPOrder + fixedFee) / (1 - commFrac);
      bepDiscountNominal = Math.max(0, orderSubtotal - minPayoutRequiredTotal);
    }
    const bepDiscountPercent = orderSubtotal > 0 ? (bepDiscountNominal / orderSubtotal) * 100 : 0;

    return {
      isOnlinePromoActive,
      orderQty,
      orderSubtotal,
      rawDiscount,
      effectiveDiscount,
      discountPerUnit,
      isPromoValid,
      finalCustomerPays,
      customerPaysPerUnit,
      appCommissionAmount,
      appCommissionPerUnit,
      netPayoutOnline,
      netPayoutPerUnit,
      netMarginOnline: netMarginOnlinePerUnit,
      netMarginOnlineTotal,
      isOnlineLosing,
      bepDiscountNominal,
      bepDiscountPercent
    };
  }
};
