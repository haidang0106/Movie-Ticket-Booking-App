import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accountType');
    navigate('/login');
  };

  const accountType = localStorage.getItem('accountType') || 'Admin';

  return (
    <div className="bg-page-bg text-on-surface font-body-md antialiased overflow-x-hidden min-h-screen">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full z-40 bg-surface w-[240px] border-r border-border-default hidden md:flex flex-col">
        <div className="h-[64px] flex items-center px-6 border-b border-border-default">
          <span className="material-symbols-outlined text-primary-container text-2xl mr-2" style={{ fontVariationSettings: "'FILL' 1" }}>movie</span>
          <span className="font-display-md text-display-md font-bold text-on-surface text-[20px]">FlickTickets</span>
        </div>
        <div className="px-6 py-4">
          <p className="text-xs text-text-muted uppercase tracking-wider mb-4 font-semibold">Cinema Admin</p>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <NavLink to="/" end className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg font-body-md text-body-md transition-colors ${isActive ? 'text-primary bg-accent-soft border-l-4 border-primary font-semibold' : 'text-on-surface-variant hover:bg-surface-variant/50'}`}>
            <span className="material-symbols-outlined">dashboard</span>
            Dashboard
          </NavLink>
          <NavLink to="/movies" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg font-body-md text-body-md transition-colors ${isActive ? 'text-primary bg-accent-soft border-l-4 border-primary font-semibold' : 'text-on-surface-variant hover:bg-surface-variant/50'}`}>
            <span className="material-symbols-outlined">movie</span>
            Movie
          </NavLink>
          <NavLink to="/bookings" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg font-body-md text-body-md transition-colors ${isActive ? 'text-primary bg-accent-soft border-l-4 border-primary font-semibold' : 'text-on-surface-variant hover:bg-surface-variant/50'}`}>
            <span className="material-symbols-outlined">confirmation_number</span>
            Bookings
          </NavLink>
          <NavLink to="/customers" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg font-body-md text-body-md transition-colors ${isActive ? 'text-primary bg-accent-soft border-l-4 border-primary font-semibold' : 'text-on-surface-variant hover:bg-surface-variant/50'}`}>
            <span className="material-symbols-outlined">group</span>
            Customer
          </NavLink>
          <NavLink to="/transaction" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg font-body-md text-body-md transition-colors ${isActive ? 'text-primary bg-accent-soft border-l-4 border-primary font-semibold' : 'text-on-surface-variant hover:bg-surface-variant/50'}`}>
            <span className="material-symbols-outlined">receipt_long</span>
            Transaction
          </NavLink>
          <NavLink to="/analytics" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg font-body-md text-body-md transition-colors ${isActive ? 'text-primary bg-accent-soft border-l-4 border-primary font-semibold' : 'text-on-surface-variant hover:bg-surface-variant/50'}`}>
            <span className="material-symbols-outlined">analytics</span>
            Analytics
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg font-body-md text-body-md transition-colors ${isActive ? 'text-primary bg-accent-soft border-l-4 border-primary font-semibold' : 'text-on-surface-variant hover:bg-surface-variant/50'}`}>
            <span className="material-symbols-outlined">settings</span>
            Settings
          </NavLink>
        </nav>
      </aside>

      {/* Top Navigation */}
      <header className="fixed top-0 right-0 w-[calc(100%-240px)] z-30 flex justify-between items-center px-container-padding bg-surface h-[64px] border-b border-border-default hidden md:flex">
        <div className="flex-1 flex items-center">
          <div className="relative w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">search</span>
            <input className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-lg text-sm focus:ring-2 focus:ring-primary-container/50 focus:outline-none transition-shadow" placeholder="Search" type="text" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 border border-border-default rounded-lg cursor-pointer hover:bg-surface-container-low transition-colors">
            <img alt="English Flag" className="w-5 h-4 object-cover rounded-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPiqo91dCGQWBLBXRmkM6SxGy707vNuwOQ3vdJEUXOf8fnr-1P6SRO00r27S50HyKN10-Joa4K0nHL4s3YYq72IJgtWgTMaKaOjHMUQjkUaUEYJIFrOf9_sMgGPf8x7v8XR9NdtmVWs9r0dSPfHWSZGHfLn2ILvfzlHfdjGWnwswaWCdwIeC-lHp4Os-_v6W79E8sr2FcNPLGdrVXUbAjK_czvVfcwl2PPOVKrH27W0_glzl2x6kvkGwRLoiVmFHrZpj1pL0dWn_1I" />
            <span className="text-sm font-medium text-text-secondary">ENGLISH</span>
            <span className="material-symbols-outlined text-text-muted text-sm">expand_more</span>
          </div>
          <button className="relative p-2 text-text-secondary hover:text-primary transition-colors hover:bg-surface-container-low rounded-full">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full border border-surface"></span>
          </button>
          <div className="flex items-center gap-3 pl-4 border-l border-border-default">
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
                A
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-text-primary">Admin</span>
                <span className="text-xs text-text-muted capitalize">{accountType.replace('_', ' ')}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Đăng xuất"
              className="ml-2 p-2 text-text-muted hover:text-danger hover:bg-danger-bg rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="md:ml-[240px] pt-[64px] p-container-padding">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
