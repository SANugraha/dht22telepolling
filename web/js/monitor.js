let chart;
let tempData = [];
let humData = [];
let labels = [];

function isValidNumber(val) {
    return typeof val === 'number' && !isNaN(val);
}

async function fetchData() {
    try {
        const response = await fetch('/data');
        if (!response.ok) throw new Error('Gagal mengambil data');
        const data = await response.json();

        // Update card values
        document.getElementById('temperature').textContent = isValidNumber(data.temperature) ? data.temperature.toFixed(1) : '--';
        document.getElementById('humidity').textContent = isValidNumber(data.humidity) ? data.humidity.toFixed(1) : '--';
        document.getElementById('status').textContent = "Data terakhir diperbarui: " + new Date().toLocaleTimeString();

        // Update chart data hanya jika data valid
        const now = new Date().toLocaleTimeString();
        if (isValidNumber(data.temperature) && isValidNumber(data.humidity)) {
            if (labels.length > 20) { // keep last 20 data points
                labels.shift();
                tempData.shift();
                humData.shift();
            }
            labels.push(now);
            tempData.push(data.temperature);
            humData.push(data.humidity);
            if (chart) chart.update();
        }
    } catch (err) {
        document.getElementById('status').textContent = "Gagal mengambil data dari server";
    }
}


function updateChartColors() {
    const isDark = document.body.classList.contains('dark-mode');
    if (!chart) return;
    const isMobile = window.innerWidth < 600;
    chart.options.plugins.legend.labels.color = isDark ? '#fff' : '#222';
    chart.options.plugins.title.color = isDark ? '#8be9fd' : '#0096c7';
    chart.options.scales.x.ticks.color = isDark ? '#fff' : '#222';
    chart.options.scales.y.ticks.color = isDark ? '#fff' : '#222';
    chart.options.scales.x.title.color = isDark ? '#fff' : '#222';
    chart.options.scales.y.title.color = isDark ? '#fff' : '#222';
    chart.options.scales.y.grid.color = isDark ? '#3a4060' : '#e0eafc';
    // Responsive font & label rotation
    chart.options.scales.x.ticks.font = { size: isMobile ? 10 : 13 };
    chart.options.scales.y.ticks.font = { size: isMobile ? 10 : 13 };
    chart.options.plugins.legend.labels.font = { size: isMobile ? 12 : 15, weight: 'bold' };
    chart.options.plugins.title.font = { size: isMobile ? 13 : 18, weight: 'bold' };
    chart.options.scales.x.ticks.maxRotation = isMobile ? 45 : 0;
    chart.options.scales.x.ticks.minRotation = isMobile ? 45 : 0;
    chart.update();
}

function setupChart() {
    const ctx = document.getElementById('chart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Suhu (°C)',
                    data: tempData,
                    borderColor: 'rgba(255, 140, 0, 0.9)',
                    backgroundColor: 'rgba(255, 140, 0, 0.08)',
                    fill: false,
                    borderWidth: 3,
                    pointBackgroundColor: 'rgba(255, 140, 0, 0.9)',
                    pointBorderColor: '#fff',
                    pointRadius: 4,
                    tension: 0.4
                },
                {
                    label: 'Kelembapan (%)',
                    data: humData,
                    borderColor: 'rgba(0, 180, 216, 0.9)',
                    backgroundColor: 'rgba(0, 180, 216, 0.08)',
                    fill: false,
                    borderWidth: 3,
                    pointBackgroundColor: 'rgba(0, 180, 216, 0.9)',
                    pointBorderColor: '#fff',
                    pointRadius: 4,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: { size: 15, weight: 'bold' },
                        color: '#222',
                        boxWidth: 24,
                        padding: 18
                    }
                },
                title: {
                    display: true,
                    text: 'Monitoring Suhu & Kelembapan Secara Realtime',
                    font: { size: 18, weight: 'bold' },
                    color: '#0096c7',
                    padding: { top: 10, bottom: 18 }
                },
                tooltip: { enabled: true }
            },
            scales: {
                x: {
                    title: { display: true, text: 'Waktu', font: { size: 13, weight: 'bold' } },
                    grid: { display: true },
                    ticks: { color: '#222', font: { size: 13 } }
                },
                y: {
                    title: { display: true, text: 'Nilai', font: { size: 13, weight: 'bold' } },
                    beginAtZero: true,
                    grid: { color: '#e0eafc', borderDash: [4, 4] },
                    ticks: { color: '#222', font: { size: 13 } }
                }
            }
        }
    });
    updateChartColors();
}

function tampilkanLokasiUser() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            async function(position) {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                document.getElementById('location').textContent = 
                    `Lokasi Anda: ${lat.toFixed(5)}, ${lon.toFixed(5)} (mencari alamat...)`;
                try {
                    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
                    const response = await fetch(url, { headers: { 'User-Agent': 'SIPADU Monitoring' } });
                    const data = await response.json();
                    if (data.display_name) {
                        document.getElementById('location').textContent = 
                            `Lokasi Anda: ${data.display_name}`;
                    } else {
                        document.getElementById('location').textContent = 
                            `Lokasi Anda: ${lat.toFixed(5)}, ${lon.toFixed(5)}`;
                    }
                } catch (e) {
                    document.getElementById('location').textContent = 
                        `Lokasi Anda: ${lat.toFixed(5)}, ${lon.toFixed(5)} (gagal mendapatkan alamat)`;
                }
            },
            function(error) {
                document.getElementById('location').textContent = 
                    "Gagal mendeteksi lokasi: " + error.message;
            }
        );
    } else {
        document.getElementById('location').textContent = 
            "Browser tidak mendukung geolokasi.";
    }
}

window.onload = () => {
    setupChart();
    tampilkanLokasiUser();
    fetchData();
    setInterval(fetchData, 5000); // update setiap 5 detik
    // On load, set dark mode if saved
    if (localStorage.getItem('sipadu-dark') === 'true') {
        document.body.classList.add('dark-mode');
    }
};

// Integrasi dengan toggle dark mode
document.addEventListener('DOMContentLoaded', function() {
    const darkBtn = document.getElementById('toggle-dark');
    if (darkBtn) {
        darkBtn.addEventListener('click', function() {
            setTimeout(updateChartColors, 100); // update chart setelah mode berubah
        });
    }
    // Jika dark mode aktif dari awal
    setTimeout(updateChartColors, 200);
});

window.addEventListener('resize', () => setTimeout(updateChartColors, 200)); 