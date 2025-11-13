# BBMS Schema Entity Relationship Diagram (ERD) Description

## Visual Schema Overview

This document provides a text-based description of the entity relationships in the BBMS database schema. For a visual ERD, use a tool like pgAdmin, DBeaver, or draw.io with this description.

## Core Entity Groups

### 1. SECURITY & USER MANAGEMENT

```
┌─────────────┐
│   roles     │
│─────────────│
│ id (PK)     │
│ role_name   │◄───┐
│ permissions │    │
│ schema_ver  │    │
└─────────────┘    │
                   │
                   │
┌─────────────┐    │
│   users     │    │
│─────────────│    │
│ id (PK)     │    │
│ username    │    │
│ password    │    │
│ email_enc   │    │
│ phone_enc   │    │
│ role_id (FK)├────┘
└─────────────┘
       │
       │ 1:N
       │
       ▼
┌─────────────┐
│ user_tokens │
│─────────────│
│ id (PK)     │
│ user_id (FK)│
│ token_hash  │
│ device_info │
│ is_revoked  │
│ expires_at  │
└─────────────┘
```

### 2. ADDRESS MANAGEMENT (Centralized)

```
┌──────────────┐
│  addresses   │◄─────────────┐
│──────────────│              │
│ id (PK)      │              │
│ address_type │              │
│ province     │              │
│ city         │              │
│ barangay     │              │
│ geo_coord    │              │
└──────────────┘              │
       ▲                      │
       │                      │
       │ Referenced by:       │
       │ - donors             │
       │ - stakeholders       │
       │ - mobile_drives      │
       │                      │
```

### 3. DONOR MANAGEMENT

```
┌─────────────┐
│   donors    │
│─────────────│
│ id (PK)     │
│ donor_code  │
│ first_name  │
│ last_name   │
│ blood_type  │
│ email_enc   │
│ phone_enc   │
│ id_num_enc  │
│ address_id  │──────┐
└─────────────┘      │
       │             │
       │ 1:N         │
       ▼             │
┌──────────────┐     │
│ donation_    │     │
│ records      │     │
│──────────────│     │
│ id (PK)      │     │
│ donor_id (FK)│     │
│ drive_id (FK)│     │
│ donation_date│     │
│ outcome      │     │
└──────────────┘     │
       │             │
       │ 1:N         │
       ▼             │
┌──────────────┐     │
│ test_results │     │
│──────────────│     │
│ id (PK)      │     │
│ donation_id  │     │
│ test_type    │     │
│ result       │     │
└──────────────┘     │
                     │
                     ▼
              ┌──────────┐
              │addresses │
              └──────────┘
```

### 4. STAKEHOLDER & MOBILE DRIVES (Many-to-Many)

```
┌──────────────┐
│ stakeholders │
│──────────────│
│ id (PK)      │
│ code         │
│ name         │
│ category     │
│ email_enc    │
│ phone_enc    │
│ address_id   │──────┐
└──────────────┘      │
       │              │
       │ 1:N          │
       ▼              │
┌──────────────┐      │
│ stakeholder_ │      │
│ coordinators │      │
│──────────────│      │
│ id (PK)      │      │
│ stakehld_id  │      │
│ name         │      │
│ contact_enc  │      │
└──────────────┘      │
       │              │
       │              │
       │ M:N          │
       ▼              │
┌──────────────┐      │
│ stakeholder_ │      │
│ mobile_drives│      │
│──────────────│      │
│ id (PK)      │      │
│ stakehld_id  │      │
│ drive_id (FK)│      │
│ role_desc    │      │
└──────────────┘      │
       │              │
       │              │
       ▼              │
┌──────────────┐      │
│ mobile_drives│      │
│──────────────│      │
│ id (PK)      │      │
│ drive_code   │      │
│ venue        │      │
│ drive_date   │      │
│ target_units │      │
│ status       │      │
│ address_id   │──────┤
└──────────────┘      │
       │              │
       │ 1:N          │
       ▼              │
┌──────────────┐      │
│ mobile_drive_│      │
│ staff        │      │
│──────────────│      │
│ id (PK)      │      │
│ drive_id (FK)│      │
│ user_id (FK) │      │
│ staff_role   │      │
└──────────────┘      │
                      ▼
               ┌──────────┐
               │addresses │
               └──────────┘
```

