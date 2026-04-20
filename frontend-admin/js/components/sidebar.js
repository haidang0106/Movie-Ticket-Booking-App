/**
 * Sidebar component that injects the HTML for the sidebar
 * and handles its logic (active state, toggling)
 */

class Sidebar {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.init();
  }

  // Define the menu items
  getMenuItems() {
    return [
      { id: 'dashboard', name: 'Dashboard', icon: 'layout-dashboard', url: 'index.html' },
      { id: 'movies', name: 'Phim', icon: 'film', url: 'movies.html' },
      { id: 'shows', name: 'Suất chiếu', icon: 'calendar-days', url: 'shows.html' },
      { id: 'cinemas', name: 'Rạp & Phòng chiếu', icon: 'building-2', url: 'cinemas.html' },
      { id: 'seats', name: 'Sơ đồ ghế', icon: 'sofa', url: 'seat-layout.html' },
      { id: 'vouchers', name: 'Khuyến mãi', icon: 'ticket', url: 'vouchers.html' },
      { id: 'reports', name: 'Báo cáo', icon: 'bar-chart-3', url: 'reports.html' },
      { id: 'accounts', name: 'Tài khoản', icon: 'users', url: 'accounts.html' },
      { id: 'settings', name: 'Cài đặt', icon: 'settings', url: 'settings.html' }
    ];
  }

  // Render the HTML string
  render() {
    // Xác định trang hiện tại từ URL (để highlight menu)
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    const menuItemsHtml = this.getMenuItems().map(item => {
      const isActive = currentPage === item.url ? 'active' : '';
      return `
        <li class="sidebar-item">
          <a href="${item.url}" class="sidebar-link ${isActive}">
            <i data-lucide="${item.icon}"></i>
            <span>${item.name}</span>
          </a>
        </li>
      `;
    }).join('');

    this.container.innerHTML = `
      <div class="sidebar-header">
        <h2 class="sidebar-logo">
          <span class="logo-text">Cine<span class="text-primary">Admin</span></span>
        </h2>
      </div>
      <ul class="sidebar-menu">
        ${menuItemsHtml}
      </ul>
      <div class="sidebar-footer">
        <button id="logout-btn" class="btn-logout">
          <i data-lucide="log-out"></i>
          <span>Đăng xuất</span>
        </button>
      </div>
    `;

    // Initialize Lucide icons if available
    if (window.lucide) {
      lucide.createIcons();
    }
  }

  // Khởi tạo các sự kiện
  bindEvents() {
    const logoutBtn = this.container.querySelector('#logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        // Handle logout logic, clear token, redirect to login
        alert('Tính năng đăng xuất sẽ được thực hiện khi làm phần Auth!');
      });
    }
  }

  init() {
    if (!this.container) return;
    this.render();
    this.bindEvents();
  }
}
