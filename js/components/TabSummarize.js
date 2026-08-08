/* ─────────────────── MODUL 5: SUMMARIZE & AI ADVISOR CENTER (SABLE BROWN & SANDCASTLE) ─────────────────── */
(function() {
  const h = React.createElement;

  window.TabSummarizeComponent = function TabSummarize({ prod, onOpenAI }) {
    const fmtIDR = window.AppMath.formatIDR;
    const calculateHPP = window.AppMath.calculateHPP;
    const calculateOfflinePrice = window.AppMath.calculateOfflinePrice;
    const calculateOnlinePrice = window.AppMath.calculateOnlinePrice;
    const calculatePromoSim = window.AppMath.calculatePromoSim;

    const hppData = calculateHPP(prod);
    const offlineData = calculateOfflinePrice(hppData.hppMurni, prod);
    const onlineData = calculateOnlinePrice(offlineData.effectiveOfflinePrice, prod);
    const promoData = calculatePromoSim(hppData.hppMurni, onlineData.effectiveOnlinePrice, prod);

    const [aiAnalysis, setAiAnalysis] = React.useState(null);
    const [loadingAI, setLoadingAI] = React.useState(false);

    const handleRunFullAI = () => {
      setLoadingAI(true);
      setTimeout(() => {
        setAiAnalysis({
          status: 'success',
          timestamp: new Date().toLocaleTimeString('id-ID'),
          summary: `Berdasarkan kalkulasi terpadu, produk "${prod.name}" memiliki struktur HPP Murni ${fmtIDR(hppData.hppMurni)}. Margin harga toko fisik sebesar ${offlineData.marginRatio.toFixed(0)}% tergolong ${offlineData.marginRatio >= 30 ? 'SANGAT SEHAT' : 'PERLU DIPERTIMBANGKAN'}. Pada kanal online, pencairan bersih Anda tetap terjaga pada ${fmtIDR(onlineData.simulatedPayout)}.`,
          recommendation: promoData.isBoncos
            ? '⚠️ PERINGATAN PROMO: Skenario promo online saat ini menyebabkan kerugian! Naikkan syarat minimal belanja atau turunkan batas diskon maksimal.'
            : '✅ MARGIN AMAN: Skenario promo online memberikan laba bersih positif per transaksi. Anda dapat menjalankan promo dengan aman.'
        });
        setLoadingAI(false);
      }, 600);
    };

    React.useEffect(() => {
      handleRunFullAI();
    }, [prod.id]);

    return h('div', { className: 'space-y-6 animate-fade-in max-w-5xl mx-auto pb-12' },

      /* Executive Summary Header - Sable Brown Card (100% PURE WHITE TEXT) */
      h('div', { className: 'bg-[#4A3427] text-white rounded-3xl p-6 md:p-8 shadow-md relative overflow-hidden space-y-4 border border-[#241710]' },
        h('div', { className: 'relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4' },
          h('div', { className: 'space-y-1' },
            h('div', { className: 'flex items-center gap-2' },
              h('span', { className: 'text-xs font-extrabold uppercase tracking-widest text-[#EFE9DC] bg-white/15 px-3 py-1 rounded-full border border-white/20' },
                '📊 SUMMARIZE & AI CENTER'
              ),
              h('span', { className: 'text-xs text-[#EFE9DC] font-bold' }, `• Resep: ${prod.name || 'Produk UMKM'}`)
            ),
            h('h2', { className: 'text-2xl sm:text-3xl font-black text-white font-heading tracking-tight' }, 'Rangkuman Keuangan & Analisis AI Integritas'),
            h('p', { className: 'text-xs text-[#EFE9DC] max-w-xl font-bold' },
              'Rangkuman eksekutif keseluruhan finansial produk (HPP, Toko, Online, & Diskon Promo) terintegrasi langsung dengan Juragan AI Advisor.'
            )
          ),
          h('button', {
            onClick: handleRunFullAI,
            disabled: loadingAI,
            className: 'btn-secondary-taupe px-5 py-3 rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer border border-[#6B5541] self-start md:self-auto text-xs font-extrabold text-white'
          },
            loadingAI ? '🤖 Memproses AI...' : '✨ Analisis Ulang AI Advisor'
          )
        )
      ),

      /* Real-Time Transaction Simulation Card Grid */
      h('div', { className: 'bg-[#F0E6D2] rounded-3xl p-6 md:p-8 shadow-xs border border-[#D4C8B5] space-y-6' },
        h('div', { className: 'flex items-center justify-between border-b border-[#D4C8B5] pb-3' },
          h('h3', { className: 'text-sm font-black uppercase tracking-wider text-[#241710]' },
            '📑 SIMULASI HASIL TRANSAKSI REAL-TIME'
          ),
          h('span', { className: 'text-xs text-[#6B5541] font-bold' }, `Asumsi ${prod.simOrderQty || 2} Porsi`)
        ),

        /* 4-Grid Financial Breakdown */
        h('div', { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4' },
          
          /* Card 1: HPP Murni */
          h('div', { className: 'p-4 rounded-2xl bg-white border border-[#D4C8B5] space-y-1 shadow-xs' },
            h('span', { className: 'text-[10px] font-extrabold uppercase text-[#6B5541] block' }, 'Modul 1: HPP Murni'),
            h('span', { className: 'text-lg font-black font-mono text-[#241710] block' }, fmtIDR(hppData.hppMurni)),
            h('span', { className: 'text-[10px] text-[#6B5541] font-bold block' }, 'Modal bersih / porsi')
          ),

          /* Card 2: Harga Offline */
          h('div', { className: 'p-4 rounded-2xl bg-white border border-[#D4C8B5] space-y-1 shadow-xs' },
            h('span', { className: 'text-[10px] font-extrabold uppercase text-[#6B5541] block' }, 'Modul 2: Harga Toko'),
            h('span', { className: 'text-lg font-black font-mono text-[#241710] block' }, fmtIDR(offlineData.effectiveOfflinePrice)),
            h('span', { className: 'text-[10px] text-[#241710] font-extrabold block' }, `Margin ${offlineData.marginRatio.toFixed(0)}%`)
          ),

          /* Card 3: Harga Online */
          h('div', { className: 'p-4 rounded-2xl bg-white border border-[#D4C8B5] space-y-1 shadow-xs' },
            h('span', { className: 'text-[10px] font-extrabold uppercase text-[#6B5541] block' }, 'Modul 3: Harga Online'),
            h('span', { className: 'text-lg font-black font-mono text-[#241710] block' }, fmtIDR(onlineData.effectiveOnlinePrice)),
            h('span', { className: 'text-[10px] text-[#6B5541] font-bold block' }, `Cair Bersih ${fmtIDR(onlineData.simulatedPayout)}`)
          ),

          /* Card 4: Net Profit Promo */
          h('div', { className: `p-4 rounded-2xl border space-y-1 shadow-xs ${promoData.isBoncos ? 'bg-rose-50 border-rose-300' : 'bg-white border-[#D4C8B5]'}` },
            h('span', { className: 'text-[10px] font-extrabold uppercase text-[#6B5541] block' }, 'Modul 4: Net Laba Promo'),
            h('span', { className: `text-lg font-black font-mono block ${promoData.isBoncos ? 'text-rose-700' : 'text-[#241710]'}` },
              `${promoData.netProfit >= 0 ? '+' : ''}${fmtIDR(promoData.netProfit)}`
            ),
            h('span', { className: `text-[10px] font-bold block ${promoData.isBoncos ? 'text-rose-700' : 'text-[#241710]'}` },
              promoData.isBoncos ? '🔴 BONCOS PROMO' : '🟢 MARGIN AMAN'
            )
          )

        ),

        /* AI Executive Briefing Output */
        aiAnalysis && h('div', { className: 'p-5 rounded-2xl bg-white border border-[#D4C8B5] space-y-3' },
          h('div', { className: 'flex items-center gap-2 border-b border-[#D4C8B5] pb-2' },
            h('span', { className: 'text-base' }, '🤖'),
            h('h4', { className: 'text-xs font-black uppercase text-[#241710]' }, 'EXECUTIVE BRIEFING JURAGAN AI ADVISOR'),
            h('span', { className: 'text-[10px] text-[#6B5541] font-mono ml-auto' }, `Generated: ${aiAnalysis.timestamp}`)
          ),
          h('p', { className: 'text-xs text-[#241710] leading-relaxed font-medium' }, aiAnalysis.summary),
          h('div', { className: `p-3.5 rounded-xl text-xs font-extrabold border ${promoData.isBoncos ? 'bg-rose-50 text-rose-900 border-rose-200' : 'bg-[#F7F3E9] text-[#241710] border-[#D4C8B5]'}` },
            aiAnalysis.recommendation
          )
        ),

        /* Direct Trigger Modal AI Advisor */
        h('div', { className: 'flex justify-end pt-2' },
          h('button', {
            onClick: onOpenAI,
            className: 'btn-primary-brown text-white font-extrabold text-xs px-6 py-3.5 rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer'
          },
            '🤖 Buka Deep Consultation Juragan AI Advisor ➔'
          )
        )

      )
    );
  };
})();
