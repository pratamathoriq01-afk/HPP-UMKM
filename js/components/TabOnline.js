/* ─────────────────── MODUL 3: HARGA APLIKASI ONLINE (REVERSE-MARGIN) - SABLE BROWN & SANDCASTLE ─────────────────── */
(function() {
  const h = React.createElement;

  window.TabOnlineComponent = function TabOnline({ prod, onUpdateProduct, onNavigateTab }) {
    const fmtIDR = window.AppMath.formatIDR;
    const calculateHPP = window.AppMath.calculateHPP;
    const calculateOfflinePrice = window.AppMath.calculateOfflinePrice;
    const calculateOnlinePrice = window.AppMath.calculateOnlinePrice;
    const FlexibleInput = window.FlexibleInput;

    const hppData = calculateHPP(prod);
    const offlineData = calculateOfflinePrice(hppData.hppMurni, prod);
    const onlineData = calculateOnlinePrice(offlineData.effectiveOfflinePrice, prod);

    return h('div', { className: 'space-y-6 animate-fade-in max-w-4xl mx-auto pb-12' },

      /* Module Banner */
      h('div', { className: 'bg-[#F0E6D2] rounded-3xl p-6 shadow-xs border border-[#D4C8B5] space-y-2' },
        h('div', { className: 'flex items-center gap-2' },
          h('span', { className: 'text-xs font-extrabold uppercase tracking-wider text-[#241710] bg-[#D4C8B5] px-2.5 py-1 rounded-lg border border-[#BDB6A3]' }, 'Modul 3: Reverse-Margin Online'),
          h('span', { className: 'text-xs text-[#6B5541] font-bold' }, '• GoFood / GrabFood / ShopeeFood')
        ),
        h('h2', { className: 'text-xl font-black text-[#241710]' }, '🛵 Harga Aplikasi Online (Reverse-Margin)'),
        h('p', { className: 'text-xs text-[#6B5541] max-w-xl font-semibold' },
          'Hitung harga markup otomatis agar pendapatan bersih yang cair ke kantong Anda tetap sama persis dengan harga toko offline meski dipotong komisi.'
        )
      ),

      /* Calculation Card */
      h('div', { className: 'bg-[#F0E6D2] rounded-3xl p-6 md:p-8 shadow-xs border border-[#D4C8B5] space-y-6' },
        
        /* Inputs & Platform Settings */
        h('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 border-b border-[#D4C8B5]' },
          
          /* Target Payout Base (Harga Offline) */
          h('div', { className: 'p-4 rounded-2xl bg-white border border-[#D4C8B5] space-y-1' },
            h('span', { className: 'text-[11px] font-extrabold uppercase tracking-wider text-[#6B5541] block' }, 'Target Cair Bersih (Offline):'),
            h('span', { className: 'text-xl font-black text-[#241710] font-mono block' }, fmtIDR(offlineData.effectiveOfflinePrice)),
            h('span', { className: 'text-[10px] text-[#6B5541] font-semibold' }, 'Dari Modul 2')
          ),

          /* Commission % Input */
          h('div', { className: 'p-4 rounded-2xl bg-white border border-[#D4C8B5] space-y-1' },
            h('label', { className: 'text-[11px] font-extrabold uppercase tracking-wider text-[#241710] block' }, 'Komisi Platform App:'),
            h('div', { className: 'w-full' },
              h(FlexibleInput, {
                value: prod.commissionPercent,
                onChange: (v) => onUpdateProduct('commissionPercent', v),
                suffix: '%'
              })
            ),
            h('span', { className: 'text-[10px] text-[#6B5541] font-semibold' }, 'Standar Grab/Gojek/Shopee ~20%')
          ),

          /* Fixed Fee Input */
          h('div', { className: 'p-4 rounded-2xl bg-white border border-[#D4C8B5] space-y-1' },
            h('label', { className: 'text-[11px] font-extrabold uppercase tracking-wider text-[#241710] block' }, 'Biaya Layanan Tetap:'),
            h('div', { className: 'w-full' },
              h(FlexibleInput, {
                value: prod.fixedFee,
                onChange: (v) => onUpdateProduct('fixedFee', v),
                prefix: 'Rp'
              })
            ),
            h('span', { className: 'text-[10px] text-[#6B5541] font-semibold' }, 'Biaya per transaksi (misal: Rp 1.000)')
          )

        ),

        /* Recommended Online Price Box */
        h('div', { className: 'space-y-3' },
          h('div', { className: 'flex items-center justify-between' },
            h('span', { className: 'text-xs font-extrabold uppercase tracking-wider text-[#6B5541]' }, 'Formula Reverse-Margin:'),
            h('span', { className: 'text-xs text-[#6B5541] font-mono font-bold' }, '(Harga Offline + Biaya Tetap) / (1 - Komisi)')
          ),

          /* Sable Brown Header Card - NO BLUE, NO GREEN */
          h('div', { className: 'p-6 rounded-3xl bg-[#4A3427] text-white shadow-xs space-y-3 border border-[#241710]' },
            h('div', { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4' },
              h('div', null,
                h('span', { className: 'text-xs font-extrabold uppercase tracking-wider text-white block' }, 'REKOMENDASI HARGA JUAL ONLINE:'),
                h('span', { className: 'text-3xl font-black text-white font-mono tracking-tight block mt-0.5' },
                  fmtIDR(onlineData.effectiveOnlinePrice)
                )
              ),
              h('div', { className: 'w-full sm:w-56 bg-white text-[#241710] rounded-xl p-1.5 shadow-inner' },
                h('label', { className: 'text-[10px] text-[#6B5541] font-bold uppercase block px-2' }, 'Override Manual Harga Online:'),
                h(FlexibleInput, {
                  value: onlineData.effectiveOnlinePrice,
                  onChange: (v) => onUpdateProduct('customOnlinePrice', v),
                  prefix: 'Rp'
                })
              )
            )
          )
        ),

        /* Simulation Proof Box */
        h('div', { className: 'p-5 rounded-2xl bg-white border border-[#D4C8B5] space-y-3 text-xs' },
          h('span', { className: 'font-extrabold uppercase tracking-wider text-[#241710] block border-b border-[#D4C8B5] pb-2' },
            '🧾 SIMULASI PENCAIRAN BERSIH (NET PAYOUT TOKO):'
          ),
          h('div', { className: 'space-y-1.5 text-[#374151] font-semibold' },
            h('div', { className: 'flex justify-between' },
              h('span', null, '• Harga Terdaftar di Aplikasi:'),
              h('span', { className: 'font-mono font-black text-[#241710]' }, fmtIDR(onlineData.effectiveOnlinePrice))
            ),
            h('div', { className: 'flex justify-between text-rose-600 font-extrabold' },
              h('span', null, `• Potongan Komisi (${prod.commissionPercent}%):`),
              h('span', { className: 'font-mono font-bold' }, `- ${fmtIDR(onlineData.commissionAmount)}`)
            ),
            h('div', { className: 'flex justify-between text-rose-600 font-extrabold' },
              h('span', null, '• Potongan Biaya Layanan Tetap:'),
              h('span', { className: 'font-mono font-bold' }, `- ${fmtIDR(prod.fixedFee)}`)
            ),
            h('div', { className: 'flex justify-between pt-2 border-t border-[#D4C8B5] text-sm font-black text-[#241710] bg-[#F7F3E9] p-2.5 rounded-xl' },
              h('span', null, '✅ Uang Cair Bersih ke Penjual:'),
              h('span', { className: 'font-mono' },
                `${fmtIDR(onlineData.simulatedPayout)} (Sama persis dengan toko offline!)`
              )
            )
          )
        ),

        /* Bottom Action Button - NO BLUE */
        h('div', { className: 'flex justify-end pt-2' },
          h('button', {
            onClick: () => onNavigateTab('promo'),
            className: 'btn-primary-brown text-white font-extrabold text-xs px-6 py-3.5 rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer'
          },
            'Lanjut ke Modul 4: Pusat Simulasi Diskon & Promo ➔'
          )
        )

      )
    );
  };
})();
