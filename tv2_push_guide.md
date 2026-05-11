# 📋 Hướng dẫn TV2 — Push files lên nhánh main (Buổi 4)

## Tổng quan

Bạn là **TV2**, phụ trách **Module M1** (Quản Lý Phim & Lịch Chiếu) và **M2** (Tìm Kiếm & Xem Phim).  
Đến hết **Buổi 4**, theo lịch trình, bạn cần hoàn thành và push các file từ **Buổi 1 → Buổi 4**.

> [!IMPORTANT]
> Chỉ push những file **do TV2 chịu trách nhiệm**. Không push file của TV1, TV3, TV4, TV5 (trừ khi đã thỏa thuận).

---

## 📁 Danh sách Files cần push (theo từng tầng)

### 1. 🗄️ Database — Migrations & Seeds

Đây là các bảng TV2 phụ trách: `City`, `Cinema`, `CinemaHall`, `CinemaHallSeat`, `Movie`, `Show`, `LikeMovie`

| File | Đường dẫn | Trạng thái | Mô tả |
|------|-----------|------------|-------|
| Migration M1/M2 | `database/migrations/001_create_city_cinema_movie_show.sql` | ✅ Đã có | Schema bảng City, Cinema, Hall, Seat, Movie, Show |

> [!WARNING]
> Hiện tại thư mục `database/seeds/` chỉ có `.gitkeep`. Theo yêu cầu Buổi 1, TV2 cần tạo seed data. Nếu chưa có, **cần tạo thêm** trước khi push:

| File cần tạo (nếu chưa có) | Mô tả |
|----|-------|
| `database/seeds/cities.sql` | Dữ liệu mẫu thành phố (HCM, Hà Nội, Đà Nẵng...) |
| `database/seeds/cinemas.sql` | Dữ liệu mẫu cụm rạp (CGV, Galaxy, Lotte...) |
| `database/seeds/movies.sql` | Dữ liệu mẫu phim (5-10 phim) |
| `database/seeds/shows.sql` | *(Buổi 5 TV5 tạo, nhưng TV2 có thể tạo mẫu)* |

---

### 2. ⚙️ Backend — Models

Tất cả các model TV2 đã tạo:

| File | Đường dẫn | Trạng thái | Mô tả |
|------|-----------|------------|-------|
| Movie Model | `backend/src/models/movie.model.js` | ✅ Đã có (11KB) | CRUD Movie — getAll, getById, search, create, update, delete |
| Cinema Model | `backend/src/models/cinema.model.js` | ✅ Đã có (5KB) | CRUD Cinema — getAll, getById, getByCity |
| City Model | `backend/src/models/city.model.js` | ✅ Đã có (2KB) | Query City |
| Hall Model | `backend/src/models/hall.model.js` | ✅ Đã có (5.6KB) | CRUD CinemaHall |
| Seat Model | `backend/src/models/seat.model.js` | ✅ Đã có (5.2KB) | CRUD CinemaHallSeat |
| Show Model | `backend/src/models/show.model.js` | ✅ Đã có (10KB) | CRUD Show — getById, getByHall, getByMovie |
| LikeMovie Model | `backend/src/models/likeMovie.model.js` | ✅ Đã có (3.2KB) | Like/Unlike phim |

---

### 3. ⚙️ Backend — Services (Business Logic)

| File | Đường dẫn | Trạng thái | Mô tả |
|------|-----------|------------|-------|
| Movie Service | `backend/src/services/movie.service.js` | ✅ Đã có (4.3KB) | Logic phim: getAll, search, featured, create, update |
| Cinema Service | `backend/src/services/cinema.service.js` | ✅ Đã có (1.5KB) | Logic rạp: danh sách, lọc theo city |
| Hall Service | `backend/src/services/hall.service.js` | ✅ Đã có (5KB) | Logic phòng chiếu + sơ đồ ghế |
| Show Service | `backend/src/services/show.service.js` | ✅ Đã có (4.6KB) | Logic suất chiếu: tạo, kiểm tra xung đột |

---

### 4. ⚙️ Backend — Controllers

#### Customer-facing Controllers:

| File | Đường dẫn | Trạng thái | Mô tả |
|------|-----------|------------|-------|
| Movie Controller | `backend/src/controllers/movie/movie.controller.js` | ✅ Đã có (3.1KB) | getMovies, getById, search, like/unlike |
| Cinema Controller | `backend/src/controllers/cinema/cinema.controller.js` | ✅ Đã có (1.4KB) | getCinemas, getById, getByCity |
| Hall Controller (cinema) | `backend/src/controllers/cinema/hall.controller.js` | ✅ Đã có (2.5KB) | getHalls, configHall |
| Show Controller | `backend/src/controllers/show/show.controller.js` | ✅ Đã có (2.4KB) | getShowById, getShowSeats |
| Hall Controller (admin) | `backend/src/controllers/hall/hall.controller.js` | ✅ Đã có (1.8KB) | Admin hall management |

