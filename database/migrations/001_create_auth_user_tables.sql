-- 001_create_auth_user_tables.sql
-- Description: Khởi tạo các bảng cấu trúc cơ bản cho Authentication và User 

-- 1. Bảng Account: Bảng dùng chung cho xác thực và phân quyền
CREATE TABLE Account (
    AccountID INT IDENTITY(1,1) PRIMARY KEY,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    AccountType NVARCHAR(50) NOT NULL CHECK (AccountType IN ('CUSTOMER', 'ADMIN', 'SUPER_ADMIN')),
    IsActive BIT DEFAULT 1,
    IsVerified BIT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);

-- 2. Bảng Customer: Lưu trữ thông tin chi tiết dành riêng cho KH
CREATE TABLE Customer (
    CustomerID INT IDENTITY(1,1) PRIMARY KEY,
    AccountID INT UNIQUE NOT NULL FOREIGN KEY REFERENCES Account(AccountID),
    FullName NVARCHAR(150),
    PhoneNumber NVARCHAR(20) UNIQUE NULL,
    Gender NVARCHAR(10) CHECK (Gender IN ('MALE', 'FEMALE', 'OTHER')),
    DateOfBirth DATE NULL,
    AvatarUrl NVARCHAR(255) NULL,
    LoyaltyPoints INT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);

-- 3. Bảng LoyaltyPointHistory: Quản lý tính minh bạch việc cộng/trừ điểm tích luỹ
CREATE TABLE LoyaltyPointHistory (
    HistoryID INT IDENTITY(1,1) PRIMARY KEY,
    CustomerID INT NOT NULL FOREIGN KEY REFERENCES Customer(CustomerID),
    Points INT NOT NULL,  -- Số dương (Earned), Số âm (Revoked/Used)
    Type NVARCHAR(50) NOT NULL CHECK (Type IN ('EARNED', 'REVOKED', 'USED')),
    Description NVARCHAR(255),
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- Trigger Tự động cập nhật trường UpdatedAt cho Account
GO
CREATE TRIGGER trg_UpdateAccount_UpdatedAt
ON Account
AFTER UPDATE
AS
BEGIN
   SET NOCOUNT ON;
   UPDATE Account SET UpdatedAt = GETDATE()
   FROM Inserted i WHERE Account.AccountID = i.AccountID;
END;

-- Trigger Tự động cập nhật trường UpdatedAt cho Customer
GO
CREATE TRIGGER trg_UpdateCustomer_UpdatedAt
ON Customer
AFTER UPDATE
AS
BEGIN
   SET NOCOUNT ON;
   UPDATE Customer SET UpdatedAt = GETDATE()
   FROM Inserted i WHERE Customer.CustomerID = i.CustomerID;
END;
