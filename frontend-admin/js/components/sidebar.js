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

    // Lấy thông tin User từ localStorage
    const adminUser = JSON.parse(localStorage.getItem('admin_user') || '{}');
    const adminName = adminUser.name || 'Quản trị viên';

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
        <button id="sidebar-collapse-btn" class="btn-collapse">
          <i data-lucide="chevron-left"></i>
          <span>Thu gọn menu</span>
        </button>
      </div>
    `;

    if (window.lucide) {
      lucide.createIcons();
    }
  }

  // Khởi tạo các sự kiện
  bindEvents() {
    // 1. Logic Thu gọn Sidebar
    const collapseBtn = this.container.querySelector('#sidebar-collapse-btn');
    const sidebar = document.querySelector('.sidebar');
    const layout = document.querySelector('.admin-layout');
    
    if (collapseBtn && sidebar) {
      collapseBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        if (layout) layout.classList.toggle('sidebar-collapsed');
        
        // Cập nhật icon
        const icon = collapseBtn.querySelector('i');
        if (sidebar.classList.contains('collapsed')) {
          icon.setAttribute('data-lucide', 'chevron-right');
        } else {
          icon.setAttribute('data-lucide', 'chevron-left');
        }
        if (window.lucide) lucide.createIcons();
        
        // Lưu trạng thái vào localStorage
        localStorage.setItem('sidebar_collapsed', sidebar.classList.contains('collapsed'));
      });

      // Khôi phục trạng thái từ localStorage
      if (localStorage.getItem('sidebar_collapsed') === 'true') {
        sidebar.classList.add('collapsed');
        if (layout) layout.classList.add('sidebar-collapsed');
        const icon = collapseBtn.querySelector('i');
        icon.setAttribute('data-lucide', 'chevron-right');
        if (window.lucide) lucide.createIcons();
      }
    }

    // Nút toggle sidebar trên Mobile (nếu có trong header)
    const mobileToggle = document.getElementById('sidebar-toggle');
    if (mobileToggle && sidebar) {
      mobileToggle.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-show');
      });
    }
  }

  init() {
    if (!this.container) return;
    this.render();
    this.bindEvents();
  }
}
