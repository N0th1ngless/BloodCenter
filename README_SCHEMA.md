# BBMS Schema - Quick Start Guide

## Overview

The Blood Bank Management System (BBMS) database schema provides a comprehensive solution for managing blood donations, donors, stakeholders, mobile drives, inventory, and requests.

## Files in This Repository

- **bbms_schema.sql** - Complete database schema with all features (requires PostGIS)
- **SCHEMA_DOCUMENTATION.md** - Comprehensive documentation of all features
- **MIGRATION_GUIDE.md** - Step-by-step migration instructions
- **bbms_schema_no_postgis.sql** - Alternative schema without geographical features

## Quick Start

### Prerequisites

- PostgreSQL 12 or higher
- Required extensions: uuid-ossp, pgcrypto
- Optional: PostGIS (for geographical features)

### Installation

#### Option 1: Full Installation with PostGIS

```bash
# Install PostGIS (Ubuntu/Debian)
sudo apt-get update
sudo apt-get install postgresql-postgis postgresql-16-postgis-3

# Create database
sudo -u postgres psql -c "CREATE DATABASE bloodbank;"

# Install schema
sudo -u postgres psql -d bloodbank -f bbms_schema.sql
```

#### Option 2: Installation without PostGIS

If PostGIS is not available or not needed:

```bash
# Create database
sudo -u postgres psql -c "CREATE DATABASE bloodbank;"

# Edit bbms_schema.sql and remove/comment PostGIS lines:
# Line 17: -- CREATE EXTENSION IF NOT EXISTS "postgis";
# Line 30: Change geo_coord GEOGRAPHY(POINT, 4326) to:
#          latitude NUMERIC(10, 8),
#          longitude NUMERIC(11, 8)
# Line 37: Remove geo_coord GIST index

# Install modified schema
sudo -u postgres psql -d bloodbank -f bbms_schema.sql
```

### Verify Installation

```bash
# Check tables
sudo -u postgres psql -d bloodbank -c "\dt"

# Check views
sudo -u postgres psql -d bloodbank -c "\dv"

# Check functions
sudo -u postgres psql -d bloodbank -c "\df"

# Test encryption
sudo -u postgres psql -d bloodbank << 'EOF'
SELECT encrypt_data('test@example.com', 'test-key') IS NOT NULL as encryption_works;
SELECT hash_token('test-token') as hashed_token;
EOF
```

## Key Features

### 1. Enhanced Security
- **Encrypted sensitive data**: Emails, phone numbers, ID numbers
- **Hashed tokens**: Secure authentication tokens
- **Token revocation**: Ability to invalidate compromised tokens

### 2. Normalized Data Structure
- **Centralized addresses**: Single table for all address data
- **Many-to-many relationships**: Flexible stakeholder-drive associations
- **Referential integrity**: Comprehensive foreign key constraints

### 3. Geographical Integration (with PostGIS)
- **Location tracking**: GPS coordinates for drives and addresses
- **Distance queries**: Find nearby drives or donors
- **Spatial analysis**: Coverage area optimization

### 4. Reporting Views
Eight pre-built views for common analytics:
- Donor activity summaries
- Stakeholder performance insights
- Donation statistics by blood type
- Mobile drive performance
- Blood inventory status
- Monthly donation trends
- User activity summary
- Blood request fulfillment status

### 5. JSON Versioning
- **Schema evolution**: Track changes to JSON structures
- **Backward compatibility**: Support multiple permission formats
- **Migration support**: Smooth transitions during updates

## Core Tables

| Table | Description |
|-------|-------------|
| addresses | Centralized address management |
| roles | User roles with JSON permissions |
| users | System users with encrypted data |
| user_tokens | Enhanced authentication tokens |
| donors | Blood donors registry |
| stakeholders | Organizations and partners |
| stakeholder_coordinators | Contact persons |
| mobile_drives | Blood donation events |
| stakeholder_mobile_drives | Many-to-many mapping |
| mobile_drive_staff | Staff assignments |
| donation_records | Individual donations |
| test_results | Laboratory test results |
| blood_inventory | Product inventory |
| blood_requests | Blood product requests |
| issuance_records | Distribution tracking |
| documents | Attachments and files |
| audit_log | System audit trail |

## Usage Examples

### Insert Donor with Encrypted Data

```sql
-- Set your encryption key
SET app.encryption_key = 'your-secure-key-here';

-- Insert donor
INSERT INTO donors (
    donor_code, first_name, last_name,
    email_encrypted, phone_encrypted,
    blood_type, gender, date_of_birth, donor_type
) VALUES (
    'D2025001',
    'Juan',
    'Dela Cruz',
    encrypt_data('juan@example.com', current_setting('app.encryption_key')),
    encrypt_data('+639171234567', current_setting('app.encryption_key')),
    'O+',
    'Male',
    '1990-01-15',
    'Voluntary'
);
```

### Query with Decrypted Data

```sql
SELECT 
    donor_code,
    first_name,
    last_name,
    decrypt_data(email_encrypted, current_setting('app.encryption_key')) AS email,
    decrypt_data(phone_encrypted, current_setting('app.encryption_key')) AS phone,
    blood_type
FROM donors
WHERE donor_code = 'D2025001';
```

