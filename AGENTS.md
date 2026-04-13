# AGENTS.md — Hệ thống Đặt vé Xem phim Đa nền tảng

> Đồ án môn Phát triển Ứng dụng Đa nền tảng · Nhóm 5 thành viên
> Phiên bản v2 — React Native · Node.js/Express · SQL Server · Redis · WebSocket

---

## Mục lục

- [I. Tổng quan Dự án](#i-tổng-quan-dự-án)
- [II. Cấu trúc Thư mục](#ii-cấu-trúc-thư-mục)
- [III. Công nghệ & Phiên bản](#iii-công-nghệ--phiên-bản)
- [IV. Backend — Node.js + Express](#iv-backend--nodejs--express)
- [V. Mobile App — React Native](#v-mobile-app--react-native)
- [VI. Frontend Admin — HTML/CSS/JS](#vi-frontend-admin--htmlcssjs)
- [VII. Database — SQL Server](#vii-database--sql-server)
- [VIII. Quy tắc Nghiệp vụ](#viii-quy-tắc-nghiệp-vụ)
- [IX. Testing & Verification](#ix-testing--verification)
- [X. Git & Workflow](#x-git--workflow)

---

## I. Tổng quan Dự án

Hệ thống đặt vé xem phim đa nền tảng bao gồm:

- **Mobile App** (React Native): Giao diện khách hàng — đặt vé, chọn ghế realtime, thanh toán QR.
- **Admin Panel** (HTML/CSS/JS): Giao diện quản trị — quản lý phim, rạp, khuyến mãi, báo cáo doanh thu.
- **Backend API** (Node.js/Express): REST API xử lý business logic, WebSocket realtime, Job Scheduler.
- **Database** (SQL Server): 16 bảng dữ liệu có cấu trúc, hỗ trợ ACID.
- **Cache/Lock** (Redis): Khóa ghế tạm thời TTL 10 phút, Optimistic Locking.

### Actors

| Actor | Mô tả |
|-------|-------|
| **Khách hàng** (CUSTOMER) | Đăng ký, đặt vé, thanh toán, quản lý vé, xem thông báo |
| **Quản trị viên** (ADMIN) | Quản lý phim, rạp, sơ đồ ghế, khuyến mãi, xem báo cáo |
| **Nhân viên** (STAFF) | Hỗ trợ kiểm vé, xác nhận offline |
| **Hệ thống tự động** | Cronjob hủy ghế hết hạn, nhắc lịch, cộng điểm, broadcast ghế |

---

## II. Cấu trúc Thư mục

```
da_nen_tang/
├── AGENTS.md                           # File cấu hình này
├── backend/                            # Node.js + Express API Server
│   ├── package.json
│   ├── .env.example
│   ├── server.js                       # Entry point
│   └── src/
│       ├── config/                     # Cấu hình DB, Redis, JWT, Cloudinary, env
│       ├── controllers/                # Xử lý request/response
│       │   ├── admin/                  # UC16-19: Phim, rạp, khuyến mãi, báo cáo
│       │   ├── auth/                   # UC01-02: Đăng ký, đăng nhập, phân quyền
│       │   ├── booking/                # UC04-05,12-13: Đặt vé, lịch sử, hủy vé
│       │   ├── cinema/                 # Rạp, phòng chiếu, sơ đồ ghế
│       │   ├── customer/               # UC22: Thông tin tài khoản, loyalty
│       │   ├── movie/                  # UC03: Tìm kiếm phim, lịch chiếu
│       │   ├── notification/           # UC11,15: Thông báo, nhắc lịch
│       │   ├── payment/               # UC06,10,21: Thanh toán, rollback, retry
│       │   ├── product/               # Combo bắp nước
│       │   └── voucher/               # UC08-09: FEFO engine, voucher
│       ├── middlewares/                # Auth JWT, phân quyền, error handler, rate limit
│       ├── models/                     # ORM/Query models — 16 bảng theo ERD
│       ├── routes/                     # Express Router (mirror controllers)
│       │   ├── admin/                  # /admin/* routes
│       │   ├── auth/                   # /auth/* routes
│       │   ├── booking/               # /booking/* routes
│       │   ├── cinema/                # /cinema/* routes
│       │   ├── customer/              # /customer/* routes
│       │   ├── movie/                 # /movie/* routes
│       │   ├── notification/          # /notification/* routes
│       │   ├── payment/              # /payment/* routes
│       │   ├── product/              # /product/* routes
│       │   └── voucher/              # /voucher/* routes
│       ├── services/                   # Business logic layer
│       ├── utils/                      # Helper functions, formatters
│       ├── jobs/                       # node-cron / bull: scheduled tasks
│       ├── socket/                     # Socket.IO: realtime seat updates
│       └── validators/                 # Input validation (joi / express-validator)
│
├── frontend-admin/                     # HTML/CSS/JS Admin Panel
│   ├── index.html                      # Entry point
│   ├── css/                            # Stylesheets
│   ├── js/
│   │   ├── pages/                      # Logic từng trang admin
│   │   ├── components/                 # Reusable UI components
│   │   ├── services/                   # API calls (fetch/axios)
│   │   └── utils/                      # Helpers, formatters
│   ├── pages/                          # HTML pages (movies, cinemas, reports...)
│   └── assets/images/                  # Ảnh, icons
│
├── mobile-app/                         # React Native (iOS + Android)
│   ├── package.json
│   ├── App.js                          # Entry point
│   ├── app.json
│   └── src/
│       ├── api/                        # Axios instance, API endpoints config
│       ├── assets/                     # Fonts, images
│       ├── components/                 # Reusable UI components
│       │   ├── common/                 # Button, Input, Modal, Loading, Header
│       │   ├── auth/                   # Login/Register forms
│       │   ├── booking/                # Booking flow components
│       │   ├── cinema/                 # Cinema list, hall info
│       │   ├── movie/                  # Movie card, movie detail
│       │   ├── notification/           # Notification item
│       │   ├── payment/               # QR code, payment status
│       │   ├── profile/               # Avatar, loyalty points
│       │   ├── seat/                  # Seat map grid (WebSocket realtime)
│       │   └── voucher/               # Voucher card, FEFO list
│       ├── navigation/                 # React Navigation (Stack, Tab, Drawer)
│       ├── screens/                    # Màn hình chính
│       │   ├── auth/                   # LoginScreen, RegisterScreen
│       │   ├── home/                   # HomeScreen (phim đang chiếu)
│       │   ├── movie/                  # MovieDetailScreen, SearchScreen
│       │   ├── cinema/                 # CinemaListScreen, ShowtimeScreen
│       │   ├── booking/               # SeatSelectionScreen, ComboScreen
│       │   ├── payment/              # PaymentScreen, PaymentResultScreen
│       │   ├── profile/              # ProfileScreen, EditProfileScreen
│       │   ├── notification/          # NotificationListScreen
│       │   └── ticket/               # TicketHistoryScreen, TicketDetailScreen
│       ├── services/                   # API service layer (authService, bookingService...)
│       ├── store/slices/               # Redux Toolkit / Zustand state slices
│       ├── hooks/                      # Custom hooks (useSocket, useAuth, useLocation)
│       ├── utils/                      # Helpers, date formatters, price formatters
│       ├── constants/                  # Enums, color palette, API URLs, seat types
│       └── context/                    # React Context (AuthContext, ThemeContext)
│
├── database/                           # SQL Server
│   ├── migrations/                     # Schema creation & alterations (theo thứ tự)
│   ├── seeds/                          # Dữ liệu mẫu (cities, cinemas, movies, shows...)
│   └── scripts/                        # Utility SQL scripts (reset, backup, indexes)
│
└── docs/                               # Tài liệu
    ├── diagrams/                       # ERD, Use Case, Sequence diagram images
    └── api/                            # API documentation (endpoint specs)
```

---

## III. Công nghệ & Phiên bản

| Tầng | Công nghệ | Vai trò |
|------|-----------|---------|
| Frontend Mobile | **React Native** (Expo hoặc CLI) | Giao diện khách hàng: đặt vé, chọn ghế, thanh toán |
| Frontend Admin | **HTML / CSS / JavaScript** thuần | Giao diện quản trị: phim, rạp, báo cáo (Chart.js) |
| Backend | **Node.js + Express** | REST API, business logic, middleware |
| Realtime | **Socket.IO** (WebSocket) | Cập nhật trạng thái ghế theo thời gian thực |
| Database | **SQL Server** (mssql) | Lưu trữ dữ liệu có cấu trúc (ACID) |
| Cache / Lock | **Redis** (ioredis) | Khóa ghế tạm thời TTL 10 phút, Optimistic Locking |
| Xác thực | **JWT + HMAC** (jsonwebtoken) | Token-based auth, payload chứa AccountType |
| Email | **Nodemailer** | Gửi email xác nhận vé, thông báo |
| Job Scheduler | **node-cron** hoặc **bull** | Cronjob hủy ghế hết hạn, nhắc lịch 30p trước chiếu |
| File Storage | **S3** hoặc **Cloudinary** | Lưu ảnh poster phim, AvatarUrl (KHÔNG lưu trong DB) |
| Charts | **Chart.js** | Biểu đồ trực quan trên Admin Panel |

### Dependencies chính (Backend)

```json
{
  "dependencies": {
    "express": "^4.x",
    "mssql": "^10.x",
    "ioredis": "^5.x",
    "socket.io": "^4.x",
    "jsonwebtoken": "^9.x",
    "bcryptjs": "^2.x",
    "nodemailer": "^6.x",
    "node-cron": "^3.x",
    "joi": "^17.x",
    "cors": "^2.x",
    "helmet": "^7.x",
    "morgan": "^1.x",
    "dotenv": "^16.x",
    "multer": "^1.x",
    "cloudinary": "^1.x"
  }
}
```

### Dependencies chính (Mobile App)

```json
{
  "dependencies": {
    "react-native": "latest",
    "@react-navigation/native": "^6.x",
    "@react-navigation/stack": "^6.x",
    "@react-navigation/bottom-tabs": "^6.x",
    "@reduxjs/toolkit": "^2.x",
    "react-redux": "^9.x",
    "axios": "^1.x",
    "socket.io-client": "^4.x",
    "react-native-vector-icons": "^10.x",
    "react-native-qrcode-svg": "^6.x",
    "@react-native-async-storage/async-storage": "^1.x",
    "react-native-push-notification": "^8.x"
  }
}
```

---

## IV. Backend — Node.js + Express

### Quy tắc chung

- Sử dụng **ES6+ syntax** (arrow functions, destructuring, template literals, async/await).
- **LUÔN** dùng `async/await` thay vì callbacks hoặc `.then()` chains.
- **KHÔNG BAO GIỜ** dùng `var`. Dùng `const` mặc định, chỉ dùng `let` khi cần reassign.
- Tất cả files sử dụng **CommonJS** (`require/module.exports`) hoặc thống nhất **ESM** (`import/export`) — chọn 1 và giữ nhất quán trong toàn bộ backend.
- **KHÔNG** commit file `.env`. Luôn dùng `.env.example` làm template.

### Kiến trúc MVC + Service Layer

```
Request → Route → Middleware → Controller → Service → Model → Database
                                    ↓
                              Validator (input)
```

- **Routes**: Chỉ define HTTP method + path + middleware chain. Không chứa logic.
- **Controllers**: Nhận request, gọi service, trả response. Không chứa business logic trực tiếp.
- **Services**: Chứa TOÀN BỘ business logic. Đây là nơi duy nhất xử lý nghiệp vụ.
- **Models**: Chỉ chứa query database (SQL queries hoặc ORM methods).
- **Validators**: Validate input bằng Joi hoặc express-validator. Luôn validate TRƯỚC khi vào controller.

### Cấu trúc Response API

Tất cả API phải trả về format thống nhất:

```javascript
// Success
{
  "success": true,
  "message": "Thông báo thành công",
  "data": { ... }
}

// Error
{
  "success": false,
  "message": "Mô tả lỗi",
  "error": {
    "code": "ERROR_CODE",
    "details": "Chi tiết lỗi (chỉ hiện ở development)"
  }
}

// Paginated List
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### HTTP Status Codes

| Code | Khi nào dùng |
|------|-------------|
| `200` | GET thành công, UPDATE thành công |
| `201` | POST tạo mới thành công |
| `400` | Validation error, bad request |
| `401` | Chưa xác thực (missing/invalid token) |
| `403` | Không có quyền (AccountType không đủ) |
| `404` | Resource không tồn tại |
| `409` | Conflict (ghế đã được đặt, voucher đã dùng) |
| `422` | Unprocessable entity (vi phạm ràng buộc nghiệp vụ) |
| `500` | Internal server error |

### Naming Conventions

```javascript
// Files: kebab-case
auth.controller.js
booking.service.js
cinema-hall.model.js
auth.middleware.js
booking.validator.js
seat.routes.js

// Variables & Functions: camelCase
const bookingService = require('./booking.service');
async function getAvailableSeats(showId) { ... }

// Constants & Enums: UPPER_SNAKE_CASE
const SEAT_TYPES = { STANDARD: 'STANDARD', VIP: 'VIP', COUPLE: 'COUPLE', AISLE: 'AISLE', EMPTY: 'EMPTY' };
const PAYMENT_STATUS = { CREATED: 'CREATED', PENDING_PAYMENT: 'PENDING_PAYMENT', PROCESSING: 'PROCESSING', SUCCESS: 'SUCCESS', FAILED: 'FAILED' };
const BOOKING_STATUS = { PENDING: 'PENDING', CONFIRMED: 'CONFIRMED', CANCELLED: 'CANCELLED' };
const ACCOUNT_TYPES = { CUSTOMER: 'CUSTOMER', ADMIN: 'ADMIN', STAFF: 'STAFF' };

// Database table/column references: PascalCase (theo ERD)
// SQL queries reference: Account.AccountType, Customer.LoyaltyPoints, CinemaHallSeat.RowVersion
```

### Middleware Stack

Thứ tự middleware trên mỗi route:

```javascript
router.post('/bookings',
  authMiddleware,           // 1. Xác thực JWT token
  roleMiddleware('CUSTOMER'), // 2. Phân quyền theo AccountType
  rateLimitMiddleware,       // 3. Rate limiting
  validateBooking,           // 4. Validate input
  bookingController.create   // 5. Controller handler
);
```

### Authentication & Authorization

- JWT token payload **BẮT BUỘC** chứa: `{ accountId, accountType, customerId }`.
- Token expire: Access Token = 24h, Refresh Token = 7d.
- Kiểm tra `Account.IsActive` mỗi lần đăng nhập — tài khoản bị vô hiệu hóa không thể login.
- Phân quyền dựa trên `AccountType`: `CUSTOMER`, `ADMIN`, `STAFF`.
- Admin routes prefix: `/admin/*` — chỉ `ADMIN` và `STAFF` được truy cập.
- Hash password bằng **bcryptjs** với salt rounds = 10.

### WebSocket (Socket.IO)

```javascript
// Room naming convention: show_{showId}
socket.join(`show_${showId}`);

// Events phát ra:
'seat:hold'        // Ghế vừa được khóa tạm (10 phút)
'seat:release'     // Ghế vừa được giải phóng (hết hạn / hủy vé)
'seat:booked'      // Ghế đã được đặt thành công (thanh toán xong)
'booking:expired'  // Đơn đặt hết hạn 10 phút

// Payload structure:
{
  showId: Number,
  seatId: Number,
  seatNumber: String,
  status: 'HOLDING' | 'EMPTY' | 'BOOKED',
  holdBy: Number | null,     // customerId
  holdUntil: Date | null
}
```

### Job Scheduler

Các tác vụ định kỳ chạy bằng `node-cron` hoặc `bull`:

| Job | Schedule | Mô tả |
|-----|----------|-------|
| `releaseExpiredSeats` | Mỗi 1 phút | Kiểm tra Redis TTL + fallback query `BookingSeat.HoldUntil < NOW()`. Giải phóng ghế hết hạn, broadcast WebSocket. |
| `reminderNotification` | Mỗi 5 phút | Gửi thông báo nhắc lịch 30 phút trước giờ chiếu. |
| `cleanupExpiredBookings` | Mỗi 10 phút | Xóa booking tạm quá hạn, cập nhật trạng thái. |

### Redis Key Conventions

```
seat:hold:{showId}:{seatId}    → TTL 600s (10 phút), value = customerId
booking:temp:{bookingId}       → TTL 600s, value = JSON booking data
rate:limit:{ip}                → TTL 60s, value = request count
```

### Error Handling

- Tất cả async controller **BẮT BUỘC** wrap trong `try/catch` hoặc dùng `asyncHandler` wrapper.
- KHÔNG BAO GIỜ để unhandled promise rejection.
- Log errors bằng `console.error` hoặc logging library (winston/pino).
- Sử dụng custom error classes:

```javascript
class AppError extends Error {
  constructor(message, statusCode, errorCode) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true;
  }
}

// Ví dụ:
throw new AppError('Ghế đã được đặt bởi người khác', 409, 'SEAT_ALREADY_BOOKED');
throw new AppError('Đã quá thời hạn hủy vé', 422, 'CANCELLATION_DEADLINE_PASSED');
throw new AppError('Voucher không hợp lệ hoặc đã hết hạn', 400, 'INVALID_VOUCHER');
```

### API Routes Reference

```
# Auth
POST   /api/auth/register              → UC01: Đăng ký tài khoản
POST   /api/auth/login                 → UC02: Đăng nhập (trả JWT)
POST   /api/auth/refresh-token         → Làm mới token

# Customer
GET    /api/customer/profile           → UC22: Xem thông tin tài khoản
PUT    /api/customer/profile           → UC22: Sửa thông tin
PUT    /api/customer/avatar            → Upload ảnh đại diện (Cloudinary)
GET    /api/customer/loyalty-points    → Xem điểm tích lũy

# Movies
GET    /api/movies                     → UC03: Danh sách phim đang chiếu
GET    /api/movies/search?q=           → UC03: Tìm kiếm phim
GET    /api/movies/:id                 → Chi tiết phim
POST   /api/movies/:id/like            → Yêu thích phim
DELETE /api/movies/:id/like            → Bỏ yêu thích

# Cinemas
GET    /api/cinemas                    → Danh sách rạp
GET    /api/cinemas?cityId=            → Lọc rạp theo thành phố
GET    /api/cinemas/:id/shows          → Lịch chiếu theo rạp

# Shows
GET    /api/shows/:id                  → Chi tiết suất chiếu
GET    /api/shows/:id/seats            → UC05: Sơ đồ ghế (kèm trạng thái realtime)

# Bookings
POST   /api/bookings                   → UC04: Tạo đơn đặt vé (khóa ghế 10p)
GET    /api/bookings                   → UC12: Lịch sử đặt vé
GET    /api/bookings/:id               → Chi tiết booking
POST   /api/bookings/:id/cancel        → UC13: Hủy vé (kiểm tra thời hạn)

# Payment
POST   /api/payments/:bookingId/pay    → UC06: Thanh toán (QR giả lập)
POST   /api/payments/webhook           → Webhook từ Payment Gateway
POST   /api/payments/:bookingId/retry  → UC21: Retry thanh toán

# Products
GET    /api/products                   → Danh sách combo bắp nước

# Vouchers
GET    /api/vouchers                   → UC08: Danh sách voucher FEFO
POST   /api/vouchers/apply             → UC09: Áp dụng voucher

# Notifications
GET    /api/notifications              → Danh sách thông báo
PUT    /api/notifications/:id/read     → Đánh dấu đã đọc

# Admin
GET    /api/admin/stats/revenue        → UC19: Báo cáo doanh thu
GET    /api/admin/stats/tickets        → UC19: Thống kê vé bán ra
GET    /api/admin/stats/accounts       → UC19: Thống kê tài khoản
POST   /api/admin/movies               → UC16: Thêm phim
PUT    /api/admin/movies/:id           → UC16: Sửa phim
DELETE /api/admin/movies/:id           → UC16: Xóa phim
POST   /api/admin/shows                → UC16: Tạo suất chiếu
POST   /api/admin/cinemas              → UC17: Thêm rạp
PUT    /api/admin/cinemas/:id/halls    → UC17: Cấu hình phòng chiếu
PUT    /api/admin/halls/:id/seats      → UC17: Thiết lập sơ đồ ghế
POST   /api/admin/vouchers             → UC18: Tạo voucher
PUT    /api/admin/vouchers/:id         → UC18: Cập nhật voucher
PUT    /api/admin/accounts/:id/status  → Kích hoạt / vô hiệu hóa tài khoản
```

---

## V. Mobile App — React Native

### Quy tắc chung

- Sử dụng **Functional Components** + **Hooks**. KHÔNG dùng Class Components.
- State management: **Redux Toolkit** hoặc **Zustand** — chọn 1, nhất quán.
- Navigation: **React Navigation v6+** (Stack Navigator + Bottom Tab Navigator).
- HTTP client: **Axios** với interceptors cho JWT token.
- KHÔNG inline styles phức tạp. Dùng `StyleSheet.create()` ở cuối file.
- Mỗi screen component đặt trong 1 file riêng, đặt tên PascalCase: `LoginScreen.js`, `SeatSelectionScreen.js`.

### Naming Conventions

```javascript
// Files — PascalCase cho components/screens, camelCase cho utilities
LoginScreen.js
MovieCard.js
SeatGrid.js
authService.js
useSocket.js
formatCurrency.js

// Components — PascalCase
export default function MovieCard({ movie, onPress }) { ... }

// Hooks — 'use' prefix + camelCase
export function useAuth() { ... }
export function useSocket(showId) { ... }

// Redux Slices — camelCase
authSlice.js → state.auth
bookingSlice.js → state.booking

// Constants — UPPER_SNAKE_CASE
export const SEAT_COLORS = {
  STANDARD: '#4CAF50',
  VIP: '#FF9800',
  COUPLE: '#E91E63',
  HOLDING: '#FFEB3B',
  BOOKED: '#9E9E9E',
  AISLE: 'transparent',
  SELECTED: '#2196F3',
};
```

### Cấu trúc Screen

Mỗi screen tuân theo pattern:

```javascript
// screens/booking/SeatSelectionScreen.js
import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSocket } from '../../hooks/useSocket';
import SeatGrid from '../../components/seat/SeatGrid';
import { showService } from '../../services/showService';

export default function SeatSelectionScreen({ route, navigation }) {
  const { showId } = route.params;
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  // 1. Fetch initial data
  useEffect(() => { /* ... */ }, [showId]);

  // 2. WebSocket realtime
  useSocket(showId, {
    onSeatHold: (data) => { /* cập nhật ghế bị giữ */ },
    onSeatRelease: (data) => { /* cập nhật ghế được nhả */ },
  });

  // 3. Event handlers
  const handleSeatPress = (seat) => { /* logic chọn ghế + check ràng buộc */ };
  const handleConfirm = () => { /* navigate to ComboScreen */ };

  // 4. Render
  return (
    <View style={styles.container}>
      <SeatGrid seats={seats} selected={selectedSeats} onSeatPress={handleSeatPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
});
```

### Navigation Structure

```
App
├── AuthStack (khi chưa login)
│   ├── LoginScreen
│   └── RegisterScreen
│
└── MainTab (khi đã login)
    ├── HomeStack
    │   ├── HomeScreen              → Danh sách phim đang chiếu
    │   ├── MovieDetailScreen       → Chi tiết phim + suất chiếu
    │   ├── CinemaListScreen        → Chọn rạp
    │   ├── ShowtimeScreen          → Chọn suất chiếu
    │   ├── SeatSelectionScreen     → Chọn ghế (realtime)
    │   ├── ComboScreen             → Chọn bắp nước
    │   ├── PaymentScreen           → Thanh toán QR
    │   └── PaymentResultScreen     → Kết quả
    │
    ├── TicketStack
    │   ├── TicketHistoryScreen     → Lịch sử vé
    │   └── TicketDetailScreen      → Chi tiết vé + QR code
    │
    ├── NotificationScreen          → Danh sách thông báo
    │
    └── ProfileStack
        ├── ProfileScreen           → Thông tin tài khoản + Loyalty
        └── EditProfileScreen       → Sửa thông tin
```

### API Service Pattern

```javascript
// api/axiosInstance.js — Config Axios với interceptors
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://YOUR_API_URL/api',
  timeout: 10000,
});

// Request interceptor — Tự động gắn JWT token
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor — Xử lý lỗi 401 (token expired)
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401) {
      // Thử refresh token hoặc logout
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default api;
```

```javascript
// services/bookingService.js — Ví dụ service layer
import api from '../api/axiosInstance';

export const bookingService = {
  getSeats: (showId) => api.get(`/shows/${showId}/seats`),
  createBooking: (data) => api.post('/bookings', data),
  getHistory: (page = 1) => api.get(`/bookings?page=${page}`),
  cancelBooking: (bookingId) => api.post(`/bookings/${bookingId}/cancel`),
};
```

---

## VI. Frontend Admin — HTML/CSS/JS

### Quy tắc chung

- Sử dụng **Vanilla JavaScript** (ES6+). KHÔNG dùng framework (React, Vue, Angular).
- Styling bằng **CSS thuần** — có thể dùng CSS Variables cho theme.
- Charts bằng **Chart.js** cho biểu đồ doanh thu, vé bán ra.
- Gọi API bằng `fetch()` hoặc `axios` CDN.
- Layout responsive dùng CSS Grid / Flexbox.
- Đặt tên file HTML theo trang: `movies.html`, `cinemas.html`, `reports.html`.

### Cấu trúc trang Admin

```
index.html            → Dashboard tổng quan (doanh thu, vé hôm nay)
pages/
├── movies.html       → CRUD phim (UC16)
├── shows.html        → Quản lý suất chiếu (UC16)
├── cinemas.html      → Quản lý rạp + phòng chiếu (UC17)
├── seat-layout.html  → Thiết lập sơ đồ ghế (UC17)
├── vouchers.html     → Cấu hình khuyến mãi (UC18)
├── reports.html      → Báo cáo thống kê + Chart.js (UC19)
└── accounts.html     → Quản lý tài khoản (kích hoạt/vô hiệu)
```

### Naming Conventions

```javascript
// JS files: camelCase
js/pages/movieManager.js
js/services/apiService.js
js/components/dataTable.js
js/utils/formatDate.js

// CSS classes: kebab-case, prefix theo module
.admin-sidebar { }
.movie-card { }
.report-chart { }
.seat-grid { }
.btn-primary { }
.modal-overlay { }

// IDs: camelCase, mô tả rõ element
#movieFormModal
#revenueChart
#seatLayoutGrid
#accountStatusToggle
```

---

## VII. Database — SQL Server

### ERD — 16 bảng dữ liệu

#### Nhóm Cinema & Hall

```sql
-- City
CREATE TABLE City (
    CityID INT PRIMARY KEY IDENTITY(1,1),
    CityName NVARCHAR(100) NOT NULL
);

-- Cinema
CREATE TABLE Cinema (
    CinemaID INT PRIMARY KEY IDENTITY(1,1),
    CinemaName NVARCHAR(200) NOT NULL,
    CityID INT NOT NULL FOREIGN KEY REFERENCES City(CityID),
    Latitude DECIMAL(9,6),
    Longitude DECIMAL(9,6)
);

-- CinemaHall
CREATE TABLE CinemaHall (
    HallID INT PRIMARY KEY IDENTITY(1,1),
    CinemaID INT NOT NULL FOREIGN KEY REFERENCES Cinema(CinemaID),
    HallName NVARCHAR(100) NOT NULL,
    TotalSeats INT NOT NULL
);

-- CinemaHallSeat
CREATE TABLE CinemaHallSeat (
    SeatID INT PRIMARY KEY IDENTITY(1,1),
    HallID INT NOT NULL FOREIGN KEY REFERENCES CinemaHall(HallID),
    SeatNumber NVARCHAR(10) NOT NULL,           -- VD: 'A1', 'B5', 'C10'
    SeatType NVARCHAR(20) NOT NULL,             -- STANDARD | VIP | COUPLE | AISLE | EMPTY
    SeatPrice DECIMAL(10,2) DEFAULT 0,          -- Phụ thu theo loại ghế
    PairID INT NULL,                            -- Liên kết cặp ghế đôi
    RowIndex INT NOT NULL,                      -- ★ Tọa độ hàng trong lưới sơ đồ
    ColIndex INT NOT NULL,                      -- ★ Tọa độ cột trong lưới sơ đồ
    IsAisle BIT DEFAULT 0,                      -- ★ Đánh dấu lối đi
    RowVersion INT DEFAULT 0                    -- ★ Optimistic Locking
);
```

#### Nhóm Movie & Show

```sql
-- Movie
CREATE TABLE Movie (
    MovieID INT PRIMARY KEY IDENTITY(1,1),
    MovieTitle NVARCHAR(200) NOT NULL,
    MovieGenre NVARCHAR(100),
    MovieLanguage NVARCHAR(50),
    MovieRuntime INT,                           -- Phút
    MovieReleaseDate DATE,
    MovieActor NVARCHAR(500),
    MovieDirector NVARCHAR(200)
    -- Poster lưu trên S3/Cloudinary, không lưu trong DB
);

-- Show (suất chiếu)
CREATE TABLE Show (
    ShowID INT PRIMARY KEY IDENTITY(1,1),
    MovieID INT NOT NULL FOREIGN KEY REFERENCES Movie(MovieID),
    HallID INT NOT NULL FOREIGN KEY REFERENCES CinemaHall(HallID),
    ShowTime TIME NOT NULL,
    ShowDate DATE NOT NULL,
    Format NVARCHAR(10) NOT NULL,               -- ★ 2D | 3D | IMAX
    BasePrice DECIMAL(10,2) NOT NULL            -- ★ Giá cơ bản (theo ngày/định dạng)
);
```

#### Nhóm Booking & Seat

```sql
-- Booking
CREATE TABLE Booking (
    BookingID INT PRIMARY KEY IDENTITY(1,1),
    CustomerID INT NOT NULL FOREIGN KEY REFERENCES Customer(CustomerID),
    ShowID INT NOT NULL FOREIGN KEY REFERENCES Show(ShowID),
    TotalSeats INT NOT NULL,                    -- ★ Số ghế trong đơn
    Status NVARCHAR(20) NOT NULL                -- PENDING | CONFIRMED | CANCELLED
);

-- BookingSeat
CREATE TABLE BookingSeat (
    BookingSeatID INT PRIMARY KEY IDENTITY(1,1),
    BookingID INT NOT NULL FOREIGN KEY REFERENCES Booking(BookingID),
    ShowID INT NOT NULL FOREIGN KEY REFERENCES Show(ShowID),
    SeatID INT NOT NULL FOREIGN KEY REFERENCES CinemaHallSeat(SeatID),
    Status NVARCHAR(20) NOT NULL,               -- HOLDING | BOOKED | EMPTY
    TicketPrice DECIMAL(10,2) NOT NULL,         -- = BasePrice + SeatPrice
    HoldUntil DATETIME NULL                     -- ★ Failover khi Redis down
);
```

#### Nhóm Customer & Account

```sql
-- Account
CREATE TABLE Account (
    AccountID INT PRIMARY KEY IDENTITY(1,1),
    AccountName NVARCHAR(100) NOT NULL UNIQUE,  -- Email đăng nhập
    AccountPassword NVARCHAR(255) NOT NULL,     -- Bcrypt hash
    AccountType NVARCHAR(20) NOT NULL,          -- ★ CUSTOMER | ADMIN | STAFF
    IsActive BIT DEFAULT 1                      -- ★ Trạng thái hoạt động
);

-- Customer
CREATE TABLE Customer (
    CustomerID INT PRIMARY KEY IDENTITY(1,1),
    AccountID INT NOT NULL UNIQUE FOREIGN KEY REFERENCES Account(AccountID),
    CustomerName NVARCHAR(100) NOT NULL,
    CustomerEmail NVARCHAR(200) NOT NULL,
    CustomerPhone NVARCHAR(20),
    CustomerGender NVARCHAR(10),
    CustomerDOB DATE,
    LoyaltyPoints INT DEFAULT 0,               -- ★ Điểm tích lũy
    AvatarUrl NVARCHAR(500) NULL                -- ★ Link ảnh S3/Cloudinary
);

-- LikeMovie (N:N Customer–Movie)
CREATE TABLE LikeMovie (
    CustomerID INT NOT NULL FOREIGN KEY REFERENCES Customer(CustomerID),
    MovieID INT NOT NULL FOREIGN KEY REFERENCES Movie(MovieID),
    IsLiked BIT DEFAULT 1,
    PRIMARY KEY (CustomerID, MovieID)
);
```

#### Nhóm Payment & Voucher

```sql
-- Payment (1:1 với Booking, retry = update Status)
CREATE TABLE Payment (
    PaymentID INT PRIMARY KEY IDENTITY(1,1),
    BookingID INT NOT NULL UNIQUE FOREIGN KEY REFERENCES Booking(BookingID),
    VoucherID INT NULL FOREIGN KEY REFERENCES Voucher(VoucherID), -- ★ Đã sửa chiều FK
    Amount DECIMAL(10,2) NOT NULL,
    PaymentDate DATETIME DEFAULT GETDATE(),
    Status NVARCHAR(20) NOT NULL                -- State machine: CREATED → PENDING_PAYMENT → PROCESSING → SUCCESS / FAILED
);

-- Voucher
CREATE TABLE Voucher (
    VoucherID INT PRIMARY KEY IDENTITY(1,1),
    Code NVARCHAR(50) NOT NULL UNIQUE,
    DiscountValue DECIMAL(10,2) NOT NULL,       -- Giá trị giảm (VNĐ hoặc %)
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    IsActive BIT DEFAULT 1,
    UsageLimit INT NOT NULL,
    UsageCount INT DEFAULT 0,
    MinTicketQty INT DEFAULT 1,                 -- ★ Số vé tối thiểu
    MinOrderValue DECIMAL(10,2) DEFAULT 0,
    ApplicableType NVARCHAR(10) DEFAULT 'ALL'   -- ★ 2D | 3D | IMAX | ALL
);

-- VoucherCustomer (kho voucher của khách)
CREATE TABLE VoucherCustomer (
    VoucherID INT NOT NULL FOREIGN KEY REFERENCES Voucher(VoucherID),
    CustomerID INT NOT NULL FOREIGN KEY REFERENCES Customer(CustomerID),
    PRIMARY KEY (VoucherID, CustomerID)
);

-- VoucherUsage (lịch sử dùng voucher — FEFO tracking)
CREATE TABLE VoucherUsage (
    VUsageID INT PRIMARY KEY IDENTITY(1,1),
    VoucherID INT NOT NULL FOREIGN KEY REFERENCES Voucher(VoucherID),
    CustomerID INT NOT NULL FOREIGN KEY REFERENCES Customer(CustomerID),
    UsedAt DATETIME DEFAULT GETDATE()
);
```

#### Nhóm Product & Notification

```sql
-- Product (combo bắp nước)
CREATE TABLE Product (
    ProductID INT PRIMARY KEY IDENTITY(1,1),
    ProductName NVARCHAR(200) NOT NULL,
    ProductDescription NVARCHAR(500),           -- ★ Mô tả sản phẩm
    ProductPrice DECIMAL(10,2) NOT NULL,
    ImageProduct NVARCHAR(500)                  -- Link ảnh S3/Cloudinary
);

-- BookingProduct (N:N Booking–Product)
CREATE TABLE BookingProduct (
    BookingProductID INT PRIMARY KEY IDENTITY(1,1),
    BookingID INT NOT NULL FOREIGN KEY REFERENCES Booking(BookingID),
    ProductID INT NOT NULL FOREIGN KEY REFERENCES Product(ProductID),
    Quantity INT NOT NULL DEFAULT 1
);

-- Notification
CREATE TABLE Notification (
    NotificationID INT PRIMARY KEY IDENTITY(1,1),
    CustomerID INT NOT NULL FOREIGN KEY REFERENCES Customer(CustomerID),
    Message NVARCHAR(500) NOT NULL,
    DateSend DATETIME DEFAULT GETDATE(),
    IsRead BIT DEFAULT 0
);
```

### Quy tắc Database

- **KHÔNG** lưu file ảnh trực tiếp vào DB. Chỉ lưu URL (S3/Cloudinary).
- **KHÔNG** lưu password dạng plaintext. Luôn hash bằng bcryptjs.
- Booking–Payment là **1:1**. Khi retry thanh toán, **CẬP NHẬT** `Payment.Status` thay vì tạo bản ghi mới.
- FK Voucher–Payment: `Payment.VoucherID → Voucher` (N:1, nullable). KHÔNG phải ngược lại.
- Sử dụng `CinemaHallSeat.RowVersion` cho **Optimistic Locking**: kiểm tra version trước khi confirm ghế, tránh 2 người đặt cùng 1 ghế.
- Dùng `BookingSeat.HoldUntil` làm **failover** khi Redis down — Job Scheduler query `WHERE HoldUntil < NOW()`.
- Tên bảng và cột theo **PascalCase** nhất quán với ERD.
- Migrations đặt tên theo thứ tự: `001_create_city_cinema.sql`, `002_create_movie_show.sql`, ...

---

## VIII. Quy tắc Nghiệp vụ

### 1. Công thức tính giá vé

```
TicketPrice = BasePrice (Show) + SeatPrice (CinemaHallSeat)
```

- `BasePrice` thay đổi theo **ngày** (thường/cuối tuần) và **định dạng** (2D/3D/IMAX).
- `SeatPrice` là phụ thu cố định theo loại ghế:

| Loại ghế | SeatType | Phụ thu (SeatPrice) |
|----------|----------|---------------------|
| Ghế thường | `STANDARD` | 0đ |
| Ghế VIP | `VIP` | +30.000đ |
| Ghế đôi | `COUPLE` | +50.000đ |
| Lối đi | `AISLE` | N/A (không thể đặt, `IsAisle=1`) |
| Khu trống | `EMPTY` | N/A (dành cho thiết bị chiếu) |

### 2. Ràng buộc chọn ghế (Lonely Seat Rule)

Hệ thống **KHÔNG** cho phép chọn ghế nếu để lại đúng **1 khoảng trống đơn lẻ** giữa các ghế đã đặt hoặc sát mép tường/lối đi.

```
✗ [Đặt] [Trống] [Đặt]  → KHÔNG hợp lệ (1 ghế đơn lẻ)
✓ [Đặt] [Đặt] [Trống]  → Hợp lệ
✓ [Đặt] [Đặt] [Đặt]    → Hợp lệ
```

Validation phải chạy ở **cả frontend (UX)** và **backend (bảo mật)**.

### 3. Quy trình đặt vé (Booking Flow)

```
1. Khách chọn suất chiếu
2. API trả về sơ đồ ghế (data từ Redis + DB)
3. Khách chọn ghế + combo + voucher FEFO
4. API khóa ghế vào Redis (TTL 10 phút) + ghi HoldUntil vào DB (failover)
5. Khách thanh toán QR
6. Webhook xác nhận → check Optimistic Locking (RowVersion)
   ├── Thành công → Cập nhật vé, cộng LoyaltyPoints, gửi email, xóa Redis cache
   └── Thất bại (trùng ghế offline) → Refund + giải phóng Redis + báo lỗi
```

### 4. State Machine thanh toán (Payment.Status)

```
CREATED → PENDING_PAYMENT → PROCESSING → SUCCESS
                                       ↘ FAILED → (retry) → PENDING_PAYMENT
```

| Trạng thái | Mô tả | Hành động tiếp theo |
|------------|--------|---------------------|
| `CREATED` | Đơn vừa khởi tạo | Chờ khách xác nhận → `PENDING_PAYMENT` |
| `PENDING_PAYMENT` | Đang chờ quét QR | Thanh toán → `PROCESSING` \| Hết 10p → Hủy đơn |
| `PROCESSING` | Gateway đang xử lý | OK → `SUCCESS` \| Lỗi → `FAILED` |
| `SUCCESS` | Hoàn tất | Cộng LoyaltyPoints + Email + Xóa Redis |
| `FAILED` | Thất bại | Rollback (hoàn tiền + nhả ghế). Cho phép retry |

### 5. Voucher Engine FEFO (First Expired, First Out)

Khi mở giỏ hàng, hệ thống tự động gợi ý voucher sắp hết hạn nhất. Điều kiện check:

```sql
SELECT * FROM Voucher v
JOIN VoucherCustomer vc ON v.VoucherID = vc.VoucherID
WHERE vc.CustomerID = @CustomerID
  AND v.IsActive = 1
  AND v.MinOrderValue <= @TotalAmount              -- Giá trị đơn tối thiểu
  AND v.MinTicketQty <= @TotalSeats                -- Số vé tối thiểu
  AND v.ApplicableType IN (@ShowFormat, 'ALL')     -- Định dạng phim ★
  AND GETDATE() BETWEEN v.StartDate AND v.EndDate  -- Còn hiệu lực
  AND v.UsageCount < v.UsageLimit                  -- Còn lượt dùng
  AND NOT EXISTS (                                  -- Chưa dùng voucher này
    SELECT 1 FROM VoucherUsage vu
    WHERE vu.VoucherID = v.VoucherID AND vu.CustomerID = @CustomerID
  )
ORDER BY v.EndDate ASC;                             -- FEFO: ưu tiên sắp hết hạn
```

### 6. Hủy vé (Cancellation Rules)

- Chỉ hủy nếu còn **≥ X giờ trước giờ chiếu** (cấu hình).
- Hoàn tiền nếu `Payment.Status = SUCCESS` (gọi API Refund).
- Cập nhật: `Booking.Status → CANCELLED`, `BookingSeat.Status → EMPTY`.
- Broadcast WebSocket ghế vừa giải phóng cho tất cả client đang xem suất chiếu đó.

### 7. Optimistic Locking (Chống đặt trùng ghế)

```javascript
// Khi xác nhận thanh toán, kiểm tra RowVersion
const seat = await db.query(
  'SELECT RowVersion FROM CinemaHallSeat WHERE SeatID = @seatId'
);

const result = await db.query(`
  UPDATE CinemaHallSeat
  SET RowVersion = RowVersion + 1
  WHERE SeatID = @seatId AND RowVersion = @currentVersion
`);

if (result.rowsAffected === 0) {
  // RowVersion đã thay đổi → ghế đã bị đặt offline bởi người khác
  throw new AppError('Ghế đã được bán offline', 409, 'SEAT_VERSION_CONFLICT');
}
```

---

## IX. Testing & Verification

### Backend Testing

```bash
# Cài dependencies
cd backend && npm install

# Chạy server development
npm run dev                     # nodemon, port 3000

# Chạy tests
npm test                        # Jest / Mocha
npm run test:unit               # Unit tests (services, utils)
npm run test:integration        # Integration tests (API endpoints)
```

### Test Checklist

- [ ] Auth: Đăng ký, đăng nhập, JWT works, phân quyền CUSTOMER/ADMIN/STAFF
- [ ] Movies: CRUD phim, tìm kiếm, yêu thích
- [ ] Cinemas: Danh sách rạp, lọc theo thành phố, sơ đồ ghế
- [ ] Booking: Tạo đơn, khóa ghế 10p, check lonely seat rule
- [ ] Payment: Thanh toán flow (state machine), retry, rollback
- [ ] Voucher: FEFO engine, apply voucher, check điều kiện
- [ ] WebSocket: Realtime seat updates, broadcast
- [ ] Jobs: Giải phóng ghế hết hạn, nhắc lịch 30p
- [ ] Admin: CRUD phim, báo cáo doanh thu, thống kê vé/tài khoản

### Mobile Testing

```bash
# Cài dependencies
cd mobile-app && npm install

# Chạy Metro bundler
npx react-native start

# Chạy trên thiết bị/simulator
npx react-native run-android
npx react-native run-ios
```

### Database Testing

```bash
# Chạy migrations
cd database
sqlcmd -S localhost -d MovieTicketDB -i migrations/001_create_city_cinema.sql

# Chạy seed data
sqlcmd -S localhost -d MovieTicketDB -i seeds/sample_data.sql
```

### Verification Commands

```bash
# Kiểm tra backend chạy OK
curl http://localhost:3000/api/health

# Kiểm tra Redis connection
redis-cli ping    # → PONG

# Kiểm tra SQL Server connection
sqlcmd -S localhost -Q "SELECT 1"
```

---

## X. Git & Workflow

### Branch Naming

```
main                          # Production-ready
develop                       # Integration branch
feature/auth-login            # Tính năng mới
feature/booking-flow
feature/seat-realtime
feature/voucher-fefo
feature/admin-reports
bugfix/payment-retry
hotfix/seat-lock-race
```

### Commit Convention

```
feat: thêm API đặt vé và khóa ghế tạm 10 phút
fix: sửa lỗi race condition khi 2 người đặt cùng ghế
refactor: tách business logic booking sang service layer
docs: cập nhật API documentation endpoint thanh toán
style: format code theo ESLint rules
test: thêm unit test cho voucher FEFO engine
chore: cập nhật dependencies, cấu hình Docker
```

### PR Checklist

- [ ] Code follows naming conventions trong AGENTS.md
- [ ] API response format thống nhất (success/error)
- [ ] Input validation có ở cả frontend và backend
- [ ] Xử lý error đầy đủ (try/catch, AppError)
- [ ] WebSocket events broadcast đúng room
- [ ] Database queries có parameterized (chống SQL injection)
- [ ] Không commit `.env`, `node_modules`, files tạm
- [ ] Đã test trên local trước khi push

### Environment Variables (.env.example)

```env
# Server
PORT=3000
NODE_ENV=development

# Database — SQL Server
DB_HOST=localhost
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=your_password
DB_NAME=MovieTicketDB

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d

# Cloudinary (File Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Payment Gateway (giả lập)
PAYMENT_GW_URL=http://localhost:4000
PAYMENT_GW_SECRET=your_payment_secret

# Booking Config
SEAT_HOLD_TTL_SECONDS=600
CANCELLATION_HOURS_BEFORE=2
LOYALTY_POINTS_PER_BOOKING=10

# WebSocket
WS_CORS_ORIGIN=http://localhost:3001
```

---

## Phụ lục: Use Cases Reference

| Mã | Tên Use Case | Actor | Loại |
|----|-------------|-------|------|
| UC01 | Đăng ký tài khoản | Khách hàng | Primary |
| UC02 | Đăng nhập / Phân quyền | Khách hàng, Admin | Primary |
| UC03 | Tìm kiếm & Xem lịch chiếu | Khách hàng | Primary |
| UC04 | Quy trình Đặt vé | Khách hàng | Primary |
| UC05 | Chọn ghế & Sản phẩm | Khách hàng | Include (UC04) |
| UC06 | Xác nhận & Thanh toán | Khách hàng | Include (UC04) |
| UC07 | Khóa ghế tạm thời 10p | Hệ thống | Extend (UC06) |
| UC08 | Tự động gợi ý FEFO | Hệ thống | Extend (UC06) |
| UC09 | Nhập mã voucher thủ công | Khách hàng | Extend (UC06) |
| UC10 | Tự động hoàn tiền (Rollback) | Hệ thống | Extend (UC06) |
| UC11 | Gửi thông báo giao dịch | Hệ thống | Extend (UC06) |
| UC12 | Tra cứu lịch sử đặt vé | Khách hàng | Primary |
| UC13 | Hủy vé (trước giờ chiếu) | Khách hàng | Primary |
| UC14 | Tự động giải phóng ghế | Hệ thống | Extend (UC13) |
| UC15 | Cronjob nhắc lịch (30p) | Hệ thống | Primary |
| UC16 | Quản lý phim & lịch chiếu | Quản trị viên | Primary |
| UC17 | Quản lý rạp & sơ đồ ghế | Quản trị viên | Primary |
| UC18 | Cấu hình khuyến mãi | Quản trị viên | Primary |
| UC19 | Xem báo cáo thống kê | Quản trị viên | Primary |
| UC20 | Cộng điểm tích lũy | Hệ thống | Extend (UC06) |
| UC21 | Retry thanh toán | Khách hàng | Extend (UC06) |
| UC22 | Xem / sửa thông tin tài khoản | Khách hàng | Primary |
