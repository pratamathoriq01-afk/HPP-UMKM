/* ─────────────────── AI SYSTEM ENGINE (JURAGAN AI ADVISOR) ─────────────────── */
window.AppAI = {
  /* Main Entrypoint: Analyze Product financial health & strategy */
  analyzeProduct: async function(prod, hppData, offlineData, onlineData, promoData, config) {
    const apiKey = config && config.apiKey ? config.apiKey.trim() : '';

    if (apiKey) {
      try {
        const geminiResult = await this.callGeminiAPI(prod, hppData, offlineData, onlineData, promoData, apiKey, config.model);
        if (geminiResult) return geminiResult;
      } catch (err) {
        console.warn('Gemini API call failed or timed out, falling back to Local Smart Heuristic Engine:', err);
      }
    }

    // Fallback or Default: Smart Local Heuristic Engine
    return this.generateLocalHeuristicAnalysis(prod, hppData, offlineData, onlineData, promoData);
  },

  /* Online Gemini API Integration */
  callGeminiAPI: async function(prod, hppData, offlineData, onlineData, promoData, apiKey, modelName) {
    const model = modelName || 'gemini-2.5-flash';
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const fmt = window.AppMath.formatIDR;
    const promptText = `
Anda adalah Juragan AI Advisor, konsultan keuangan UMKM kuliner profesional tingkat atas berstandar SAK EMKM.
Berikan analisa taktis & mendalam dalam format JSON murni untuk resep berikut:

Nama Resep: ${prod.name}
- HPP Murni per Porsi: ${fmt(hppData.hppMurni)}
  * Proporsi Bahan Baku Utama: ${hppData.mainPct.toFixed(1)}% (${fmt(hppData.totalMainMaterials)})
  * Proporsi BOP Variabel: ${hppData.bopPct.toFixed(1)}% (${fmt(hppData.totalBopMaterials)})
  * Proporsi Kemasan: ${hppData.packPct.toFixed(1)}% (${fmt(hppData.totalPackagings)})

- Strategi Harga Toko (Offline):
  * Target Margin: ${prod.marginPercent}%
  * Harga Jual Offline: ${fmt(offlineData.effectiveOfflinePrice)} (Laba: ${fmt(offlineData.netOfflineMargin)} / porsi)
  * Status Margin: ${offlineData.marginStatus.label} (${offlineData.marginRatio.toFixed(1)}%)

- Strategi Harga Online (Reverse-Margin):
  * Komisi App: ${prod.commissionPercent}% + Fixed Fee: ${fmt(prod.fixedFee)}
  * Rekomendasi Harga Online: ${fmt(onlineData.effectiveOnlinePrice)}

- Simulasi Diskon Promo Online (${promoData.orderQty} porsi):
  * Diskon: ${promoData.promoPercent}% (Max Cap: ${fmt(promoData.maxDiscountCap)})
  * Uang Cair ke Penjual: ${fmt(promoData.netPayout)}
  * Total HPP Order: ${fmt(promoData.totalHPPOrder)}
  * Laba Bersih Promo: ${fmt(promoData.netProfit)}
  * Status Promo: ${promoData.isBoncos ? 'BONCOS / RUGI 🔴' : 'PROFIT / AMAN 🟢'}

HANYA Kembalikan respons dalam format JSON valid tanpa markdown tambahan dengan struktur key persis:
{
  "summary": "Ringkasan ringkas kesehatan bisnis produk ini dalam 2 kalimat.",
  "hppAnalysis": "Analisis efisiensi biaya bahan baku vs BOP vs kemasan dan potensi efisiensi.",
  "pricingStrategy": "Saran optimasi harga offline & online agar tidak boncos.",
  "promoSafety": "Evaluasi promo online dan peringatan risiko kebocoran diskon.",
  "actionItems": ["Langkah taktis 1", "Langkah taktis 2", "Langkah taktis 3"]
}
`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.2 }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API HTTP Error ${response.status}`);
    }

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (responseText) {
      const parsed = JSON.parse(responseText);
      return {
        source: 'Gemini AI (' + model + ')',
        summary: parsed.summary,
        hppAnalysis: parsed.hppAnalysis,
        pricingStrategy: parsed.pricingStrategy,
        promoSafety: parsed.promoSafety,
        actionItems: parsed.actionItems || []
      };
    }
    return null;
  },

  /* Smart Local Heuristic Advisory Engine (Offline Zero-Config) */
  generateLocalHeuristicAnalysis: function(prod, hppData, offlineData, onlineData, promoData) {
    const fmt = window.AppMath.formatIDR;
    const actionItems = [];

    // 1. HPP & Proporsi Biaya Analysis
    let hppAnalysis = '';
    if (hppData.mainPct > 70) {
      hppAnalysis = `Porsi biaya Bahan Baku Utama Anda sangat dominan (${hppData.mainPct.toFixed(1)}%). Ini wajar untuk produk kualitas tinggi, namun pastikan untuk mencari supplier bahan utama dalam jumlah besar agar mendapat potongan harga grosir.`;
      actionItems.push(`Negosiasikan harga beli bahan utama (${prod.mainMaterials[0]?.name || 'Bahan Utama'}) dengan supplier untuk pembelian bulk.`);
    } else if (hppData.packPct > 15) {
      hppAnalysis = `Proporsi biaya Kemasan Anda cukup tinggi (${hppData.packPct.toFixed(1)}%). Pertimbangkan mencari alternatif kemasan ekonomis tanpa mengurangi nilai estetika visual produk.`;
      actionItems.push(`Cari alternatif vendor kemasan polos dengan stiker brand untuk menekan biaya kemasan.`);
    } else {
      hppAnalysis = `Struktur proporsi biaya HPP Murni Anda seimbang (${hppData.mainPct.toFixed(1)}% Bahan Utama, ${hppData.bopPct.toFixed(1)}% BOP, ${hppData.packPct.toFixed(1)}% Kemasan).`;
    }

    // 2. Pricing Strategy Analysis
    let pricingStrategy = '';
    if (offlineData.marginRatio < 15) {
      pricingStrategy = `PERINGATAN MARGIN KRITIS! Margin offline Anda hanya ${offlineData.marginRatio.toFixed(1)}% (${fmt(offlineData.netOfflineMargin)}/porsi). Angka ini terlalu tipis untuk menutupi biaya operasional toko harian. Rekomendasi: naikkan harga toko ke minimal ${fmt(offlineData.recommendedPrice)}.`;
      actionItems.push(`Naikkan harga toko offline ke ${fmt(offlineData.recommendedPrice)} untuk mencapai target margin sehat minimal 30%.`);
    } else if (offlineData.marginRatio >= 30) {
      pricingStrategy = `Margin offline Anda sangat sehat (${offlineData.marginRatio.toFixed(1)}%). Keuntungan bersih ${fmt(offlineData.netOfflineMargin)} per porsi memberikan bantalan aman untuk biaya operasional bulanan.`;
    } else {
      pricingStrategy = `Margin offline Anda berada di level pas-pasan (${offlineData.marginRatio.toFixed(1)}%). Naikkan sedikit harga offline jika ingin lebih aman terhadap kenaikan bahan baku.`;
    }

    // 3. Promo Safety Analysis
    let promoSafety = '';
    if (promoData.isBoncos) {
      promoSafety = `🚨 STATUS PROMO RUGI (BONCOS)! Pada simulasi pesanan ${promoData.orderQty} porsi, pencairan bersih Anda (${fmt(promoData.netPayout)}) LEBIH KECIL dari beban HPP Murni (${fmt(promoData.totalHPPOrder)}), sehingga rugi ${fmt(Math.abs(promoData.netProfit))}. Biaya diskon terlampau besar!`;
      actionItems.push(`Turunkan Batas Maksimal Diskon (Cap) dari ${fmt(promoData.maxDiscountCap)} menjadi maksimal ${fmt(Math.max(0, promoData.maxDiscountCap - Math.abs(promoData.netProfit)))}.`);
      actionItems.push(`Ubah syarat Minimal Belanja promo dari ${fmt(promoData.minOrder)} ke nominal yang lebih tinggi agar porsi pembelian konsumen membesar.`);
    } else {
      promoSafety = `🟢 STATUS PROMO AMAN (PROFIT). Pada simulasi ${promoData.orderQty} porsi, Anda menghasilkan laba bersih promo sebesar ${fmt(promoData.netProfit)}. HPP murni Anda tertutup sempurna setelah komisi platform.`;
    }

    // Summary
    const statusText = promoData.isBoncos ? 'membutuhkan penyesuaian promo segera karena risiko rugi' : 'berada dalam kondisi finansial yang baik';
    const summary = `Resep "${prod.name}" memiliki HPP Murni ${fmt(hppData.hppMurni)}/porsi dan status margin ${offlineData.marginStatus.label} (${offlineData.marginRatio.toFixed(1)}%). Saat ini produk ${statusText}.`;

    return {
      source: 'Local Smart Financial AI Engine',
      summary,
      hppAnalysis,
      pricingStrategy,
      promoSafety,
      actionItems
    };
  }
};
