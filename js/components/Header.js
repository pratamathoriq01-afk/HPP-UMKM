/* ─────────────────── HEADER COMPONENT (PRO-GROWTH LEDGER TOP BAR) ─────────────────── */
(function() {
  const h = React.createElement;

  window.HeaderComponent = function Header({
    productName,
    onUpdateProductName,
    onToggleDrawer,
    onAddProduct
  }) {
    return h('header', { className: 'sticky top-0 z-50 bg-[#002045] text-white shadow-md' },
      h('div', { className: 'max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4' },
        /* Left: Drawer ☰ + Brand & Title Input */
        h('div', { className: 'flex items-center gap-3 flex-1' },
          h('button', {
            onClick: onToggleDrawer,
            title: 'Buka Daftar Produk (☰)',
            className: 'w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 text-white transition flex items-center justify-center font-bold text-lg cursor-pointer border border-white/10'
          }, '☰'),

          h('div', { className: 'flex items-center gap-3 flex-1 max-w-lg' },
            h('div', { className: 'hidden sm:flex w-8 h-8 rounded-lg bg-[#85f6ad] text-[#002045] items-center justify-center font-black text-sm shadow-xs' },
              '📊'
            ),
            h('div', { className: 'flex-1' },
              h('div', { className: 'flex items-center gap-2' },
                h('input', {
                  type: 'text',
                  value: productName,
                  onChange: (e) => onUpdateProductName(e.target.value),
                  className: 'text-lg font-bold text-white bg-transparent border-b border-white/20 hover:border-white/50 focus:border-[#85f6ad] focus:outline-none w-full max-w-xs pb-0.5 font-sans',
                  placeholder: 'Nama Produk...'
                }),
                /* Professional SAK EMKM Pastel Badge */
                h('span', { className: 'hidden md:inline-flex items-center gap-1.5 bg-[#85f6ad]/15 text-[#85f6ad] font-bold border border-[#85f6ad]/30 px-2.5 py-0.5 rounded-full text-[11px] whitespace-nowrap' },
                  h('span', { className: 'w-1.5 h-1.5 rounded-full bg-[#85f6ad] animate-pulse' }),
                  'SAK EMKM Financial Standard'
                )
              )
            )
          )
        ),

        /* Right Quick Action: Add New Product */
        h('div', { className: 'flex items-center gap-3' },
          h('button', {
            onClick: onAddProduct,
            className: 'px-4 py-2 bg-[#006d3c] hover:bg-[#00522c] text-white font-bold text-xs rounded-lg transition flex items-center gap-2 cursor-pointer shadow-xs border border-[#85f6ad]/20'
          },
            h('span', null, '➕'),
            h('span', { className: 'hidden sm:inline' }, 'Tambah Produk Baru')
          )
        )
      )
    );
  };
})();