### 5. INVENTORY & REQUESTS

```
┌──────────────┐
│ donation_    │
│ records      │
│──────────────│
│ id (PK)      │
└──────────────┘
       │
       │ 1:1
       ▼
┌──────────────┐
│ blood_       │
│ inventory    │
│──────────────│
│ id (PK)      │
│ unit_number  │
│ donation_id  │
│ blood_type   │
│ component    │
│ status       │
│ expiry_date  │
└──────────────┘
       │
       │ N:M (via issuance_records)
       │
       ▼
┌──────────────┐
│ blood_       │
│ requests     │
│──────────────│
│ id (PK)      │
│ request_code │
│ blood_type   │
│ units_req    │
│ status       │
│ urgency      │
└──────────────┘
       │
       │ 1:N
       ▼
┌──────────────┐
│ issuance_    │
│ records      │
│──────────────│
│ id (PK)      │
│ request_id   │
│ inventory_id │
│ issued_date  │
└──────────────┘
```

### 6. SUPPORTING ENTITIES

```
┌──────────────┐
│ documents    │
│──────────────│
│ id (PK)      │
│ entity_type  │ ── References any entity
│ entity_id    │    (donor, stakeholder, drive, etc.)
│ doc_name     │
│ file_url     │
└──────────────┘

┌──────────────┐
│ audit_log    │
│──────────────│
│ id (PK)      │
│ user_id (FK) │ ── Tracks all system actions
│ action       │
│ entity_type  │
│ entity_id    │
│ old_values   │
│ new_values   │
│ timestamp    │
└──────────────┘
```

## Reporting Views (Read-Only)

```
┌──────────────────────────┐
│ REPORTING VIEWS          │
├──────────────────────────┤
│ • donor_activity_summary │
│   - Aggregates donor     │
│     stats & history      │
│                          │
│ • stakeholder_           │
│   performance_insights   │
│   - Drive participation  │
│     & performance        │
│                          │
│ • donation_statistics_   │
│   by_blood_type          │
│   - Monthly trends       │
│                          │
│ • mobile_drive_          │
│   performance            │
│   - Target vs achieved   │
│                          │
│ • blood_inventory_status │
│   - Current stock levels │
│                          │
│ • monthly_donation_      │
│   trends                 │
│   - Time series analysis │
│                          │
│ • user_activity_summary  │
│   - Staff performance    │
│                          │
│ • blood_request_         │
│   fulfillment_status     │
│   - Request tracking     │
└──────────────────────────┘
```

## Key Relationships Summary

### One-to-Many (1:N)
- roles → users
- users → user_tokens
- users → mobile_drives (as coordinator)
- donors → donation_records
- donation_records → test_results
- donation_records → blood_inventory
- mobile_drives → mobile_drive_staff
- mobile_drives → donation_records
- blood_requests → issuance_records
- stakeholders → stakeholder_coordinators

### Many-to-Many (M:N)
- stakeholders ↔ mobile_drives (via stakeholder_mobile_drives)
- blood_inventory ↔ blood_requests (via issuance_records)

### One-to-One (1:1)
- donation_records ↔ blood_inventory (optional)

### Referenced By Multiple (Polymorphic-style)
- addresses (referenced by donors, stakeholders, mobile_drives)
- users (referenced as coordinator, screener, phlebotomist, etc.)
- documents (references any entity via entity_type/entity_id)

## Cardinality Notation

```
│     = One
│ 1   = Exactly one
│ 1,N = One or many
│ 0,N = Zero or many
│ M:N = Many to many
```

## Constraint Types

### Primary Keys (PK)
All tables have a SERIAL PRIMARY KEY named `id` (except where noted)

### Foreign Keys (FK)
- Enforce referential integrity
- Most use CASCADE on delete for junction tables
- Others use RESTRICT to prevent orphaned data

### Check Constraints
- Blood types: A+, A-, B+, B-, AB+, AB-, O+, O-
- Statuses: specific allowed values per table
- Date ranges: end_time > start_time
- Numeric ranges: units >= 0, age > 0

### Unique Constraints
- User-facing codes (donor_code, stakeholder_code, drive_code)
- Usernames
- QR codes
- Unit numbers

