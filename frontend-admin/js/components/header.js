/**
 * Header component handling top bar logic
 * (User profile dropdown, notifications, etc.)
 */
class Header {
  constructor() {
    this.header = document.querySelector('.top-header');
    this.init();
  }

  init() {
    if (!this.header) return;
    this.render();
    this.bindEvents();
  }

  render() {
    const headerRight = this.header.querySelector('.header-right');
    if (!headerRight) return;

    // Lấy thông tin user
    const adminUser = JSON.parse(localStorage.getItem('admin_user') || '{}');
    const adminName = adminUser.name || 'Quản trị viên';
    const adminRole = adminUser.role || 'Super Admin';

    headerRight.innerHTML = `
      <div class="header-actions">
        <button class="btn-icon">
          <i data-lucide="bell"></i>
          <span class="notification-badge">3</span>
        </button>
        
        <div class="user-profile-header" id="header-user-trigger">
          <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(adminName)}&background=E50914&color=fff" alt="Admin" class="avatar">
          <div class="user-info d-none-mobile">
            <span class="user-name">${adminName}</span>
            <span class="user-role">${adminRole}</span>
          </div>
          <i data-lucide="chevron-down" class="chevron-icon"></i>
          
          <!-- Dropdown Menu -->
          <div class="header-dropdown" id="header-dropdown">
            <div class="dropdown-header">Tài khoản của tôi</div>
            <a href="settings.html" class="dropdown-item">
              <i data-lucide="settings"></i>
              <span>Cài đặt tài khoản</span>
            </a>
            <hr class="dropdown-divider">
            <button id="header-logout-btn" class="dropdown-item logout">
              <i data-lucide="log-out"></i>
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) {
      lucide.createIcons();
    }
  }

  bindEvents() {
    const trigger = this.header.querySelector('#header-user-trigger');
    const dropdown = this.header.querySelector('#header-dropdown');
    
    if (trigger && dropdown) {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('show');
        trigger.classList.toggle('active');
      });

      document.addEventListener('click', () => {
        dropdown.classList.remove('show');
        trigger.classList.remove('active');
      });
    }

    const logoutBtn = this.header.querySelector('#header-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
          window.location.href = 'login.html';
        }
      });
    }
  }
}

// Tự động khởi tạo khi tài liệu sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
  window.adminHeader = new Header();
});
