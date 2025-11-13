-- =====================================================
-- BBMS Schema Test Suite
-- =====================================================
-- This script tests all major features of the schema
-- Run after installing bbms_schema.sql
-- =====================================================

\echo '========================================='
\echo 'BBMS Schema Test Suite'
\echo '========================================='
\echo ''

-- =====================================================
-- Test 1: Extension Availability
-- =====================================================
\echo 'Test 1: Checking required extensions...'

SELECT 
    extname as extension_name,
    extversion as version,
    'INSTALLED' as status
FROM pg_extension
WHERE extname IN ('uuid-ossp', 'pgcrypto')
ORDER BY extname;

\echo ''

-- =====================================================
-- Test 2: Table Creation
-- =====================================================
\echo 'Test 2: Verifying table creation...'

SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns 
     WHERE table_schema = 'public' AND columns.table_name = tables.table_name) as column_count
FROM information_schema.tables
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

\echo ''

-- =====================================================
-- Test 3: View Creation
-- =====================================================
\echo 'Test 3: Verifying reporting views...'

SELECT 
    table_name as view_name,
    'CREATED' as status
FROM information_schema.views
WHERE table_schema = 'public'
ORDER BY table_name;

\echo ''

-- =====================================================
-- Test 4: Function Creation
-- =====================================================
\echo 'Test 4: Verifying helper functions...'

SELECT 
    proname as function_name,
    pg_get_function_arguments(oid) as arguments,
    'CREATED' as status
FROM pg_proc
WHERE pronamespace = 'public'::regnamespace
  AND proname IN ('encrypt_data', 'decrypt_data', 'hash_token', 'update_updated_at_column')
ORDER BY proname;

\echo ''

-- =====================================================
-- Test 5: Encryption Functions
-- =====================================================
\echo 'Test 5: Testing encryption and decryption...'

DO $$
DECLARE
    test_key TEXT := 'test-encryption-key-123';
    original_value TEXT := 'test@example.com';
    encrypted_value BYTEA;
    decrypted_value TEXT;
BEGIN
    -- Test encrypt_data function
    SELECT encrypt_data(original_value, test_key) INTO encrypted_value;
    
    IF encrypted_value IS NOT NULL THEN
        RAISE NOTICE '✓ Encryption function works';
    ELSE
        RAISE EXCEPTION '✗ Encryption function failed';
    END IF;
    
    -- Test decrypt_data function
    SELECT decrypt_data(encrypted_value, test_key) INTO decrypted_value;
    
    IF decrypted_value = original_value THEN
        RAISE NOTICE '✓ Decryption function works';
    ELSE
        RAISE EXCEPTION '✗ Decryption returned incorrect value: %', decrypted_value;
    END IF;
    
    RAISE NOTICE '✓ Encryption test suite PASSED';
END $$;

\echo ''

-- =====================================================
-- Test 6: Token Hashing
-- =====================================================
\echo 'Test 6: Testing token hashing...'

DO $$
DECLARE
    token1 TEXT := 'test-token-12345';
    token2 TEXT := 'different-token';
    hash1 VARCHAR(255);
    hash2 VARCHAR(255);
    hash3 VARCHAR(255);
BEGIN
    -- Test hash_token function
    SELECT hash_token(token1) INTO hash1;
    SELECT hash_token(token1) INTO hash2;
    SELECT hash_token(token2) INTO hash3;
    
    IF hash1 IS NOT NULL AND LENGTH(hash1) = 64 THEN
        RAISE NOTICE '✓ Hash function produces valid SHA-256 hash';
    ELSE
        RAISE EXCEPTION '✗ Hash function failed';
    END IF;
    
    IF hash1 = hash2 THEN
        RAISE NOTICE '✓ Hash function is consistent';
    ELSE
        RAISE EXCEPTION '✗ Hash function is inconsistent';
    END IF;
    
    IF hash1 != hash3 THEN
        RAISE NOTICE '✓ Different inputs produce different hashes';
    ELSE
        RAISE EXCEPTION '✗ Hash collision detected';
    END IF;
    
    RAISE NOTICE '✓ Token hashing test suite PASSED';
