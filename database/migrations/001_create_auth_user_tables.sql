-- 001_create_auth_user_tables.sql
-- Description: Khởi tạo các bảng cấu trúc cơ bản cho Authentication và User 
SET QUOTED_IDENTIFIER ON;
GO
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
    PhoneNumber NVARCHAR(20) NULL,
    Gender NVARCHAR(10) CHECK (Gender IN ('MALE', 'FEMALE', 'OTHER')),
    DateOfBirth DATE NULL,
    AvatarUrl NVARCHAR(255) NULL,
    LoyaltyPoints INT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);

-- Unique index cho PhoneNumber (cho phép nhiều NULL)
CREATE UNIQUE INDEX UX_Customer_PhoneNumber_NotNull ON Customer(PhoneNumber) WHERE PhoneNumber IS NOT NULL;

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
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO
CREATE TRIGGER trg_UpdateAccount_UpdatedAt
ON Account
AFTER UPDATE
AS
BEGIN
   SET NOCOUNT ON;
   IF NOT UPDATE(UpdatedAt)
   BEGIN
       UPDATE Account SET UpdatedAt = GETDATE()
       FROM Account a
       INNER JOIN Inserted i ON a.AccountID = i.AccountID;
   END
END;

-- Trigger Tự động cập nhật trường UpdatedAt cho Customer
GO
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO
CREATE TRIGGER trg_UpdateCustomer_UpdatedAt
ON Customer
AFTER UPDATE
AS
BEGIN
   SET NOCOUNT ON;
   IF NOT UPDATE(UpdatedAt)
   BEGIN
       UPDATE Customer SET UpdatedAt = GETDATE()
       FROM Customer c
       INNER JOIN Inserted i ON c.CustomerID = i.CustomerID;
   END
END;