### Create and Verify Token

```sql
-- Create token hash
SELECT hash_token('my-auth-token-12345') AS token_hash;

-- Insert token
INSERT INTO user_tokens (
    user_id, token_hash, token_type, 
    device_info, expires_at
) VALUES (
    1,
    hash_token('my-auth-token-12345'),
    'auth',
    '{"browser": "Chrome", "os": "Windows 10", "ip": "192.168.1.1"}'::jsonb,
    NOW() + INTERVAL '7 days'
);

-- Verify token
SELECT * FROM user_tokens
WHERE token_hash = hash_token('my-auth-token-12345')
  AND is_revoked = false
  AND expires_at > NOW();
```

### Use Reporting Views

```sql
-- View donor activity
SELECT * FROM donor_activity_summary
WHERE blood_type = 'O+'
ORDER BY total_donations DESC
LIMIT 10;

-- Check inventory status
SELECT * FROM blood_inventory_status
WHERE available_units < 5;

-- View mobile drive performance
SELECT * FROM mobile_drive_performance
WHERE drive_date >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY achievement_percentage DESC;
```

### Geographical Queries (with PostGIS)

```sql
-- Insert address with coordinates (Naga City, Philippines)
INSERT INTO addresses (
    address_type, province, city, barangay,
    geo_coord
) VALUES (
    'mobile_drive',
    'Camarines Sur',
    'Naga City',
    'San Francisco',
    ST_SetSRID(ST_MakePoint(123.1816, 13.6218), 4326)::geography
);

-- Find drives within 10km
SELECT 
    md.drive_code,
    md.venue,
    a.city,
    ST_Distance(
        a.geo_coord,
        ST_SetSRID(ST_MakePoint(123.1816, 13.6218), 4326)::geography
    ) / 1000 AS distance_km
FROM mobile_drives md
JOIN addresses a ON md.address_id = a.id
WHERE ST_DWithin(
    a.geo_coord,
    ST_SetSRID(ST_MakePoint(123.1816, 13.6218), 4326)::geography,
    10000  -- 10km in meters
)
ORDER BY distance_km;
```

## Security Best Practices

1. **Never hardcode encryption keys** - Use environment variables
2. **Rotate encryption keys periodically** - Implement key rotation strategy
3. **Use strong keys** - Minimum 32 characters, random
4. **Limit database access** - Use role-based permissions
5. **Enable SSL/TLS** - Encrypt connections to database
6. **Regular backups** - Schedule automated backups
7. **Audit logs** - Monitor the audit_log table regularly
8. **Token expiration** - Set appropriate expiration times
9. **Revoke compromised tokens** - Use is_revoked flag immediately

## Performance Tips

1. **Use views for complex queries** - Pre-built reporting views
2. **Index optimization** - Already included for common queries
3. **Partitioning** - Consider partitioning large tables by date
4. **Materialized views** - For frequently accessed reports
5. **Connection pooling** - Use in your application
6. **Query optimization** - Use EXPLAIN ANALYZE for slow queries

## Maintenance

### Regular Tasks

```sql
-- Clean expired tokens (run daily)
DELETE FROM user_tokens 
WHERE expires_at < CURRENT_TIMESTAMP - INTERVAL '30 days';

-- Update statistics (run weekly)
ANALYZE donors;
ANALYZE donation_records;
ANALYZE blood_inventory;

-- Check inventory expiring soon (run daily)
SELECT * FROM blood_inventory_status
WHERE expiring_soon_count > 0;

-- Vacuum database (run weekly)
VACUUM ANALYZE;
```

### Backup

```bash
# Daily backup
pg_dump -U postgres bloodbank > backup_$(date +%Y%m%d).sql

# Compressed backup
pg_dump -U postgres bloodbank | gzip > backup_$(date +%Y%m%d).sql.gz
```

## Troubleshooting

### PostGIS Not Available
If you get "extension postgis is not available":
- Install PostGIS: `sudo apt-get install postgresql-16-postgis-3`
- Or modify schema to use latitude/longitude numeric fields

### Encryption Errors
If encryption fails:
- Verify pgcrypto is installed: `SELECT * FROM pg_extension WHERE extname = 'pgcrypto';`
- Check encryption key is set correctly

### Performance Issues
If queries are slow:
- Run ANALYZE on affected tables
- Check indexes with: `SELECT * FROM pg_stat_user_indexes WHERE idx_scan = 0;`
- Use EXPLAIN ANALYZE to identify bottlenecks

## Documentation

For detailed information, see:
- **SCHEMA_DOCUMENTATION.md** - Complete feature documentation
- **MIGRATION_GUIDE.md** - Migration from existing schemas

## Support

For issues or questions:
1. Check the documentation files
2. Review PostgreSQL logs
3. Verify all prerequisites are met
4. Test with provided examples

## Version

- **Schema Version**: 1.0
- **Last Updated**: 2025-01-15
- **PostgreSQL**: 12+
- **Extensions**: uuid-ossp, pgcrypto, postgis (optional)
