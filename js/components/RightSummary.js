/* ─────────────────── RIGHT SUMMARY: PANEL RINGKASAN & STRUK DIGITAL (SABLE BROWN & SANDCASTLE) ─────────────────── */
(function() {
  const h = React.createElement;

  window.RightSummaryComponent = function RightSummary({ prod, onOpenAI }) {
    const fmtIDR = window.AppMath.formatIDR;
    const calculateHPP = window.AppMath.calculateHPP;
    const calculateOfflinePrice = window.AppMath.calculateOfflinePrice;
    const calculateOnlinePrice = window.AppMath.calculateOnlinePrice;
    const calculatePromoSim = window.AppMath.calculatePromoSim;

    const hppData = calculateHPP(prod);
    const offlineData = calculateOfflinePrice(hppData.hppMurni, prod);
    const onlineData = calculateOnlinePrice(offlineData.effectiveOfflinePrice, prod);
    const promoData = calculatePromoSim(hppData.hppMurni, onlineData.effectiveOnlinePrice, prod);

    return h('div', { className: 'space-y-5 select-none' },

      /* ─────────────────── HERO SABLE BROWN HPP SUMMARY CARD ─────────────────── */
      h('div', { className: 'bg-[#4A3427] text-white rounded-3xl p-6 shadow-md relative overflow-hidden border border-[#241710]' },
        h('div', { className: 'relative z-10 space-y-2' },
          h('div', { className: 'flex items-center justify-between' },
            h('span', { className: 'text-[11px] font-extrabold text-[#EFE9DC] uppercase tracking-widest' }, 'HPP / PORSI'),
            h('button', {
              onClick: onOpenAI,
              className: 'bg-white/20 hover:bg-white/30 text-white font-extrabold text-[10px] px-3 py-1 rounded-full border border-white/25 flex items-center gap-1 cursor-pointer transition shadow-xs'
            },
              '🤖 AI Advisor'
            )
          ),
          h('div', { className: 'text-3xl sm:text-4xl font-black font-mono text-white tracking-tight' },
            fmtIDR(hppData.hppMurni)
          )
        ),

        /* Breakdown Pill List */
        h('div', { className: 'grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-white/20 relative z-10 text-center' },
          h('div', { className: 'bg-white/15 p-2 rounded-xl border border-white/15' },
            h('p', { className: 'text-[9px] text-[#EFE9DC] font-extrabold uppercase tracking-wider' }, 'Utama'),
            h('p', { className: 'text-xs font-black font-mono text-white mt-0.5' }, fmtIDR(hppData.totalMainMaterials))
          ),
          h('div', { className: 'bg-white/15 p-2 rounded-xl border border-white/15' },
            h('p', { className: 'text-[9px] text-[#FEF08A] font-extrabold uppercase tracking-wider' }, 'BOP'),
            h('p', { className: 'text-xs font-black font-mono text-white mt-0.5' }, fmtIDR(hppData.totalBopMaterials))
          ),
          h('div', { className: 'bg-white/15 p-2 rounded-xl border border-white/15' },
            h('p', { className: 'text-[9px] text-[#FDE68A] font-extrabold uppercase tracking-wider' }, 'Kemasan'),
            h('p', { className: 'text-xs font-black font-mono text-white mt-0.5' }, fmtIDR(hppData.totalPackagings))
          )
        )
      ),

      /* ─────────────────── 📊 PANEL RINGKASAN & ANALISIS BIAYA (PIE CHART) ─────────────────── */
      h('div', { className: 'bg-white rounded-3xl p-5 shadow-xs border border-[#D4C8B5] space-y-4' },
        h('div', { className: 'border-b border-[#D4C8B5] pb-2.5' },
          h('h3', { className: 'text-xs font-black text-[#241710] uppercase tracking-wider' }, '📊 PANEL RINGKASAN & ANALISIS BIAYA'),
          h('p', { className: 'text-[11px] text-[#6B5541] font-bold' }, 'Visualisasi proporsi biaya manufaktur murni per porsi')
        ),

        /* Visual Pie Chart Component */
        h('div', { className: 'flex flex-col items-center justify-center p-3 bg-[#EFE9DC] rounded-2xl border border-[#D4C8B5]' },
          
          /* CSS Pie Chart / Donut Chart representation */
          h('div', {
            className: 'w-36 h-36 rounded-full relative flex items-center justify-center shadow-xs transition transform hover:scale-105 my-1',
            style: {
              background: `conic-gradient(
                #4a3427 0% ${hppData.mainPct}%,
                #8c7259 ${hppData.mainPct}% ${hppData.mainPct + hppData.bopPct}%,
                #d4c8b5 ${hppData.mainPct + hppData.bopPct}% 100%
              )`
            }
          },
            h('div', { className: 'w-24 h-24 bg-white rounded-full flex flex-col items-center justify-center shadow-inner text-center p-1' },
              h('span', { className: 'text-[9px] text-[#6B5541] font-extrabold uppercase' }, 'TOTAL HPP'),
              h('span', { className: 'text-xs font-black text-[#241710] font-mono' }, fmtIDR(hppData.hppMurni))
            )
          )
        ),

        /* Proportion Legend Breakdown */
        h('div', { className: 'space-y-2' },
          h('div', { className: 'p-2.5 rounded-xl bg-[#EFE9DC] border border-[#D4C8B5] flex items-center justify-between' },
            h('div', { className: 'flex items-center gap-2' },
              h('div', { className: 'w-3 h-3 rounded-full bg-[#4A3427]' }),
              h('span', { className: 'text-xs font-black text-[#241710]' }, 'Bahan Baku Utama')
            ),
            h('div', { className: 'text-right' },
              h('span', { className: 'text-xs font-black text-[#241710] font-mono' }, `${hppData.mainPct.toFixed(1)}%`),
              h('span', { className: 'text-[10px] text-[#6B5541] font-mono block font-bold' }, `(${fmtIDR(hppData.totalMainMaterials)})`)
            )
          ),

          h('div', { className: 'p-2.5 rounded-xl bg-[#EFE9DC] border border-[#D4C8B5] flex items-center justify-between' },
            h('div', { className: 'flex items-center gap-2' },
              h('div', { className: 'w-3 h-3 rounded-full bg-[#8C7259]' }),
              h('span', { className: 'text-xs font-black text-[#241710]' }, 'BOP Variabel')
            ),
            h('div', { className: 'text-right' },
              h('span', { className: 'text-xs font-black text-[#241710] font-mono' }, `${hppData.bopPct.toFixed(1)}%`),
              h('span', { className: 'text-[10px] text-[#6B5541] font-mono block font-bold' }, `(${fmtIDR(hppData.totalBopMaterials)})`)
            )
          ),

          h('div', { className: 'p-2.5 rounded-xl bg-[#EFE9DC] border border-[#D4C8B5] flex items-center justify-between' },
            h('div', { className: 'flex items-center gap-2' },
              h('div', { className: 'w-3 h-3 rounded-full bg-[#D4C8B5]' }),
              h('span', { className: 'text-xs font-black text-[#241710]' }, 'Kemasan Packaging')
            ),
            h('div', { className: 'text-right' },
              h('span', { className: 'text-xs font-black text-[#241710] font-mono' }, `${hppData.packPct.toFixed(1)}%`),
              h('span', { className: 'text-[10px] text-[#6B5541] font-mono block font-bold' }, `(${fmtIDR(hppData.totalPackagings)})`)
            )
          )
        )
      ),

      /* ─────────────────── PRICING CARDS (OFFLINE & ONLINE) ─────────────────── */
      h('div', { className: 'grid grid-cols-2 gap-3' },
        
        /* Harga Toko Offline Card */
        h('div', { className: 'bg-white rounded-2xl p-4 border border-[#D4C8B5] shadow-xs space-y-1' },
          h('span', { className: 'text-[10px] font-extrabold uppercase tracking-wider text-[#6B5541] block' }, 'Harga Toko Offline'),
          h('span', { className: 'text-lg font-black font-mono text-[#241710] block' },
            fmtIDR(offlineData.effectiveOfflinePrice)
          ),
          h('span', {
            className: `text-[10px] font-bold px-2 py-0.5 rounded-full inline-block border ${offlineData.marginStatus.badgeClass}`
          },
            `${offlineData.marginStatus.icon} ${offlineData.marginRatio.toFixed(0)}% Margin`
          )
        ),

        /* Harga App Online Card */
        h('div', { className: 'bg-white rounded-2xl p-4 border border-[#D4C8B5] shadow-xs space-y-1' },
          h('span', { className: 'text-[10px] font-extrabold uppercase tracking-wider text-[#6B5541] block' }, 'Harga Online App'),
          h('span', { className: 'text-lg font-black font-mono text-[#241710] block' },
            fmtIDR(onlineData.effectiveOnlinePrice)
          ),
          h('span', { className: 'text-[10px] font-extrabold text-[#241710] bg-[#F7F3E9] px-2 py-0.5 rounded-full inline-block border border-[#D4C8B5]' },
            `Komisi ${prod.commissionPercent}%`
          )
        )

      ),

      /* ─────────────────── STRUK SIMULASI PROMO & BONCOS ALERT ─────────────────── */
      h('div', { className: 'bg-white rounded-2xl border border-[#D4C8B5] p-4 text-xs space-y-2.5 font-mono shadow-xs' },
        h('div', { className: 'flex justify-between items-center border-b border-[#D4C8B5] pb-2 font-sans' },
          h('span', { className: 'text-[10px] font-extrabold text-[#6B5541] uppercase tracking-widest' },
            '🏷️ Struk Promo Online'
          ),
          h('span', {
            className: `text-[9.5px] font-bold px-2 py-0.5 rounded-full border ${
              promoData.isBoncos ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-[#F7F3E9] text-[#241710] border-[#D4C8B5]'
            }`
          }, promoData.isBoncos ? '🔴 RUGI PROMO' : '⚫ AMAN PROMO')
        ),

        h('div', { className: 'flex justify-between text-[#6B5541] font-bold' },
          h('span', null, `Pesanan (${promoData.orderQty} porsi):`),
          h('span', null, fmtIDR(promoData.orderSubtotal))
        ),
        h('div', { className: 'flex justify-between text-rose-600 font-extrabold' },
          h('span', null, `Diskon Promo (${promoData.promoPercent}%):`),
          h('span', null, `- ${fmtIDR(promoData.effectiveDiscount)}`)
        ),
        h('div', { className: 'flex justify-between text-[#241710] font-black' },
          h('span', null, 'Dibayar Konsumen:'),
          h('span', null, fmtIDR(promoData.customerPays))
        ),
        h('div', { className: 'flex justify-between text-rose-600 font-extrabold' },
          h('span', null, `Potongan Komisi (${prod.commissionPercent}%):`),
          h('span', null, `- ${fmtIDR(promoData.appCommissionTotal)}`)
        ),
        h('div', { className: 'flex justify-between pt-1 border-t border-[#D4C8B5] font-black text-[#241710] font-sans' },
          h('span', null, 'Uang Cair (Net Payout):'),
          h('span', { className: 'font-mono text-sm text-[#241710]' }, fmtIDR(promoData.netPayout))
        ),
        h('div', { className: 'flex justify-between pt-1 border-t border-[#D4C8B5] text-xs font-bold font-sans' },
          h('span', null, 'Laba Bersih Promo:'),
          h('span', { className: `font-mono text-sm font-black ${promoData.isBoncos ? 'text-rose-600' : 'text-[#241710]'}` },
            `${promoData.netProfit >= 0 ? '+' : ''}${fmtIDR(promoData.netProfit)}`
          )
        )
      ),

      /* ─────────────────── STICKY BOTTOM BAR FOR MOBILE ─────────────────── */
      h('div', { className: 'fixed bottom-0 left-0 right-0 z-40 bg-[#4A3427] text-white p-3 border-t border-[#241710] flex items-center justify-between px-4 lg:hidden shadow-2xl' },
        h('div', null,
          h('span', { className: 'text-[10px] text-[#EFE9DC] font-bold uppercase block' }, 'HPP per Porsi'),
          h('span', { className: 'text-lg font-black font-mono text-white' }, fmtIDR(hppData.hppMurni))
        ),
        h('div', { className: 'flex items-center gap-2' },
          h('button', {
            onClick: onOpenAI,
            className: 'btn-secondary-taupe text-white font-extrabold text-xs px-3.5 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1'
          },
            '🤖 AI Advisor'
          )
        )
      )

    );
  };
})();
