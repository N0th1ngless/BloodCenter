# Blood Bank Management System (BBMS) Database Schema Documentation

## Overview

This document describes the comprehensive database schema for the Blood Bank Management System. The schema has been designed with enhanced features to ensure data security, integrity, and optimal query performance.

## Key Enhancements Implemented

### 1. Enhanced Relational Modeling

**Many-to-Many Mapping for Stakeholders and Mobile Drives**
- Created `stakeholder_mobile_drives` junction table
- Allows multiple stakeholders to be associated with multiple mobile blood drives
- Supports role descriptions (Host, Co-organizer, Sponsor) for each stakeholder-drive relationship
- Enables tracking of contribution notes

**Benefits:**
- Better represents real-world relationships where multiple organizations collaborate on blood drives
- Enables accurate tracking of multi-stakeholder events
- Provides flexibility for future expansion

### 2. Address Normalization

**Centralized `addresses` Table**
- Single source of truth for all addresses in the system
- Referenced by `donors`, `stakeholders`, and `mobile_drives` tables
- Supports multiple address types with flexible structure

**Schema:**
```sql
addresses (
    id, address_type, province, city, barangay, street, 
    postal_code, geo_coord, created_at, updated_at
)
```

**Benefits:**
- Reduces data redundancy
- Easier address updates and maintenance
- Consistent address format across the system
- Supports geographical queries

### 3. Encrypted Sensitive Data

**Encryption Implementation:**
- Uses PostgreSQL's `pgcrypto` extension
- Encrypts sensitive fields using symmetric encryption (pgp_sym_encrypt)

**Encrypted Fields:**
- **users**: `email_encrypted`, `phone_encrypted`
- **donors**: `id_number_encrypted`, `email_encrypted`, `phone_encrypted`
- **stakeholders**: `email_encrypted`, `phone_encrypted`
- **stakeholder_coordinators**: `contact_encrypted`, `email_encrypted`
- **blood_requests**: `requester_contact_encrypted`, `patient_name_encrypted`

**Helper Functions:**
```sql
-- Encrypt data
encrypt_data(data TEXT, encryption_key TEXT) RETURNS BYTEA

-- Decrypt data
decrypt_data(encrypted_data BYTEA, encryption_key TEXT) RETURNS TEXT
```

**Usage Example:**
```sql
-- Inserting encrypted data
INSERT INTO donors (first_name, email_encrypted, phone_encrypted) 
VALUES (
    'John', 
    encrypt_data('john@example.com', 'your-encryption-key'),
    encrypt_data('+639171234567', 'your-encryption-key')
);

-- Querying decrypted data
SELECT 
    first_name,
    decrypt_data(email_encrypted, 'your-encryption-key') AS email,
    decrypt_data(phone_encrypted, 'your-encryption-key') AS phone
FROM donors;
```

**Benefits:**
- Complies with data protection regulations (GDPR, HIPAA)
- Protects personally identifiable information (PII)
- Reduces risk of data breaches

### 4. Token Enhancements

**Enhanced `user_tokens` Table:**
- `token_hash`: Stores SHA-256 hash of tokens instead of plain text
- `is_revoked`: Boolean flag for token revocation
- `revoked_at`: Timestamp of revocation
- `revoked_reason`: Text explanation for revocation
- `device_info`: JSONB field storing device details

**Token Hash Function:**
```sql
hash_token(token TEXT) RETURNS VARCHAR(255)
```

**Device Info Structure:**
```json
{
    "browser": "Chrome",
    "browser_version": "119.0",
    "os": "Windows 10",
    "ip_address": "192.168.1.1",
    "user_agent": "Mozilla/5.0...",
    "timestamp": "2024-01-15T10:30:00Z"
}
```

**Benefits:**
- Enhanced security through token hashing
- Ability to revoke compromised tokens
- Track user sessions across devices
- Audit trail for security incidents

### 5. Versioning for JSON Fields

**Implementation in `roles` Table:**
- `permissions`: JSONB field for flexible permission structure
- `schema_version`: INTEGER field for tracking JSON schema versions

**Schema Version Example:**
```json
{
    "all": true,
    "schema_version": 1,
    "modules": {
        "donors": {
            "view": true,
            "edit": true,
            "delete": false
        }
    }
}
```

**Migration Strategy:**
- When updating JSON structure, increment `schema_version`
- Application code can check version and handle accordingly
- Allows backward compatibility during transitions

**Benefits:**
- Facilitates smooth schema migrations
- Enables gradual rollout of permission changes
- Maintains backward compatibility
- Clear audit trail of permission structure evolution

### 6. Geographical Data Integration

**PostGIS Integration:**
- Uses PostGIS extension for spatial data types
- `geo_coord` field in `addresses` table uses `GEOGRAPHY(POINT, 4326)` type
- WGS84 coordinate system (EPSG:4326) for GPS compatibility

