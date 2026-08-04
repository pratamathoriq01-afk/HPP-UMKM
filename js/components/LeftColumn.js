/* ─────────────────── LEFT COLUMN: TOUCH BAR & SEPARATED MODULES (PRO-GROWTH LEDGER) ─────────────────── */
(function() {
  const h = React.createElement;

  window.LeftColumnComponent = function LeftColumn({ prod, onUpdateProduct }) {
    const fmtIDR = window.AppMath.formatIDR;
    const UNITS = window.AppConfig.UNITS;
    const FlexibleInput = window.FlexibleInput;
    const Tip = window.Tip;

    /* Touch Bar Active Tab State: 'hpp' | 'offline' | 'online' | 'promo' | 'all' */
    const [activeTab, setActiveTab] = React.useState('hpp');

    /* Promo Sub-Tab State: 'promo-online' | 'promo-offline' */
    const [promoSubTab, setPromoSubTab] = React.useState('promo-online');

    /* Financial Math Helpers for Reports */
    const calculateHPP = window.AppMath.calculateHPP;
    const calculateBaseSellingPrice = window.AppMath.calculateBaseSellingPrice;
    const calculateOfflineDiscount = window.AppMath.calculateOfflineDiscount;
    const calculateAppSellingPrice = window.AppMath.calculateAppSellingPrice;
    const calculateOnlinePromo = window.AppMath.calculateOnlinePromo;

    const hppData = calculateHPP(prod);
    const basePriceData = calculateBaseSellingPrice(hppData.hppPerUnit, prod);
    const offlineDiscData = calculateOfflineDiscount(basePriceData.basePrice, hppData.hppPerUnit, prod);
    const appPriceData = calculateAppSellingPrice(basePriceData.basePrice, prod);
    const onlinePromoData = calculateOnlinePromo(appPriceData.appPrice, hppData.hppPerUnit, prod, prod.simOrderQty || 2);

    /* Row Helper Methods */
    const addRow = (section) => {
      const item = section === 'materials'
        ? { id: Date.now(), name: '', qty: 1, unit: 'gram', unitPrice: 0 }
        : section === 'labors'
        ? { id: Date.now(), name: '', price: 0 }
        : { id: Date.now(), name: '', price: 0 };
      onUpdateProduct(section, [...(prod[section] || []), item]);
    };

    const removeRow = (section, id) => {
      onUpdateProduct(section, (prod[section] || []).filter(r => r.id !== id));
    };

    const updateRow = (section, id, field, val) => {
      onUpdateProduct(section, (prod[section] || []).map(r => r.id === id ? { ...r, [field]: val } : r));
    };

    /* Touch Bar Navigation Tabs Configuration */
    const TABS = [
      { id: 'hpp', icon: '📦', label: '1. Biaya HPP' },
      { id: 'offline', icon: '🏪', label: '2. Harga Offline' },
      { id: 'online', icon: '📱', label: '3. Harga Online' },
      { id: 'promo', icon: '🏷️', label: '4. Simulasi Promo' },
      { id: 'all', icon: '⚡', label: 'Semua Modul' }
    ];

    return h('div', { className: 'space-y-6 animate-fade-in pb-12' },

      /* Page Heading */
      h('div', { className: 'flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2' },
        h('div', null,
          h('h2', { className: 'text-2xl font-bold text-[#002045]' }, 'Kalkulator Keuangan UMKM'),
          h('p', { className: 'text-xs text-slate-500 font-medium mt-0.5' },
            'Pilih modul pada Touch Bar di bawah untuk mengelola input secara fokus & terpisah.'
          )
        )
      ),

      /* ─────────────────── LUXURY INTERACTIVE TOUCH BAR ─────────────────── */
      h('div', { className: 'touch-bar-container' },
        TABS.map(t =>
          h('button', {
            key: t.id,
            onClick: () => setActiveTab(t.id),
            className: `touch-bar-pill ${activeTab === t.id ? 'active' : ''}`
          },
            h('span', null, t.icon),
            h('span', null, t.label)
          )
        )
      ),

      /* ─────────────────── MODUL 1: BIAYA PRODUKSI & HPP ─────────────────── */
      (activeTab === 'hpp' || activeTab === 'all') &&
      h('div', { className: 'pg-card p-6 space-y-6 animate-fade-in' },
        h('div', { className: 'flex items-center justify-between border-b border-slate-200 pb-4' },
          h('div', { className: 'flex items-center gap-3' },
            h('div', { className: 'w-10 h-10 rounded-lg bg-[#002045] text-white flex items-center justify-center font-bold shadow-xs' },
              '📦'
            ),
            h('div', null,
              h('h3', { className: 'text-base font-bold text-[#0d1c2e]' }, 'Modul 1: Biaya Produksi & HPP'),
              h('p', { className: 'text-xs text-slate-500' }, 'Kalkulasi Bahan Baku, BTKL, dan Overhead Pabrik per Batch.')
            )
          ),
          h('div', { className: 'flex items-center gap-2 bg-[#eff4ff] px-3.5 py-2 rounded-lg border border-[#dce9ff]' },
            h('label', { className: 'text-xs font-bold text-[#002045] uppercase tracking-wider' }, 'Target Batch:'),
            h('div', { className: 'w-24 font-mono font-bold' },
              h(FlexibleInput, {
                value: prod.targetQty,
                onChange: (v) => onUpdateProduct('targetQty', Math.max(1, v)),
                suffix: 'pcs'
              })
            )
          )
        ),

        /* Section A: Bahan Baku Langsung */
        h('div', { className: 'space-y-3' },
          h('div', { className: 'flex items-center justify-between' },
            h('span', { className: 'text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1' },
              'A. Bahan Baku Langsung',
              h(Tip, { text: 'Bahan pokok yang terpakai habis secara fisik dalam proses pembuatan produk.' })
            ),
            h('button', {
              onClick: () => addRow('materials'),
              className: 'text-xs font-bold text-[#006d3c] hover:underline transition flex items-center gap-1 cursor-pointer'
            }, '➕ Tambah Bahan Baku')
          ),

          /* Column Titles */
          h('div', { className: 'grid grid-cols-12 gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2' },
            h('div', { className: 'col-span-4' }, 'Nama Bahan'),
            h('div', { className: 'col-span-2 text-center' }, 'Jumlah'),
            h('div', { className: 'col-span-2 text-center' }, 'Satuan'),
            h('div', { className: 'col-span-2 text-right' }, 'Harga / Satuan'),
            h('div', { className: 'col-span-2 text-right' }, 'Subtotal')
          ),

          /* Item Rows */
          (prod.materials || []).map(m => {
            const subTotal = (parseFloat(m.qty) || 0) * (parseFloat(m.unitPrice) || 0);
            return h('div', { key: m.id, className: 'pg-item-row p-2.5 grid grid-cols-12 gap-2 items-center' },
              h('div', { className: 'col-span-4' },
                h('input', {
                  type: 'text',
                  value: m.name,
                  onChange: (e) => updateRow('materials', m.id, 'name', e.target.value),
                  placeholder: 'Contoh: Beras Pulen...',
                  className: 'w-full bg-white border border-[#cbd5e0] rounded-lg text-xs px-3 py-2 focus:outline-none focus:border-[#002045] font-semibold text-[#0d1c2e] shadow-xs'
                })
              ),
              h('div', { className: 'col-span-2 font-mono' },
                h(FlexibleInput, {
                  value: m.qty,
                  onChange: (v) => updateRow('materials', m.id, 'qty', v)
                })
              ),
              h('div', { className: 'col-span-2' },
                h('select', {
                  value: m.unit,
                  onChange: (e) => updateRow('materials', m.id, 'unit', e.target.value),
                  className: 'w-full bg-white border border-[#cbd5e0] rounded-lg text-xs px-2 py-2 focus:outline-none focus:border-[#002045] font-semibold text-slate-700 shadow-xs cursor-pointer'
                },
                  UNITS.map(u => h('option', { key: u, value: u }, u))
                )
              ),
              h('div', { className: 'col-span-2 font-mono' },
                h(FlexibleInput, {
                  value: m.unitPrice,
                  onChange: (v) => updateRow('materials', m.id, 'unitPrice', v),
                  prefix: 'Rp'
                })
              ),
              h('div', { className: 'col-span-2 flex items-center justify-between gap-1 pl-1' },
                h('span', { className: 'text-xs font-bold font-mono text-[#0d1c2e] text-right w-full' }, fmtIDR(subTotal)),
                h('button', {
                  onClick: () => removeRow('materials', m.id),
                  disabled: prod.materials.length <= 1,
                  className: 'p-1.5 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 disabled:opacity-20 transition cursor-pointer',
                  title: 'Hapus'
                }, '🗑️')
              )
            );
          })
        ),

        /* Section B: Biaya Tenaga Kerja Langsung (BTKL) */
        h('div', { className: 'space-y-3 border-t border-slate-200 pt-4' },
          h('div', { className: 'flex items-center justify-between' },
            h('span', { className: 'text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1' },
              'B. Biaya Tenaga Kerja Langsung (BTKL)',
              h(Tip, { text: 'Upah juru masak atau asisten yang terlibat langsung dalam pembuatan batch ini.' })
            ),
            h('button', {
              onClick: () => addRow('labors'),
              className: 'text-xs font-bold text-[#006d3c] hover:underline transition flex items-center gap-1 cursor-pointer'
            }, '➕ Tambah Upah BTKL')
          ),

          (prod.labors || []).map(l =>
            h('div', { key: l.id, className: 'pg-item-row p-2.5 flex gap-2 items-center' },
              h('input', {
                type: 'text',
                value: l.name,
                onChange: (e) => updateRow('labors', l.id, 'name', e.target.value),
                placeholder: 'Contoh: Upah Koki per Batch...',
                className: 'flex-1 bg-white border border-[#cbd5e0] rounded-lg text-xs px-3 py-2 focus:outline-none focus:border-[#002045] font-semibold text-[#0d1c2e] shadow-xs'
              }),
              h('div', { className: 'w-44 font-mono' },
                h(FlexibleInput, {
                  value: l.price,
                  onChange: (v) => updateRow('labors', l.id, 'price', v),
                  prefix: 'Rp'
                })
              ),
              h('button', {
                onClick: () => removeRow('labors', l.id),
                disabled: (prod.labors || []).length <= 1,
                className: 'p-1.5 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 disabled:opacity-20 transition cursor-pointer'
              }, '🗑️')
            )
          )
        ),

        /* Section C: Biaya Overhead Pabrik (BOP) */
        h('div', { className: 'space-y-3 border-t border-slate-200 pt-4' },
          h('div', { className: 'flex items-center justify-between' },
            h('span', { className: 'text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1' },
              'C. Biaya Overhead Pabrik (BOP)',
              h(Tip, { text: 'Biaya pendukung tidak langsung seperti gas, kemasan, listrik, dan air per batch.' })
            ),
            h('button', {
              onClick: () => addRow('overheads'),
              className: 'text-xs font-bold text-[#006d3c] hover:underline transition flex items-center gap-1 cursor-pointer'
            }, '➕ Tambah Overhead')
          ),

          (prod.overheads || []).map(o =>
            h('div', { key: o.id, className: 'pg-item-row p-2.5 flex gap-2 items-center' },
              h('input', {
                type: 'text',
                value: o.name,
                onChange: (e) => updateRow('overheads', o.id, 'name', e.target.value),
                placeholder: 'Contoh: Gas Melon + Kemasan Box...',
                className: 'flex-1 bg-white border border-[#cbd5e0] rounded-lg text-xs px-3 py-2 focus:outline-none focus:border-[#002045] font-semibold text-[#0d1c2e] shadow-xs'
              }),
              h('div', { className: 'w-44 font-mono' },
                h(FlexibleInput, {
                  value: o.price,
                  onChange: (v) => updateRow('overheads', o.id, 'price', v),
                  prefix: 'Rp'
                })
              ),
              h('button', {
                onClick: () => removeRow('overheads', o.id),
                disabled: (prod.overheads || []).length <= 1,
                className: 'p-1.5 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 disabled:opacity-20 transition cursor-pointer'
              }, '🗑️')
            )
          )
        ),

        /* Report Summary Statement */
        h('div', { className: 'bg-[#eff4ff] border border-[#dce9ff] rounded-xl p-4 text-xs space-y-2 font-mono' },
          h('p', { className: 'text-[10px] font-bold text-[#002045] uppercase tracking-wider font-sans' }, 'Laporan HPP SAK EMKM Summary'),
          h('div', { className: 'flex justify-between text-slate-700' },
            h('span', null, 'Total Bahan Baku:'),
            h('span', { className: 'font-bold' }, fmtIDR(hppData.totalMaterials))
          ),
          h('div', { className: 'flex justify-between text-slate-700' },
            h('span', null, 'Total Upah BTKL:'),
            h('span', { className: 'font-bold' }, fmtIDR(hppData.totalLabors))
          ),
          h('div', { className: 'flex justify-between text-slate-700' },
            h('span', null, 'Total Overhead BOP:'),
            h('span', { className: 'font-bold' }, fmtIDR(hppData.totalOverheads))
          ),
          h('div', { className: 'flex justify-between pt-2 border-t border-[#c4c6cf] text-sm font-bold text-[#002045] font-sans' },
            h('span', null, 'HPP per Unit:'),
            h('span', { className: 'font-mono text-base font-extrabold text-[#006d3c]' }, fmtIDR(hppData.hppPerUnit))
          )
        )
      ),

      /* ─────────────────── MODUL 2: HARGA JUAL OFFLINE ─────────────────── */
      (activeTab === 'offline' || activeTab === 'all') &&
      h('div', { className: 'pg-card p-6 space-y-5 animate-fade-in' },
        h('div', { className: 'flex justify-between items-center border-b border-slate-200 pb-3' },
          h('div', { className: 'flex items-center gap-3' },
            h('div', { className: 'w-10 h-10 rounded-lg bg-[#006d3c] text-white flex items-center justify-center font-bold shadow-xs' },
              '🏪'
            ),
            h('div', null,
              h('h3', { className: 'text-base font-bold text-[#0d1c2e]' }, 'Modul 2: Harga Jual Toko (Offline)'),
              h('p', { className: 'text-xs text-slate-500' }, 'Tentukan persentase margin keuntungan offline berdasarkan HPP.')
            )
          ),
          h('div', { className: 'flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-bold' },
            ['percent', 'nominal'].map(m =>
              h('button', {
                key: m,
                onClick: () => onUpdateProduct('marginMode', m),
                className: `px-3 py-1.5 rounded transition cursor-pointer ${
                  prod.marginMode === m
                    ? 'bg-[#002045] text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`
              }, m === 'percent' ? '% Margin' : 'Rp Margin')
            )
          )
        ),

        prod.marginMode === 'percent'
          ? h('div', { className: 'space-y-2' },
              h('div', { className: 'flex justify-between items-center' },
                h('label', { className: 'text-xs font-bold uppercase text-slate-600' }, 'Target Margin Keuntungan:'),
                h('span', { className: 'text-base font-bold font-mono text-[#006d3c]' }, `${prod.marginPercent || 0}%`)
              ),
              h('input', {
                type: 'range',
                min: '5',
                max: '200',
                step: '5',
                value: prod.marginPercent || 0,
                onChange: (e) => onUpdateProduct('marginPercent', parseInt(e.target.value, 10)),
                className: 'w-full emerald'
              }),
              h('div', { className: 'flex justify-between text-[10px] text-slate-400 font-bold font-mono' },
                ['5%', '50%', '100%', '150%', '200%'].map(l => h('span', { key: l }, l))
              )
            )
          : h('div', { className: 'max-w-md' },
              h('label', { className: 'text-xs font-bold uppercase text-slate-600 block mb-1' }, 'Nominal Margin Untung (Rp):'),
              h('div', { className: 'font-mono' },
                h(FlexibleInput, {
                  value: prod.marginNominal,
                  onChange: (v) => onUpdateProduct('marginNominal', v),
                  prefix: 'Rp'
                })
              )
            ),

        /* Breakdown Table for Offline */
        h('div', { className: 'bg-[#f8f9ff] border border-[#e5eeff] rounded-xl p-4 text-xs space-y-2 font-mono' },
          h('div', { className: 'flex justify-between text-slate-600' },
            h('span', null, 'HPP / Unit:'),
            h('span', null, fmtIDR(hppData.hppPerUnit))
          ),
          h('div', { className: 'flex justify-between text-[#006d3c] font-bold' },
            h('span', null, `Target Keuntungan (+${basePriceData.marginPercent.toFixed(0)}%):`),
            h('span', null, `+${fmtIDR(basePriceData.marginNominal)}`)
          ),
          h('div', { className: 'flex justify-between pt-2 border-t border-slate-200 text-sm font-bold text-[#002045] font-sans' },
            h('span', null, 'Harga Jual Dasar (Offline):'),
            h('span', { className: 'font-mono text-base font-extrabold text-[#006d3c]' }, fmtIDR(basePriceData.basePrice))
          )
        )
      ),

      /* ─────────────────── MODUL 3: HARGA APLIKASI ONLINE ─────────────────── */
      (activeTab === 'online' || activeTab === 'all') &&
      h('div', { className: 'pg-card p-6 space-y-5 animate-fade-in' },
        h('div', { className: 'flex justify-between items-center border-b border-slate-200 pb-3' },
          h('div', { className: 'flex items-center gap-3' },
            h('div', { className: 'w-10 h-10 rounded-lg bg-[#1a365d] text-white flex items-center justify-center font-bold shadow-xs' },
              '📱'
            ),
            h('div', null,
              h('h3', { className: 'text-base font-bold text-[#0d1c2e]' }, 'Modul 3: Harga Aplikasi Online (Reverse-Margin)'),
              h('p', { className: 'text-xs text-slate-500' }, 'Hitung markup harga aplikasi agar net payout utuh sama persis dengan offline.')
            )
          )
        ),

        h('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
          h('div', null,
            h('label', { className: 'text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1' }, 'Komisi Platform (%)'),
            h('div', { className: 'font-mono' },
              h(FlexibleInput, {
                value: prod.commissionPercent,
                onChange: (v) => onUpdateProduct('commissionPercent', Math.min(99, Math.max(0, v))),
                suffix: '%'
              })
            ),
            h('p', { className: 'text-[10px] text-slate-400 mt-1' }, 'Potongan komisi aplikasi (misal 20%).')
          ),

          h('div', null,
            h('label', { className: 'text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1' }, 'Biaya Layanan Tetap (Rp)'),
            h('div', { className: 'font-mono' },
              h(FlexibleInput, {
                value: prod.fixedFee,
                onChange: (v) => onUpdateProduct('fixedFee', Math.max(0, v)),
                prefix: 'Rp'
              })
            ),
            h('p', { className: 'text-[10px] text-slate-400 mt-1' }, 'Biaya tetap per transaksi.')
          )
        ),

        /* Formula Reverse Margin Output Box */
        h('div', { className: 'bg-[#eff4ff] border border-[#dce9ff] rounded-xl p-4 text-xs space-y-2 font-mono' },
          h('p', { className: 'text-[10px] font-bold text-[#002045] uppercase tracking-wider font-sans' }, 'Formula Reverse-Margin Presisi'),
          h('div', { className: 'bg-white p-2 rounded border border-slate-200 text-center font-bold text-[#002045] text-[11px]' },
            'Harga Aplikasi = (Harga Offline + Biaya Tetap) ÷ (1 − Komisi %)'
          ),
          h('div', { className: 'flex justify-between text-slate-700 pt-1' },
            h('span', null, 'Harga Offline:'),
            h('span', null, fmtIDR(basePriceData.basePrice))
          ),
          h('div', { className: 'flex justify-between text-[#b45309] font-bold pt-1 border-t border-slate-200 text-sm font-sans' },
            h('span', null, 'Harga Terdaftar di Aplikasi:'),
            h('span', { className: 'font-mono text-base font-extrabold text-[#b45309]' }, fmtIDR(appPriceData.appPrice))
          )
        )
      ),

      /* ─────────────────── MODUL 4: SIMULASI PROMO ONLINE VS OFFLINE TERPISAH ─────────────────── */
      (activeTab === 'promo' || activeTab === 'all') &&
      h('div', { className: 'pg-card p-6 space-y-6 animate-fade-in' },
        h('div', { className: 'flex justify-between items-center border-b border-slate-200 pb-4' },
          h('div', { className: 'flex items-center gap-3' },
            h('div', { className: 'w-10 h-10 rounded-lg bg-[#ba1a1a] text-white flex items-center justify-center font-bold shadow-xs' },
              '🏷️'
            ),
            h('div', null,
              h('h3', { className: 'text-base font-bold text-[#0d1c2e]' }, 'Modul 4: Pusat Simulasi Diskon & Promo'),
              h('p', { className: 'text-xs text-slate-500' }, 'Pilih sub-modul promo toko offline atau promo aplikasi online di bawah.')
            )
          )
        ),

        /* Sub-Touch Bar Promo: Offline vs Online Dedicated Tabs */
        h('div', { className: 'flex bg-[#f8f9ff] p-1 rounded-xl border border-[#e5eeff] gap-1 text-xs font-bold' },
          h('button', {
            onClick: () => setPromoSubTab('promo-online'),
            className: `flex-1 py-2 px-3 rounded-lg transition cursor-pointer flex items-center justify-center gap-2 ${
              promoSubTab === 'promo-online'
                ? 'bg-[#002045] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`
          },
            h('span', null, '📱'),
            h('span', null, 'Promo Aplikasi Online (Simulasi Krusial)')
          ),
          h('button', {
            onClick: () => setPromoSubTab('promo-offline'),
            className: `flex-1 py-2 px-3 rounded-lg transition cursor-pointer flex items-center justify-center gap-2 ${
              promoSubTab === 'promo-offline'
                ? 'bg-[#002045] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`
          },
            h('span', null, '🏪'),
            h('span', null, 'Promo Toko Offline (Universal)')
          )
        ),

        /* ── SUB-MODUL 4A: PROMO APLIKASI ONLINE (SIMULASI ORDER PRESISI) ── */
        (promoSubTab === 'promo-online' || activeTab === 'all') &&
        h('div', { className: 'space-y-5 bg-[#fff8f8] border border-rose-100 rounded-xl p-5' },
          h('div', { className: 'flex items-center justify-between border-b border-rose-200 pb-3' },
            h('div', null,
              h('h4', { className: 'text-sm font-bold text-rose-950 flex items-center gap-2' },
                '📱 Simulasi Pesanan Pembeli & Promo Online',
                h('span', { className: 'text-[10px] bg-rose-200 text-rose-900 px-2 py-0.5 rounded-full font-bold' }, 'Penting Meminimalisir Boncos')
              ),
              h('p', { className: 'text-xs text-rose-700 mt-0.5' }, 'Simulasikan pesanan konsumen online dengan syarat min. order & cap maksimal diskon.')
            ),

            /* Independent Toggle Switch for Online Promo */
            h('label', { className: 'flex items-center gap-2 cursor-pointer select-none' },
              h('input', {
                type: 'checkbox',
                checked: prod.promoEnabled || false,
                onChange: (e) => onUpdateProduct('promoEnabled', e.target.checked),
                className: 'w-4 h-4 text-[#ba1a1a] rounded focus:ring-[#ba1a1a] cursor-pointer shadow-xs'
              }),
              h('span', { className: 'text-xs font-bold text-slate-800' },
                prod.promoEnabled ? 'Aktifkan Promo Online' : 'Promo Online Off (Harga Normal)'
              )
            )
          ),

          !prod.promoEnabled && h('div', { className: 'bg-slate-100 border border-slate-200 text-slate-600 p-3 rounded-lg text-xs font-medium flex items-center gap-2' },
            h('span', null, 'ℹ️'),
            h('span', null, `Promo Aplikasi Online Nonaktif. Yang berlaku adalah Harga Normal Aplikasi murni (${fmtIDR(appPriceData.appPrice)} per porsi).`)
          ),

          h('div', { className: `space-y-5 transition-opacity duration-300 ${prod.promoEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}` },

            /* Input Parameters Grid */
            h('div', { className: 'grid grid-cols-1 md:grid-cols-4 gap-4' },

              /* 1. Kuantitas Pesanan Pembeli */
              h('div', null,
                h('label', { className: 'block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1' }, 'Jumlah Pesanan Pembeli'),
                h('div', { className: 'font-mono' },
                  h(FlexibleInput, {
                    value: prod.simOrderQty || 2,
                    onChange: (v) => onUpdateProduct('simOrderQty', Math.max(1, v)),
                    suffix: 'porsi'
                  })
                ),
                h('p', { className: 'text-[10px] text-slate-400 mt-1' }, 'Subtotal: ' + fmtIDR(onlinePromoData.orderSubtotal))
              ),

              /* 2. Syarat Minimal Order Rp */
              h('div', null,
                h('label', { className: 'block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1' }, 'Syarat Min. Order (Rp)'),
                h('div', { className: 'font-mono' },
                  h(FlexibleInput, {
                    value: prod.promoMinOrder,
                    onChange: (v) => onUpdateProduct('promoMinOrder', Math.max(0, v)),
                    prefix: 'Rp'
                  })
                ),
                h('p', { className: 'text-[10px] text-slate-400 mt-1' }, 'Batas min. belanja konsumen.')
              ),

              /* 3. Persen Diskon % */
              h('div', null,
                h('label', { className: 'block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1' },
                  `Diskon Promo (${prod.promoPercent || 0}%)`
                ),
                h('input', {
                  type: 'range',
                  min: '0',
                  max: '70',
                  step: '5',
                  value: prod.promoPercent || 0,
                  onChange: (e) => onUpdateProduct('promoPercent', parseInt(e.target.value, 10)),
                  className: 'w-full rose'
                }),
                h('div', { className: 'flex justify-between text-[9px] text-slate-400 font-bold font-mono mt-1' },
                  ['0%', '25%', '50%', '70%'].map(l => h('span', { key: l }, l))
                )
              ),

              /* 4. Batas Maksimal Diskon Cap Rp */
              h('div', null,
                h('label', { className: 'block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1' }, 'Maksimal Diskon Cap (Rp)'),
                h('div', { className: 'font-mono' },
                  h(FlexibleInput, {
                    value: prod.promoMaxDiscount,
                    onChange: (v) => onUpdateProduct('promoMaxDiscount', Math.max(0, v)),
                    prefix: 'Rp'
                  })
                ),
                h('p', { className: 'text-[10px] text-slate-400 mt-1' }, 'Contoh cap: Rp 20.000.')
              )

            ),

            /* Status Promo Active / Minimum Order Alert */
            prod.promoEnabled && h('div', {
              className: `p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 font-mono ${
                onlinePromoData.isPromoValid
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`
            },
              h('span', null, onlinePromoData.isPromoValid ? '✅' : '⚠️'),
              onlinePromoData.isPromoValid
                ? h('span', null,
                    'Promo Aktif! Subtotal Belanja ',
                    h('strong', null, fmtIDR(onlinePromoData.orderSubtotal)),
                    ' >= Min. Order ',
                    h('strong', null, fmtIDR(prod.promoMinOrder)),
                    '. Diskon Efektif: ',
                    h('strong', { className: 'text-emerald-700 font-extrabold' }, fmtIDR(onlinePromoData.effectiveDiscount)),
                    onlinePromoData.effectiveDiscount < onlinePromoData.rawDiscount && h('span', { className: 'text-slate-500 text-[11px] font-normal ml-1' }, `(Dibatasi oleh Cap Maksimal ${fmtIDR(prod.promoMaxDiscount)})`)
                  )
                : h('span', null,
                    'Promo Belum Aktif: Subtotal Belanja Pembeli ',
                    h('strong', null, fmtIDR(onlinePromoData.orderSubtotal)),
                    ` (${onlinePromoData.orderQty} porsi) belum mencapai Syarat Min. Order `,
                    h('strong', null, fmtIDR(prod.promoMinOrder)),
                    '. Tambahkan porsi pesanan.'
                  )
            ),

            /* Flashing Red Alert if Negative Margin / Boncos */
            onlinePromoData.isOnlineLosing && onlinePromoData.isPromoValid && h('div', {
              className: 'bg-rose-50 border-2 border-rose-400 text-rose-950 p-4 rounded-xl text-xs space-y-1 shadow-md animate-pulse'
            },
              h('div', { className: 'flex items-center gap-2 font-bold text-sm text-rose-800' },
                h('span', { className: 'text-base' }, '🚨'),
                'PERINGATAN PROMO ONLINE RUGI/BONCOS!'
              ),
              h('p', { className: 'text-rose-900 text-[11.5px] leading-relaxed font-medium' },
                'Diskon promo & komisi platform memotong modal HPP! UMKM merugi sebesar ',
                h('strong', { className: 'font-mono text-sm underline text-rose-700' }, fmtIDR(Math.abs(onlinePromoData.netMarginOnlineTotal))),
                ` untuk ${onlinePromoData.orderQty} porsi (${fmtIDR(Math.abs(onlinePromoData.netMarginOnline))} per unit).`
              )
            ),

            /* Live Transaction Order Breakdown Table */
            h('div', { className: 'bg-white p-4 rounded-xl border border-rose-200 text-xs space-y-2 font-mono shadow-xs' },
              h('p', { className: 'text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 font-sans' },
                `Rincian Simulasi Transaksi (${onlinePromoData.orderQty} Porsi Online)`
              ),
              h('div', { className: 'flex justify-between text-slate-700' },
                h('span', null, `Subtotal Belanja (${onlinePromoData.orderQty} × ${fmtIDR(appPriceData.appPrice)}):`),
                h('span', { className: 'font-bold' }, fmtIDR(onlinePromoData.orderSubtotal))
              ),
              h('div', { className: 'flex justify-between text-rose-600 font-bold' },
                h('span', null, 'Diskon Promo Ditanggung UMKM:'),
                h('span', null, `−${fmtIDR(onlinePromoData.effectiveDiscount)}`)
              ),
              h('div', { className: 'flex justify-between text-slate-800 font-bold' },
                h('span', null, 'Total Pembayaran Konsumen di Aplikasi:'),
                h('span', null, fmtIDR(onlinePromoData.finalCustomerPays))
              ),
              h('div', { className: 'flex justify-between text-rose-600 font-bold' },
                h('span', null, `Potongan Komisi (${prod.commissionPercent}%) & Biaya Tetap:`),
                h('span', null, `−${fmtIDR(onlinePromoData.appCommissionAmount)}`)
              ),
              h('div', { className: 'flex justify-between pt-2 border-t border-slate-200 text-sm font-bold text-[#002045] font-sans' },
                h('span', null, 'Net Payout Diterima Bersih UMKM:'),
                h('span', { className: 'font-mono text-base font-extrabold text-[#006d3c]' }, fmtIDR(onlinePromoData.netPayoutOnline))
              ),
              h('div', { className: 'flex justify-between text-slate-600 font-bold' },
                h('span', null, `Modal Total HPP (${onlinePromoData.orderQty} × ${fmtIDR(hppData.hppPerUnit)}):`),
                h('span', null, fmtIDR(onlinePromoData.orderQty * hppData.hppPerUnit))
              ),
              h('div', { className: 'flex justify-between pt-2 border-t border-slate-200 text-sm font-bold font-sans' },
                h('span', null, 'Margin Bersih UMKM Per Unit (Setelah Promo):'),
                h('span', { className: `font-mono text-base font-extrabold ${onlinePromoData.isOnlineLosing ? 'text-rose-600' : 'text-[#006d3c]'}` },
                  fmtIDR(onlinePromoData.netMarginOnline)
                )
              )
            ),

            /* BEP Safety Net Limits Box */
            h('div', { className: 'bg-[#eff4ff] border border-[#dce9ff] p-4 rounded-xl text-xs space-y-2 font-mono' },
              h('span', { className: 'text-[10px] font-bold text-[#002045] uppercase tracking-widest block font-sans' },
                '🛡️ BATAS AMAN DISKON PROMO ONLINE (BEP / BREAK-EVEN POINT)'
              ),
              h('div', { className: 'grid grid-cols-2 gap-3 pt-1 text-center' },
                h('div', { className: 'bg-white border border-[#dce9ff] p-2.5 rounded-lg' },
                  h('span', { className: 'text-[9px] text-slate-500 block font-sans uppercase' }, 'Maksimal Diskon %'),
                  h('span', { className: 'text-base font-bold text-rose-600 block' }, `${onlinePromoData.bepDiscountPercent.toFixed(1)}%`)
                ),
                h('div', { className: 'bg-white border border-[#dce9ff] p-2.5 rounded-lg' },
                  h('span', { className: 'text-[9px] text-slate-500 block font-sans uppercase' }, 'Maksimal Potongan Rp'),
                  h('span', { className: 'text-base font-bold text-rose-600 block' }, fmtIDR(onlinePromoData.bepDiscountNominal))
                )
              ),
              h('p', { className: 'text-[10px] text-slate-500 italic mt-1 font-sans' },
                'Diskon promo yang melebihi nilai di atas akan menggerus modal HPP produk Anda.'
              )
            )

          )
        ),

        /* ── SUB-MODUL 4B: PROMO TOKO OFFLINE (UNIVERSAL) ── */
        (promoSubTab === 'promo-offline' || activeTab === 'all') &&
        h('div', { className: 'space-y-4 bg-[#f8f9ff] border border-[#e5eeff] rounded-xl p-5' },
          h('div', { className: 'flex items-center justify-between border-b border-slate-200 pb-3' },
            h('div', null,
              h('h4', { className: 'text-sm font-bold text-slate-900' }, '🏪 Promo Toko Offline (Universal Direct Discount)'),
              h('p', { className: 'text-xs text-slate-500 mt-0.5' }, 'Diskon langsung di kasir/toko tanpa batas syarat rumit.')
            ),

            /* Independent Toggle Switch for Offline Promo */
            h('label', { className: 'flex items-center gap-2 cursor-pointer select-none' },
              h('input', {
                type: 'checkbox',
                checked: prod.offlinePromoEnabled || false,
                onChange: (e) => onUpdateProduct('offlinePromoEnabled', e.target.checked),
                className: 'w-4 h-4 text-[#002045] rounded focus:ring-[#002045] cursor-pointer shadow-xs'
              }),
              h('span', { className: 'text-xs font-bold text-slate-800' },
                prod.offlinePromoEnabled ? 'Aktifkan Diskon Offline' : 'Diskon Offline Off (Harga Normal)'
              )
            )
          ),

          !prod.offlinePromoEnabled && h('div', { className: 'bg-slate-100 border border-slate-200 text-slate-600 p-3 rounded-lg text-xs font-medium flex items-center gap-2' },
            h('span', null, 'ℹ️'),
            h('span', null, `Diskon Toko Offline Nonaktif. Yang berlaku adalah Harga Normal Toko murni (${fmtIDR(basePriceData.basePrice)}).`)
          ),

          h('div', { className: `space-y-4 transition-opacity duration-300 ${prod.offlinePromoEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}` },
            h('div', { className: 'flex items-center justify-between' },
              h('label', { className: 'text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1' },
                prod.offlineDiscountMode === 'percent' ? 'Besar Diskon Toko (%)' : 'Potongan Diskon Toko (Rp)'
              ),
              h('div', { className: 'flex bg-white p-0.5 rounded-lg border border-slate-200 text-xs font-bold' },
                ['percent', 'nominal'].map(m =>
                  h('button', {
                    key: m,
                    onClick: () => onUpdateProduct('offlineDiscountMode', m),
                    className: `px-3 py-1 rounded transition cursor-pointer ${
                      prod.offlineDiscountMode === m
                        ? 'bg-[#002045] text-white shadow-xs'
                        : 'text-slate-500'
                    }`
                  }, m === 'percent' ? '% Diskon' : 'Rp Diskon')
                )
              )
            ),

            h('div', { className: 'max-w-md space-y-3' },
              prod.offlineDiscountMode === 'percent'
                ? h('div', { className: 'space-y-1' },
                    h('input', {
                      type: 'range',
                      min: '0',
                      max: '50',
                      step: '5',
                      value: prod.offlineDiscountPercent || 0,
                      onChange: (e) => onUpdateProduct('offlineDiscountPercent', parseInt(e.target.value, 10)),
                      className: 'w-full emerald'
                    }),
                    h('div', { className: 'flex justify-between text-[9px] text-slate-400 font-bold font-mono' },
                      ['0%', '10%', '20%', '30%', '40%', '50%'].map(l => h('span', { key: l }, l))
                    )
                  )
                : h('div', { className: 'font-mono' },
                    h(FlexibleInput, {
                      value: prod.offlineDiscountNominal,
                      onChange: (v) => onUpdateProduct('offlineDiscountNominal', v),
                      prefix: 'Rp'
                    })
                  )
            ),

            /* Offline Summary Box */
            h('div', { className: 'bg-white p-4 rounded-xl border border-slate-200 text-xs space-y-2 font-mono shadow-xs' },
              h('div', { className: 'flex justify-between text-slate-600' },
                h('span', null, 'Harga Offline Dasar:'),
                h('span', null, fmtIDR(basePriceData.basePrice))
              ),
              h('div', { className: 'flex justify-between text-rose-600 font-bold' },
                h('span', null, 'Potongan Diskon Toko:'),
                h('span', null, `−${fmtIDR(offlineDiscData.discountNominal)}`)
              ),
              h('div', { className: 'flex justify-between pt-2 border-t border-slate-200 text-sm font-bold text-[#002045] font-sans' },
                h('span', null, 'Harga Akhir Offline (Dibayar Pembeli):'),
                h('span', { className: 'font-mono text-base font-extrabold text-[#006d3c]' }, fmtIDR(offlineDiscData.finalOfflinePrice))
              ),
              h('div', { className: 'flex justify-between text-slate-700 font-bold pt-1 font-sans' },
                h('span', null, 'Sisa Margin Bersih Offline:'),
                h('span', { className: `font-mono ${offlineDiscData.isOfflineLosing ? 'text-rose-600' : 'text-[#006d3c]'}` },
                  fmtIDR(offlineDiscData.netOfflineMargin)
                )
              )
            )
          )
        )

      )

    );
  };
})();
