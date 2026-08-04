/* ─────────────────── TAB 2: HARGA JUAL OFFLINE & MARGIN ─────────────────── */
(function() {
  const h = React.createElement;

  window.TabOfflineComponent = function TabOffline({ prod, onUpdateProduct }) {
    const fmtIDR = window.AppMath.formatIDR;
    const calculateHPP = window.AppMath.calculateHPP;
    const calculateBaseSellingPrice = window.AppMath.calculateBaseSellingPrice;
    const FlexibleInput = window.FlexibleInput;

    const { hppPerUnit } = calculateHPP(prod);
    const basePriceData = calculateBaseSellingPrice(hppPerUnit, prod);

    return h('div', { className: 'space-y-6 animate-fade-in max-w-4xl mx-auto' },
      /* Top Banner Info */
      h('div', { className: 'bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center justify-between' },
        h('div', null,
          h('h2', { className: 'text-base font-black text-amber-950' }, 'Modul 2: Penentuan Harga Jual Offline & Margin'),
          h('p', { className: 'text-xs text-amber-900 mt-0.5 leading-relaxed' },
            'Menentukan harga jual toko (offline/beli langsung) berdasarkan HPP dasar dan target margin keuntungan yang diinginkan.'
          )
        ),

        /* Mode Toggle % / Rp */
        h('div', { className: 'flex bg-white p-1 rounded-xl border border-amber-200 shadow-sm' },
          ['percent', 'nominal'].map(m =>
            h('button', {
              key: m,
              onClick: () => onUpdateProduct('marginMode', m),
              className: `px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                prod.marginMode === m
                  ? 'bg-amber-950 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`
            }, m === 'percent' ? 'Persen (%)' : 'Rupiah (Rp)')
          )
        )
      ),

      /* Target Margin Input Box */
      h('div', { className: 'app-card p-6' },
        h('div', { className: 'flex justify-between items-center mb-3' },
          h('label', { className: 'text-xs font-extrabold uppercase tracking-wider text-slate-600' }, 'Target Keuntungan (Margin)'),
          h('span', { className: 'text-base font-black text-purple-700' },
            prod.marginMode === 'percent'
              ? `${prod.marginPercent || 0}%`
              : fmtIDR(prod.marginNominal)
          )
        ),

        prod.marginMode === 'percent'
          ? h('div', { className: 'space-y-2' },
              h('input', {
                type: 'range',
                min: '5',
                max: '200',
                step: '5',
                value: prod.marginPercent || 0,
                onChange: (e) => onUpdateProduct('marginPercent', parseInt(e.target.value, 10)),
                className: 'w-full purple'
              }),
              h('div', { className: 'flex justify-between text-[10px] text-slate-400 font-bold' },
                ['5%', '50%', '100%', '150%', '200%'].map(l => h('span', { key: l }, l))
              )
            )
          : h(FlexibleInput, {
              value: prod.marginNominal,
              onChange: (v) => onUpdateProduct('marginNominal', v),
              prefix: 'Rp'
            })
      ),

      /* Detail Breakdown Ledger Table */
      h('div', { className: 'app-card p-6 space-y-4' },
        h('h3', { className: 'text-xs font-extrabold uppercase tracking-widest text-slate-500 border-b border-slate-100 pb-2' },
          'Detail Penghitungan Harga Offline Dasar'
        ),

        h('div', { className: 'space-y-2 text-xs font-semibold text-slate-700' },
          h('div', { className: 'flex justify-between' },
            h('span', null, 'Harga Pokok Produksi (HPP):'),
            h('span', { className: 'font-extrabold text-slate-900' }, fmtIDR(hppPerUnit))
          ),

          h('div', { className: 'flex justify-between text-purple-700' },
            h('span', null, `Target Margin Keuntungan (${basePriceData.marginPercent.toFixed(0)}%):`),
            h('span', { className: 'font-extrabold' }, `+${fmtIDR(basePriceData.marginNominal)}`)
          ),

          h('div', { className: 'flex justify-between pt-3 border-t-2 border-slate-200 text-base font-black text-slate-900' },
            h('span', null, 'Harga Jual Dasar (Offline):'),
            h('span', { className: 'text-purple-800 font-black' }, fmtIDR(basePriceData.basePrice))
          )
        ),

        /* Visual Bar Chart Breakdown */
        h('div', { className: 'pt-4 border-t border-slate-100' },
          h('p', { className: 'text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2' },
            'Proporsi Komposisi Harga Offline'
          ),
          h('div', { className: 'h-5 rounded-full overflow-hidden flex bg-slate-100 border border-slate-200' },
            h('div', {
              className: 'bg-purple-600 flex items-center justify-center text-[9px] font-black text-white transition-all duration-500',
              style: { width: `${basePriceData.hppRatio}%` }
            }, basePriceData.hppRatio > 20 ? 'HPP' : ''),
            h('div', {
              className: 'bg-pink-500 flex items-center justify-center text-[9px] font-black text-white transition-all duration-500',
              style: { width: `${basePriceData.marginRatio}%` }
            }, basePriceData.marginRatio > 20 ? 'Margin' : '')
          ),

          h('div', { className: 'flex justify-between text-[11px] font-bold text-slate-600 mt-2' },
            h('span', { className: 'flex items-center gap-1.5' },
              h('span', { className: 'w-3 h-3 rounded bg-purple-600' }),
              ` HPP: ${basePriceData.hppRatio.toFixed(0)}% (${fmtIDR(hppPerUnit)})`
            ),
            h('span', { className: 'flex items-center gap-1.5' },
              h('span', { className: 'w-3 h-3 rounded bg-pink-500' }),
              ` Untung: ${basePriceData.marginRatio.toFixed(0)}% (${fmtIDR(basePriceData.marginNominal)})`
            )
          )
        )
      )
    );
  };
})();