**Geographical Index:**
```sql
CREATE INDEX idx_addresses_geo_coord ON addresses USING GIST(geo_coord);
```

**Usage Examples:**
```sql
-- Insert location with coordinates
INSERT INTO addresses (address_type, province, city, geo_coord)
VALUES (
    'mobile_drive',
    'Camarines Sur',
    'Naga City',
    ST_SetSRID(ST_MakePoint(123.1816, 13.6218), 4326)::geography
);

-- Find drives within 10km radius
SELECT md.*, a.city
FROM mobile_drives md
JOIN addresses a ON md.address_id = a.id
WHERE ST_DWithin(
    a.geo_coord,
    ST_SetSRID(ST_MakePoint(123.1816, 13.6218), 4326)::geography,
    10000  -- 10km in meters
);

-- Calculate distance between two locations
SELECT 
    ST_Distance(
        (SELECT geo_coord FROM addresses WHERE id = 1),
        (SELECT geo_coord FROM addresses WHERE id = 2)
    ) / 1000 AS distance_km;
```

**Benefits:**
- Accurate location tracking for mobile drives
- Distance-based queries for route optimization
- Spatial analysis for coverage planning
- Integration with mapping services

### 7. Reporting Views

Eight comprehensive SQL views have been created for analytics:

#### a. **donor_activity_summary**
Provides comprehensive donor statistics including:
- Total donations count
- Acceptance rate
- Eligibility status
- Geographic distribution

#### b. **stakeholder_performance_insights**
Tracks stakeholder engagement:
- Number of drives participated
- Units collected
- Average performance metrics
- Last activity date

#### c. **donation_statistics_by_blood_type**
Monthly breakdown by blood type:
- Total donations
- Acceptance/rejection rates
- Trend analysis

#### d. **mobile_drive_performance**
Drive-level analytics:
- Target vs. achieved units
- Achievement percentage
- Donor participation
- Stakeholder involvement

#### e. **blood_inventory_status**
Real-time inventory overview:
- Available units by blood type and component
- Expiring soon alerts
- Reserved and issued units

#### f. **monthly_donation_trends**
Time-series analysis:
- Monthly donation volumes
- Unique donor counts
- Drive frequency

#### g. **user_activity_summary**
Staff performance tracking:
- Donations screened
- Drives coordinated
- System activity

#### h. **blood_request_fulfillment_status**
Request management:
- Fulfillment rates
- Overdue requests
- Critical status alerts

## Database Schema Structure

### Core Tables

1. **addresses** - Centralized address management
2. **roles** - User roles with JSON permissions
3. **users** - System users with encrypted data
4. **user_tokens** - Enhanced authentication tokens
5. **donors** - Blood donors registry
6. **stakeholders** - Organizations and partners
7. **stakeholder_coordinators** - Contact persons
8. **mobile_drives** - Blood donation events
9. **stakeholder_mobile_drives** - Many-to-many mapping
10. **mobile_drive_staff** - Staff assignments
11. **donation_records** - Individual donations
12. **test_results** - Laboratory test results
13. **blood_inventory** - Product inventory
14. **blood_requests** - Blood product requests
15. **issuance_records** - Distribution tracking
16. **documents** - Attachments and files
17. **audit_log** - System audit trail

### Relationships Diagram

```
users ─┬─> user_tokens
       ├─> mobile_drives (coordinator)
       ├─> donation_records (screener/phlebotomist)
       └─> audit_log

donors ─┬─> donation_records
        └─> addresses

stakeholders ─┬─> stakeholder_coordinators
              ├─> stakeholder_mobile_drives
              └─> addresses

mobile_drives ─┬─> stakeholder_mobile_drives
               ├─> mobile_drive_staff
               ├─> donation_records
               └─> addresses

donation_records ─┬─> test_results
                  └─> blood_inventory

blood_inventory ─> issuance_records

blood_requests ─> issuance_records
```

## Installation Instructions

### Prerequisites

- PostgreSQL 12 or higher
- PostGIS extension
- pgcrypto extension

### Setup Steps

1. **Install PostgreSQL Extensions:**
```bash
# Connect to your database
psql -U postgres -d bloodbank

# Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "postgis";
```

2. **Run Schema Creation:**
```bash
psql -U postgres -d bloodbank -f bbms_schema.sql
```

3. **Verify Installation:**
```sql
-- Check tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check views
SELECT table_name 
FROM information_schema.views 
WHERE table_schema = 'public';

-- Check extensions
SELECT * FROM pg_extension;
```

## Security Best Practices

### 1. Encryption Key Management

**DO NOT** hardcode encryption keys in your application. Use environment variables or key management services:

