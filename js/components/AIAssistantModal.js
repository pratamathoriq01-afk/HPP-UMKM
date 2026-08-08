/* ─────────────────── JURAGAN AI ADVISOR MODAL COMPONENT (SABLE BROWN & SANDCASTLE) ─────────────────── */
(function() {
  const h = React.createElement;

  window.AIAssistantModalComponent = function AIAssistantModal({
    isOpen,
    onClose,
    prod,
    hppData,
    offlineData,
    onlineData,
    promoData
  }) {
    const fmtIDR = window.AppMath.formatIDR;
    const [advice, setAdvice] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const generateAdvice = () => {
      setLoading(true);
      setTimeout(() => {
        let result = `📌 **HASIL CONSULTATION JURAGAN AI ADVISOR FOR: ${prod.name || 'Produk UMKM'}**\n\n`;
        
        result += `1. **ANALISIS HPP MURNI (${fmtIDR(hppData.hppMurni)})**\n`;
        result += `   • Porsi terbesar HPP Anda didominasi oleh Bahan Utama (${hppData.mainPct.toFixed(1)}%).\n`;
        result += `   • Rekomendasi AI: Negosiasikan pembelian grosir untuk bahan utama atau cari alternatif suplier lokal.\n\n`;

        result += `2. **STRATEGI HARGA TOKO OFFLINE (${fmtIDR(offlineData.effectiveOfflinePrice)})**\n`;
        result += `   • Status Margin: **${offlineData.marginStatus.label}** (${offlineData.marginRatio.toFixed(0)}%).\n`;
        if (offlineData.marginRatio < 30) {
          result += `   • ⚠️ PERIKSA: Margin di bawah 30% berisiko tergerus inflasi operasional. Pertimbangkan menaikkan harga jual toko secara bertahap.\n\n`;
        } else {
          result += `   • ✅ Margin toko fisik tergolong sangat sehat dan memberikan ruang gerak bisnis yang aman.\n\n`;
        }

        result += `3. **HARGA ONLINE REVERSE-MARGIN (${fmtIDR(onlineData.effectiveOnlinePrice)})**\n`;
        result += `   • Potongan komisi platform (${prod.commissionPercent}%) & biaya tetap (${fmtIDR(prod.fixedFee)}).\n`;
        result += `   • Pencairan bersih toko tetap aman pada **${fmtIDR(onlineData.simulatedPayout)}**.\n\n`;

        result += `4. **EVALUASI SIMULASI PROMO ONLINE**\n`;
        if (promoData.isBoncos) {
          result += `   • 🔴 **PERINGATAN BONCOS!** Skenario promo saat ini menyebabkan kerugian bersih sebesar **${fmtIDR(promoData.netProfit)}**.\n`;
          result += `   • Tindakan Segera: Naikkan Syarat Minimal Belanja atau turunkan batas Maksimal Diskon (Cap) aplikasi.\n`;
        } else {
          result += `   • 🟢 **AMAN / PROFITABLE**: Skenario promo menghasilkan sisa keuntungan bersih **+${fmtIDR(promoData.netProfit)}** per pesanan.\n`;
        }

        setAdvice(result);
        setLoading(false);
      }, 700);
    };

    React.useEffect(() => {
      if (isOpen) {
        generateAdvice();
      }
    }, [isOpen, prod.id]);

    if (!isOpen) return null;

    return h('div', { className: 'fixed inset-0 z-50 overflow-y-auto select-none' },
      /* Backdrop */
      h('div', {
        className: 'fixed inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity',
        onClick: onClose
      }),

      /* Modal Dialog Box */
      h('div', { className: 'flex min-h-full items-center justify-center p-4 text-center' },
        h('div', { className: 'w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white text-left align-middle shadow-2xl transition-all border border-[#D4C8B5] animate-fade-in' },
          
          /* Header */
          h('div', { className: 'p-5 bg-[#4A3427] text-white flex items-center justify-between shadow-xs border-b border-[#241710]' },
            h('div', { className: 'flex items-center gap-3' },
              h('div', { className: 'w-9 h-9 rounded-xl bg-white/15 text-white flex items-center justify-center font-bold text-lg border border-white/20' }, '🤖'),
              h('div', null,
                h('h3', { className: 'text-sm font-extrabold text-white tracking-tight' }, 'Juragan AI Advisor (Konsultasi Real-Time)'),
                h('p', { className: 'text-[10px] text-[#EFE9DC] font-bold' }, `Analisis Spesifik: ${prod.name || 'Produk UMKM'}`)
              )
            ),
            h('button', {
              onClick: onClose,
              className: 'p-1.5 rounded-lg text-white hover:bg-white/20 transition cursor-pointer font-bold'
            }, '✕')
          ),

          /* Body Content */
          h('div', { className: 'p-6 space-y-4 text-xs leading-relaxed text-[#241710] font-sans' },
            loading ? h('div', { className: 'py-12 text-center space-y-3' },
              h('div', { className: 'w-10 h-10 border-4 border-[#4A3427] border-t-transparent rounded-full animate-spin mx-auto' }),
              h('p', { className: 'text-xs text-[#6B5541] font-extrabold' }, 'Juragan AI Advisor sedang menganalisis data finansial resep Anda...')
            ) : h('div', { className: 'bg-[#F0E6D2] p-5 rounded-2xl border border-[#D4C8B5] space-y-3 whitespace-pre-line font-medium text-[#241710]' },
              advice
            )
          ),

          /* Footer */
          h('div', { className: 'p-4 bg-[#EFE9DC] border-t border-[#D4C8B5] flex justify-end gap-2' },
            h('button', {
              onClick: onClose,
              className: 'btn-primary-brown px-6 py-2.5 rounded-xl text-white font-extrabold text-xs shadow-xs transition cursor-pointer'
            },
              'Tutup Advisory'
            )
          )

        )
      )
    );
  };
})();
