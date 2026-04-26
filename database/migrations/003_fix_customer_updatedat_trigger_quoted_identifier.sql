-- 003_fix_customer_updatedat_trigger_quoted_identifier.sql
-- Description: Recreate trg_UpdateCustomer_UpdatedAt with QUOTED_IDENTIFIER ON and ANSI_NULLS ON.
-- This is required by SQL Server when updating tables with filtered indexes.

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

IF EXISTS (SELECT * FROM sys.triggers WHERE name = 'trg_UpdateCustomer_UpdatedAt' AND parent_id = OBJECT_ID('Customer'))
BEGIN
    PRINT 'Dropping trg_UpdateCustomer_UpdatedAt...';
    DROP TRIGGER trg_UpdateCustomer_UpdatedAt;
END
GO

PRINT 'Creating trg_UpdateCustomer_UpdatedAt with correct SET options...';
GO

CREATE TRIGGER trg_UpdateCustomer_UpdatedAt
ON Customer
AFTER UPDATE
AS
BEGIN
   SET NOCOUNT ON;
   -- Only update if it's not a recursive update of UpdatedAt itself
   IF NOT UPDATE(UpdatedAt)
   BEGIN
       UPDATE Customer 
       SET UpdatedAt = GETDATE()
       FROM Customer c
       INNER JOIN Inserted i ON c.CustomerID = i.CustomerID;
   END
END;
GO

PRINT 'Migration 003 completed: trg_UpdateCustomer_UpdatedAt recreated with QUOTED_IDENTIFIER ON.';
