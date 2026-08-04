/* ─────────────────── TAB 1: BIAYA PRODUKSI & HPP (SAK EMKM) ─────────────────── */
(function() {
  const h = React.createElement;

  window.TabHPPComponent = function TabHPP({ prod, onUpdateProduct }) {
    const fmtIDR = window.AppMath.formatIDR;
    const calculateHPP = window.AppMath.calculateHPP;
    const UNITS = window.AppConfig.UNITS;
    const FlexibleInput = window.FlexibleInput;
    const Tip = window.Tip;

    const hppData = calculateHPP(prod);

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

    return h('div', { className: 'space-y-6 animate-fade-in max-w-5xl mx-auto' },
      /* Top Banner Info */
      h('div', { className: 'bg-purple-50 border border-purple-200 rounded-2xl p-5 flex items-center justify-between' },
        h('div', null,
          h('h2', { className: 'text-base font-black text-purple-950' }, 'Modul 1: Biaya Produksi & HPP'),
          h('p', { className: 'text-xs text-purple-700 mt-0.5 leading-relaxed' },
            'Perhitungan Harga Pokok Produksi berstandar akuntansi ',
            h('strong', null, 'SAK EMKM'),
            ' (Bahan Baku + Tenaga Kerja Langsung + Overhead).'
          )
        ),

        h('div', { className: 'flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-purple-200 shadow-sm' },
          h('label', { className: 'text-xs font-bold text-slate-600 uppercase tracking-wider' }, 'Kuantitas Batch:'),
          h('div', { className: 'w-24' },
            h(FlexibleInput, {
              value: prod.targetQty,
              onChange: (v) => onUpdateProduct('targetQty', Math.max(1, v)),
              suffix: 'pcs'
            })
          )
        )
      ),

      /* Section A: Bahan Baku Langsung */
      h('div', { className: 'app-card p-6' },
        h('div', { className: 'flex items-center justify-between mb-4' },
          h('h3', { className: 'text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center' },
            'A. Biaya Bahan Baku Langsung',
            h(Tip, { text: 'Bahan pokok yang terpakai habis secara fisik dalam proses pembuatan produk.' })
          ),
          h('button', {
            onClick: () => addRow('materials'),
            className: 'text-xs font-bold text-purple-700 hover:text-purple-900 transition flex items-center gap-1 cursor-pointer'
          },
            h('span', null, '➕'),
            h('span', null, 'Tambah Bahan Baku')
          )
        ),

        /* Table Header */
        h('div', { className: 'grid grid-cols-12 gap-2 mb-2 px-2 text-[9px] font-extrabold uppercase tracking-wider text-slate-400' },
          h('div', { className: 'col-span-4' }, 'Nama Bahan'),
          h('div', { className: 'col-span-2 text-center' }, 'Jumlah'),
          h('div', { className: 'col-span-2 text-center' }, 'Satuan'),
          h('div', { className: 'col-span-2 text-right' }, 'Harga / Satuan'),
          h('div', { className: 'col-span-2 text-right' }, 'Subtotal')
        ),

        /* Material Rows */
        h('div', { className: 'space-y-2' },
          (prod.materials || []).map(m => {
            const subTotal = (parseFloat(m.qty) || 0) * (parseFloat(m.unitPrice) || 0);
            return h('div', { key: m.id, className: 'grid grid-cols-12 gap-2 items-center bg-slate-50 hover:bg-slate-100/70 p-2 rounded-xl border border-slate-200/80 transition' },
              h('div', { className: 'col-span-4' },
                h('input', {
                  type: 'text',
                  value: m.name,
                  onChange: (e) => updateRow('materials', m.id, 'name', e.target.value),
                  placeholder: 'Contoh: Beras Pulen...',
                  className: 'w-full bg-white border border-slate-200 rounded-lg text-xs px-3 py-1.5 focus:outline-none focus:border-indigo-500 font-semibold text-slate-800'
                })
              ),
              h('div', { className: 'col-span-2' },
                h(FlexibleInput, {
                  value: m.qty,
                  onChange: (v) => updateRow('materials', m.id, 'qty', v)
                })
              ),
              h('div', { className: 'col-span-2' },
                h('select', {
                  value: m.unit,
                  onChange: (e) => updateRow('materials', m.id, 'unit', e.target.value),
                  className: 'w-full bg-white border border-slate-200 rounded-lg text-xs px-2 py-1.5 focus:outline-none focus:border-indigo-500 font-semibold text-slate-700'
                },
                  UNITS.map(u => h('option', { key: u, value: u }, u))
                )
              ),
              h('div', { className: 'col-span-2' },
                h(FlexibleInput, {
                  value: m.unitPrice,
                  onChange: (v) => updateRow('materials', m.id, 'unitPrice', v),
                  prefix: 'Rp'
                })
              ),
              h('div', { className: 'col-span-2 flex items-center justify-between gap-1 pl-1' },
                h('span', { className: 'text-xs font-extrabold text-slate-800 text-right w-full' }, fmtIDR(subTotal)),
                h('button', {
                  onClick: () => removeRow('materials', m.id),
                  disabled: prod.materials.length <= 1,
                  className: 'p-1 rounded text-slate-300 hover:text-rose-600 hover:bg-rose-50 disabled:opacity-20 transition cursor-pointer',
                  title: 'Hapus'
                }, '🗑️')
              )
            );
          })
        )
      ),

      /* Section B: Biaya Tenaga Kerja Langsung (BTKL) */
      h('div', { className: 'app-card p-6' },
        h('div', { className: 'flex items-center justify-between mb-4' },
          h('h3', { className: 'text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center' },
            'B. Biaya Tenaga Kerja Langsung (BTKL)',
            h(Tip, { text: 'Upah juru masak, pembuat, atau asisten yang terlibat langsung dalam proses pembuatan produk batch ini.' })
          ),
          h('button', {
            onClick: () => addRow('labors'),
            className: 'text-xs font-bold text-purple-700 hover:text-purple-900 transition flex items-center gap-1 cursor-pointer'
          },
            h('span', null, '➕'),
            h('span', null, 'Tambah Upah BTKL')
          )
        ),

        h('div', { className: 'space-y-2' },
          (prod.labors || []).map(l =>
            h('div', { key: l.id, className: 'flex gap-2 items-center bg-slate-50 hover:bg-slate-100/70 p-2 rounded-xl border border-slate-200/80 transition' },
              h('input', {
                type: 'text',
                value: l.name,
                onChange: (e) => updateRow('labors', l.id, 'name', e.target.value),
                placeholder: 'Contoh: Upah Asisten Masak per Batch...',
                className: 'flex-1 bg-white border border-slate-200 rounded-lg text-xs px-3 py-1.5 focus:outline-none focus:border-indigo-500 font-semibold text-slate-800'
              }),
              h('div', { className: 'w-40' },
                h(FlexibleInput, {
                  value: l.price,
                  onChange: (v) => updateRow('labors', l.id, 'price', v),
                  prefix: 'Rp'
                })
              ),
              h('button', {
                onClick: () => removeRow('labors', l.id),
                disabled: (prod.labors || []).length <= 1,
                className: 'p-1 rounded text-slate-300 hover:text-rose-600 hover:bg-rose-50 disabled:opacity-20 transition cursor-pointer'
              }, '🗑️')
            )
          )
        )
      ),

      /* Section C: Biaya Overhead Pabrik (BOP) */
      h('div', { className: 'app-card p-6' },
        h('div', { className: 'flex items-center justify-between mb-4' },
          h('h3', { className: 'text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center' },
            'C. Biaya Overhead Pabrik (BOP)',
            h(Tip, { text: 'Biaya pendukung produksi tidak langsung seperti gas, kemasan, listrik, dan air per batch.' })
          ),
          h('button', {
            onClick: () => addRow('overheads'),
            className: 'text-xs font-bold text-purple-700 hover:text-purple-900 transition flex items-center gap-1 cursor-pointer'
          },
            h('span', null, '➕'),
            h('span', null, 'Tambah Overhead')
          )
        ),

        h('div', { className: 'space-y-2' },
          (prod.overheads || []).map(o =>
            h('div', { key: o.id, className: 'flex gap-2 items-center bg-slate-50 hover:bg-slate-100/70 p-2 rounded-xl border border-slate-200/80 transition' },
              h('input', {
                type: 'text',
                value: o.name,
                onChange: (e) => updateRow('overheads', o.id, 'name', e.target.value),
                placeholder: 'Contoh: Gas Melon + Kemasan Box...',
                className: 'flex-1 bg-white border border-slate-200 rounded-lg text-xs px-3 py-1.5 focus:outline-none focus:border-indigo-500 font-semibold text-slate-800'
              }),
              h('div', { className: 'w-40' },
                h(FlexibleInput, {
                  value: o.price,
                  onChange: (v) => updateRow('overheads', o.id, 'price', v),
                  prefix: 'Rp'
                })
              ),
              h('button', {
                onClick: () => removeRow('overheads', o.id),
                disabled: (prod.overheads || []).length <= 1,
                className: 'p-1 rounded text-slate-300 hover:text-rose-600 hover:bg-rose-50 disabled:opacity-20 transition cursor-pointer'
              }, '🗑️')
            )
          )
        )
      ),

      /* Official SAK EMKM Cost of Production Statement Report */
      h('div', { className: 'app-card p-6 border-2 border-purple-200 bg-gradient-to-b from-white to-purple-50/10' },
        h('h3', { className: 'text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-4 border-b border-slate-200 pb-2' },
          'Laporan Harga Pokok Produksi (HPP) SAK EMKM'
        ),

        h('div', { className: 'space-y-2.5 text-xs text-slate-700 font-medium' },
          h('div', { className: 'flex justify-between' },
            h('span', null, '1. Biaya Bahan Baku Langsung:'),
            h('span', { className: 'font-bold text-slate-900' }, fmtIDR(hppData.totalMaterials))
          ),
          h('div', { className: 'flex justify-between' },
            h('span', null, '2. Biaya Tenaga Kerja Langsung (BTKL):'),
            h('span', { className: 'font-bold text-slate-900' }, fmtIDR(hppData.totalLabors))
          ),
          h('div', { className: 'flex justify-between' },
            h('span', null, '3. Biaya Overhead Pabrik (BOP):'),
            h('span', { className: 'font-bold text-slate-900' }, fmtIDR(hppData.totalOverheads))
          ),
          
          h('div', { className: 'flex justify-between pt-2 border-t border-slate-200 text-sm font-extrabold text-slate-800' },
            h('span', null, 'Total Biaya Manufaktur / Batch:'),
            h('span', null, fmtIDR(hppData.totalProductionCost))
          ),

          h('div', { className: 'flex justify-between pt-3 border-t-2 border-dashed border-purple-200 text-base font-black text-purple-850' },
            h('span', null, 'Harga Pokok Produksi (HPP) per Unit:'),
            h('span', null,
              fmtIDR(hppData.hppPerUnit),
              ' ',
              h('span', { className: 'text-xs font-normal text-slate-400' }, `(${hppData.qty} pcs)`)
            )
          )
        )
      )
    );
  };
})();