#### Admin Controllers:

| File | Đường dẫn | Trạng thái | Mô tả |
|------|-----------|------------|-------|
| Admin Movie Controller | `backend/src/controllers/admin/movie/movie.controller.js` | ✅ Đã có (1.7KB) | Admin CRUD phim |
| Admin Cinema Controller | `backend/src/controllers/admin/cinema/cinema.controller.js` | ✅ Đã có (0.9KB) | Admin quản lý rạp |
| Admin Show Controller | `backend/src/controllers/admin/show/show.controller.js` | ✅ Đã có (1KB) | Admin CRUD suất chiếu |

---

### 5. ⚙️ Backend — Routes

| File | Đường dẫn | Trạng thái | Mô tả |
|------|-----------|------------|-------|
| Movie Routes | `backend/src/routes/movie/movie.routes.js` | ✅ Đã có (1.3KB) | `GET /movies`, `/movies/search`, `/movies/:id`, like/unlike |
| Cinema Routes | `backend/src/routes/cinema/cinema.routes.js` | ✅ Đã có (0.8KB) | `GET /cinemas`, `/cinemas?cityId=` |
| Hall Routes | `backend/src/routes/cinema/hall.routes.js` | ✅ Đã có (0.7KB) | Hall endpoints |
| Seat Routes | `backend/src/routes/cinema/seat.routes.js` | ✅ Đã có (0.6KB) | Seat endpoints |
| Cinema Index | `backend/src/routes/cinema/index.js` | ✅ Đã có (0.4KB) | Cinema router barrel |
| Show Routes | `backend/src/routes/show/show.routes.js` | ✅ Đã có (1.1KB) | `GET /shows/:id`, `/shows/:id/seats` |
| Hall Routes (admin) | `backend/src/routes/hall/hall.routes.js` | ✅ Đã có (0.9KB) | Admin hall routes |
| Routes Index | `backend/src/routes/index.js` | ✅ Đã có (1.1KB) | Main router gom tất cả routes |

> [!IMPORTANT]
> Hiện thư mục `backend/src/routes/admin/` chỉ có `.gitkeep`. Nếu Admin routes (cho movie/cinema/show) chưa được kết nối vào router index, cần kiểm tra và bổ sung trước khi push.

---

### 6. ⚙️ Backend — Validators

> [!WARNING]
> Thư mục `backend/src/validators/` hiện chỉ có `.gitkeep`. Theo yêu cầu Buổi 3-4, TV2 cần tạo:

| File cần tạo (nếu chưa có) | Mô tả |
|----|-------|
| `backend/src/validators/movie.validator.js` | Validate input khi tạo/sửa phim |
| `backend/src/validators/cinema.validator.js` | Validate input khi tạo/sửa rạp |
| `backend/src/validators/show.validator.js` | Validate tạo suất chiếu (kiểm tra xung đột thời gian) |

---

### 7. 📱 Mobile App — Screens

| File | Đường dẫn | Trạng thái | Mô tả |
|------|-----------|------------|-------|
| HomeScreen | `mobile-app/src/screens/home/HomeScreen.js` | ✅ Đã có (4KB) | Danh sách phim đang chiếu + featured |
| HomeScreen Styles | `mobile-app/src/screens/home/HomeScreen.styles.js` | ✅ Đã có (1.7KB) | StyleSheet cho HomeScreen |
| MovieDetailScreen | `mobile-app/src/screens/movie/MovieDetailScreen.js` | ✅ Đã có (9.4KB) | Chi tiết phim: poster, trailer, lịch chiếu |
| SearchScreen | `mobile-app/src/screens/search/SearchScreen.js` | ✅ Đã có (3.5KB) | Tìm kiếm phim |
| SearchScreen Styles | `mobile-app/src/screens/search/SearchScreen.styles.js` | ✅ Đã có (1.3KB) | StyleSheet cho SearchScreen |
| CinemaListScreen | `mobile-app/src/screens/cinema/CinemaListScreen.js` | ✅ Đã có (2.5KB) | Danh sách cụm rạp |

---

### 8. 📱 Mobile App — Components

| File | Đường dẫn | Trạng thái | Mô tả |
|------|-----------|------------|-------|
| MovieCard | `mobile-app/src/components/movie/MovieCard.js` | ✅ Đã có (1.4KB) | Card hiển thị phim (poster, tên, rating) |

