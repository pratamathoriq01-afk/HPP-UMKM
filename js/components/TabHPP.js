/* ─────────────────── MODUL 1: BIAYA PRODUKSI & HPP MURNI (ORGANIC BEIGE & ESPRESSO) ─────────────────── */
(function() {
  const h = React.createElement;

  window.TabHPPComponent = function TabHPP({ prod, onUpdateProduct, onNavigateTab }) {
    const fmtIDR = window.AppMath.formatIDR;
    const calculateHPP = window.AppMath.calculateHPP;
    const FlexibleInput = window.FlexibleInput;

    const UNITS = ['porsi', 'pcs', 'gram', 'kg', 'ml', 'liter', 'pack', 'butir', 'sendok', 'cup'];
    const hppData = calculateHPP(prod);

    /* Helper: Generic list row updater */
    const updateRow = (listKey, id, field, value) => {
      const currentList = prod[listKey] || [];
      const updatedList = currentList.map(item => (item.id === id ? { ...item, [field]: value } : item));
      onUpdateProduct(listKey, updatedList);
    };

    /* Helper: Add row */
    const addRow = (listKey) => {
      const currentList = prod[listKey] || [];
      const nextId = currentList.reduce((max, item) => (item.id > max ? item.id : max), 0) + 1;
      let newRow = { id: nextId, name: '', totalPrice: 0 };
      if (listKey === 'mainMaterials') newRow = { ...newRow, name: 'Bahan Baru ' + nextId, totalPrice: 10000, portions: 5, unit: 'porsi' };
      if (listKey === 'bopMaterials') newRow = { ...newRow, name: 'Overhead Baru ' + nextId, totalPrice: 15000, capacity: 1000, capUnit: 'ml', usage: 100, usageUnit: 'ml', portions: 5 };
      if (listKey === 'packagings') newRow = { ...newRow, name: 'Kemasan Baru ' + nextId, totalPrice: 20000, itemsPerPack: 50, unit: 'pcs' };
      onUpdateProduct(listKey, [...currentList, newRow]);
    };

    /* Helper: Remove row */
    const removeRow = (listKey, id) => {
      const currentList = prod[listKey] || [];
      if (currentList.length <= 1) return;
      onUpdateProduct(listKey, currentList.filter(item => item.id !== id));
    };

    return h('div', { className: 'space-y-6 animate-fade-in max-w-5xl mx-auto pb-12' },

      /* Module Banner */
      h('div', { className: 'bg-[#F0E6D2] rounded-3xl p-6 shadow-xs border border-[#E2D9C8] space-y-2' },
        h('div', { className: 'flex items-center gap-2' },
          h('span', { className: 'text-xs font-extrabold uppercase tracking-wider text-[#2C1E16] bg-[#E2D9C8] px-2.5 py-1 rounded-lg border border-[#BDB6A3]' }, 'Modul 1: HPP Murni'),
          h('span', { className: 'text-xs text-[#786452] font-bold' }, '• Standar Manufaktur Kuliner Presisi')
        ),
        h('h2', { className: 'text-xl font-black text-[#2C1E16]' }, '📦 Biaya Produksi & HPP Murni per Porsi'),
        h('p', { className: 'text-xs text-[#786452] max-w-2xl font-semibold' },
          'Kelola 3 pilar HPP murni (Bahan Utama, BOP Variabel, & Kemasan). HPP Murni adalah modal bersih 0% risiko yang wajib tertutup sempurna sebelum mengambil laba.'
        )
      ),

      /* Total Summary HPP Banner */
      h('div', { className: 'bg-[#3D2B1F] text-white p-6 rounded-3xl shadow-xs border border-[#2C1E16] flex flex-col md:flex-row items-center justify-between gap-4' },
        h('div', { className: 'space-y-1 text-center md:text-left' },
          h('span', { className: 'text-[11px] font-extrabold uppercase tracking-widest text-[#E2D9C8]' }, 'TOTAL HPP MURNI PER PORSI'),
          h('div', { className: 'text-3xl sm:text-4xl font-black font-mono text-white tracking-tight' },
            fmtIDR(hppData.hppMurni)
          )
        ),
        h('div', { className: 'flex flex-wrap justify-center gap-2 text-center text-xs font-bold' },
          h('div', { className: 'bg-white/10 px-3 py-1.5 rounded-xl border border-white/10' },
            h('span', { className: 'text-[10px] text-[#E2D9C8] block font-extrabold' }, 'Bahan Utama'),
            h('span', { className: 'font-mono font-black text-white' }, fmtIDR(hppData.totalMainMaterials))
          ),
          h('div', { className: 'bg-white/10 px-3 py-1.5 rounded-xl border border-white/10' },
            h('span', { className: 'text-[10px] text-[#E2D9C8] block font-extrabold' }, 'BOP Variabel'),
            h('span', { className: 'font-mono font-black text-white' }, fmtIDR(hppData.totalBopMaterials))
          ),
          h('div', { className: 'bg-white/10 px-3 py-1.5 rounded-xl border border-white/10' },
            h('span', { className: 'text-[10px] text-[#E2D9C8] block font-extrabold' }, 'Kemasan'),
            h('span', { className: 'font-mono font-black text-white' }, fmtIDR(hppData.totalPackagings))
          )
        )
      ),

      /* ─────────────────── A. BAHAN BAKU UTAMA ─────────────────── */
      h('div', { className: 'bg-[#F0E6D2] rounded-3xl p-5 sm:p-6 shadow-xs border border-[#E2D9C8] space-y-4' },
        h('div', { className: 'flex items-center justify-between border-b border-[#E2D9C8] pb-3' },
          h('div', { className: 'flex items-center gap-2' },
            h('span', { className: 'text-lg' }, '🥩'),
            h('h3', { className: 'text-sm font-black uppercase tracking-wider text-[#2C1E16]' }, 'A. BAHAN BAKU UTAMA')
          ),
          h('button', {
            onClick: () => addRow('mainMaterials'),
            className: 'btn-secondary-taupe px-3 py-1.5 rounded-xl text-white font-extrabold text-xs flex items-center gap-1 cursor-pointer shadow-xs'
          },
            '➕ Tambah Bahan Utama'
          )
        ),

        /* Header Labels (Desktop) */
        h('div', { className: 'hidden sm:grid sm:grid-cols-12 gap-2 text-[10px] font-extrabold uppercase tracking-wider text-[#786452] px-3' },
          h('div', { className: 'col-span-4' }, 'Nama Bahan Utama'),
          h('div', { className: 'col-span-3' }, 'Total Harga Beli'),
          h('div', { className: 'col-span-3 text-center' }, 'Hasil Porsi & Satuan'),
          h('div', { className: 'col-span-2 text-right' }, 'HPP / Porsi')
        ),

        /* Rows */
        h('div', { className: 'space-y-2.5' },
          (hppData.mainList || []).map(m =>
            h('div', { key: m.id, className: 'flex flex-col sm:grid sm:grid-cols-12 gap-2 items-center bg-white p-3 rounded-2xl border border-[#E2D9C8] transition' },
              
              /* Nama Bahan */
              h('div', { className: 'w-full sm:col-span-4' },
                h('label', { className: 'sm:hidden text-[10px] font-bold text-[#786452] block mb-1' }, 'Nama Bahan'),
                h('input', {
                  type: 'text',
                  value: m.name,
                  onChange: (e) => updateRow('mainMaterials', m.id, 'name', e.target.value),
                  placeholder: 'Misal: Ayam / Beras...',
                  className: 'w-full bg-white border border-[#E2D9C8] rounded-xl text-xs px-3 py-2 font-bold text-[#2C1E16] focus:outline-none focus:border-[#3D2B1F]'
                })
              ),

              /* Total Harga Beli */
              h('div', { className: 'w-full sm:col-span-3' },
                h('label', { className: 'sm:hidden text-[10px] font-bold text-[#786452] block mb-1' }, 'Total Harga Beli'),
                h(FlexibleInput, {
                  value: m.totalPrice,
                  onChange: (v) => updateRow('mainMaterials', m.id, 'totalPrice', v),
                  prefix: 'Rp'
                })
              ),

              /* Hasil Porsi & Satuan */
              h('div', { className: 'w-full sm:col-span-3' },
                h('label', { className: 'sm:hidden text-[10px] font-bold text-[#786452] block mb-1' }, 'Hasil Porsi & Satuan'),
                h('div', { className: 'flex items-center gap-1.5' },
                  h('div', { className: 'w-16 flex-shrink-0' },
                    h(FlexibleInput, {
                      value: m.portions,
                      onChange: (v) => updateRow('mainMaterials', m.id, 'portions', Math.max(1, v))
                    })
                  ),
                  h('select', {
                    value: m.unit || 'porsi',
                    onChange: (e) => updateRow('mainMaterials', m.id, 'unit', e.target.value),
                    className: 'flex-1 min-w-[70px] bg-white border border-[#E2D9C8] rounded-xl text-xs px-2 py-2 font-semibold text-[#2C1E16] focus:outline-none'
                  },
                    UNITS.map(u => h('option', { key: u, value: u }, u))
                  )
                )
              ),

              /* HPP / Porsi & Action */
              h('div', { className: 'w-full sm:col-span-2 flex items-center justify-between sm:justify-end gap-2 pt-1 sm:pt-0' },
                h('div', { className: 'text-right' },
                  h('span', { className: 'sm:hidden text-[10px] text-[#786452] block' }, 'HPP/Porsi:'),
                  h('span', { className: 'font-mono font-extrabold text-[#2C1E16] text-xs' }, fmtIDR(m.hppPerPortion))
                ),
                (prod.mainMaterials || []).length > 1 && h('button', {
                  onClick: () => removeRow('mainMaterials', m.id),
                  className: 'text-xs text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition cursor-pointer font-bold',
                  title: 'Hapus Row'
                }, '🗑️')
              )

            )
          )
        )
      ),

      /* ─────────────────── B. BAHAN HABIS PAKAI (BOP VARIABEL) ─────────────────── */
      h('div', { className: 'bg-[#F0E6D2] rounded-3xl p-5 sm:p-6 shadow-xs border border-[#E2D9C8] space-y-4' },
        h('div', { className: 'flex items-center justify-between border-b border-[#E2D9C8] pb-3' },
          h('div', { className: 'flex items-center gap-2' },
            h('span', { className: 'text-lg' }, '🛢️'),
            h('h3', { className: 'text-sm font-black uppercase tracking-wider text-[#2C1E16]' }, 'B. BAHAN HABIS PAKAI (BOP VARIABEL)')
          ),
          h('button', {
            onClick: () => addRow('bopMaterials'),
            className: 'btn-secondary-taupe px-3 py-1.5 rounded-xl text-white font-extrabold text-xs flex items-center gap-1 cursor-pointer shadow-xs'
          },
            '➕ Tambah Overhead'
          )
        ),

        /* Panduan Pengisian Callout Box */
        h('div', { className: 'p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#E2D9C8] text-[#2C1E16] text-xs flex items-start gap-2.5 leading-relaxed font-semibold' },
          h('span', { className: 'text-base' }, '💡'),
          h('div', null,
            h('strong', { className: 'font-extrabold text-[#2C1E16] block mb-0.5' }, 'Panduan Pengisian Bahan Habis Pakai (BOP):'),
            'Masukkan bahan pendukung yang terpakai saat proses (misal Minyak/Gas). Masukkan Harga Beli (Rp 43.000), Kapasitas Total (2000 ml), Pemakaian Resep (500 ml), dan Hasil Porsi (8 porsi). Rumus: (Rp 43.000 ÷ 2000 ml × 500 ml) ÷ 8 = Rp 1.343,75 / porsi.'
          )
        ),

        /* Rows */
        h('div', { className: 'space-y-3' },
          (hppData.bopList || []).map(b =>
            h('div', { key: b.id, className: 'bg-white p-3.5 rounded-2xl border border-[#E2D9C8] space-y-2.5 transition' },
              
              /* Row Top: Nama & Harga Beli */
              h('div', { className: 'grid grid-cols-1 sm:grid-cols-12 gap-2 items-center' },
                h('div', { className: 'sm:col-span-7' },
                  h('label', { className: 'text-[10px] font-bold text-[#786452] block mb-0.5 uppercase' }, 'Nama Bahan Habis Pakai:'),
                  h('input', {
                    type: 'text',
                    value: b.name,
                    onChange: (e) => updateRow('bopMaterials', b.id, 'name', e.target.value),
                    placeholder: 'Misal: Minyak Goreng / Gas LPG...',
                    className: 'w-full bg-white border border-[#E2D9C8] rounded-xl text-xs px-3 py-2 font-bold text-[#2C1E16] focus:outline-none focus:border-[#3D2B1F]'
                  })
                ),
                h('div', { className: 'sm:col-span-5' },
                  h('label', { className: 'text-[10px] font-bold text-[#786452] block mb-0.5 uppercase' }, 'Harga Beli Kemasan:'),
                  h(FlexibleInput, {
                    value: b.totalPrice,
                    onChange: (v) => updateRow('bopMaterials', b.id, 'totalPrice', v),
                    prefix: 'Rp'
                  })
                )
              ),

              /* Row Bottom: Kapasitas, Pemakaian & Hasil Porsi */
              h('div', { className: 'grid grid-cols-1 sm:grid-cols-12 gap-2 items-center pt-2 border-t border-[#E2D9C8]' },
                
                /* Kapasitas Total */
                h('div', { className: 'sm:col-span-4' },
                  h('label', { className: 'text-[10px] font-bold text-[#786452] block mb-0.5' }, 'Kapasitas Total:'),
                  h('div', { className: 'flex items-center gap-1' },
                    h('div', { className: 'w-20 flex-shrink-0' },
                      h(FlexibleInput, {
                        value: b.capacity,
                        onChange: (v) => updateRow('bopMaterials', b.id, 'capacity', v)
                      })
                    ),
                    h('select', {
                      value: b.capUnit || 'ml',
                      onChange: (e) => updateRow('bopMaterials', b.id, 'capUnit', e.target.value),
                      className: 'flex-1 min-w-[65px] bg-white border border-[#E2D9C8] rounded-xl text-[11px] px-1.5 py-2 font-semibold text-[#2C1E16]'
                    },
                      UNITS.map(u => h('option', { key: u, value: u }, u))
                    )
                  )
                ),

                /* Pemakaian Resep */
                h('div', { className: 'sm:col-span-4' },
                  h('label', { className: 'text-[10px] font-bold text-[#786452] block mb-0.5' }, 'Pemakaian Resep:'),
                  h('div', { className: 'flex items-center gap-1' },
                    h('div', { className: 'w-20 flex-shrink-0' },
                      h(FlexibleInput, {
                        value: b.usage,
                        onChange: (v) => updateRow('bopMaterials', b.id, 'usage', v)
                      })
                    ),
                    h('select', {
                      value: b.usageUnit || 'ml',
                      onChange: (e) => updateRow('bopMaterials', b.id, 'usageUnit', e.target.value),
                      className: 'flex-1 min-w-[65px] bg-white border border-[#E2D9C8] rounded-xl text-[11px] px-1.5 py-2 font-semibold text-[#2C1E16]'
                    },
                      UNITS.map(u => h('option', { key: u, value: u }, u))
                    )
                  )
                ),

                /* Hasil Porsi & HPP */
                h('div', { className: 'sm:col-span-4 flex items-center justify-between gap-2' },
                  h('div', null,
                    h('label', { className: 'text-[10px] font-bold text-[#786452] block mb-0.5' }, 'Hasil Porsi:'),
                    h('div', { className: 'w-16' },
                      h(FlexibleInput, {
                        value: b.portions,
                        onChange: (v) => updateRow('bopMaterials', b.id, 'portions', Math.max(1, v))
                      })
                    )
                  ),
                  h('div', { className: 'text-right' },
                    h('span', { className: 'text-[10px] text-[#786452] block font-bold' }, 'Subtotal/Porsi:'),
                    h('span', { className: 'font-mono font-extrabold text-[#2C1E16] text-xs' }, fmtIDR(b.hppPerPortion))
                  ),
                  (prod.bopMaterials || []).length > 1 && h('button', {
                    onClick: () => removeRow('bopMaterials', b.id),
                    className: 'text-xs text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition cursor-pointer font-bold',
                    title: 'Hapus Row'
                  }, '🗑️')
                )

              )

            )
          )
        )
      ),

      /* ─────────────────── C. KEMASAN & PACKAGING ─────────────────── */
      h('div', { className: 'bg-[#F0E6D2] rounded-3xl p-5 sm:p-6 shadow-xs border border-[#E2D9C8] space-y-4' },
        h('div', { className: 'flex items-center justify-between border-b border-[#E2D9C8] pb-3' },
          h('div', { className: 'flex items-center gap-2' },
            h('span', { className: 'text-lg' }, '📦'),
            h('h3', { className: 'text-sm font-black uppercase tracking-wider text-[#2C1E16]' }, 'C. KEMASAN & PACKAGING')
          ),
          h('button', {
            onClick: () => addRow('packagings'),
            className: 'btn-secondary-taupe px-3 py-1.5 rounded-xl text-white font-extrabold text-xs flex items-center gap-1 cursor-pointer shadow-xs'
          },
            '➕ Tambah Kemasan'
          )
        ),

        /* Header Labels (Desktop) */
        h('div', { className: 'hidden sm:grid sm:grid-cols-12 gap-2 text-[10px] font-extrabold uppercase tracking-wider text-[#786452] px-3' },
          h('div', { className: 'col-span-4' }, 'Nama Kemasan / Packaging'),
          h('div', { className: 'col-span-3' }, 'Total Harga Beli Pack'),
          h('div', { className: 'col-span-3' }, 'Isi per Kemasan'),
          h('div', { className: 'col-span-2 text-right' }, 'Biaya / Porsi')
        ),

        /* Rows */
        h('div', { className: 'space-y-2.5' },
          (hppData.packList || []).map(p =>
            h('div', { key: p.id, className: 'flex flex-col sm:grid sm:grid-cols-12 gap-2 items-center bg-white p-3 rounded-2xl border border-[#E2D9C8] transition' },
              
              /* Nama Kemasan */
              h('div', { className: 'w-full sm:col-span-4' },
                h('label', { className: 'sm:hidden text-[10px] font-bold text-[#786452] block mb-1' }, 'Nama Kemasan'),
                h('input', {
                  type: 'text',
                  value: p.name,
                  onChange: (e) => updateRow('packagings', p.id, 'name', e.target.value),
                  placeholder: 'Misal: Box Makanan / Kantong...',
                  className: 'w-full bg-white border border-[#E2D9C8] rounded-xl text-xs px-3 py-2 font-bold text-[#2C1E16] focus:outline-none focus:border-[#3D2B1F]'
                })
              ),

              /* Total Harga Beli Pack */
              h('div', { className: 'w-full sm:col-span-3' },
                h('label', { className: 'sm:hidden text-[10px] font-bold text-[#786452] block mb-1' }, 'Total Harga Beli Pack'),
                h(FlexibleInput, {
                  value: p.totalPrice,
                  onChange: (v) => updateRow('packagings', p.id, 'totalPrice', v),
                  prefix: 'Rp'
                })
              ),

              /* Isi per Kemasan & Satuan */
              h('div', { className: 'w-full sm:col-span-3' },
                h('label', { className: 'sm:hidden text-[10px] font-bold text-[#786452] block mb-1' }, 'Isi per Kemasan'),
                h('div', { className: 'flex items-center gap-1.5' },
                  h('div', { className: 'w-20 flex-shrink-0' },
                    h(FlexibleInput, {
                      value: p.itemsPerPack,
                      onChange: (v) => updateRow('packagings', p.id, 'itemsPerPack', Math.max(1, v))
                    })
                  ),
                  h('span', { className: 'text-xs text-[#2C1E16] font-extrabold' }, p.unit || 'pcs')
                )
              ),

              /* HPP / Porsi & Action */
              h('div', { className: 'w-full sm:col-span-2 flex items-center justify-between sm:justify-end gap-2 pt-1 sm:pt-0' },
                h('div', { className: 'text-right' },
                  h('span', { className: 'sm:hidden text-[10px] text-[#786452] block' }, 'HPP/Porsi:'),
                  h('span', { className: 'font-mono font-extrabold text-[#2C1E16] text-xs' }, fmtIDR(p.hppPerPortion))
                ),
                (prod.packagings || []).length > 1 && h('button', {
                  onClick: () => removeRow('packagings', p.id),
                  className: 'text-xs text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition cursor-pointer font-bold',
                  title: 'Hapus Row'
                }, '🗑️')
              )

            )
          )
        )
      ),

      /* Bottom Action Navigation Button */
      h('div', { className: 'flex justify-end pt-2' },
        h('button', {
          onClick: () => onNavigateTab('offline'),
          className: 'btn-primary-brown text-white font-extrabold text-xs px-6 py-3.5 rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer'
        },
          'Lanjut ke Harga Jual Toko (Offline) ➔'
        )
      )

    );
  };
})();
