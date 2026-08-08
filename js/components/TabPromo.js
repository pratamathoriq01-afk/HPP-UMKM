/* ─────────────────── MODUL 4: PUSAT SIMULASI DISKON & PROMO - SABLE BROWN & SANDCASTLE ─────────────────── */
(function() {
  const h = React.createElement;

  window.TabPromoComponent = function TabPromo({ prod, onUpdateProduct }) {
    const fmtIDR = window.AppMath.formatIDR;
    const calculateHPP = window.AppMath.calculateHPP;
    const calculateOfflinePrice = window.AppMath.calculateOfflinePrice;
    const calculateOfflinePromo = window.AppMath.calculateOfflinePromo;
    const calculateOnlinePrice = window.AppMath.calculateOnlinePrice;
    const calculatePromoSim = window.AppMath.calculatePromoSim;
    const FlexibleInput = window.FlexibleInput;

    const [activeSubTab, setActiveSubTab] = React.useState('online'); // 'online' | 'offline'

    const hppData = calculateHPP(prod);
    const offlineData = calculateOfflinePrice(hppData.hppMurni, prod);
    const offlinePromo = calculateOfflinePromo(offlineData.effectiveOfflinePrice, hppData.hppMurni, prod);
    const onlineData = calculateOnlinePrice(offlineData.effectiveOfflinePrice, prod);
    const promoData = calculatePromoSim(hppData.hppMurni, onlineData.effectiveOnlinePrice, prod);

    return h('div', { className: 'space-y-6 animate-fade-in max-w-4xl mx-auto pb-12' },

      /* Module Banner */
      h('div', { className: 'bg-[#F0E6D2] rounded-3xl p-6 shadow-xs border border-[#D4C8B5] space-y-3' },
        h('div', { className: 'flex items-center justify-between' },
          h('div', { className: 'flex items-center gap-2' },
            h('span', { className: 'text-xs font-extrabold uppercase tracking-wider text-[#241710] bg-[#D4C8B5] px-2.5 py-1 rounded-lg border border-[#BDB6A3]' }, 'Modul 4: Promo Simulator'),
            h('span', { className: 'text-xs text-[#6B5541] font-bold' }, '• Pemisah Input Promo Toko & Online')
          )
        ),
        h('h2', { className: 'text-xl font-black text-[#241710]' }, '🏷️ Pusat Simulasi Diskon & Proteksi Promo'),
        h('p', { className: 'text-xs text-[#6B5541] max-w-xl font-semibold' },
          'Simulasikan promo diskon toko (offline) dan promo aplikasi (online) secara terpisah untuk mendeteksi risiko boncos sebelum promo diaktifkan.'
        ),

        /* Sub-Tab Navigation Bar */
        h('div', { className: 'flex gap-2 pt-2 border-t border-[#D4C8B5]' },
          h('button', {
            onClick: () => setActiveSubTab('online'),
            className: `px-4 py-2.5 rounded-2xl text-xs font-extrabold transition cursor-pointer flex items-center gap-2 border ${
              activeSubTab === 'online'
                ? 'bg-[#4A3427] text-white border-[#241710] shadow-xs'
                : 'bg-[#F7F3E9] text-[#241710] border-[#D4C8B5] hover:bg-[#D4C8B5]'
            }`
          },
            '🛵 Promo Aplikasi Online (Gojek/Grab/Shopee)'
          ),
          h('button', {
            onClick: () => setActiveSubTab('offline'),
            className: `px-4 py-2.5 rounded-2xl text-xs font-extrabold transition cursor-pointer flex items-center gap-2 border ${
              activeSubTab === 'offline'
                ? 'bg-[#4A3427] text-white border-[#241710] shadow-xs'
                : 'bg-[#F7F3E9] text-[#241710] border-[#D4C8B5] hover:bg-[#D4C8B5]'
            }`
          },
            '🏪 Promo Toko Fisik (Offline / Dine-In)'
          )
        )
      ),

      /* ─────────────────── SUB-TAB 1: PROMO APLIKASI ONLINE ─────────────────── */
      activeSubTab === 'online' ? h('div', { className: 'space-y-6' },

        /* ⚙️ Input Form Promo Online */
        h('div', { className: 'bg-[#F0E6D2] rounded-3xl p-6 md:p-8 shadow-xs border border-[#D4C8B5] space-y-6' },
          h('div', { className: 'flex items-center justify-between border-b border-[#D4C8B5] pb-3' },
            h('h3', { className: 'text-sm font-extrabold uppercase tracking-wider text-[#241710]' },
              '⚙️ INPUT SKENARIO PROMO APLIKASI ONLINE'
            ),
            h('div', { className: 'flex items-center gap-2' },
              h('label', { className: 'text-xs font-extrabold text-[#241710]' }, 'Aktifkan Promo App:'),
              h('input', {
                type: 'checkbox',
                checked: !!prod.promoEnabled,
                onChange: (e) => onUpdateProduct('promoEnabled', e.target.checked),
                className: 'w-4 h-4 text-[#4A3427] rounded cursor-pointer'
              })
            )
          ),

          /* 1. Asumsi Pesanan */
          h('div', { className: 'p-4 rounded-2xl bg-white border border-[#D4C8B5] space-y-3' },
            h('span', { className: 'text-xs font-extrabold text-[#241710] block' }, '1. Asumsi Pesanan Pelanggan dalam 1 Struk:'),
            h('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-4 items-center' },
              h('div', { className: 'flex items-center gap-3' },
                h('label', { className: 'text-xs text-[#6B5541] font-bold' }, 'Jumlah Porsi:'),
                h('div', { className: 'w-32' },
                  h(FlexibleInput, {
                    value: prod.simOrderQty || 2,
                    onChange: (v) => onUpdateProduct('simOrderQty', Math.max(1, v)),
                    suffix: 'porsi'
                  })
                )
              ),
              h('div', { className: 'text-right' },
                h('span', { className: 'text-xs text-[#6B5541] font-bold block' }, 'Total Subtotal Awal:'),
                h('span', { className: 'text-lg font-black text-[#241710] font-mono' }, fmtIDR(promoData.orderSubtotal))
              )
            )
          ),

          /* 2. S&K Promo App */
          h('div', { className: 'p-4 rounded-2xl bg-white border border-[#D4C8B5] space-y-3' },
            h('span', { className: 'text-xs font-extrabold text-[#241710] block' }, '2. Syarat & Ketentuan Promo Aplikasi:'),
            h('div', { className: 'grid grid-cols-1 sm:grid-cols-3 gap-3' },
              h('div', null,
                h('label', { className: 'text-[11px] font-extrabold text-[#241710] block mb-1' }, 'Minimal Belanja:'),
                h(FlexibleInput, {
                  value: prod.promoMinOrder,
                  onChange: (v) => onUpdateProduct('promoMinOrder', v),
                  prefix: 'Rp'
                })
              ),
              h('div', null,
                h('label', { className: 'text-[11px] font-extrabold text-[#241710] block mb-1' }, 'Persentase Diskon:'),
                h(FlexibleInput, {
                  value: prod.promoPercent,
                  onChange: (v) => onUpdateProduct('promoPercent', v),
                  suffix: '%'
                })
              ),
              h('div', null,
                h('label', { className: 'text-[11px] font-extrabold text-[#241710] block mb-1' }, 'Maksimal Diskon (Cap):'),
                h(FlexibleInput, {
                  value: prod.promoMaxDiscount,
                  onChange: (v) => onUpdateProduct('promoMaxDiscount', v),
                  prefix: 'Rp'
                })
              )
            )
          ),

          /* 3. Kebijakan Potongan Komisi */
          h('div', { className: 'p-4 rounded-2xl bg-white border border-[#D4C8B5] space-y-2' },
            h('span', { className: 'text-xs font-extrabold text-[#241710] block' }, '3. Kebijakan Potongan Komisi Aplikasi:'),
            h('div', { className: 'flex flex-col sm:flex-row gap-4 text-xs font-bold text-[#241710]' },
              h('label', { className: 'flex items-center gap-2 cursor-pointer' },
                h('input', {
                  type: 'radio',
                  name: 'deductionMode',
                  checked: prod.commissionDeductionMode === 'before_discount',
                  onChange: () => onUpdateProduct('commissionDeductionMode', 'before_discount'),
                  className: 'text-[#4A3427]'
                }),
                h('span', null, '🔘 Potong dari Harga Awal (Sebelum Diskon)')
              ),
              h('label', { className: 'flex items-center gap-2 cursor-pointer' },
                h('input', {
                  type: 'radio',
                  name: 'deductionMode',
                  checked: prod.commissionDeductionMode === 'after_discount',
                  onChange: () => onUpdateProduct('commissionDeductionMode', 'after_discount'),
                  className: 'text-[#4A3427]'
                }),
                h('span', null, '⚪ Potong dari Harga Akhir (Setelah Diskon)')
              )
            )
          )
        ),

        /* 🧾 Simulasi Hasil Transaksi Online */
        h('div', { className: 'bg-[#F0E6D2] rounded-3xl p-6 md:p-8 shadow-xs border border-[#D4C8B5] space-y-6' },
          h('h3', { className: 'text-sm font-extrabold uppercase tracking-wider text-[#241710] border-b border-[#D4C8B5] pb-3' },
            '🧾 SIMULASI HASIL TRANSAKSI ONLINE REAL-TIME'
          ),

          h('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-6' },
            
            /* A. Sisi Konsumen */
            h('div', { className: 'p-5 rounded-2xl bg-white border border-[#D4C8B5] space-y-3 text-xs' },
              h('h4', { className: 'font-extrabold uppercase text-[#241710] border-b border-[#D4C8B5] pb-2' },
                'A. SISI KONSUMEN (YANG DIBAYAR)'
              ),
              h('div', { className: 'space-y-2 text-[#374151] font-semibold' },
                h('div', { className: 'flex justify-between' },
                  h('span', null, `Total Belanja (${promoData.orderQty} porsi):`),
                  h('span', { className: 'font-mono font-black text-[#241710]' }, fmtIDR(promoData.orderSubtotal))
                ),
                h('div', { className: 'flex justify-between' },
                  h('span', null, 'Status Syarat Promo:'),
                  h('span', { className: `font-bold ${promoData.isMinOrderMet ? 'text-[#241710]' : 'text-rose-600'}` },
                    promoData.isMinOrderMet ? '✅ Terpenuhi' : '❌ Min. Belanja Belum Terpenuhi'
                  )
                ),
                h('div', { className: 'flex justify-between text-rose-600 font-extrabold' },
                  h('span', null, `Diskon Diterapkan (${promoData.promoPercent}%):`),
                  h('span', { className: 'font-mono font-bold' }, `- ${fmtIDR(promoData.effectiveDiscount)}`)
                ),
                h('div', { className: 'flex justify-between pt-2 border-t border-[#D4C8B5] font-black text-sm text-[#241710]' },
                  h('span', null, 'Total Dibayar Konsumen:'),
                  h('span', { className: 'font-mono text-[#241710]' }, fmtIDR(promoData.customerPays))
                )
              )
            ),

            /* B. Sisi Penjual */
            h('div', { className: 'p-5 rounded-2xl bg-white border border-[#D4C8B5] space-y-3 text-xs' },
              h('h4', { className: 'font-extrabold uppercase text-[#241710] border-b border-[#D4C8B5] pb-2' },
                'B. SISI PENJUAL (NET PAYOUT)'
              ),
              h('div', { className: 'space-y-2 text-[#374151] font-semibold' },
                h('div', { className: 'flex justify-between' },
                  h('span', null, 'Total Uang dari Konsumen:'),
                  h('span', { className: 'font-mono font-black text-[#241710]' }, fmtIDR(promoData.customerPays))
                ),
                h('div', { className: 'flex justify-between text-rose-600 font-extrabold' },
                  h('span', null, `Potongan Komisi App (${prod.commissionPercent}%):`),
                  h('span', { className: 'font-mono font-bold' }, `- ${fmtIDR(promoData.appCommissionTotal)}`)
                ),
                h('div', { className: 'flex justify-between pt-2 border-t border-[#D4C8B5] font-black text-sm text-[#241710] bg-[#F7F3E9] p-2 rounded-xl' },
                  h('span', null, 'Uang Cair ke Penjual:'),
                  h('span', { className: 'font-mono text-[#241710]' }, fmtIDR(promoData.netPayout))
                )
              )
            )

          )
        ),

        /* 🚨 Analisis Keamanan Margin Online BEP */
        h('div', {
          className: `rounded-3xl p-6 md:p-8 shadow-xs border transition ${
            promoData.isBoncos
              ? 'bg-rose-50 border-rose-300 text-rose-950'
              : 'bg-[#EFE9DC] border-[#D4C8B5] text-[#241710]'
          }`
        },
          h('div', { className: 'flex items-center justify-between border-b border-black/10 pb-4 mb-4' },
            h('div', null,
              h('h3', { className: 'text-base font-black uppercase tracking-wider' }, '🚨 ANALISIS KEAMANAN MARGIN ONLINE (BEP)'),
              h('p', { className: 'text-xs opacity-80 font-bold' }, 'Pencocokan Uang Cair vs Beban HPP Keseluruhan')
            ),
            h('span', {
              className: `text-xs font-black px-4 py-2 rounded-full border shadow-xs ${
                promoData.isBoncos ? 'bg-rose-600 text-white border-rose-700' : 'bg-[#4A3427] text-white border-[#241710]'
              }`
            },
              promoData.isBoncos ? '🔴 BONCOS / RUGI' : '⚫ PROFIT / AMAN'
            )
          ),

          h('div', { className: 'space-y-3 text-xs font-semibold' },
            h('div', { className: 'flex justify-between' },
              h('span', null, '• Uang Cair ke Penjual (Net Payout):'),
              h('span', { className: 'font-mono font-bold' }, fmtIDR(promoData.netPayout))
            ),
            h('div', { className: 'flex justify-between' },
              h('span', null, `• Total Beban HPP (${promoData.orderQty} x ${fmtIDR(hppData.hppMurni)}):`),
              h('span', { className: 'font-mono font-bold text-rose-700' }, `- ${fmtIDR(promoData.totalHPPOrder)}`)
            ),

            h('div', {
              className: `p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border ${
                promoData.isBoncos ? 'bg-rose-100/80 border-rose-300' : 'bg-white border-[#D4C8B5]'
              }`
            },
              h('div', null,
                h('span', { className: 'text-xs font-extrabold uppercase tracking-wider block' }, 'KEUNTUNGAN BERSIH PROMO ONLINE:'),
                h('span', {
                  className: `text-3xl font-black font-mono tracking-tight ${
                    promoData.isBoncos ? 'text-rose-700' : 'text-[#241710]'
                  }`
                },
                  `${promoData.netProfit >= 0 ? '+' : ''}${fmtIDR(promoData.netProfit)}`
                )
              ),
              h('div', { className: 'text-xs text-right max-w-xs leading-relaxed font-bold' },
                promoData.isBoncos
                  ? '🔴 HPP TIDAK TERTUTUP! Kurangi batas maksimal diskon (cap) atau tingkatkan minimal belanja.'
                  : '⚫ HPP murni tertutup sempurna dengan sisa laba bersih aman.'
              )
            )
          )
        )

      ) :

      /* ─────────────────── SUB-TAB 2: PROMO TOKO OFFLINE ─────────────────── */
      h('div', { className: 'space-y-6 animate-fade-in' },

        /* ⚙️ Input Form Promo Toko Offline */
        h('div', { className: 'bg-[#F0E6D2] rounded-3xl p-6 md:p-8 shadow-xs border border-[#D4C8B5] space-y-6' },
          h('div', { className: 'flex items-center justify-between border-b border-[#D4C8B5] pb-3' },
            h('h3', { className: 'text-sm font-extrabold uppercase tracking-wider text-[#241710]' },
              '🏪 INPUT DISKON & PROMO TOKO FISIK (OFFLINE)'
            ),
            h('div', { className: 'flex items-center gap-2' },
              h('label', { className: 'text-xs font-extrabold text-[#241710]' }, 'Aktifkan Diskon Toko:'),
              h('input', {
                type: 'checkbox',
                checked: !!prod.offlinePromoEnabled,
                onChange: (e) => onUpdateProduct('offlinePromoEnabled', e.target.checked),
                className: 'w-4 h-4 text-[#4A3427] rounded cursor-pointer'
              })
            )
          ),

          /* Diskon Form Options */
          h('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-4' },
            
            /* Discount Mode Selector */
            h('div', { className: 'p-4 rounded-2xl bg-white border border-[#D4C8B5] space-y-2' },
              h('label', { className: 'text-xs font-bold text-[#241710] block' }, 'Skema Potongan Diskon Toko:'),
              h('div', { className: 'flex gap-3 text-xs font-bold text-[#241710]' },
                h('label', { className: 'flex items-center gap-1.5 cursor-pointer' },
                  h('input', {
                    type: 'radio',
                    name: 'offlineDiscMode',
                    checked: (prod.offlineDiscountMode || 'percent') === 'percent',
                    onChange: () => onUpdateProduct('offlineDiscountMode', 'percent'),
                    className: 'text-[#4A3427]'
                  }),
                  h('span', null, 'Persentase (%)')
                ),
                h('label', { className: 'flex items-center gap-1.5 cursor-pointer' },
                  h('input', {
                    type: 'radio',
                    name: 'offlineDiscMode',
                    checked: prod.offlineDiscountMode === 'nominal',
                    onChange: () => onUpdateProduct('offlineDiscountMode', 'nominal'),
                    className: 'text-[#4A3427]'
                  }),
                  h('span', null, 'Nominal (Rp)')
                )
              )
            ),

            /* Discount Value Input */
            h('div', { className: 'p-4 rounded-2xl bg-white border border-[#D4C8B5] space-y-2' },
              h('label', { className: 'text-xs font-bold text-[#241710] block' },
                (prod.offlineDiscountMode || 'percent') === 'percent' ? 'Persentase Diskon Toko (%):' : 'Nominal Potongan Diskon (Rp):'
              ),
              (prod.offlineDiscountMode || 'percent') === 'percent' ? h(FlexibleInput, {
                value: prod.offlineDiscountPercent,
                onChange: (v) => onUpdateProduct('offlineDiscountPercent', v),
                suffix: '%'
              }) : h(FlexibleInput, {
                value: prod.offlineDiscountNominal,
                onChange: (v) => onUpdateProduct('offlineDiscountNominal', v),
                prefix: 'Rp'
              })
            )

          )
        ),

        /* 🧾 Hasil Simulasi Diskon Toko */
        h('div', {
          className: `rounded-3xl p-6 md:p-8 shadow-xs border transition ${
            offlinePromo.isLosing
              ? 'bg-rose-50 border-rose-300 text-rose-950'
              : 'bg-[#EFE9DC] border-[#D4C8B5] text-[#241710]'
          }`
        },
          h('div', { className: 'flex items-center justify-between border-b border-black/10 pb-4 mb-4' },
            h('div', null,
              h('h3', { className: 'text-base font-black uppercase tracking-wider' }, '📊 HASIL SIMULASI DISKON TOKO OFFLINE'),
              h('p', { className: 'text-xs opacity-80 font-bold' }, 'Perhitungan harga jual toko setelah diskon & margin bersih')
            ),
            h('span', {
              className: `text-xs font-black px-4 py-2 rounded-full border shadow-xs ${
                offlinePromo.isLosing ? 'bg-rose-600 text-white border-rose-700' : 'bg-[#4A3427] text-white border-[#241710]'
              }`
            },
              offlinePromo.isLosing ? '🔴 DISKON RUGI' : '⚫ MARGIN AMAN'
            )
          ),

          h('div', { className: 'space-y-3 text-xs font-semibold' },
            h('div', { className: 'flex justify-between' },
              h('span', null, '• Harga Toko Dasar (Sebelum Diskon):'),
              h('span', { className: 'font-mono font-bold' }, fmtIDR(offlineData.effectiveOfflinePrice))
            ),
            h('div', { className: 'flex justify-between text-rose-600' },
              h('span', null, `• Potongan Diskon Toko (${offlinePromo.discountPercent.toFixed(0)}%):`),
              h('span', { className: 'font-mono font-bold' }, `- ${fmtIDR(offlinePromo.discountNominal)}`)
            ),
            h('div', { className: 'flex justify-between font-extrabold text-sm pt-2 border-t border-black/10' },
              h('span', null, '• Harga Jual Toko Setelah Diskon:'),
              h('span', { className: 'font-mono text-[#241710]' }, fmtIDR(offlinePromo.priceAfterDiscount))
            ),
            h('div', { className: 'flex justify-between' },
              h('span', null, `• Modal HPP Murni:`),
              h('span', { className: 'font-mono font-bold text-rose-700' }, `- ${fmtIDR(hppData.hppMurni)}`)
            ),

            h('div', {
              className: `p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border ${
                offlinePromo.isLosing ? 'bg-rose-100/80 border-rose-300' : 'bg-white border-[#D4C8B5]'
              }`
            },
              h('div', null,
                h('span', { className: 'text-xs font-extrabold uppercase tracking-wider block' }, 'LABA BERSIH DISKON TOKO PER PORSI:'),
                h('span', {
                  className: `text-3xl font-black font-mono tracking-tight ${
                    offlinePromo.isLosing ? 'text-rose-700' : 'text-[#241710]'
                  }`
                },
                  `${offlinePromo.netMarginAfterDiscount >= 0 ? '+' : ''}${fmtIDR(offlinePromo.netMarginAfterDiscount)}`
                )
              ),
              h('div', { className: 'text-xs text-right max-w-xs leading-relaxed font-bold' },
                offlinePromo.isLosing
                  ? '🔴 POTONGAN DISKON MERUGIKAN HPP! Turunkan persentase diskon toko.'
                  : '⚫ Diskon toko aman dan memberikan sisa keuntungan bersih.'
              )
            )
          )
        )

      )

    );
  };
})();
