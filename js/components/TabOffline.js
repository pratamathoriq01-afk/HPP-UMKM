/* ─────────────────── MODUL 2: HARGA JUAL TOKO (OFFLINE) - SABLE BROWN & SANDCASTLE ─────────────────── */
(function() {
  const h = React.createElement;

  window.TabOfflineComponent = function TabOffline({ prod, onUpdateProduct, onNavigateTab }) {
    const fmtIDR = window.AppMath.formatIDR;
    const calculateHPP = window.AppMath.calculateHPP;
    const calculateOfflinePrice = window.AppMath.calculateOfflinePrice;
    const FlexibleInput = window.FlexibleInput;

    const hppData = calculateHPP(prod);
    const offlineData = calculateOfflinePrice(hppData.hppMurni, prod);

    return h('div', { className: 'space-y-6 animate-fade-in max-w-4xl mx-auto pb-12' },

      /* Module Banner */
      h('div', { className: 'bg-[#F0E6D2] rounded-3xl p-6 shadow-xs border border-[#D4C8B5] space-y-2' },
        h('div', { className: 'flex items-center gap-2' },
          h('span', { className: 'text-xs font-extrabold uppercase tracking-wider text-[#241710] bg-[#D4C8B5] px-2.5 py-1 rounded-lg border border-[#BDB6A3]' }, 'Modul 2: Pricing Offline'),
          h('span', { className: 'text-xs text-[#6B5541] font-bold' }, '• Penjualan Toko / Dine-In / Takeaway')
        ),
        h('h2', { className: 'text-xl font-black text-[#241710]' }, '🏪 Penentuan Harga Jual Toko (Offline)'),
        h('p', { className: 'text-xs text-[#6B5541] max-w-xl font-semibold' },
          'Tentukan target margin keuntungan bersih untuk pelanggan yang membeli langsung di lokasi toko Anda.'
        )
      ),

      /* Calculation Card */
      h('div', { className: 'bg-[#F0E6D2] rounded-3xl p-6 md:p-8 shadow-xs border border-[#D4C8B5] space-y-6' },
        
        /* Step 1: HPP Info & Target Margin Input */
        h('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-[#D4C8B5]' },
          
          /* HPP Murni Display */
          h('div', { className: 'p-4 rounded-2xl bg-white border border-[#D4C8B5] space-y-1' },
            h('span', { className: 'text-xs font-extrabold uppercase tracking-wider text-[#6B5541] block' }, 'HPP Murni per Porsi (Modul 1):'),
            h('span', { className: 'text-2xl font-black text-[#241710] font-mono' }, fmtIDR(hppData.hppMurni)),
            h('p', { className: 'text-[11px] text-[#6B5541] font-semibold' }, 'Modal bersih bahan & kemasan murni')
          ),

          /* Target Margin Input */
          h('div', { className: 'p-4 rounded-2xl bg-white border border-[#D4C8B5] space-y-2' },
            h('label', { className: 'text-xs font-extrabold uppercase tracking-wider text-[#241710] block' }, 'Target Margin Keuntungan Toko:'),
            h('div', { className: 'flex items-center gap-3' },
              h('div', { className: 'w-32' },
                h(FlexibleInput, {
                  value: prod.marginPercent,
                  onChange: (v) => onUpdateProduct('marginPercent', v),
                  suffix: '%'
                })
              ),
              h('span', { className: 'text-xs text-[#241710] font-extrabold' },
                `+ ${fmtIDR(hppData.hppMurni * (prod.marginPercent / 100))} laba kotor`
              )
            )
          )

        ),

        /* Step 2: Rekomendasi vs Pembulatan Manual */
        h('div', { className: 'space-y-4' },
          h('div', { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-2' },
            h('span', { className: 'text-xs font-extrabold uppercase tracking-wider text-[#6B5541]' }, 'Rekomendasi Harga Jual Offline:'),
            h('span', { className: 'text-sm font-black text-[#241710] font-mono' },
              `Kalkulasi Presisi: ${fmtIDR(offlineData.recommendedPriceRaw)}`
            )
          ),

          /* Custom Price Box - Sable Brown Card (NO GREEN) */
          h('div', { className: 'p-5 rounded-2xl bg-[#4A3427] text-white shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#241710]' },
            h('div', null,
              h('span', { className: 'text-xs font-extrabold uppercase tracking-wider text-white block' }, 'HARGA JUAL TOKO FIX (OFFLINE):'),
              h('p', { className: 'text-[11px] text-[#EFE9DC] opacity-90 font-semibold' }, 'Dapat dibulatkan manual sesuai nominal manis di toko')
            ),
            h('div', { className: 'w-full sm:w-56 bg-white text-[#241710] rounded-xl p-1.5 shadow-inner' },
              h(FlexibleInput, {
                value: offlineData.effectiveOfflinePrice,
                onChange: (v) => onUpdateProduct('customOfflinePrice', v),
                prefix: 'Rp'
              })
            )
          )
        ),

        /* Step 3: Margin Health & Net Profit Statement */
        h('div', { className: 'p-5 rounded-2xl bg-white border border-[#D4C8B5] space-y-4' },
          h('div', { className: 'flex items-center justify-between' },
            h('span', { className: 'text-xs font-extrabold uppercase tracking-wider text-[#6B5541]' }, 'ANALISIS KEUNTUNGAN BERSIH:'),
            h('span', {
              className: `inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${offlineData.marginStatus.badgeClass}`
            },
              h('span', null, offlineData.marginStatus.icon),
              h('span', null, `Status: ${offlineData.marginStatus.label} (${offlineData.marginRatio.toFixed(1)}%)`)
            )
          ),

          h('div', { className: 'flex items-center justify-between pt-2 border-t border-[#D4C8B5] text-sm font-extrabold text-[#241710]' },
            h('span', null, 'Laba Bersih Offline per Porsi:'),
            h('span', { className: 'font-mono text-base text-[#241710] font-black' }, fmtIDR(offlineData.netOfflineMargin))
          )
        ),

        /* Bottom Action Button - NO BLUE */
        h('div', { className: 'flex justify-end pt-2' },
          h('button', {
            onClick: () => onNavigateTab('online'),
            className: 'btn-primary-brown text-white font-extrabold text-xs px-6 py-3.5 rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer'
          },
            'Lanjut ke Modul 3: Harga Aplikasi Online (Reverse-Margin) ➔'
          )
        )

      )
    );
  };
})();
