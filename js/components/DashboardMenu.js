/* ─────────────────── HALAMAN 1: DASHBOARD MANAJEMEN MENU (SABLE BROWN & SANDCASTLE) ─────────────────── */
(function() {
  const h = React.createElement;

  window.DashboardMenuComponent = function DashboardMenu({ products, activeId, onSelectProduct, onAddProduct, onDeleteProduct, onNavigateTab }) {
    const fmtIDR = window.AppMath.formatIDR;
    const calculateHPP = window.AppMath.calculateHPP;
    const calculateOfflinePrice = window.AppMath.calculateOfflinePrice;

    return h('div', { className: 'space-y-6 animate-fade-in max-w-6xl mx-auto pb-12' },
      
      /* Welcome Banner - Sandcastle Container */
      h('div', { className: 'bg-[#EFE9DC] border border-[#D4C8B5] p-6 md:p-8 rounded-3xl shadow-xs relative overflow-hidden space-y-4' },
        h('div', { className: 'relative z-10 space-y-2' },
          h('div', { className: 'inline-flex items-center gap-2 bg-[#4A3427] text-white text-xs px-3.5 py-1 rounded-full font-extrabold shadow-xs' },
            '👋 Halo, Juragan!'
          ),
          h('h2', { className: 'text-2xl md:text-3xl font-black text-[#241710] tracking-tight font-heading' }, 'Dashboard Manajemen Menu & Resep'),
          h('p', { className: 'text-xs md:text-sm text-[#6B5541] max-w-2xl leading-relaxed font-bold' },
            'Pantau seluruh resep aktif, analisa kesehatan margin keuntungan, dan eksekusi strategi harga offline & online dalam satu tempat.'
          )
        ),
        h('div', { className: 'pt-2 flex flex-wrap items-center gap-3 relative z-10' },
          h('button', {
            onClick: onAddProduct,
            className: 'btn-secondary-taupe text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer border border-[#6B5541]'
          },
            h('span', { className: 'text-white' }, '➕'),
            h('span', { className: 'text-white font-extrabold' }, 'Buat Resep & Hitung HPP Baru')
          )
        )
      ),

      /* Table / Grid of Active Recipes */
      h('div', { className: 'bg-white rounded-3xl p-6 shadow-xs border border-[#D4C8B5] space-y-4' },
        h('div', { className: 'flex items-center justify-between border-b border-[#D4C8B5] pb-4' },
          h('div', null,
            h('h3', { className: 'text-base font-black text-[#241710]' }, 'Daftar Menu Aktif'),
            h('p', { className: 'text-xs text-[#6B5541] font-extrabold' }, `Total ${products.length} menu tersimpan di sistem`)
          )
        ),

        /* Responsive Table */
        h('div', { className: 'overflow-x-auto' },
          h('table', { className: 'w-full text-left border-collapse' },
            h('thead', null,
              h('tr', { className: 'border-b border-[#D4C8B5] text-[11px] font-extrabold uppercase tracking-wider text-[#6B5541] bg-[#F7F3E9]' },
                h('th', { className: 'py-3.5 px-4 rounded-l-xl' }, 'Nama Produk / Resep'),
                h('th', { className: 'py-3.5 px-4 text-right' }, 'HPP Murni'),
                h('th', { className: 'py-3.5 px-4 text-right' }, 'Harga Jual (Offline)'),
                h('th', { className: 'py-3.5 px-4 text-center' }, 'Status Margin'),
                h('th', { className: 'py-3.5 px-4 text-center rounded-r-xl' }, 'Aksi Eksekusi')
              )
            ),
            h('tbody', { className: 'divide-y divide-[#D4C8B5] text-xs font-semibold text-[#241710]' },
              products.map(p => {
                const hppData = calculateHPP(p);
                const offlineData = calculateOfflinePrice(hppData.hppMurni, p);
                const isActive = p.id === activeId;

                return h('tr', {
                  key: p.id,
                  className: `hover:bg-[#F7F3E9] transition ${isActive ? 'bg-[#EFE9DC]/60' : ''}`
                },
                  /* Nama Produk */
                  h('td', { className: 'py-4 px-4' },
                    h('div', { className: 'flex items-center gap-3' },
                      h('div', { className: 'w-9 h-9 rounded-xl bg-[#EFE9DC] flex items-center justify-center font-bold text-[#241710] shadow-xs' },
                        '🍲'
                      ),
                      h('div', null,
                        h('div', { className: 'font-extrabold text-[#241710] text-sm' }, p.name),
                        isActive && h('span', { className: 'inline-block text-[10px] text-[#241710] font-extrabold bg-[#D4C8B5] px-2 py-0.5 rounded-full mt-0.5' }, 'Aktif Di-Edit')
                      )
                    )
                  ),

                  /* HPP Murni */
                  h('td', { className: 'py-4 px-4 text-right font-mono font-bold text-[#6B5541]' },
                    fmtIDR(hppData.hppMurni)
                  ),

                  /* Harga Offline */
                  h('td', { className: 'py-4 px-4 text-right font-mono font-black text-[#241710] text-sm' },
                    fmtIDR(offlineData.effectiveOfflinePrice)
                  ),

                  /* Status Margin Badge */
                  h('td', { className: 'py-4 px-4 text-center' },
                    h('span', {
                      className: `inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${offlineData.marginStatus.badgeClass}`
                    },
                      h('span', null, offlineData.marginStatus.icon),
                      h('span', null, `${offlineData.marginStatus.label} (${offlineData.marginRatio.toFixed(0)}%)`)
                    )
                  ),

                  /* Aksi */
                  h('td', { className: 'py-4 px-4 text-center' },
                    h('div', { className: 'flex items-center justify-center gap-2' },
                      h('button', {
                        onClick: () => {
                          onSelectProduct(p.id);
                          onNavigateTab('hpp');
                        },
                        className: 'btn-primary-brown text-white text-xs font-extrabold px-3.5 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1 shadow-xs'
                      },
                        '✏️ Edit Resep'
                      ),
                      products.length > 1 && h('button', {
                        onClick: () => onDeleteProduct(p.id),
                        className: 'p-1.5 rounded-xl text-[#6B5541] hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer font-bold',
                        title: 'Hapus Resep'
                      }, '🗑️')
                    )
                  )
                );
              })
            )
          )
        )
      )
    );
  };
})();