## Indexes Summary

### B-Tree Indexes (Default)
- All primary keys (automatic)
- All foreign keys
- Frequently queried fields (status, dates, codes)
- Unique fields

### GIST Index
- addresses.geo_coord (for geographical queries with PostGIS)

### Multi-Column Indexes
- addresses(latitude, longitude) - for coordinate queries without PostGIS

## Data Flow Examples

### Blood Donation Process
```
1. Donor Registration
   donors → addresses

2. Mobile Drive Setup
   mobile_drives → addresses
   stakeholder_mobile_drives (M:N)
   mobile_drive_staff

3. Donation Collection
   donation_records → donors
   donation_records → mobile_drives

4. Testing
   test_results → donation_records

5. Inventory Management
   blood_inventory → donation_records

6. Request & Issuance
   blood_requests
   issuance_records → blood_requests
   issuance_records → blood_inventory
```

### Security Flow
```
1. User Authentication
   users → user_tokens
   
2. Token Validation
   Check: token_hash, is_revoked, expires_at
   
3. Permission Check
   users → roles → permissions (JSONB)
   
4. Action Logging
   audit_log ← all actions
```

## Schema Evolution Strategy

### JSON Versioning
```
roles.permissions contains:
{
  "schema_version": 1,
  "permissions": {...}
}

When structure changes:
1. Increment schema_version
2. Update application to handle both versions
3. Migrate data gradually
4. Deprecate old version
```

### Data Migration
```
Old Structure → Migration Scripts → New Structure
              ↓
        Backwards Compatible
        Transition Period
              ↓
        Old Structure Deprecated
```

## Encryption Schema

### Encrypted Fields (BYTEA)
```
Plain Text → pgp_sym_encrypt(text, key) → BYTEA storage
BYTEA storage → pgp_sym_decrypt(bytea, key) → Plain Text
```

### Hashed Fields (VARCHAR)
```
Token → encode(digest(token, 'sha256'), 'hex') → 64-char hex
```

### Key Management
- Keys stored in environment variables
- Never in database
- Rotated periodically
- Different keys per environment

## Performance Considerations

### Index Usage
- WHERE clauses: Use indexed columns
- JOIN operations: FK indexes optimize joins
- ORDER BY: Consider index on sort columns
- Geographical: GIST index for ST_DWithin

### Query Optimization
- Use views for complex aggregations
- Avoid SELECT * in production
- Limit result sets with pagination
- Use EXPLAIN ANALYZE for slow queries

### Scaling Strategies
- Partition large tables by date
- Materialized views for heavy reports
- Connection pooling
- Read replicas for reporting

---

## Tools for Visualization

To create a visual ERD from this schema:

1. **pgAdmin** (Free)
   - Connect to database
   - Right-click database → ERD For Database

2. **DBeaver** (Free)
   - ER Diagram feature
   - Database → ER Diagram

3. **dbdiagram.io** (Online)
   - Supports DBML syntax
   - Export from PostgreSQL

4. **Lucidchart** (Commercial)
   - Import PostgreSQL schema
   - Auto-generate ERD

5. **draw.io** (Free)
   - Manual creation using this description
   - Entity Relationship template

## Quick Reference

| Table | Primary Purpose | Key Relationships |
|-------|----------------|-------------------|
| addresses | Centralized location data | → donors, stakeholders, drives |
| roles | User permissions | → users |
| users | System users | → tokens, drives, donations |
| user_tokens | Authentication | ← users |
| donors | Blood donors | → addresses, donations |
| stakeholders | Organizations | → addresses, coordinators, drives |
| mobile_drives | Blood drive events | → addresses, staff, donations |
| stakeholder_mobile_drives | Junction table | ↔ stakeholders, drives |
| donation_records | Donation events | → donors, drives, inventory |
| test_results | Lab tests | → donations |
| blood_inventory | Product inventory | → donations, issuances |
| blood_requests | Blood requests | → issuances |
| issuance_records | Distribution | → requests, inventory |
| documents | File attachments | → any entity |
| audit_log | System audit trail | → users, any entity |

---

**Version:** 1.0  
**Last Updated:** 2025-01-15  
**Schema File:** bbms_schema.sql
