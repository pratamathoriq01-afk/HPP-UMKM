/* ─────────────────── SLIDE-OVER DRAWER COMPONENT (SABLE BROWN & SANDCASTLE) ─────────────────── */
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
        className: 'absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity',
        onClick: onClose
      }),

      /* Drawer Container */
      h('div', { className: 'fixed inset-y-0 left-0 max-w-full flex' },
        h('div', { className: 'w-80 bg-[#F7F3E9] text-[#241710] flex flex-col shadow-2xl animate-slide-left border-r border-[#D4C8B5]' },
          
          /* Header - 100% Crisp Pure White Text on Sable Brown */
          h('div', { className: 'p-5 bg-[#4A3427] text-white flex items-center justify-between shadow-xs border-b border-[#241710]' },
            h('div', { className: 'flex items-center gap-2.5' },
              h('div', { className: 'w-8 h-8 rounded-lg bg-white/15 text-white flex items-center justify-center font-bold border border-white/20' }, '☰'),
              h('div', null,
                h('h3', { className: 'text-sm font-extrabold text-white tracking-tight' }, 'Manajemen Produk'),
                h('p', { className: 'text-[10px] text-[#EFE9DC] font-bold' }, 'Kalkulator Keuangan UMKM')
              )
            ),
            h('button', {
              onClick: onClose,
              className: 'p-1.5 rounded-lg text-white hover:bg-white/20 transition cursor-pointer font-bold'
            }, '✕')
          ),

          /* Product List */
          h('div', { className: 'flex-1 overflow-y-auto p-4 space-y-2' },
            h('div', { className: 'flex items-center justify-between text-[10px] font-extrabold tracking-widest text-[#6B5541] px-1 mb-2' },
              h('span', null, 'DAFTAR PRODUK'),
              h('span', { className: 'bg-[#EFE9DC] text-[#241710] border border-[#D4C8B5] px-2 py-0.5 rounded font-extrabold' }, products.length)
            ),

            products.map(p => {
              const isActive = p.id === activeId;
              const hppData = calculateHPP(p);

              return h('div', {
                key: p.id,
                onClick: () => {
                  onSelectProduct(p.id);
                  onClose();
                },
                className: `p-3.5 rounded-xl cursor-pointer transition-all border flex flex-col gap-1 shadow-xs ${
                  isActive
                    ? 'bg-[#4A3427] border-[#241710] text-white shadow-sm'
                    : 'bg-white border-[#D4C8B5] hover:border-[#8C7259] hover:bg-[#F0E6D2] text-[#241710]'
                }`
              },
                h('div', { className: 'flex items-center justify-between' },
                  h('span', { className: `text-sm font-extrabold truncate ${isActive ? 'text-white' : 'text-[#241710]'}` }, p.name),
                  products.length > 1 && h('button', {
                    onClick: (e) => {
                      e.stopPropagation();
                      onDeleteProduct(p.id);
                    },
                    className: `p-1 rounded hover:bg-rose-600 hover:text-white transition ${
                      isActive ? 'text-white' : 'text-[#6B5541]'
                    }`,
                    title: 'Hapus Produk'
                  }, '🗑️')
                ),
                h('div', { className: 'flex justify-between items-center text-[11px] mt-1' },
                  h('span', { className: isActive ? 'text-[#EFE9DC] font-semibold' : 'text-[#6B5541] font-bold' }, 'HPP/Porsi:'),
                  h('span', { className: `font-extrabold font-mono ${isActive ? 'text-white' : 'text-[#241710]'}` }, fmtIDR(hppData.hppMurni))
                )
              );
            }),

            h('button', {
              onClick: () => {
                onAddProduct();
                onClose();
              },
              className: 'w-full mt-3 py-3 border-2 border-dashed border-[#D4C8B5] hover:border-[#4A3427] hover:text-[#241710] rounded-xl text-sm font-extrabold text-[#6B5541] flex items-center justify-center gap-2 transition bg-white cursor-pointer'
            },
              h('span', null, '➕'),
              h('span', null, 'Tambah Produk Baru')
            )
          ),

          /* Drawer Footer: Global Platform Commission Settings */
          h('div', { className: 'p-4 border-t border-[#D4C8B5] bg-[#EFE9DC] text-xs space-y-3' },
            h('span', { className: 'text-[10px] font-extrabold tracking-widest text-[#241710] block uppercase' },
              'Pengaturan Komisi Platform Online'
            ),

            h('div', null,
              h('label', { className: 'text-[10px] font-extrabold text-[#241710] block mb-1' }, 'Komisi Platform (%)'),
              h('div', { className: 'relative' },
                h('input', {
                  type: 'number',
                  min: '0',
                  max: '99',
                  value: commissionPercent,
                  onChange: (e) => onUpdateProductCommission(Math.min(99, Math.max(0, parseFloat(e.target.value) || 0))),
                  className: 'w-full bg-white border border-[#D4C8B5] text-[#241710] rounded-lg text-xs font-bold px-3 py-1.5 focus:outline-none focus:border-[#4A3427]'
                }),
                h('span', { className: 'absolute right-3 top-1/2 -translate-y-1/2 text-xs font-extrabold text-[#6B5541]' }, '%')
              )
            ),

            h('div', null,
              h('label', { className: 'text-[10px] font-extrabold text-[#241710] block mb-1' }, 'Biaya Tetap per Transaksi'),
              h('div', { className: 'relative' },
                h('span', { className: 'absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-extrabold text-[#6B5541]' }, 'Rp'),
                h('input', {
                  type: 'number',
                  min: '0',
                  value: fixedFee,
                  onChange: (e) => onUpdateProductFixedFee(Math.max(0, parseFloat(e.target.value) || 0)),
                  className: 'w-full bg-white border border-[#D4C8B5] text-[#241710] rounded-lg text-xs font-bold pl-8 pr-3 py-1.5 focus:outline-none focus:border-[#4A3427]'
                })
              )
            ),

            /* Data Safety Controls */
            h('div', { className: 'pt-2 border-t border-[#D4C8B5] flex flex-col gap-2' },
              h('button', {
                onClick: () => {
                  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
                  const downloadAnchor = document.createElement('a');
                  downloadAnchor.setAttribute("href", dataStr);
                  downloadAnchor.setAttribute("download", `backup_resep_umkm_${new Date().toISOString().slice(0,10)}.json`);
                  document.body.appendChild(downloadAnchor);
                  downloadAnchor.click();
                  downloadAnchor.remove();
                },
                className: 'w-full py-2 bg-[#4A3427] hover:bg-[#241710] text-white rounded-lg text-[11px] font-extrabold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs border border-[#241710]'
              },
                '📥 Export / Backup Data JSON'
              ),
              h('button', {
                onClick: () => {
                  if (confirm('Apakah Anda yakin ingin mengembalikan seluruh resep ke preset awal pabrik? Data tersimpan lokal saat ini akan diperbarui.')) {
                    localStorage.removeItem('umkm_cogs_products_v5');
                    window.location.reload();
                  }
                },
                className: 'w-full py-2 bg-[#7F1D1D] hover:bg-[#991B1B] text-white rounded-lg text-[10px] font-extrabold transition flex items-center justify-center gap-1 cursor-pointer shadow-xs border border-[#991B1B]'
              },
                '🔄 Reset Ke Preset Default'
              )
            )
          )

        )
      )
    );
  };
})();