```javascript
// Node.js example
const ENCRYPTION_KEY = process.env.DB_ENCRYPTION_KEY;

// Encrypt before insert
const encryptedEmail = await db.query(
    'SELECT encrypt_data($1, $2) AS encrypted',
    [email, ENCRYPTION_KEY]
);
```

### 2. Token Management

Always hash tokens before storing:

```javascript
// Generate token
const token = crypto.randomBytes(32).toString('hex');

// Hash before storing
const hashedToken = await db.query(
    'SELECT hash_token($1) AS hashed',
    [token]
);

// Return plain token to user (only once)
return token;
```

### 3. Access Control

Use PostgreSQL roles and permissions:

```sql
-- Create read-only role
CREATE ROLE bloodbank_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO bloodbank_readonly;

-- Create application role
CREATE ROLE bloodbank_app;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO bloodbank_app;

-- No access to encryption functions for read-only users
REVOKE EXECUTE ON FUNCTION decrypt_data FROM bloodbank_readonly;
```

## Performance Optimization

### 1. Indexes

All critical fields have indexes:
- Primary keys
- Foreign keys
- Frequently queried fields (status, dates, codes)
- Geographical coordinates (GIST index)

### 2. Partitioning (Optional)

For large datasets, consider partitioning:

```sql
-- Partition donation_records by year
CREATE TABLE donation_records_2024 PARTITION OF donation_records
    FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

CREATE TABLE donation_records_2025 PARTITION OF donation_records
    FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
```

### 3. Materialized Views

For frequently accessed reports, use materialized views:

```sql
CREATE MATERIALIZED VIEW donor_stats_cache AS
SELECT * FROM donor_activity_summary;

-- Refresh periodically
REFRESH MATERIALIZED VIEW donor_stats_cache;
```

## Data Migration Guide

### Migrating Existing Data

If you have existing data with plain text sensitive fields:

```sql
-- Create temporary encryption key variable
SET app.encryption_key = 'your-secure-key';

-- Migrate emails
UPDATE donors 
SET email_encrypted = encrypt_data(email_plain, current_setting('app.encryption_key'))
WHERE email_encrypted IS NULL;

-- Drop old column after verification
ALTER TABLE donors DROP COLUMN email_plain;
```

## Backup and Recovery

### Regular Backups

```bash
# Full database backup
pg_dump -U postgres bloodbank > backup_$(date +%Y%m%d).sql

# Schema only
pg_dump -U postgres -s bloodbank > schema_backup.sql

# Data only
pg_dump -U postgres -a bloodbank > data_backup.sql
```

### Restore

```bash
psql -U postgres -d bloodbank < backup_20240115.sql
```

## Monitoring and Maintenance

### Key Metrics to Monitor

1. **Inventory Levels:**
```sql
SELECT * FROM blood_inventory_status 
WHERE available_units < 10;
```

2. **Expiring Products:**
```sql
SELECT * FROM blood_inventory
WHERE status = 'Available' 
AND expiry_date <= CURRENT_DATE + INTERVAL '7 days';
```

3. **Overdue Requests:**
```sql
SELECT * FROM blood_request_fulfillment_status
WHERE fulfillment_status = 'Overdue';
```

4. **Token Cleanup:**
```sql
-- Delete expired tokens older than 30 days
DELETE FROM user_tokens 
WHERE expires_at < CURRENT_TIMESTAMP - INTERVAL '30 days';
```

## Troubleshooting

### Common Issues

1. **PostGIS Extension Not Found:**
```bash
sudo apt-get install postgresql-12-postgis-3
```

2. **Encryption Key Issues:**
- Ensure consistent key across application instances
- Use a key management service in production

3. **Performance Issues:**
```sql
-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM donor_activity_summary WHERE blood_type = 'O+';

-- Update statistics
ANALYZE donors;
VACUUM ANALYZE donation_records;
```

## Future Enhancements

Potential improvements for future versions:

1. **Row-Level Security:** Implement PostgreSQL RLS for multi-tenant scenarios
2. **Event Sourcing:** Add event log for complete audit trail
3. **Time-Series Data:** Use TimescaleDB for donation trend analysis
4. **Full-Text Search:** Add PostgreSQL full-text search for documents
5. **Notification System:** Create triggers for automated alerts

## Support and Contact

For questions or issues with the schema:
- Review this documentation
- Check PostgreSQL logs for errors
- Verify all extensions are installed
- Ensure proper permissions are set

## Version History

- **v1.0** - Initial comprehensive schema with all enhancements
  - Many-to-many stakeholder-drive mapping
  - Centralized address management
  - Encrypted sensitive data
  - Enhanced token security
  - JSON versioning
  - Geographical integration
  - Reporting views

---

**Last Updated:** 2025-01-15
**Schema Version:** 1.0