> [!NOTE]
> Theo Buổi 4, `FeaturedCarousel` component nên có (TV4 gợi ý cho TV1, nhưng TV2 cũng có thể tạo). Kiểm tra xem đã tạo chưa.

---

### 9. 📱 Mobile App — Services & Redux

| File | Đường dẫn | Trạng thái | Mô tả |
|------|-----------|------------|-------|
| Movie Service | `mobile-app/src/services/movieService.js` | ✅ Đã có (1.4KB) | API calls: getMovies, search, getById |
| Cinema Service | `mobile-app/src/services/cinemaService.js` | ✅ Đã có (0.5KB) | API calls: getCinemas |
| Movie Slice | `mobile-app/src/store/slices/movieSlice.js` | ✅ Đã có (4.9KB) | Redux state management cho Movie |
| Cinema Slice | `mobile-app/src/store/slices/cinemaSlice.js` | ✅ Đã có (1.2KB) | Redux state management cho Cinema |

---

## 🔢 Tổng hợp — Tất cả files TV2 cần push

### ✅ Files đã có (32 files):

```
# Database
database/migrations/001_create_city_cinema_movie_show.sql

# Backend — Models (7 files)
backend/src/models/movie.model.js
backend/src/models/cinema.model.js
backend/src/models/city.model.js
backend/src/models/hall.model.js
backend/src/models/seat.model.js
backend/src/models/show.model.js
backend/src/models/likeMovie.model.js

# Backend — Services (4 files)
backend/src/services/movie.service.js
backend/src/services/cinema.service.js
backend/src/services/hall.service.js
backend/src/services/show.service.js

# Backend — Controllers (8 files)
backend/src/controllers/movie/movie.controller.js
backend/src/controllers/cinema/cinema.controller.js
backend/src/controllers/cinema/hall.controller.js
backend/src/controllers/show/show.controller.js
backend/src/controllers/hall/hall.controller.js
backend/src/controllers/admin/movie/movie.controller.js
backend/src/controllers/admin/cinema/cinema.controller.js
backend/src/controllers/admin/show/show.controller.js

# Backend — Routes (7 files)
backend/src/routes/index.js
backend/src/routes/movie/movie.routes.js
backend/src/routes/cinema/cinema.routes.js
backend/src/routes/cinema/hall.routes.js
backend/src/routes/cinema/seat.routes.js
backend/src/routes/cinema/index.js
backend/src/routes/show/show.routes.js
backend/src/routes/hall/hall.routes.js

# Mobile — Screens (6 files)
mobile-app/src/screens/home/HomeScreen.js
mobile-app/src/screens/home/HomeScreen.styles.js
mobile-app/src/screens/movie/MovieDetailScreen.js
mobile-app/src/screens/search/SearchScreen.js
mobile-app/src/screens/search/SearchScreen.styles.js
mobile-app/src/screens/cinema/CinemaListScreen.js

# Mobile — Components (1 file)
mobile-app/src/components/movie/MovieCard.js

# Mobile — Services & Redux (4 files)
mobile-app/src/services/movieService.js
mobile-app/src/services/cinemaService.js
mobile-app/src/store/slices/movieSlice.js
mobile-app/src/store/slices/cinemaSlice.js
```

### ⚠️ Files nên tạo thêm trước khi push:

```
# Database Seeds (Buổi 1 yêu cầu)
database/seeds/cities.sql          → Dữ liệu thành phố mẫu
database/seeds/cinemas.sql         → Dữ liệu cụm rạp mẫu
database/seeds/movies.sql          → Dữ liệu phim mẫu

# Backend Validators (Buổi 3-4 yêu cầu)
backend/src/validators/movie.validator.js
backend/src/validators/cinema.validator.js
backend/src/validators/show.validator.js

# Admin Routes (cần kết nối admin controllers vào router)
backend/src/routes/admin/movie.routes.js
backend/src/routes/admin/cinema.routes.js
backend/src/routes/admin/show.routes.js
```

---

## 🚀 Hướng dẫn Git Push lên Main

### Bước 1: Kiểm tra trạng thái hiện tại

```bash
# Xem branch hiện tại
git branch

# Xem trạng thái files
git status
```

### Bước 2: Tạo nhánh feature (nếu chưa có)

```bash
# Tạo nhánh TV2 (nếu chưa tồn tại)
git checkout -b feature/tv2-movie-cinema

# Hoặc nếu đang ở nhánh khác, chuyển về
git checkout feature/tv2-movie-cinema
```

### Bước 3: Stage các files của TV2

