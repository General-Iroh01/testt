const API = "http://localhost:8000/api";

// Sayfaya geliş animasyonu
window.addEventListener('load', () => {
    console.log("🦁 Milyarder Kar Canavarı Başlatıldı");
    updateTime();
    setInterval(updateTime, 1000);
    
    // İlk yükleme
    setTimeout(() => {
        loadAllRecommendations();
    }, 500);
});

function updateTime() {
    const now = new Date();
    const formatted = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    document.getElementById('current-time').textContent = formatted;
}

function showSection(sectionName) {
    // Tüm section'ları gizle
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    // Seçilen section'ı göster
    const section = document.getElementById(`${sectionName}-section`);
    if (section) section.classList.add('active');
    
    // Nav button'ları güncelle
    document.querySelectorAll('.nav-tabs button').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

function showLoading(element) {
    element.innerHTML = `
        <div class="loading">
            <span class="spinner">⚙️</span> AI verileri işliyor ve analiz yapıyor...
        </div>
    `;
}

function showError(element, message) {
    element.innerHTML = `
        <div class="alert alert-danger">
            ❌ Hata: ${message}
        </div>
    `;
}

function formatAnalysis(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--accent);">$1</strong>')
        .replace(/###\s+(.*?)$/gm, '<h4 style="color: var(--accent); margin-top: 15px;">$1</h4>')
        .replace(/##\s+(.*?)$/gm, '<h3 style="color: var(--accent);">$1</h3>')
        .replace(/\bAL\b\s*($|[\n])/gm, '<span class="badge badge-success">🟢 AL</span>')
        .replace(/\bSAT\b\s*($|[\n])/gm, '<span class="badge badge-danger">🔴 SAT</span>')
        .replace(/\bBEKLE\b\s*($|[\n])/gm, '<span class="badge badge-warning">🟡 BEKLE</span>')
        .replace(/\bOYNAT\b\s*($|[\n])/gm, '<span class="badge badge-success">✅ OYNAT</span>')
        .replace(/\bKAÇIN\b\s*($|[\n])/gm, '<span class="badge badge-danger">⛔ KAÇIN</span>')
        .replace(/\bGİR\b\s*($|[\n])/gm, '<span class="badge badge-success">🚀 GİR</span>')
        .replace(/\bVAZGEÇ\b\s*($|[\n])/gm, '<span class="badge badge-danger">❌ VAZGEÇ</span>')
        .replace(/\n\n/g, '<br><br>')
        .replace(/\n/g, '<br>');
}

async function loadAllRecommendations() {
    const dashboard = document.getElementById('dashboard-crypto');
    
    if (!dashboard) return;
    
    showLoading(dashboard);
    
    try {
        const res = await fetch(`${API}/today/all`);
        const data = await res.json();
        
        let html = `
            <div class="alert alert-success">
                📅 <strong>${data.date}</strong> - Bugünün Tam Analizi
            </div>
        `;
        
        // Kripto
        if (data.recommendations.crypto) {
            html += `
                <div class="card" style="margin-top: 15px;">
                    <h3>₿ KRİPTO</h3>
                    <div class="recommendation-box">
                        ${formatAnalysis(data.recommendations.crypto.recommendation.slice(0, 500))}
                    </div>
                </div>
            `;
        }
        
        // Altın
        if (data.recommendations.gold) {
            html += `
                <div class="card" style="margin-top: 15px;">
                    <h3>🥇 ALTIN</h3>
                    <div class="recommendation-box">
                        ${formatAnalysis(data.recommendations.gold.recommendation.slice(0, 500))}
                    </div>
                </div>
            `;
        }
        
        // Borsa
        if (data.recommendations.stock) {
            html += `
                <div class="card" style="margin-top: 15px;">
                    <h3>📈 BORSA</h3>
                    <div class="recommendation-box">
                        ${formatAnalysis(data.recommendations.stock.recommendation.slice(0, 500))}
                    </div>
                </div>
            `;
        }
        
        // Spor
        if (data.recommendations.sports) {
            html += `
                <div class="card" style="margin-top: 15px;">
                    <h3>⚽ BUGÜNÜN KUPONU</h3>
                    <div class="recommendation-box">
                        ${formatAnalysis(data.recommendations.sports.recommendation)}
                    </div>
                </div>
            `;
        }
        
        dashboard.innerHTML = html;
    } catch (e) {
        showError(dashboard, e.message);
    }
}

// Kategori-spesifik fonksiyonlar
async function getDashboardCrypto() {
    const el = document.getElementById('dashboard-crypto');
    showLoading(el);
    try {
        const res = await fetch(`${API}/today/crypto`);
        const data = await res.json();
        el.innerHTML = `<div class="recommendation-box">${formatAnalysis(data.recommendation.slice(0, 800))}</div>`;
    } catch (e) {
        showError(el, e.message);
    }
}

async function getDashboardGold() {
    const el = document.getElementById('dashboard-gold');
    showLoading(el);
    try {
        const res = await fetch(`${API}/today/gold`);
        const data = await res.json();
        el.innerHTML = `<div class="recommendation-box">${formatAnalysis(data.recommendation.slice(0, 800))}</div>`;
    } catch (e) {
        showError(el, e.message);
    }
}

async function getDashboardStock() {
    const el = document.getElementById('dashboard-stock');
    showLoading(el);
    try {
        const res = await fetch(`${API}/today/stock`);
        const data = await res.json();
        el.innerHTML = `<div class="recommendation-box">${formatAnalysis(data.recommendation.slice(0, 800))}</div>`;
    } catch (e) {
        showError(el, e.message);
    }
}

async function getDashboardRE() {
    const sehir = document.getElementById('dashboard-re-sehir')?.value || 'Istanbul';
    const ilce = document.getElementById('dashboard-re-ilce')?.value || 'Kadikoy';
    const el = document.getElementById('dashboard-realestate');
    
    showLoading(el);
    try {
        const res = await fetch(`${API}/today/realestate/${sehir}/${ilce}`);
        const data = await res.json();
        
        let html = `<div class="recommendation-box">${formatAnalysis(data.recommendation.slice(0, 500))}</div>`;
        html += '<h4 style="color: var(--accent); margin-top: 15px;">🎯 En İyi 3 İlan:</h4>';
        
        if (data.best_listings) {
            data.best_listings.forEach(l => {
                const m2price = l.price && l.m2 ? (l.price / l.m2).toFixed(0) : 0;
                html += `
                    <div class="alert alert-success">
                        <strong>#${l.listing_id}</strong> - ₺${l.price?.toLocaleString()}<br>
                        ${l.m2}m² (₺${m2price}/m²) | ${l.rooms ? l.rooms + '+1' : '?'}<br>
                        <a href="${l.url}" target="_blank" style="color: var(--accent);">İlanı Gör →</a>
                    </div>
                `;
            });
        }
        
        el.innerHTML = html;
    } catch (e) {
        showError(el, e.message);
    }
}

async function getDashboardCars() {
    const marka = document.getElementById('dashboard-car-marka')?.value || 'Toyota';
    const model = document.getElementById('dashboard-car-model')?.value || 'Corolla';
    const el = document.getElementById('dashboard-cars');
    
    showLoading(el);
    try {
        const res = await fetch(`${API}/today/cars/${marka}/${model}`);
        const data = await res.json();
        
        let html = `<div class="recommendation-box">${formatAnalysis(data.recommendation.slice(0, 500))}</div>`;
        html += '<h4 style="color: var(--accent); margin-top: 15px;">🎯 En İyi 3 Araçta:</h4>';
        
        if (data.best_cars) {
            data.best_cars.forEach(c => {
                const riskColor = c.damage_risk === 'critical' ? 'badge-danger' : c.damage_risk === 'high' ? 'badge-warning' : 'badge-success';
                html += `
                    <div class="alert alert-success">
                        <strong>#${c.listing_id}</strong> - ${c.year} | ${c.km?.toLocaleString()} km<br>
                        ₺${c.price?.toLocaleString()}<br>
                        Hasar: <span class="badge ${riskColor}">${c.damage_risk?.toUpperCase()}</span><br>
                        <a href="${c.url}" target="_blank" style="color: var(--accent);">İlanı Gör →</a>
                    </div>
                `;
            });
        }
        
        el.innerHTML = html;
    } catch (e) {
        showError(el, e.message);
    }
}

async function getDashboardSports() {
    const el = document.getElementById('dashboard-sports');
    showLoading(el);
    try {
        const res = await fetch(`${API}/today/sports`);
        const data = await res.json();
        el.innerHTML = `
            <div class="alert alert-success" style="font-size: 1.1em; margin-bottom: 15px;">
                🎯 <strong>%90+ GÜVENLİ BUGÜNÜN KUPONU</strong>
            </div>
            <div class="recommendation-box">${formatAnalysis(data.recommendation)}</div>
        `;
    } catch (e) {
        showError(el, e.message);
    }
}