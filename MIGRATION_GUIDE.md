# BBMS Schema Migration Guide

## Overview

This guide provides step-by-step instructions for migrating from a basic schema to the enhanced BBMS schema with encryption, geographical data, and advanced features.

## Prerequisites

- PostgreSQL 12+ installed
- Database backup completed
- Required extensions available:
  - uuid-ossp
  - pgcrypto
  - postgis

## Pre-Migration Checklist

- [ ] Complete database backup
- [ ] Document current schema structure
- [ ] Identify existing sensitive data fields
- [ ] Generate secure encryption keys
- [ ] Test migration on development/staging environment
- [ ] Schedule maintenance window
- [ ] Notify users of downtime

## Step-by-Step Migration

### Phase 1: Extension Installation

```sql
-- Connect to your database
\c bloodbank

-- Install required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Verify extensions
SELECT extname, extversion FROM pg_extension;
```

### Phase 2: Backup Current Data

```bash
# Full backup
pg_dump -U postgres bloodbank > pre_migration_backup.sql

# Export sensitive data for migration
pg_dump -U postgres bloodbank -t donors -t users -t stakeholders --data-only > sensitive_data.sql
```

### Phase 3: Schema Creation

```bash
# Run the new schema (on fresh database or after dropping old tables)
psql -U postgres bloodbank -f bbms_schema.sql
```

### Phase 4: Data Migration

If you have existing data, use these migration scripts:

#### A. Migrate Addresses

```sql
-- Create temporary table for old address data
CREATE TEMP TABLE temp_donor_addresses AS
SELECT 
    id as donor_id,
    province,
    city,
    barangay,
    street
FROM old_donors_table;

-- Insert into addresses table
INSERT INTO addresses (address_type, province, city, barangay, street)
SELECT DISTINCT 
    'donor',
    province,
    city,
    barangay,
    street
FROM temp_donor_addresses
WHERE province IS NOT NULL;

-- Update donors with address_id
UPDATE donors d
SET address_id = a.id
FROM addresses a
WHERE d.province = a.province 
  AND d.city = a.city
  AND COALESCE(d.barangay, '') = COALESCE(a.barangay, '');
```

#### B. Encrypt Sensitive Data

```sql
-- Set encryption key (use environment variable in production)
SET app.encryption_key = 'your-secure-encryption-key-here';

-- Migrate donor emails
UPDATE donors
SET email_encrypted = encrypt_data(
    old_email_column::text, 
    current_setting('app.encryption_key')
)
WHERE old_email_column IS NOT NULL;

-- Migrate donor phones
UPDATE donors
SET phone_encrypted = encrypt_data(
    old_phone_column::text, 
    current_setting('app.encryption_key')
)
WHERE old_phone_column IS NOT NULL;

-- Migrate donor ID numbers
UPDATE donors
SET id_number_encrypted = encrypt_data(
    old_id_number::text, 
    current_setting('app.encryption_key')
)
WHERE old_id_number IS NOT NULL;

-- Verify encryption (decrypt one record)
SELECT 
    donor_code,
    decrypt_data(email_encrypted, current_setting('app.encryption_key')) as email,
    decrypt_data(phone_encrypted, current_setting('app.encryption_key')) as phone
FROM donors
LIMIT 1;
```

#### C. Migrate User Tokens

```sql
-- Hash existing tokens
UPDATE user_tokens
SET token_hash = hash_token(old_token_column)
WHERE old_token_column IS NOT NULL;

-- Set default device info for existing tokens
UPDATE user_tokens
SET device_info = jsonb_build_object(
    'migrated', true,
    'migration_date', CURRENT_TIMESTAMP,
    'note', 'Migrated from old system'
)
WHERE device_info IS NULL;
```

#### D. Create Stakeholder-Drive Mappings

```sql
-- If you had a single stakeholder_id in mobile_drives table
INSERT INTO stakeholder_mobile_drives (stakeholder_id, mobile_drive_id, role_description)
SELECT 
    old_stakeholder_id,
    id,
    'Primary Host'
FROM old_mobile_drives_table
WHERE old_stakeholder_id IS NOT NULL;
```

#### E. Add Geographical Coordinates

```sql
-- Add coordinates if you have latitude/longitude
UPDATE addresses
SET geo_coord = ST_SetSRID(
    ST_MakePoint(old_longitude, old_latitude), 
    4326
)::geography
WHERE old_latitude IS NOT NULL 
  AND old_longitude IS NOT NULL;

-- Geocode addresses using external service (pseudo-code)
-- In practice, use a geocoding API like Google Maps, OpenStreetMap, etc.
```

### Phase 5: Data Validation

