/* ─────────────────── SLIDE-OVER DRAWER COMPONENT ─────────────────── */
(function() {
  const h = React.createElement;

  window.DrawerComponent = function Drawer({
    isOpen,
    onClose,
    products,
    activeId,
    onSelectProduct,
    onAddProduct,
    onDeleteProduct,
    onUpdateProductCommission,
    onUpdateProductFixedFee,
    commissionPercent,
    fixedFee
  }) {
    const fmtIDR = window.AppMath.formatIDR;
    const calculateHPP = window.AppMath.calculateHPP;

    if (!isOpen) return null;

    return h('div', { className: 'fixed inset-0 z-50 overflow-hidden select-none' },
      /* Backdrop */
      h('div', {
        className: 'absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity',
        onClick: onClose
      }),

      /* Drawer Container */
      h('div', { className: 'fixed inset-y-0 left-0 max-w-full flex' },
        h('div', { className: 'w-80 bg-slate-900 text-slate-100 flex flex-col shadow-2xl animate-slide-left border-r border-slate-800' },
          
          /* Header */
          h('div', { className: 'p-5 border-b border-slate-800 flex items-center justify-between' },
            h('div', { className: 'flex items-center gap-2.5' },
              h('div', { className: 'w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold' }, '☰'),
              h('div', null,
                h('h3', { className: 'text-sm font-extrabold text-white' }, 'Manajemen Produk'),
                h('p', { className: 'text-[10px] text-indigo-400 font-semibold' }, 'Kalkulator Keuangan UMKM')
              )
            ),
            h('button', {
              onClick: onClose,
              className: 'p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer font-bold'
            }, '✕')
          ),

          /* Product List */
          h('div', { className: 'flex-1 overflow-y-auto p-4 space-y-2' },
            h('div', { className: 'flex items-center justify-between text-[10px] font-extrabold tracking-widest text-slate-400 px-1 mb-2' },
              h('span', null, 'DAFTAR PRODUK'),
              h('span', { className: 'bg-slate-800 text-indigo-300 px-2 py-0.5 rounded font-bold' }, products.length)
            ),

            products.map(p => {
              const isActive = p.id === activeId;
              const { hppPerUnit } = calculateHPP(p);

              return h('div', {
                key: p.id,
                onClick: () => {
                  onSelectProduct(p.id);
                  onClose();
                },
                className: `p-3.5 rounded-xl cursor-pointer transition-all border flex flex-col gap-1 ${
                  isActive
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg'
                    : 'bg-slate-800/40 border-transparent hover:bg-slate-800 hover:border-slate-700 text-slate-300'
                }`
              },
                h('div', { className: 'flex items-center justify-between' },
                  h('span', { className: 'text-sm font-bold truncate' }, p.name),
                  products.length > 1 && h('button', {
                    onClick: (e) => {
                      e.stopPropagation();
                      onDeleteProduct(p.id);
                    },
                    className: `p-1 rounded hover:bg-rose-600 hover:text-white transition ${
                      isActive ? 'text-indigo-200' : 'text-slate-500'
                    }`,
                    title: 'Hapus Produk'
                  }, '🗑️')
                ),
                h('div', { className: 'flex justify-between items-center text-[11px] mt-1' },
                  h('span', { className: isActive ? 'text-indigo-200' : 'text-slate-400' }, 'HPP/Unit:'),
                  h('span', { className: 'font-extrabold' }, fmtIDR(hppPerUnit))
                )
              );
            }),

            h('button', {
              onClick: () => {
                onAddProduct();
                onClose();
              },
              className: 'w-full mt-3 py-3 border-2 border-dashed border-slate-700 hover:border-indigo-500 hover:text-white rounded-xl text-sm font-bold text-slate-400 flex items-center justify-center gap-2 transition bg-slate-800/20 cursor-pointer'
            },
              h('span', null, '➕'),
              h('span', null, 'Tambah Produk Baru')
            )
          ),

          /* Drawer Footer: Global Platform Commission Settings */
          h('div', { className: 'p-4 border-t border-slate-800 bg-slate-950/60 text-xs space-y-3' },
            h('span', { className: 'text-[10px] font-extrabold tracking-widest text-slate-400 block uppercase' },
              'Pengaturan Komisi Platform Online'
            ),

            h('div', null,
              h('label', { className: 'text-[10px] font-semibold text-slate-400 block mb-1' }, 'Komisi Platform (%)'),
              h('div', { className: 'relative' },
                h('input', {
                  type: 'number',
                  min: '0',
                  max: '99',
                  value: commissionPercent,
                  onChange: (e) => onUpdateProductCommission(Math.min(99, Math.max(0, parseFloat(e.target.value) || 0))),
                  className: 'w-full bg-slate-900 border border-slate-700 text-white rounded-lg text-xs px-3 py-1.5 focus:outline-none focus:border-indigo-500'
                }),
                h('span', { className: 'absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500' }, '%')
              )
            ),

            h('div', null,
              h('label', { className: 'text-[10px] font-semibold text-slate-400 block mb-1' }, 'Biaya Tetap per Transaksi'),
              h('div', { className: 'relative' },
                h('span', { className: 'absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-500' }, 'Rp'),
                h('input', {
                  type: 'number',
                  min: '0',
                  value: fixedFee,
                  onChange: (e) => onUpdateProductFixedFee(Math.max(0, parseFloat(e.target.value) || 0)),
                  className: 'w-full bg-slate-900 border border-slate-700 text-white rounded-lg text-xs pl-8 pr-3 py-1.5 focus:outline-none focus:border-indigo-500'
                })
              )
            )
          )

        )
      )
    );
  };
})();
