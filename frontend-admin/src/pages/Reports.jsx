import React from 'react';

const Reports = () => {
  return (
    <div className="content">
      <h2 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '16px' }}>Báo cáo Doanh thu</h2>
      
      <div className="metrics">
        <div className="metric">
          <div className="metric-label">Tổng doanh thu Tháng này</div>
          <div className="metric-value">1,480.5M</div>
          <div className="metric-change up"><i className="ti ti-arrow-up" style={{ fontSize: '10px' }}></i> +22% so với tháng trước</div>
        </div>
        <div className="metric">
          <div className="metric-label">Tổng vé bán ra</div>
          <div className="metric-value">45.2K</div>
          <div className="metric-change up"><i className="ti ti-arrow-up" style={{ fontSize: '10px' }}></i> +15%</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '16px', height: '400px', display: 'flex', flexDirection: 'column' }}>
        <div className="card-header">
          <span className="card-title">Biểu đồ tăng trưởng (Minh họa)</span>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)', border: '1px dashed var(--color-border-secondary)', borderRadius: '8px' }}>
          <div style={{ textAlign: 'center' }}>
             <i className="ti ti-chart-bar" style={{ fontSize: '48px', color: 'var(--color-text-tertiary)' }}></i>
             <div style={{ marginTop: '10px', fontSize: '13px' }}>Khu vực hiển thị biểu đồ Chart.js (React-chartjs-2) chi tiết theo dòng thời gian</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
