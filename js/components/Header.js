/* ─────────────────── SABLE BROWN & SANDCASTLE MINIMALIST HEADER ─────────────────── */
(function() {
  const h = React.createElement;

  window.HeaderComponent = function Header({
    productName,
    onUpdateProductName,
    onToggleDrawer,
    onAddProduct,
    onOpenAI
  }) {
    return h('header', { className: 'sticky top-0 z-50 bg-[#EFE9DC] text-[#241710] shadow-xs border-b border-[#D4C8B5]' },
      h('div', { className: 'max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4' },
        
        /* Left: Drawer ☰ + Brand & Title Input */
        h('div', { className: 'flex items-center gap-3 flex-1' },
          h('button', {
            onClick: onToggleDrawer,
            title: 'Buka Daftar Resep (☰)',
            className: 'w-9 h-9 rounded-xl bg-[#F7F3E9] hover:bg-[#D4C8B5] text-[#241710] transition flex items-center justify-center font-bold text-base cursor-pointer border border-[#D4C8B5] shadow-xs'
          }, '☰'),

          h('div', { className: 'flex items-center gap-3 flex-1 max-w-lg' },
            h('div', { className: 'hidden sm:flex w-9 h-9 rounded-xl bg-[#4A3427] text-white items-center justify-center font-black text-base shadow-xs' },
              '🍲'
            ),
            h('div', { className: 'flex-1' },
              h('div', { className: 'flex items-center gap-2' },
                h('input', {
                  type: 'text',
                  value: productName || '',
                  onChange: (e) => onUpdateProductName(e.target.value),
                  className: 'text-base sm:text-lg font-black text-[#241710] bg-transparent border-b-2 border-[#BDB6A3] hover:border-[#8C7259] focus:border-[#4A3427] focus:outline-none w-full max-w-xs pb-0.5 font-heading tracking-tight',
                  placeholder: 'Nama Resep / Produk...'
                }),
                h('span', { className: 'hidden md:inline-flex items-center gap-1.5 bg-[#F7F3E9] text-[#241710] font-extrabold border border-[#D4C8B5] px-2.5 py-0.5 rounded-full text-[10px] whitespace-nowrap' },
                  h('span', { className: 'w-2 h-2 rounded-full bg-[#8C7259] animate-pulse' }),
                  'SAK EMKM Standard'
                )
              )
            )
          )
        ),

        /* Right Actions: AI Advisor & Add Recipe (Matched Light Brown & Pure White Text) */
        h('div', { className: 'flex items-center gap-2.5' },
          
          /* AI Advisor Button - Light Brown Pill with 100% PURE WHITE text */
          h('button', {
            onClick: onOpenAI,
            className: 'btn-secondary-taupe px-4 py-2.5 rounded-xl text-white font-extrabold text-xs flex items-center gap-2 cursor-pointer shadow-xs'
          },
            h('span', { className: 'text-sm' }, '🤖'),
            h('span', { className: 'hidden sm:inline font-heading tracking-wide text-white font-extrabold' }, 'Juragan AI Advisor')
          ),

          /* Add Product Button - Light Brown Pill with 100% PURE WHITE text */
          h('button', {
            onClick: onAddProduct,
            className: 'btn-secondary-taupe px-4 py-2.5 rounded-xl text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs'
          },
            h('span', { className: 'text-white' }, '➕'),
            h('span', { className: 'hidden sm:inline font-heading text-white font-extrabold' }, 'Resep Baru')
          )

        )
      )
    );
  };
})();