```sql
-- Check for unmigrated records
SELECT COUNT(*) as unmigrated_addresses
FROM donors
WHERE address_id IS NULL;

SELECT COUNT(*) as unencrypted_emails
FROM donors
WHERE email_encrypted IS NULL AND old_email_column IS NOT NULL;

-- Verify foreign key integrity
SELECT 
    conname AS constraint_name,
    conrelid::regclass AS table_name,
    confrelid::regclass AS referenced_table
FROM pg_constraint
WHERE contype = 'f';

-- Test decryption
SELECT 
    'd' as type,
    COUNT(*) as total,
    COUNT(CASE WHEN email_encrypted IS NOT NULL THEN 1 END) as encrypted_emails,
    COUNT(CASE WHEN phone_encrypted IS NOT NULL THEN 1 END) as encrypted_phones
FROM donors
UNION ALL
SELECT 
    'u' as type,
    COUNT(*) as total,
    COUNT(CASE WHEN email_encrypted IS NOT NULL THEN 1 END) as encrypted_emails,
    COUNT(CASE WHEN phone_encrypted IS NOT NULL THEN 1 END) as encrypted_phones
FROM users;
```

### Phase 6: Test Reporting Views

```sql
-- Test each view
SELECT COUNT(*) FROM donor_activity_summary;
SELECT COUNT(*) FROM stakeholder_performance_insights;
SELECT COUNT(*) FROM donation_statistics_by_blood_type;
SELECT COUNT(*) FROM mobile_drive_performance;
SELECT COUNT(*) FROM blood_inventory_status;
SELECT COUNT(*) FROM monthly_donation_trends;
SELECT COUNT(*) FROM user_activity_summary;
SELECT COUNT(*) FROM blood_request_fulfillment_status;

-- Sample data from views
SELECT * FROM donor_activity_summary LIMIT 5;
SELECT * FROM stakeholder_performance_insights LIMIT 5;
```

### Phase 7: Cleanup

```sql
-- Drop old columns after verification
ALTER TABLE donors DROP COLUMN IF EXISTS old_email_column;
ALTER TABLE donors DROP COLUMN IF EXISTS old_phone_column;
ALTER TABLE donors DROP COLUMN IF EXISTS old_id_number;
ALTER TABLE donors DROP COLUMN IF EXISTS province;
ALTER TABLE donors DROP COLUMN IF EXISTS city;
ALTER TABLE donors DROP COLUMN IF EXISTS barangay;
ALTER TABLE donors DROP COLUMN IF EXISTS street;

-- Drop temporary tables
DROP TABLE IF EXISTS temp_donor_addresses;

-- Reset encryption key variable
RESET app.encryption_key;
```

## Application Code Updates

### Node.js/Express Example

```javascript
// config/database.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const ENCRYPTION_KEY = process.env.DB_ENCRYPTION_KEY;

// Helper functions
async function encryptData(data) {
  const result = await pool.query(
    'SELECT encrypt_data($1, $2) AS encrypted',
    [data, ENCRYPTION_KEY]
  );
  return result.rows[0].encrypted;
}

async function decryptData(encryptedData) {
  const result = await pool.query(
    'SELECT decrypt_data($1, $2) AS decrypted',
    [encryptedData, ENCRYPTION_KEY]
  );
  return result.rows[0].decrypted;
}

async function hashToken(token) {
  const result = await pool.query(
    'SELECT hash_token($1) AS hashed',
    [token]
  );
  return result.rows[0].hashed;
}

module.exports = { pool, encryptData, decryptData, hashToken };
```

### Creating Donors with Encrypted Data

```javascript
// controllers/donorController.js
const { pool, encryptData } = require('../config/database');

async function createDonor(donorData) {
  const { firstName, lastName, email, phone, idNumber, ...rest } = donorData;
  
  const query = `
    INSERT INTO donors (
      donor_code, first_name, last_name,
      email_encrypted, phone_encrypted, id_number_encrypted,
      blood_type, gender, date_of_birth
    ) VALUES (
      $1, $2, $3,
      encrypt_data($4, $5),
      encrypt_data($6, $7),
      encrypt_data($8, $9),
      $10, $11, $12
    )
    RETURNING id, donor_code
  `;
  
  const result = await pool.query(query, [
    generateDonorCode(),
    firstName,
    lastName,
    email,
    process.env.DB_ENCRYPTION_KEY,
    phone,
    process.env.DB_ENCRYPTION_KEY,
    idNumber,
    process.env.DB_ENCRYPTION_KEY,
    rest.bloodType,
    rest.gender,
    rest.dateOfBirth
  ]);
  
  return result.rows[0];
}
```

### Querying Donors with Decrypted Data

