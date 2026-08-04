/* ─────────────────── TAB 4: PUSAT SIMULASI PROMO & DISKON (OFFLINE & ONLINE) ─────────────────── */
(function() {
  const h = React.createElement;

  window.TabPromoComponent = function TabPromo({ prod, onUpdateProduct }) {
    const fmtIDR = window.AppMath.formatIDR;
    const calculateHPP = window.AppMath.calculateHPP;
    const calculateBaseSellingPrice = window.AppMath.calculateBaseSellingPrice;
    const calculateOfflineDiscount = window.AppMath.calculateOfflineDiscount;
    const calculateAppSellingPrice = window.AppMath.calculateAppSellingPrice;
    const calculateOnlinePromo = window.AppMath.calculateOnlinePromo;
    const FlexibleInput = window.FlexibleInput;

    const { hppPerUnit } = calculateHPP(prod);
    const { basePrice } = calculateBaseSellingPrice(hppPerUnit, prod);
    const offlineDiscData = calculateOfflineDiscount(basePrice, hppPerUnit, prod);

    const { appPrice } = calculateAppSellingPrice(basePrice, prod);
    const onlinePromoData = calculateOnlinePromo(appPrice, hppPerUnit, prod);

    return h('div', { className: 'space-y-6 animate-fade-in max-w-5xl mx-auto' },
      /* Top Banner Info */
      h('div', { className: 'bg-purple-50 border border-purple-200 rounded-2xl p-5 flex items-center justify-between' },
        h('div', null,
          h('h2', { className: 'text-base font-black text-purple-950' }, 'Modul 4: Pusat Simulasi Diskon & Promo (Offline & Online)'),
          h('p', { className: 'text-xs text-purple-700 mt-0.5 leading-relaxed' },
            'Pusat simulasi strategi diskon toko offline dan promo aplikasi online dengan pengaman otomatis (Safety Net / BEP).'
          )
        )
      ),

      /* ─────────────────── SUB-SECTION A: SIMULASI DISKON TOKO OFFLINE ─────────────────── */
      h('div', { className: 'app-card p-6 border-2 border-amber-200 bg-amber-50/5' },
        h('div', { className: 'flex items-center justify-between mb-4 border-b border-amber-100 pb-3' },
          h('div', { className: 'flex items-center gap-2.5' },
            h('span', { className: 'w-7 h-7 rounded-lg bg-amber-100 text-amber-950 flex items-center justify-center font-extrabold text-xs' }, 'A'),
            h('h3', { className: 'text-sm font-extrabold text-slate-800' }, '1. Simulasi Diskon Toko (Offline)')
          ),

          /* Toggle % / Rp */
          h('div', { className: 'flex bg-white p-0.5 rounded-lg border border-amber-200 text-xs' },
            ['percent', 'nominal'].map(m =>
              h('button', {
                key: m,
                onClick: () => onUpdateProduct('offlineDiscountMode', m),
                className: `px-3 py-1 font-bold rounded-md transition cursor-pointer ${
                  prod.offlineDiscountMode === m
                    ? 'bg-amber-950 text-white shadow-sm border border-amber-950'
                    : 'text-slate-500'
                }`
              }, m === 'percent' ? '% Diskon' : 'Rp Diskon')
            )
          )
        ),

        h('div', { className: 'space-y-4' },
          h('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
            h('div', null,
              h('label', { className: 'text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1' },
                prod.offlineDiscountMode === 'percent' ? 'Besar Diskon Toko (%)' : 'Potongan Diskon Toko (Rp)'
              ),
              prod.offlineDiscountMode === 'percent'
                ? h('div', { className: 'space-y-1' },
                    h('input', {
                      type: 'range',
                      min: '0',
                      max: '50',
                      step: '5',
                      value: prod.offlineDiscountPercent || 0,
                      onChange: (e) => onUpdateProduct('offlineDiscountPercent', parseInt(e.target.value, 10)),
                      className: 'w-full purple'
                    }),
                    h('div', { className: 'flex justify-between text-[9px] text-slate-400 font-bold' },
                      ['0%', '10%', '20%', '30%', '40%', '50%'].map(l => h('span', { key: l }, l))
                    )
                  )
                : h(FlexibleInput, {
                    value: prod.offlineDiscountNominal,
                    onChange: (v) => onUpdateProduct('offlineDiscountNominal', v),
                    prefix: 'Rp'
                  })
            ),

            h('div', { className: 'bg-amber-50/10 p-4 rounded-xl border border-amber-200 text-xs space-y-2' },
              h('div', { className: 'flex justify-between text-slate-600 font-medium' },
                h('span', null, 'Harga Offline Awal:'),
                h('span', { className: 'font-bold text-slate-900' }, fmtIDR(basePrice))
              ),
              h('div', { className: 'flex justify-between text-pink-600 font-semibold' },
                h('span', null, 'Potongan Diskon Toko:'),
                h('span', null, `−${fmtIDR(offlineDiscData.discountNominal)}`)
              ),
              h('div', { className: 'flex justify-between pt-2 border-t border-amber-200 text-sm font-extrabold text-slate-800' },
                h('span', null, 'Harga Akhir Offline (Dibayar Konsumen):'),
                h('span', { className: 'text-purple-800 font-black' }, fmtIDR(offlineDiscData.finalOfflinePrice))
              ),
              h('div', { className: 'flex justify-between pt-1 font-bold' },
                h('span', null, 'Sisa Margin Bersih Offline:'),
                h('span', { className: offlineDiscData.isOfflineLosing ? 'text-pink-650 font-extrabold animate-pulse' : 'text-purple-800 font-extrabold' },
                  fmtIDR(offlineDiscData.netOfflineMargin)
                )
              )
            )
          ),

          offlineDiscData.isOfflineLosing && h('div', { className: 'bg-pink-50 border border-pink-200 text-pink-850 p-3 rounded-xl text-xs font-semibold flex items-center gap-2' },
            h('span', null, '⚠️'),
            h('span', null, `Peringatan: Diskon toko offline melampaui margin keuntungan. Anda merugi ${fmtIDR(Math.abs(offlineDiscData.netOfflineMargin))} per unit!`)
          )
        )
      ),

      /* ─────────────────── SUB-SECTION B: SIMULASI PROMO APLIKASI ONLINE ─────────────────── */
      h('div', {
        className: `app-card p-6 border-2 transition-all duration-300 ${
          onlinePromoData.isOnlineLosing && onlinePromoData.isPromoValid ? 'warning-alert-pulse bg-white animate-pulse' : 'border-pink-200'
        }`
      },
        h('div', { className: 'flex items-center justify-between mb-4 border-b border-pink-100 pb-3' },
          h('div', { className: 'flex items-center gap-2.5' },
            h('span', { className: 'w-7 h-7 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center font-extrabold text-xs' }, 'B'),
            h('h3', { className: 'text-sm font-extrabold text-slate-800' }, '2. Simulasi Promo Kampanye Aplikasi Online')
          ),

          h('label', { className: 'flex items-center gap-2 cursor-pointer select-none' },
            h('input', {
              type: 'checkbox',
              checked: prod.promoEnabled || false,
              onChange: (e) => onUpdateProduct('promoEnabled', e.target.checked),
              className: 'w-4 h-4 text-pink-600 rounded focus:ring-pink-500 cursor-pointer shadow-sm'
            }),
            h('span', { className: 'text-xs font-bold text-slate-700' }, 'Aktifkan Promo Online')
          )
        ),

        h('div', { className: `space-y-4 transition-opacity duration-300 ${prod.promoEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}` },
          /* Inputs Grid */
          h('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-4' },
            h('div', null,
              h('label', { className: 'block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1' }, 'Syarat Minimal Order (Rp)'),
              h(FlexibleInput, {
                value: prod.promoMinOrder,
                onChange: (v) => onUpdateProduct('promoMinOrder', Math.max(0, v)),
                prefix: 'Rp'
              })
            ),

            h('div', null,
              h('label', { className: 'block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1' }, 'Besar Diskon Promo (%)'),
              h('div', { className: 'space-y-1' },
                h('input', {
                  type: 'range',
                  min: '0',
                  max: '70',
                  step: '5',
                  value: prod.promoPercent || 0,
                  onChange: (e) => onUpdateProduct('promoPercent', parseInt(e.target.value, 10)),
                  className: 'w-full rose'
                }),
                h('div', { className: 'flex justify-between text-[9px] text-slate-400 font-bold' },
                  ['0%', '25%', '50%', '70%'].map(l => h('span', { key: l }, l))
                )
              )
            ),

            h('div', null,
              h('label', { className: 'block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1' }, 'Batas Maksimal Diskon Cap (Rp)'),
              h(FlexibleInput, {
                value: prod.promoMaxDiscount,
                onChange: (v) => onUpdateProduct('promoMaxDiscount', Math.max(0, v)),
                prefix: 'Rp'
              })
            )
          ),

          /* Promo Validity Status */
          prod.promoEnabled && h('div', {
            className: `p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
              onlinePromoData.isPromoValid 
                ? 'bg-pink-50 border-pink-200 text-pink-900' 
                : 'bg-slate-100 border-slate-200 text-slate-500'
            }`
          },
            h('span', null, '🏷️'),
            onlinePromoData.isPromoValid
              ? h('span', null,
                  'Promo Berhasil Diaplikasikan! Diskon Efektif: ',
                  h('strong', null, fmtIDR(onlinePromoData.effectiveDiscount)),
                  onlinePromoData.effectiveDiscount < onlinePromoData.rawDiscount && h('span', { className: 'ml-1 text-slate-500' }, `(Dibatasi oleh Cap Maksimal ${fmtIDR(prod.promoMaxDiscount)})`)
                )
              : h('span', null, `Promo Belum Aktif: Harga Terdaftar di Aplikasi (${fmtIDR(appPrice)}) belum memenuhi Syarat Minimal Order (${fmtIDR(prod.promoMinOrder)}).`)
          ),

          /* Warning Red Alert if Margin is negative */
          onlinePromoData.isOnlineLosing && onlinePromoData.isPromoValid && h('div', { className: 'bg-pink-50 border-2 border-pink-300 text-pink-950 p-4 rounded-xl text-xs font-semibold flex items-start gap-3 shadow-md' },
            h('span', { className: 'text-xl' }, '🚨'),
            h('div', null,
              h('p', { className: 'font-extrabold text-sm text-pink-700' }, 'Peringatan Darurat: Margin Promo Merugi!'),
              h('p', { className: 'text-pink-650 leading-relaxed mt-0.5' },
                'Besarnya diskon & komisi platform membuat modal pokok terpotong. UMKM merugi sebesar ',
                h('strong', null, fmtIDR(Math.abs(onlinePromoData.netMarginOnline))),
                ' per unit!'
              )
            )
          ),

          /* Online Promo Financial Summary Table */
          h('div', { className: 'bg-pink-50/10 p-4 rounded-xl border border-pink-200 text-xs space-y-2' },
            h('p', { className: 'text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2' }, 'Simulasi Keuangan Promo Online'),
            h('div', { className: 'flex justify-between text-slate-600' },
              h('span', null, 'Harga Aplikasi Terdaftar:'),
              h('span', { className: 'font-bold text-slate-900' }, fmtIDR(appPrice))
            ),
            h('div', { className: 'flex justify-between text-pink-600 font-semibold' },
              h('span', null, 'Diskon Kampanye ke Konsumen:'),
              h('span', null, `−${fmtIDR(onlinePromoData.isPromoValid ? onlinePromoData.effectiveDiscount : 0)}`)
            ),
            h('div', { className: 'flex justify-between text-slate-700 font-semibold' },
              h('span', null, 'Pembayaran Konsumen di Aplikasi:'),
              h('span', null, fmtIDR(onlinePromoData.finalCustomerPays))
            ),
            h('div', { className: 'flex justify-between text-pink-600 font-semibold' },
              h('span', null, `Potongan Komisi (${prod.commissionPercent}%) & Biaya Tetap:`),
              h('span', null, `−${fmtIDR(onlinePromoData.appCommissionAmount)}`)
            ),
            h('div', { className: 'flex justify-between pt-2 border-t border-pink-200 text-sm font-extrabold' },
              h('span', null, 'Margin Bersih Online (Setelah Promo):'),
              h('span', { className: onlinePromoData.isOnlineLosing && onlinePromoData.isPromoValid ? 'text-pink-650 font-black' : 'text-purple-800 font-black' },
                fmtIDR(onlinePromoData.netMarginOnline)
              )
            )
          ),

          /* Safety Net / BEP Calculator */
          h('div', { className: 'bg-pink-50/60 border border-pink-200 p-4 rounded-xl text-xs space-y-2' },
            h('p', { className: 'text-[10px] font-extrabold text-pink-850 uppercase tracking-wider flex items-center gap-1' },
              '🛡️ Batas Maksimal Diskon Aman (BEP / Break-even Point)'
            ),
            h('div', { className: 'grid grid-cols-2 gap-3 pt-1' },
              h('div', { className: 'bg-white border border-pink-200 p-3 rounded-lg text-center shadow-sm' },
                h('span', { className: 'text-[9px] font-bold text-slate-400 uppercase block' }, 'Maksimal Diskon %'),
                h('span', { className: 'text-lg font-black text-pink-700 mt-0.5 block' }, `${onlinePromoData.bepDiscountPercent.toFixed(1)}%`)
              ),
              h('div', { className: 'bg-white border border-pink-200 p-3 rounded-lg text-center shadow-sm' },
                h('span', { className: 'text-[9px] font-bold text-slate-400 uppercase block' }, 'Maksimal Potongan Rp'),
                h('span', { className: 'text-lg font-black text-pink-700 mt-0.5 block' }, fmtIDR(onlinePromoData.bepDiscountNominal))
              )
            ),
            h('p', { className: 'text-[9.5px] text-slate-500 italic mt-1' },
              'Diskon promo online yang melampaui nilai di atas akan memotong modal HPP produk Anda.'
            )
          )
        )
      )
    );
  };
})();
