/* ─────────────────── RIGHT SUMMARY: PANEL STRUK DIGITAL (PRO-GROWTH LEDGER) ─────────────────── */
(function() {
  const h = React.createElement;

  window.RightSummaryComponent = function RightSummary({ prod }) {
    const fmtIDR = window.AppMath.formatIDR;
    const calculateHPP = window.AppMath.calculateHPP;
    const calculateBaseSellingPrice = window.AppMath.calculateBaseSellingPrice;
    const calculateOfflineDiscount = window.AppMath.calculateOfflineDiscount;
    const calculateAppSellingPrice = window.AppMath.calculateAppSellingPrice;
    const calculateOnlinePromo = window.AppMath.calculateOnlinePromo;

    /* Financial Computations */
    const { totalMaterials, totalLabors, totalOverheads, totalProductionCost, qty, hppPerUnit } = calculateHPP(prod);
    const { marginNominal, marginPercent, basePrice, hppRatio, marginRatio } = calculateBaseSellingPrice(hppPerUnit, prod);
    const offlineDisc = calculateOfflineDiscount(basePrice, hppPerUnit, prod);
    const { appPrice } = calculateAppSellingPrice(basePrice, prod);
    const onlinePromo = calculateOnlinePromo(appPrice, hppPerUnit, prod, prod.simOrderQty || 2);

    const isLosingMoney = offlineDisc.isOfflineLosing || onlinePromo.isOnlineLosing;

    return h('div', { className: 'sticky top-20 select-none space-y-5' },

      /* ─────────────────── HERO NAVY HPP SUMMARY CARD ─────────────────── */
      h('div', {
        className: `bg-[#002045] text-white rounded-xl p-6 shadow-xl relative overflow-hidden transition-all duration-300 border border-[#1a365d] ${
          isLosingMoney ? 'warning-alert-pulse' : ''
        }`
      },
        /* Glowing Blur Accent Dots */
        h('div', { className: 'absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-xl pointer-events-none' }),
        h('div', { className: 'absolute bottom-0 left-0 w-24 h-24 bg-[#85f6ad]/10 rounded-full -ml-5 -mb-5 blur-lg pointer-events-none' }),

        h('h3', { className: 'text-xs font-bold text-[#adc7f7] uppercase tracking-widest relative z-10 mb-1' }, 'Total HPP Produksi'),
        h('div', { className: 'text-3xl font-bold font-mono text-white tracking-tight relative z-10 my-1' },
          fmtIDR(totalProductionCost)
        ),

        h('div', { className: 'grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/15 relative z-10' },
          h('div', null,
            h('p', { className: 'text-[11px] text-[#adc7f7] font-medium' }, 'Kuantitas Batch'),
            h('p', { className: 'text-base font-bold font-mono text-white mt-0.5' }, `${qty} pcs`)
          ),
          h('div', null,
            h('p', { className: 'text-[11px] text-[#adc7f7] font-medium' }, 'HPP / Unit'),
            h('p', { className: 'text-base font-bold font-mono text-[#85f6ad] mt-0.5' }, fmtIDR(hppPerUnit))
          )
        )
      ),

      /* ─────────────────── PRICING CARDS (OFFLINE & ONLINE) ─────────────────── */
      h('div', { className: 'grid grid-cols-2 gap-3' },

        /* Harga Offline Card */
        h('div', { className: 'bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-xs' },
          h('span', { className: 'text-[10px] font-bold uppercase tracking-wider text-slate-400 block' }, 'Harga Toko Offline'),
          h('span', { className: 'text-xl font-bold font-mono text-[#006d3c] block mt-1' }, fmtIDR(basePrice)),
          h('span', { className: 'text-[10px] font-bold text-[#006d3c] bg-[#85f6ad]/20 px-2 py-0.5 rounded inline-block mt-1 font-mono' },
            `+${marginPercent.toFixed(0)}% Margin`
          )
        ),

        /* Harga Online Card */
        h('div', { className: 'bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-xs' },
          h('span', { className: 'text-[10px] font-bold uppercase tracking-wider text-slate-400 block' }, 'Harga Aplikasi Online'),
          h('span', { className: 'text-xl font-bold font-mono text-[#b45309] block mt-1' }, fmtIDR(appPrice)),
          h('span', { className: 'text-[10px] font-bold text-[#b45309] bg-amber-50 px-2 py-0.5 rounded inline-block mt-1 font-mono' },
            `Komisi ${prod.commissionPercent || 0}%`
          )
        )

      ),

      /* ─────────────────── RED ALERT BANNER (IF LOSING MONEY) ─────────────────── */
      isLosingMoney && h('div', { className: 'bg-rose-50 border-2 border-rose-500 p-4 rounded-xl text-xs space-y-1 text-rose-950 shadow-md animate-pulse' },
        h('div', { className: 'flex items-center gap-2 font-bold text-sm text-rose-800' },
          h('span', { className: 'text-base' }, '🚨'),
          'PERINGATAN RUGI BERSIH!'
        ),
        offlineDisc.isOfflineLosing && h('p', { className: 'text-rose-900 text-[11px] leading-relaxed font-medium' },
          `Diskon offline merugikan modal HPP sebesar `,
          h('strong', { className: 'font-mono underline' }, fmtIDR(Math.abs(offlineDisc.netOfflineMargin))),
          ' per unit.'
        ),
        onlinePromo.isOnlineLosing && h('p', { className: 'text-rose-900 text-[11px] leading-relaxed font-medium' },
          `Promo online (${onlinePromo.orderQty} porsi) merugikan modal HPP sebesar `,
          h('strong', { className: 'font-mono underline' }, fmtIDR(Math.abs(onlinePromo.netMarginOnlineTotal))),
          ` (${fmtIDR(Math.abs(onlinePromo.netMarginOnline))}/unit).`
        )
      ),

      /* ─────────────────── 1. STRUK RINCIAN TOKO OFFLINE ─────────────────── */
      h('div', { className: 'bg-white rounded-xl border border-[#e2e8f0] p-4 text-xs space-y-2 font-mono shadow-xs' },
        h('div', { className: 'flex justify-between items-center border-b border-slate-100 pb-2 font-sans' },
          h('span', { className: 'text-[10px] font-bold text-slate-500 uppercase tracking-widest' },
            '🏪 Struk Rincian Toko Offline'
          ),
          h('span', {
            className: `text-[9.5px] font-bold px-2 py-0.5 rounded-full ${
              offlineDisc.isOfflinePromoActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
            }`
          }, offlineDisc.isOfflinePromoActive ? 'Promo Aktif' : 'Harga Normal')
        ),

        h('div', { className: 'flex justify-between text-slate-600' },
          h('span', null, 'Harga Offline Dasar:'),
          h('span', null, fmtIDR(basePrice))
        ),
        offlineDisc.isOfflinePromoActive ? (
          h('div', { className: 'flex justify-between text-rose-600 font-bold' },
            h('span', null, `Diskon Toko (${offlineDisc.discountPercent.toFixed(0)}%):`),
            h('span', null, `−${fmtIDR(offlineDisc.discountNominal)}`)
          )
        ) : (
          h('div', { className: 'flex justify-between text-slate-400 text-[11px]' },
            h('span', null, 'Diskon Toko:'),
            h('span', null, 'Rp 0 (Promo Off)')
          )
        ),
        h('div', { className: 'flex justify-between pt-1 border-t border-slate-100 text-slate-800 font-bold' },
          h('span', null, 'Harga Akhir Dibayar Konsumen:'),
          h('span', null, fmtIDR(offlineDisc.finalOfflinePrice))
        ),
        h('div', { className: 'flex justify-between pt-1 border-t border-slate-100 text-xs font-bold font-sans' },
          h('span', null, 'Margin Bersih Offline / Unit:'),
          h('span', { className: `font-mono text-sm ${offlineDisc.isOfflineLosing ? 'text-rose-600' : 'text-[#006d3c]'}` },
            fmtIDR(offlineDisc.netOfflineMargin)
          )
        )
      ),

      /* ─────────────────── 2. STRUK RINCIAN APLIKASI ONLINE (PRESISI & BENING) ─────────────────── */
      h('div', { className: 'bg-white rounded-xl border border-[#e2e8f0] p-4 text-xs space-y-2 font-mono shadow-xs' },
        h('div', { className: 'flex justify-between items-center border-b border-slate-100 pb-2 font-sans' },
          h('span', { className: 'text-[10px] font-bold text-slate-500 uppercase tracking-widest' },
            '📱 Struk Rincian Aplikasi Online'
          ),
          h('span', {
            className: `text-[9.5px] font-bold px-2 py-0.5 rounded-full ${
              onlinePromo.isPromoValid ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
            }`
          }, onlinePromo.isPromoValid ? 'Promo Aktif' : 'Harga Normal')
        ),

        h('div', { className: 'flex justify-between text-slate-600' },
          h('span', null, 'Harga Aplikasi Terdaftar / Unit:'),
          h('span', null, fmtIDR(appPrice))
        ),
        onlinePromo.isPromoValid ? (
          h('div', { className: 'flex justify-between text-rose-600 font-bold' },
            h('span', null, `Diskon Promo (${prod.promoPercent}%):`),
            h('span', null, `−${fmtIDR(onlinePromo.discountPerUnit)}`)
          )
        ) : (
          h('div', { className: 'flex justify-between text-slate-400 text-[11px]' },
            h('span', null, 'Diskon Promo:'),
            h('span', null, 'Rp 0 (Promo Off)')
          )
        ),
        h('div', { className: 'flex justify-between text-slate-700 font-bold' },
          h('span', null, 'Harga Akhir Dibayar Pembeli / Unit:'),
          h('span', null, fmtIDR(onlinePromo.customerPaysPerUnit))
        ),
        h('div', { className: 'flex justify-between text-rose-600 font-bold' },
          h('span', null, `Komisi (${prod.commissionPercent}%) & Biaya Layanan:`),
          h('span', null, `−${fmtIDR(onlinePromo.appCommissionPerUnit)}`)
        ),
        h('div', { className: 'flex justify-between pt-1 border-t border-slate-100 font-bold text-[#002045] font-sans' },
          h('span', null, 'Net Payout Diterima / Unit:'),
          h('span', { className: 'font-mono text-sm text-[#006d3c]' }, fmtIDR(onlinePromo.netPayoutPerUnit))
        ),
        h('div', { className: 'flex justify-between pt-1 border-t border-slate-100 text-xs font-bold font-sans' },
          h('span', null, 'Margin Bersih Online / Unit:'),
          h('span', { className: `font-mono text-sm ${onlinePromo.isOnlineLosing ? 'text-rose-600' : 'text-[#006d3c]'}` },
            fmtIDR(onlinePromo.netMarginOnline)
          )
        )
      ),

      /* ─────────────────── BEP SAFETY LIMIT ─────────────────── */
      h('div', { className: 'bg-white rounded-xl border border-[#e2e8f0] p-4 text-xs space-y-2 shadow-xs' },
        h('span', { className: 'text-[10px] font-bold text-slate-400 uppercase tracking-widest block' },
          '🛡️ BATAS AMAN MAKSIMAL DISKON (BEP)'
        ),
        h('div', { className: 'grid grid-cols-2 gap-2 text-center pt-1 font-mono' },
          h('div', { className: 'bg-[#eff4ff] border border-[#dce9ff] p-2 rounded-lg' },
            h('span', { className: 'text-[9px] text-slate-500 block font-sans uppercase' }, 'Maks. Diskon %'),
            h('span', { className: 'text-sm font-bold text-rose-600 block' }, `${onlinePromo.bepDiscountPercent.toFixed(1)}%`)
          ),
          h('div', { className: 'bg-[#eff4ff] border border-[#dce9ff] p-2 rounded-lg' },
            h('span', { className: 'text-[9px] text-slate-500 block font-sans uppercase' }, 'Maks. Nominal'),
            h('span', { className: 'text-sm font-bold text-rose-600 block' }, fmtIDR(onlinePromo.bepDiscountNominal))
          )
        )
      )

    );
  };
})();
