-- =============================================
-- Tạo cơ sở dữ liệu cho hệ thống đặt vé xem phim
-- Module 1 & 2: Phim, Rạp, Phòng chiếu, Ghế, Suất chiếu
-- =============================================

-- Bảng Thành phố
CREATE TABLE City (
    CityID INT PRIMARY KEY IDENTITY(1,1),
    CityName NVARCHAR(100) NOT NULL
);

-- Bảng Cụm rạp
CREATE TABLE Cinema (
    CinemaID INT PRIMARY KEY IDENTITY(1,1),
    CinemaName NVARCHAR(200) NOT NULL,
    Address NVARCHAR(500),                       -- Địa chỉ cụ thể
    District NVARCHAR(100),                      -- Quận/Huyện
    CityID INT NOT NULL FOREIGN KEY REFERENCES City(CityID),
    Latitude DECIMAL(9,6),                       -- Vĩ độ (tìm rạp gần)
    Longitude DECIMAL(9,6),                      -- Kinh độ
    IsActive BIT DEFAULT 1                       -- Trạng thái hoạt động
);

-- Bảng Phòng chiếu
CREATE TABLE CinemaHall (
    HallID INT PRIMARY KEY IDENTITY(1,1),
    CinemaID INT NOT NULL FOREIGN KEY REFERENCES Cinema(CinemaID),
    HallName NVARCHAR(100) NOT NULL,
    TotalRows INT NOT NULL,                      -- Tổng số hàng
    TotalCols INT NOT NULL,                      -- Tổng số cột
    TotalSeats INT NOT NULL                      -- Tổng số ghế
);

-- Bảng Ghế ngồi
CREATE TABLE CinemaHallSeat (
    SeatID INT PRIMARY KEY IDENTITY(1,1),
    HallID INT NOT NULL FOREIGN KEY REFERENCES CinemaHall(HallID),
    SeatNumber NVARCHAR(10) NOT NULL,            -- Mã ghế: A1, A2, B1...
    SeatType NVARCHAR(20) NOT NULL,              -- STANDARD, VIP, COUPLE, SWEETBOX
    SeatPrice DECIMAL(10,2) DEFAULT 0,           -- Phụ giá theo loại ghế
    PairID INT NULL,                             -- ID ghế đôi (COUPLE)
    RowIndex INT NOT NULL,                       -- Vị trí hàng (0-based)
    ColIndex INT NOT NULL,                       -- Vị trí cột (0-based)
    IsAisle BIT DEFAULT 0,                       -- Đánh dấu lối đi
    RowVersion INT DEFAULT 0                     -- Số phiên bản (optimistic locking)
);

-- Bảng Phim
CREATE TABLE Movie (
    MovieID INT PRIMARY KEY IDENTITY(1,1),
    MovieTitle NVARCHAR(200) NOT NULL,
    MovieGenre NVARCHAR(100),                    -- Thể loại: Hành động, Kinh dị...
    MovieLanguage NVARCHAR(50),                  -- Ngôn ngữ: Tiếng Việt, English...
    MovieRuntime INT,                            -- Thời lượng (phút)
    MovieReleaseDate DATE,                       -- Ngày khởi chiếu
    MovieActor NVARCHAR(500),                    -- Diễn viên
    MovieDirector NVARCHAR(200),                 -- Đạo diễn
    MovieDescription NVARCHAR(2000),             -- Mô tả/tóm tắt nội dung
    TrailerUrl NVARCHAR(500),                    -- Đường dẫn trailer YouTube
    Rating DECIMAL(3,1),                         -- Đánh giá trung bình (0.0 - 10.0)
    IsFeatured BIT DEFAULT 0,                    -- Phim nổi bật (hiển thị carousel)
    FeaturedOrder INT DEFAULT 0,                 -- Thứ tự hiển thị phim nổi bật
    IsActive BIT DEFAULT 1                       -- Trạng thái: 1 = đang chiếu, 0 = ngừng
);

-- Bảng Suất chiếu (dùng dấu [] vì Show là từ khóa SQL)
CREATE TABLE [Show] (
    ShowID INT PRIMARY KEY IDENTITY(1,1),
    MovieID INT NOT NULL FOREIGN KEY REFERENCES Movie(MovieID),
    HallID INT NOT NULL FOREIGN KEY REFERENCES CinemaHall(HallID),
    ShowDate DATE NOT NULL,                      -- Ngày chiếu
    ShowTime TIME NOT NULL,                      -- Giờ bắt đầu
    EndTime TIME NOT NULL,                       -- Giờ kết thúc (tự tính = ShowTime + Runtime + 15p)
    Format NVARCHAR(10) NOT NULL,                -- Định dạng: 2D, 3D, IMAX
    BasePrice DECIMAL(10,2) NOT NULL             -- Giá vé cơ bản
);

-- Bảng Yêu thích phim (quan hệ N:N Khách hàng - Phim)
CREATE TABLE LikeMovie (
    CustomerID INT NOT NULL,                     -- FK tới Customer (TV5 tạo)
    MovieID INT NOT NULL FOREIGN KEY REFERENCES Movie(MovieID),
    IsLiked BIT DEFAULT 1,
    PRIMARY KEY (CustomerID, MovieID)
);

-- =============================================
-- Tạo chỉ mục (index) để tăng hiệu suất truy vấn
-- =============================================
CREATE INDEX IX_Cinema_CityID ON Cinema(CityID);
CREATE INDEX IX_CinemaHall_CinemaID ON CinemaHall(CinemaID);
CREATE INDEX IX_CinemaHallSeat_HallID ON CinemaHallSeat(HallID);
CREATE INDEX IX_Movie_IsActive ON Movie(IsActive);
CREATE INDEX IX_Movie_IsFeatured ON Movie(IsFeatured) WHERE IsFeatured = 1;
CREATE INDEX IX_Show_MovieID ON [Show](MovieID);
CREATE INDEX IX_Show_HallID ON [Show](HallID);
CREATE INDEX IX_Show_ShowDate ON [Show](ShowDate);
CREATE INDEX IX_LikeMovie_MovieID ON LikeMovie(MovieID);