```javascript
async function getDonorById(donorId) {
  const query = `
    SELECT 
      d.id,
      d.donor_code,
      d.first_name,
      d.last_name,
      decrypt_data(d.email_encrypted, $1) AS email,
      decrypt_data(d.phone_encrypted, $2) AS phone,
      d.blood_type,
      d.status,
      a.province,
      a.city,
      a.barangay,
      ST_X(a.geo_coord::geometry) AS longitude,
      ST_Y(a.geo_coord::geometry) AS latitude
    FROM donors d
    LEFT JOIN addresses a ON d.address_id = a.id
    WHERE d.id = $3
  `;
  
  const result = await pool.query(query, [
    process.env.DB_ENCRYPTION_KEY,
    process.env.DB_ENCRYPTION_KEY,
    donorId
  ]);
  
  return result.rows[0];
}
```

### Token Management

```javascript
const crypto = require('crypto');

async function createAuthToken(userId, deviceInfo) {
  // Generate random token
  const token = crypto.randomBytes(32).toString('hex');
  
  // Hash token for storage
  const hashedToken = await hashToken(token);
  
  // Store in database
  const query = `
    INSERT INTO user_tokens (
      user_id, token_hash, token_type, 
      device_info, expires_at
    ) VALUES (
      $1, $2, 'auth', $3, 
      NOW() + INTERVAL '7 days'
    )
    RETURNING id
  `;
  
  await pool.query(query, [
    userId,
    hashedToken,
    JSON.stringify(deviceInfo)
  ]);
  
  // Return plain token to client (only time it's visible)
  return token;
}

async function verifyToken(token) {
  const hashedToken = await hashToken(token);
  
  const query = `
    SELECT ut.*, u.username, u.first_name, u.last_name
    FROM user_tokens ut
    JOIN users u ON ut.user_id = u.id
    WHERE ut.token_hash = $1
      AND ut.is_revoked = false
      AND ut.expires_at > NOW()
  `;
  
  const result = await pool.query(query, [hashedToken]);
  
  if (result.rows.length === 0) {
    throw new Error('Invalid or expired token');
  }
  
  // Update last_used_at
  await pool.query(
    'UPDATE user_tokens SET last_used_at = NOW() WHERE token_hash = $1',
    [hashedToken]
  );
  
  return result.rows[0];
}
```

## Rollback Plan

If migration fails:

```bash
# Step 1: Stop application
systemctl stop bloodbank-app

# Step 2: Drop new schema
psql -U postgres bloodbank -c "DROP SCHEMA public CASCADE;"
psql -U postgres bloodbank -c "CREATE SCHEMA public;"

# Step 3: Restore backup
psql -U postgres bloodbank < pre_migration_backup.sql

# Step 4: Verify restoration
psql -U postgres bloodbank -c "\dt"

# Step 5: Restart application
systemctl start bloodbank-app
```

## Post-Migration Tasks

1. **Update Application Configuration:**
   - Set encryption key in environment variables
   - Update database queries to use new schema
   - Update ORM models if applicable

2. **Performance Tuning:**
```sql
-- Analyze tables
ANALYZE donors;
ANALYZE users;
ANALYZE donation_records;
ANALYZE blood_inventory;

-- Vacuum to reclaim space
VACUUM ANALYZE;
```

3. **Monitor Performance:**
```sql
-- Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check index usage
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;
```

4. **Security Audit:**
   - Verify all sensitive data is encrypted
   - Check user permissions
   - Review audit log entries
   - Test token revocation

5. **Documentation Update:**
   - Update API documentation
   - Update deployment guides
   - Train team on new features

## Testing Checklist

- [ ] All tables created successfully
- [ ] All views accessible
- [ ] Foreign keys enforced
- [ ] Encryption/decryption working
- [ ] Token hashing functional
- [ ] Geographical queries working
- [ ] Reporting views return data
- [ ] Application can connect and query
- [ ] Performance acceptable
- [ ] Backup/restore tested

## Common Issues and Solutions

### Issue 1: Extension Not Available
```bash
# Install PostGIS
sudo apt-get update
sudo apt-get install postgresql-12-postgis-3

# Install pgcrypto (usually included)
sudo apt-get install postgresql-contrib
```

### Issue 2: Encryption Key Mismatch
```sql
-- Test with known data
SELECT decrypt_data(
    encrypt_data('test@example.com', 'test-key'),
    'test-key'
);
```

### Issue 3: Geographical Query Errors
```sql
-- Check PostGIS version
SELECT PostGIS_Version();

-- Verify SRID
SELECT ST_SRID(geo_coord) FROM addresses WHERE geo_coord IS NOT NULL LIMIT 1;
```

### Issue 4: Performance Degradation
```sql
-- Create missing indexes
CREATE INDEX idx_custom ON table_name(column_name);

-- Update statistics
ANALYZE table_name;
```

## Support

For migration issues:
1. Check PostgreSQL logs: `/var/log/postgresql/postgresql-12-main.log`
2. Review application logs
3. Verify environment variables
4. Test queries in psql directly
5. Consult SCHEMA_DOCUMENTATION.md

---

**Migration Version:** 1.0
**Last Updated:** 2025-01-15
