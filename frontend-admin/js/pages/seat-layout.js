/**
 * Seat Layout Designer Logic
 * Handles Matrix generation, Painting (Click & Drag), and saving.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Init Sidebar
  const sidebar = new Sidebar('sidebar-container');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebarEl = document.getElementById('sidebar-container');
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
      sidebarEl.classList.toggle('show');
    });
  }

  const app = new SeatLayoutDesigner();
  app.init();
});

class SeatLayoutDesigner {
  constructor() {
    this.rowsInput = document.getElementById('input-rows');
    this.colsInput = document.getElementById('input-cols');
    this.generateBtn = document.getElementById('btn-generate-grid');
    this.matrixContainer = document.getElementById('seat-matrix-container');
    this.paletteBtns = document.querySelectorAll('.palette-btn');
    this.saveBtn = document.getElementById('btn-save-layout');

    this.currentTool = 'STANDARD'; // Công cụ vẽ mặc định
    this.isDragging = false; // Cờ kiểm tra đang nhấn giữ chuột
    this.matrixData = []; // Lưu mảng 2 chiều
  }

  init() {
    this.bindPaletteSelection();
    this.bindGridGeneration();
    this.bindMouseDragEvents();
    
    // Generate initial grid
    this.generateGrid();

    // Save
    this.saveBtn.addEventListener('click', () => this.saveLayout());
  }

  /**
   * Chọn công cụ vẽ từ Toolbar
   */
  bindPaletteSelection() {
    this.paletteBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Reset active all
        this.paletteBtns.forEach(b => b.classList.remove('active'));
        // Set active current
        btn.classList.add('active');
        this.currentTool = btn.dataset.type;
      });
    });
  }

  /**
   * Sinh ra lưới dựa trên số R và C
   */
  bindGridGeneration() {
    this.generateBtn.addEventListener('click', () => {
      if(confirm('Khởi tạo lại lưới sẽ xóa toàn bộ sơ đồ hiện tại. Bạn có chắc không?')) {
        this.generateGrid();
      }
    });
  }

  generateGrid() {
    const rows = parseInt(this.rowsInput.value) || 10;
    const cols = parseInt(this.colsInput.value) || 12;
    const rowCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    this.matrixContainer.innerHTML = '';
    this.matrixData = [];

    for (let r = 0; r < rows; r++) {
      const rowChar = rowCharacters[r] || r.toString();
      const rowDiv = document.createElement('div');
      rowDiv.className = 'seat-row';
      
      const rowLabel = document.createElement('div');
      rowLabel.className = 'row-label';
      rowLabel.textContent = rowChar;
      rowDiv.appendChild(rowLabel);

      const rowData = [];

      for (let c = 0; c < cols; c++) {
        // Mặc định tạo ra ghế STANDARD
        const type = 'STANDARD'; 
        rowData.push(type);

        const seatCell = document.createElement('div');
        seatCell.className = `seat-cell ${type.toLowerCase()}`;
        seatCell.dataset.row = r;
        seatCell.dataset.col = c;
        seatCell.innerHTML = c + 1; // Số ghế tạm thời

        // Bind events for painting
        seatCell.addEventListener('mousedown', (e) => this.paintCell(seatCell, r, c));
        seatCell.addEventListener('mouseenter', (e) => {
          if (this.isDragging) this.paintCell(seatCell, r, c);
        });

        rowDiv.appendChild(seatCell);
      }

      this.matrixData.push(rowData);
      this.matrixContainer.appendChild(rowDiv);
    }
  }

  /**
   * Xử lý di chuột để vẽ liên tục
   */
  bindMouseDragEvents() {
    // Prevent default drag image behavior on the matrix
    this.matrixContainer.addEventListener('dragstart', (e) => e.preventDefault());

    document.addEventListener('mousedown', () => this.isDragging = true);
    document.addEventListener('mouseup', () => this.isDragging = false);
  }

  /**
   * Đổi loại ghế tại ô được trỏ vào
   */
  paintCell(seatCell, r, c) {
    if(this.matrixData[r][c] === this.currentTool) return; // Không cần sơn lại nếu cùng màu

    // Update Matrix Data
    this.matrixData[r][c] = this.currentTool;

    // View update
    seatCell.className = `seat-cell ${this.currentTool.toLowerCase()}`;
    
    // Nếu là Lối đi (AISLE) thì xóa text bên trong đi cho đẹp
    if(this.currentTool === 'AISLE' || this.currentTool === 'EMPTY') {
      seatCell.innerHTML = '';
    } else {
      seatCell.innerHTML = c + 1; // Reset lại số
    }
    
    // Lưu ý: logic đổi số khi có lối đi hoặc cặp đôi có thể tinh chỉnh sau
    // Đây là phiên bản basic concept
  }

  /**
   * Console log ra JSON mô phỏng việc Call POST /halls/:id/seats
   */
  saveLayout() {
    const layoutPayload = {
      hallId: 101, // Mock
      rowCount: this.matrixData.length,
      colCount: this.matrixData[0].length,
      matrix: this.matrixData
    };

    console.log("Saving Mapping:", JSON.stringify(layoutPayload, null, 2));
    alert('Đã lưu sơ đồ ghế thành công! Vui lòng F12 mở console để xem mảng ma trận JSON.');
  }

}