```bash
# Stage tất cả files TV2 đã hoàn thành
git add database/migrations/001_create_city_cinema_movie_show.sql

# Backend Models
git add backend/src/models/movie.model.js
git add backend/src/models/cinema.model.js
git add backend/src/models/city.model.js
git add backend/src/models/hall.model.js
git add backend/src/models/seat.model.js
git add backend/src/models/show.model.js
git add backend/src/models/likeMovie.model.js

# Backend Services
git add backend/src/services/movie.service.js
git add backend/src/services/cinema.service.js
git add backend/src/services/hall.service.js
git add backend/src/services/show.service.js

# Backend Controllers
git add backend/src/controllers/movie/
git add backend/src/controllers/cinema/
git add backend/src/controllers/show/
git add backend/src/controllers/hall/
git add backend/src/controllers/admin/movie/
git add backend/src/controllers/admin/cinema/
git add backend/src/controllers/admin/show/

# Backend Routes
git add backend/src/routes/index.js
git add backend/src/routes/movie/
git add backend/src/routes/cinema/
git add backend/src/routes/show/
git add backend/src/routes/hall/

# Mobile Screens
git add mobile-app/src/screens/home/
git add mobile-app/src/screens/movie/
git add mobile-app/src/screens/search/
git add mobile-app/src/screens/cinema/

# Mobile Components
git add mobile-app/src/components/movie/

# Mobile Services & Redux
git add mobile-app/src/services/movieService.js
git add mobile-app/src/services/cinemaService.js
git add mobile-app/src/store/slices/movieSlice.js
git add mobile-app/src/store/slices/cinemaSlice.js
```

### Bước 4: Commit theo convention

```bash
# Commit theo quy tắc trong AGENTS.md
git commit -m "feat(movie-cinema): complete M1+M2 backend APIs, mobile screens, admin controllers

- Models: movie, cinema, city, hall, seat, show, likeMovie
- Services: movie, cinema, hall, show business logic
- Controllers: customer + admin CRUD for movie/cinema/show
- Routes: movie, cinema, show, hall endpoints
- Mobile: HomeScreen, MovieDetailScreen, SearchScreen, CinemaListScreen
- Redux: movieSlice, cinemaSlice
- Migration: City, Cinema, Hall, Seat, Movie, Show tables"
```

### Bước 5: Push lên remote

```bash
# Push nhánh feature lên remote
git push origin feature/tv2-movie-cinema
```

### Bước 6: Tạo Pull Request → Merge vào Main

1. Vào GitHub → tạo **Pull Request** từ `feature/tv2-movie-cinema` → `main`
2. Mô tả rõ những gì đã làm (M1 + M2 hoàn thiện)
3. Tag các thành viên khác review (đặc biệt TV1, TV5)
4. Sau khi approve → **Merge** vào `main`

> [!TIP]
> Nếu nhóm bạn đã thống nhất push trực tiếp lên `main` (không dùng PR), có thể bỏ qua bước tạo nhánh feature:
> ```bash
> git checkout main
> git add <các files ở trên>
> git commit -m "feat(movie-cinema): complete M1+M2 for session 4"
> git push origin main
> ```

---

## 📊 Checklist Buổi 4 cho TV2

Theo AGENTS.md, công việc TV2 trong Buổi 4:

| # | Công việc | File liên quan | Trạng thái |
|---|-----------|---------------|------------|
| ① | Hoàn thiện `show.controller.js` — getShowSeats (merge DB + Redis status) | `controllers/show/show.controller.js` | ✅ Đã có |
| ② | Tạo Admin API `PUT /admin/halls/:id/seats` — sơ đồ ghế ma trận | `controllers/hall/hall.controller.js` + routes | ✅ Đã có |
| ③ | Tạo `show.validator.js` — validate suất chiếu (xung đột thời gian) | `validators/show.validator.js` | ⚠️ Chưa tạo |
| ④ | Admin API `POST/PUT/DELETE /admin/shows` hoàn chỉnh | `controllers/admin/show/show.controller.js` | ✅ Đã có |
| ⑤ | Tạo `MovieDetailScreen` Mobile | `screens/movie/MovieDetailScreen.js` | ✅ Đã có |

> [!CAUTION]
> **Thiếu `show.validator.js`**: File validator cho suất chiếu chưa được tạo. Đây là yêu cầu của Buổi 4. Nên tạo và push cùng lần này.

---

## 🔗 Lưu ý khi Push

1. **KHÔNG push file `.env`** — chỉ push `.env.example`
2. **KHÔNG push `node_modules/`** — đảm bảo `.gitignore` đã bao gồm
3. **Kiểm tra `routes/index.js`** — đảm bảo các route của TV2 đã được mount đúng
4. **Không xung đột** — pull code mới nhất từ `main` trước khi push:
   ```bash
   git pull origin main --rebase
   ```
5. **Seed data** — nếu các bạn khác cần test, seed data là rất quan trọng
