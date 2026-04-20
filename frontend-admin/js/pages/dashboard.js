/**
 * Dashboard Logic - Handles rendering stats and charts
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Sidebar
  const sidebar = new Sidebar('sidebar-container');

  // Sidebar Toggle logic (for mobile/tablet)
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebarEl = document.getElementById('sidebar-container');
  
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
      sidebarEl.classList.toggle('show');
    });
  }

  // Khởi tạo Dashboard Data
  renderStatsCards();
  initRevenueChart();
  initOccupancyChart();
});

/**
 * Render Thẻ thống kê (Stats Cards) với Mock Data
 */
function renderStatsCards() {
  const statsContainer = document.getElementById('stats-container');
  if (!statsContainer) return;

  const mockStats = [
    {
      title: 'Doanh thu hôm nay',
      value: '24.500.000 ₫',
      icon: 'dollar-sign',
      colorClass: 'primary',
      change: '+15%',
      isUp: true
    },
    {
      title: 'Vé bán ra',
      value: '350',
      icon: 'ticket',
      colorClass: 'success',
      change: '+5%',
      isUp: true
    },
    {
      title: 'Suất chiếu',
      value: '42',
      icon: 'film',
      colorClass: 'info',
      change: '0%',
      isUp: true
    },
    {
      title: 'Khách hàng mới',
      value: '28',
      icon: 'users',
      colorClass: 'warning',
      change: '-2%',
      isUp: false
    }
  ];

  const html = mockStats.map(stat => `
    <div class="stat-card">
      <div class="stat-header">
        <div>
          <h3 class="stat-title">${stat.title}</h3>
          <div class="stat-value">${stat.value}</div>
        </div>
        <div class="stat-icon ${stat.colorClass}">
          <i data-lucide="${stat.icon}"></i>
        </div>
      </div>
      <div class="stat-change ${stat.isUp ? 'up' : 'down'}">
        <i data-lucide="${stat.isUp ? 'trending-up' : 'trending-down'}"></i>
        <span>${stat.change} so với hôm qua</span>
      </div>
    </div>
  `).join('');

  statsContainer.innerHTML = html;
  
  // Re-init unrendered icons
  if (window.lucide) lucide.createIcons();
}

/**
 * Initialize Revenue Chart (Chart.js)
 */
function initRevenueChart() {
  const ctx = document.getElementById('revenueChart');
  if (!ctx) return;

  // Chart.js global config for dark mode
  Chart.defaults.color = '#B3B3B3';
  Chart.defaults.borderColor = '#333333';
  Chart.defaults.font.family = 'Inter';

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
      datasets: [{
        label: 'Doanh thu (Triệu VNĐ)',
        data: [12, 19, 15, 25, 42, 65, 55],
        borderColor: '#E50914', // Đỏ Netflix
        backgroundColor: 'rgba(229, 9, 20, 0.1)',
        borderWidth: 3,
        tension: 0.4, // Tạo đường cong mềm mại
        fill: true,
        pointBackgroundColor: '#141414',
        pointBorderColor: '#E50914',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false // Ẩn legend vì đã có title ở card header
        },
        tooltip: {
          backgroundColor: '#282828',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: '#333333',
          borderWidth: 1,
          padding: 10,
          displayColors: false,
          callbacks: {
            label: function(context) {
              return context.parsed.y + ' Triệu VNĐ';
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: '#333333',
            drawBorder: false,
          }
        },
        x: {
          grid: {
            display: false,
            drawBorder: false,
          }
        }
      }
    }
  });
}

/**
 * Initialize Occupancy Chart (Pie/Doughnut)
 */
function initOccupancyChart() {
  const ctx = document.getElementById('occupancyChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Đã đặt', 'Ghế trống', 'Đang giữ'],
      datasets: [{
        data: [65, 25, 10],
        backgroundColor: [
          '#E50914', // Đã đặt - Đỏ primary
          '#333333', // Ghế trống - Xám đậm
          '#f1c40f'  // Đang giữ - Vàng warning
        ],
        borderWidth: 0,
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '75%', // Độ mỏng của vòng tròn
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        }
      }
    }
  });
}
