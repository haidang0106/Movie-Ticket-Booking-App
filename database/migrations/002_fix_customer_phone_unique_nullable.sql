-- database/migrations/002_fix_customer_phone_unique_nullable.sql
-- Description: Thay thế UNIQUE constraint trên PhoneNumber bằng Filtered Unique Index để cho phép nhiều giá trị NULL.

SET QUOTED_IDENTIFIER ON;
GO
BEGIN TRANSACTION;

-- 1. Tìm tên Constraint UNIQUE được hệ thống tự động sinh ra cho cột PhoneNumber
DECLARE @ConstraintName NVARCHAR(255);
SELECT TOP 1 @ConstraintName = dc.name
FROM sys.key_constraints dc
JOIN sys.index_columns ic ON dc.parent_object_id = ic.object_id AND dc.unique_index_id = ic.index_id
JOIN sys.columns c ON ic.object_id = c.object_id AND ic.column_id = c.column_id
WHERE dc.parent_object_id = OBJECT_ID('Customer')
  AND c.name = 'PhoneNumber'
  AND dc.type = 'UQ';

-- 2. Xóa Constraint nếu tồn tại
IF @ConstraintName IS NOT NULL
BEGIN
    PRINT 'Dropping unique constraint: ' + @ConstraintName;
    EXEC('ALTER TABLE Customer DROP CONSTRAINT [' + @ConstraintName + ']');
END

-- 3. Xóa index nếu tồn tại (đề phòng trường hợp đã tồn tại index trùng tên hoặc index unique khác)
IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'UX_Customer_PhoneNumber_NotNull' AND object_id = OBJECT_ID('Customer'))
BEGIN
    DROP INDEX UX_Customer_PhoneNumber_NotNull ON Customer;
END

-- 4. Tạo Filtered Unique Index: Chỉ unique đối với các giá trị không NULL
CREATE UNIQUE INDEX UX_Customer_PhoneNumber_NotNull 
ON Customer(PhoneNumber) 
WHERE PhoneNumber IS NOT NULL;

COMMIT TRANSACTION;
PRINT 'Migration 002 completed: Customer.PhoneNumber uniqueness fixed for NULLs.';
