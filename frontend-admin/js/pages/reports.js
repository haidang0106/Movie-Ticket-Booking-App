/**
 * Reports & Data Visualization Logic
 * Initializes Chart.js with mock business data.
 */

document.addEventListener('DOMContentLoaded', () => {
  const sidebar = new Sidebar('sidebar-container');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebarEl = document.getElementById('sidebar-container');
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
      sidebarEl.classList.toggle('show');
    });
  }

  initRevenueChart();
  initMarketShareChart();
  initTopMoviesChart();
  initNewUsersChart();

  // Export Logic
  document.getElementById('btn-export')?.addEventListener('click', () => {
    alert('Báo cáo PDF đang được trích xuất... Vui lòng đợi trong giây lát.');
  });
});

function initRevenueChart() {
  const ctx = document.getElementById('revenueReportChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['01/04', '04/04', '07/04', '10/04', '13/04', '16/04', '20/04'],
      datasets: [
        {
          label: 'Doanh thu (k VNĐ)',
          data: [45000, 52000, 48000, 65000, 85000, 72000, 95000],
          borderColor: '#E50914',
          backgroundColor: 'rgba(229, 9, 20, 0.1)',
          fill: true,
          tension: 0.4,
          borderWidth: 3,
          pointRadius: 4,
          pointBackgroundColor: '#E50914'
        },
        {
          label: 'Kế hoạch',
          data: [40000, 45000, 50000, 55000, 60000, 65000, 70000],
          borderColor: 'rgba(255, 255, 255, 0.2)',
          borderDash: [5, 5],
          fill: false,
          tension: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#ffffff' } }
      },
      scales: {
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#888' }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#888' }
        }
      }
    }
  });
}

function initMarketShareChart() {
  const ctx = document.getElementById('marketShareChart').getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['CineAdmin Metropolis', 'CineAdmin Landmark 81', 'CineAdmin Vincom', 'Khác'],
      datasets: [{
        data: [45, 30, 15, 10],
        backgroundColor: [
          '#E50914', 
          '#b30009', 
          '#800006', 
          '#4d0004'
        ],
        borderWidth: 0,
        hoverOffset: 10
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: { color: '#ffffff', padding: 20 }
        }
      }
    }
  });
}

function initTopMoviesChart() {
  const ctx = document.getElementById('topMoviesChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Dune 2', 'Lật Mặt 7', 'Godzilla x Kong', 'Mai', 'Kung Fu Panda 4'],
      datasets: [{
        label: 'Số vé bán ra',
        data: [4200, 3800, 2500, 1900, 1200],
        backgroundColor: '#E50914',
        borderRadius: 5
      }]
    },
    options: {
      indexAxis: 'y', // Horizontal bar
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#888' } },
        y: { grid: { display: false }, ticks: { color: '#ffffff' } }
      }
    }
  });
}

function initNewUsersChart() {
  const ctx = document.getElementById('newUsersChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
      datasets: [{
        label: 'Khách hàng mới',
        data: [120, 150, 110, 180, 250, 420, 380],
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        hoverBackgroundColor: '#E50914'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#888' } },
        x: { grid: { display: false }, ticks: { color: '#888' } }
      }
    }
  });
}