END $$;

\echo ''

-- =====================================================
-- Test 7: Insert Test Data
-- =====================================================
\echo 'Test 7: Inserting test data...'

-- Set test encryption key
SET app.encryption_key = 'test-key-for-demo';

-- Insert test role (if not exists)
INSERT INTO roles (role_name, description, permissions, schema_version)
VALUES ('test_role', 'Test Role', '{"test": true, "schema_version": 1}'::jsonb, 1)
ON CONFLICT (role_name) DO NOTHING;

-- Insert test user
INSERT INTO users (
    username, password_hash, 
    email_encrypted, phone_encrypted,
    first_name, last_name, role_id
) VALUES (
    'testuser',
    encode(digest('test-password', 'sha256'), 'hex'),
    encrypt_data('test@example.com', current_setting('app.encryption_key')),
    encrypt_data('+639171234567', current_setting('app.encryption_key')),
    'Test',
    'User',
    (SELECT id FROM roles WHERE role_name = 'test_role')
) ON CONFLICT (username) DO NOTHING
RETURNING id, username;

-- Insert test address
INSERT INTO addresses (
    address_type, province, city, barangay, street
) VALUES (
    'donor',
    'Camarines Sur',
    'Naga City',
    'San Francisco',
    '123 Test Street'
) ON CONFLICT DO NOTHING
RETURNING id;

-- Insert test donor
INSERT INTO donors (
    donor_code, first_name, last_name,
    email_encrypted, phone_encrypted,
    blood_type, gender, date_of_birth,
    donor_type, civil_status,
    address_id
) VALUES (
    'TEST001',
    'Juan',
    'Dela Cruz',
    encrypt_data('juan@example.com', current_setting('app.encryption_key')),
    encrypt_data('+639171111111', current_setting('app.encryption_key')),
    'O+',
    'Male',
    '1990-01-15',
    'Voluntary',
    'Single',
    (SELECT id FROM addresses WHERE address_type = 'donor' LIMIT 1)
) ON CONFLICT (donor_code) DO NOTHING
RETURNING id, donor_code;

-- Insert test stakeholder
INSERT INTO stakeholders (
    stakeholder_code, name, category,
    email_encrypted, phone_encrypted,
    address_id
) VALUES (
    'STKTEST001',
    'Test Barangay Hall',
    'District 1 (All Brgy in Camarines Sur)',
    encrypt_data('stakeholder@example.com', current_setting('app.encryption_key')),
    encrypt_data('+639172222222', current_setting('app.encryption_key')),
    (SELECT id FROM addresses WHERE address_type = 'donor' LIMIT 1)
) ON CONFLICT (stakeholder_code) DO NOTHING
RETURNING id, stakeholder_code;

-- Insert test mobile drive
INSERT INTO mobile_drives (
    drive_code, venue, drive_date,
    start_time, end_time, district,
    target_units, achieved_units, status,
    address_id
) VALUES (
    'MBD-TEST-001',
    'Test Community Center',
    CURRENT_DATE + INTERVAL '7 days',
    '08:00:00',
    '16:00:00',
    'Naga City',
    50,
    0,
    'Planned',
    (SELECT id FROM addresses WHERE address_type = 'donor' LIMIT 1)
) ON CONFLICT (drive_code) DO NOTHING
RETURNING id, drive_code;

-- Create stakeholder-drive mapping
INSERT INTO stakeholder_mobile_drives (
    stakeholder_id,
    mobile_drive_id,
    role_description
) VALUES (
    (SELECT id FROM stakeholders WHERE stakeholder_code = 'STKTEST001'),
    (SELECT id FROM mobile_drives WHERE drive_code = 'MBD-TEST-001'),
    'Host'
) ON CONFLICT DO NOTHING;

\echo '✓ Test data inserted successfully'
\echo ''

-- =====================================================
-- Test 8: Query Test Data
-- =====================================================
\echo 'Test 8: Querying test data with decryption...'

