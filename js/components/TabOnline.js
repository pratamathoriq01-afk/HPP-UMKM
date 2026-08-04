/* ─────────────────── TAB 3: HARGA APLIKASI ONLINE (REVERSE MARGIN) ─────────────────── */
(function() {
  const h = React.createElement;

  window.TabOnlineComponent = function TabOnline({ prod, onUpdateProduct }) {
    const fmtIDR = window.AppMath.formatIDR;
    const calculateHPP = window.AppMath.calculateHPP;
    const calculateBaseSellingPrice = window.AppMath.calculateBaseSellingPrice;
    const calculateAppSellingPrice = window.AppMath.calculateAppSellingPrice;
    const FlexibleInput = window.FlexibleInput;

    const { hppPerUnit } = calculateHPP(prod);
    const { basePrice } = calculateBaseSellingPrice(hppPerUnit, prod);
    const { appPrice, commFrac, fixedFee } = calculateAppSellingPrice(basePrice, prod);

    const commissionAmount = appPrice * commFrac;
    const netPayout = Math.max(0, appPrice - commissionAmount - fixedFee);

    return h('div', { className: 'space-y-6 animate-fade-in max-w-4xl mx-auto' },
      /* Top Banner Info */
      h('div', { className: 'bg-pink-50 border border-pink-200 rounded-2xl p-5 flex items-center justify-between' },
        h('div', null,
          h('h2', { className: 'text-base font-black text-pink-950' }, 'Modul 3: Harga Aplikasi Online (Reverse-Margin)'),
          h('p', { className: 'text-xs text-pink-900 mt-0.5 leading-relaxed' },
            'Menghitung harga pendaftaran produk di GoFood/GrabFood/ShopeeFood agar setelah dipotong komisi, ',
            h('strong', null, 'pendapatan bersih tetap utuh sama persis dengan harga jual offline'),
            '.'
          )
        )
      ),

      /* Online App Platform Settings Inputs */
      h('div', { className: 'app-card p-6 grid grid-cols-1 md:grid-cols-2 gap-4' },
        h('div', null,
          h('label', { className: 'text-xs font-extrabold uppercase tracking-wider text-slate-600 block mb-1' }, 'Komisi Platform (%)'),
          h('div', { className: 'relative' },
            h(FlexibleInput, {
              value: prod.commissionPercent,
              onChange: (v) => onUpdateProduct('commissionPercent', Math.min(99, Math.max(0, v))),
              suffix: '%'
            })
          ),
          h('p', { className: 'text-[10px] text-slate-400 mt-1' }, 'Potongan komisi platform (misal: 20%).')
        ),

        h('div', null,
          h('label', { className: 'text-xs font-extrabold uppercase tracking-wider text-slate-600 block mb-1' }, 'Biaya Tetap Aplikasi (Rp)'),
          h('div', { className: 'relative' },
            h(FlexibleInput, {
              value: prod.fixedFee,
              onChange: (v) => onUpdateProduct('fixedFee', Math.max(0, v)),
              prefix: 'Rp'
            })
          ),
          h('p', { className: 'text-[10px] text-slate-400 mt-1' }, 'Biaya tambahan bernilai tetap per transaksi.')
        )
      ),

      /* Reverse Margin Detailed Explanation Box */
      h('div', { className: 'app-card p-6 space-y-4' },
        h('h3', { className: 'text-xs font-extrabold uppercase tracking-widest text-slate-500 border-b border-slate-100 pb-2' },
          'Detail Formula & Kalkulasi Reverse-Margin'
        ),

        h('div', { className: 'bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2.5' },
          h('p', { className: 'text-[10px] font-extrabold text-slate-500 uppercase tracking-wider' }, 'Metode Presisi:'),
          h('div', { className: 'font-mono bg-white border border-slate-200 p-2 rounded-lg text-center font-extrabold text-slate-800' },
            'Harga Aplikasi = (Harga Offline + Biaya Tetap) ÷ (1 − Komisi %)'
          ),

          h('div', { className: 'space-y-1.5 pt-2 border-t border-slate-200 text-slate-700 font-semibold' },
            h('div', { className: 'flex justify-between' },
              h('span', null, 'Harga Offline Dasar:'),
              h('span', { className: 'font-extrabold text-slate-900' }, fmtIDR(basePrice))
            ),
            h('div', { className: 'flex justify-between' },
              h('span', null, 'Biaya Layanan Tetap:'),
              h('span', { className: 'font-extrabold text-slate-900' }, `+${fmtIDR(fixedFee)}`)
            ),
            h('div', { className: 'flex justify-between' },
              h('span', null, `Faktor Pembagi Komisi (${prod.commissionPercent}%):`),
              h('span', { className: 'font-extrabold text-slate-900' }, `÷ ${(1 - commFrac).toFixed(2)}`)
            ),
            h('div', { className: 'flex justify-between pt-2 border-t border-dashed border-slate-200 text-base font-black text-pink-700' },
              h('span', null, 'Harga Terdaftar di Aplikasi Online:'),
              h('span', null, fmtIDR(appPrice))
            )
          )
        ),

        /* Step-by-step Payout Proof */
        h('div', { className: 'bg-pink-50/60 border border-pink-200 rounded-xl p-4 text-xs space-y-2' },
          h('p', { className: 'text-[10px] font-extrabold text-pink-800 uppercase tracking-wider' },
            'Pembuktian Arus Payout Bersih UMKM'
          ),
          h('div', { className: 'flex justify-between text-slate-700 font-medium' },
            h('span', null, 'Harga Terdaftar di Aplikasi:'),
            h('span', null, fmtIDR(appPrice))
          ),
          h('div', { className: 'flex justify-between text-rose-600 font-semibold' },
            h('span', null, `Potongan Komisi Platform (${prod.commissionPercent}%):`),
            h('span', null, `−${fmtIDR(commissionAmount)}`)
          ),
          h('div', { className: 'flex justify-between text-rose-600 font-semibold' },
            h('span', null, 'Potongan Biaya Tetap:'),
            h('span', null, `−${fmtIDR(fixedFee)}`)
          ),
          h('div', { className: 'flex justify-between pt-2 border-t border-pink-200 font-black text-purple-750 text-sm' },
            h('span', null, 'Pendapatan Bersih (Net Payout):'),
            h('span', null, fmtIDR(netPayout))
          ),
          h('p', { className: 'text-[10px] text-slate-500 italic mt-1' },
            `✓ Diterima bersih ${fmtIDR(netPayout)} (sama persis dengan harga jual offline, margin modal aman 100%!).`
          )
        ),

        /* Side-by-side comparison */
        h('div', { className: 'grid grid-cols-2 gap-4 pt-2' },
          h('div', { className: 'app-card p-4 text-center border-2 border-slate-200' },
            h('span', { className: 'text-[10px] font-extrabold uppercase tracking-wider text-slate-400' }, 'Harga Offline'),
            h('span', { className: 'text-xl font-black text-slate-900 block mt-1' }, fmtIDR(basePrice)),
            h('span', { className: 'text-[10px] text-slate-400 font-semibold block mt-1' }, 'Beli Langsung di Toko')
          ),

          h('div', { className: 'app-card p-4 text-center border-2 border-pink-200 bg-pink-50/20' },
            h('span', { className: 'text-[10px] font-extrabold uppercase tracking-wider text-pink-700' }, 'Harga Aplikasi Online'),
            h('span', { className: 'text-xl font-black text-pink-700 block mt-1' }, fmtIDR(appPrice)),
            h('span', { className: 'text-[10px] text-pink-650 font-semibold block mt-1' }, 'Termasuk Markup Komisi')
          )
        )
      )
    );
  };
})();