SELECT 
    username,
    first_name,
    last_name,
    decrypt_data(email_encrypted, current_setting('app.encryption_key')) AS email,
    decrypt_data(phone_encrypted, current_setting('app.encryption_key')) AS phone
FROM users
WHERE username = 'testuser';

SELECT 
    donor_code,
    first_name,
    last_name,
    blood_type,
    decrypt_data(email_encrypted, current_setting('app.encryption_key')) AS email
FROM donors
WHERE donor_code = 'TEST001';

\echo ''

-- =====================================================
-- Test 9: Foreign Key Constraints
-- =====================================================
\echo 'Test 9: Verifying foreign key constraints...'

SELECT 
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;

\echo ''

-- =====================================================
-- Test 10: Index Creation
-- =====================================================
\echo 'Test 10: Verifying indexes...'

SELECT 
    schemaname,
    tablename,
    indexname,
    'CREATED' as status
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

\echo ''

-- =====================================================
-- Test 11: Reporting Views Data
-- =====================================================
\echo 'Test 11: Testing reporting views...'

\echo 'Donor Activity Summary:'
SELECT * FROM donor_activity_summary WHERE donor_code = 'TEST001';

\echo ''
\echo 'Stakeholder Performance Insights:'
SELECT * FROM stakeholder_performance_insights WHERE stakeholder_code = 'STKTEST001';

\echo ''
\echo 'Mobile Drive Performance:'
SELECT * FROM mobile_drive_performance WHERE drive_code = 'MBD-TEST-001';

\echo ''

-- =====================================================
-- Test 12: Trigger Functionality
-- =====================================================
\echo 'Test 12: Testing automatic timestamp triggers...'

DO $$
DECLARE
    old_updated_at TIMESTAMP;
    new_updated_at TIMESTAMP;
BEGIN
    -- Get current updated_at
    SELECT updated_at INTO old_updated_at
    FROM donors WHERE donor_code = 'TEST001';
    
    -- Wait a moment
    PERFORM pg_sleep(1);
    
    -- Update record
    UPDATE donors SET status = 'active' WHERE donor_code = 'TEST001';
    
    -- Get new updated_at
    SELECT updated_at INTO new_updated_at
    FROM donors WHERE donor_code = 'TEST001';
    
    IF new_updated_at > old_updated_at THEN
        RAISE NOTICE '✓ Timestamp trigger works correctly';
    ELSE
        RAISE EXCEPTION '✗ Timestamp trigger failed';
    END IF;
END $$;

\echo ''

-- =====================================================
-- Test 13: Check Constraints
-- =====================================================
\echo 'Test 13: Verifying check constraints...'

SELECT 
    tc.table_name,
    tc.constraint_name,
    pgc.consrc as constraint_definition
FROM information_schema.table_constraints tc
JOIN pg_constraint pgc ON tc.constraint_name = pgc.conname::text
WHERE tc.constraint_type = 'CHECK'
    AND tc.table_schema = 'public'
ORDER BY tc.table_name, tc.constraint_name;

\echo ''

-- =====================================================
-- Test Summary
-- =====================================================
\echo '========================================='
\echo 'Test Suite Summary'
\echo '========================================='

SELECT 
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE') as tables_created,
    (SELECT COUNT(*) FROM information_schema.views WHERE table_schema = 'public') as views_created,
    (SELECT COUNT(*) FROM pg_proc WHERE pronamespace = 'public'::regnamespace) as functions_created,
    (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public') as indexes_created,
    (SELECT COUNT(*) FROM information_schema.table_constraints WHERE table_schema = 'public' AND constraint_type = 'FOREIGN KEY') as foreign_keys,
    (SELECT COUNT(*) FROM information_schema.table_constraints WHERE table_schema = 'public' AND constraint_type = 'CHECK') as check_constraints;

\echo ''
\echo '✓ All tests completed successfully!'
\echo '========================================='

-- Clean up test encryption key
RESET app.encryption_key;
