-- =====================================================
-- Blood Bank Management System (BBMS) Database Schema
-- =====================================================
-- This schema incorporates enhanced features including:
-- 1. Many-to-many mappings for stakeholders and mobile drives
-- 2. Centralized address management
-- 3. Encrypted sensitive data fields
-- 4. Enhanced token security with revocation support
-- 5. JSON field versioning
-- 6. Geographical data integration
-- 7. Reporting views for analytics
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";      -- For UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";       -- For encryption and hashing
CREATE EXTENSION IF NOT EXISTS "postgis";        -- For geographical data types

-- =====================================================
-- 1. CENTRALIZED ADDRESS TABLE
-- =====================================================
CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    address_type VARCHAR(50) NOT NULL, -- 'donor', 'stakeholder', 'mobile_drive', 'other'
    province VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    barangay VARCHAR(100),
    street VARCHAR(255),
    postal_code VARCHAR(20),
    geo_coord GEOGRAPHY(POINT, 4326), -- Geographical coordinates for location tracking
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_address_type CHECK (address_type IN ('donor', 'stakeholder', 'mobile_drive', 'other'))
);

-- Index for geographical queries
CREATE INDEX idx_addresses_geo_coord ON addresses USING GIST(geo_coord);
CREATE INDEX idx_addresses_type ON addresses(address_type);
CREATE INDEX idx_addresses_province ON addresses(province);
CREATE INDEX idx_addresses_city ON addresses(city);

-- =====================================================
-- 2. ROLES TABLE WITH VERSIONING
-- =====================================================
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    permissions JSONB NOT NULL DEFAULT '{}', -- JSON field for flexible permissions
    schema_version INTEGER NOT NULL DEFAULT 1, -- Versioning for JSON schema
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default roles
INSERT INTO roles (role_name, description, permissions, schema_version) VALUES
('admin', 'System Administrator', '{"all": true, "schema_version": 1}', 1),
('doctor', 'Medical Doctor', '{"view_donors": true, "approve_donations": true, "view_reports": true, "schema_version": 1}', 1),
('nurse', 'Registered Nurse', '{"view_donors": true, "register_donors": true, "conduct_screening": true, "schema_version": 1}', 1),
('technician', 'Laboratory Technician', '{"view_inventory": true, "process_blood": true, "conduct_tests": true, "schema_version": 1}', 1),
('coordinator', 'Blood Drive Coordinator', '{"manage_drives": true, "view_stakeholders": true, "schedule_events": true, "schema_version": 1}', 1),
('staff', 'General Staff', '{"view_basic": true, "schema_version": 1}', 1);

CREATE INDEX idx_roles_name ON roles(role_name);
CREATE INDEX idx_roles_active ON roles(is_active);

-- =====================================================
-- 3. USERS TABLE WITH ENCRYPTED SENSITIVE DATA
-- =====================================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL, -- Hashed password
    email_encrypted BYTEA NOT NULL, -- Encrypted email
    phone_encrypted BYTEA, -- Encrypted phone number
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role_id INTEGER NOT NULL REFERENCES roles(id),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    failed_login_attempts INTEGER DEFAULT 0,
    account_locked_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_failed_attempts CHECK (failed_login_attempts >= 0)
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role_id);
CREATE INDEX idx_users_active ON users(is_active);

-- =====================================================
-- 4. ENHANCED USER TOKENS TABLE
-- =====================================================
CREATE TABLE user_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE, -- Hashed token for security
    token_type VARCHAR(50) NOT NULL DEFAULT 'auth', -- 'auth', 'refresh', 'reset', 'verify'
    device_info JSONB, -- Store device information (browser, OS, IP, etc.)
    is_revoked BOOLEAN DEFAULT FALSE,
    revoked_at TIMESTAMP,
    revoked_reason TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP,
    CONSTRAINT chk_token_type CHECK (token_type IN ('auth', 'refresh', 'reset', 'verify'))
);

CREATE INDEX idx_user_tokens_user ON user_tokens(user_id);
CREATE INDEX idx_user_tokens_hash ON user_tokens(token_hash);
CREATE INDEX idx_user_tokens_revoked ON user_tokens(is_revoked);
CREATE INDEX idx_user_tokens_expires ON user_tokens(expires_at);

-- =====================================================
-- 5. DONORS TABLE WITH ENCRYPTED SENSITIVE DATA
-- =====================================================
CREATE TABLE donors (
    id SERIAL PRIMARY KEY,
    donor_code VARCHAR(50) NOT NULL UNIQUE, -- e.g., D2508012345
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    date_of_birth DATE NOT NULL,
    age INTEGER,
    gender VARCHAR(20) NOT NULL,
    civil_status VARCHAR(50) NOT NULL,
    blood_type VARCHAR(5) NOT NULL,
    donor_type VARCHAR(50) NOT NULL, -- 'Voluntary', 'Replacement', 'Walk-in', 'Repeat'
    id_number_encrypted BYTEA, -- Encrypted ID number (passport, driver's license, etc.)
    id_type VARCHAR(50), -- Type of ID
    email_encrypted BYTEA, -- Encrypted email
    phone_encrypted BYTEA NOT NULL, -- Encrypted phone number
    address_id INTEGER REFERENCES addresses(id),
    is_first_time BOOLEAN DEFAULT TRUE,
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'deferred', 'inactive'
    eligibility_status VARCHAR(50) DEFAULT 'eligible', -- 'eligible', 'temporarily_deferred', 'permanently_deferred'
    deferral_reason TEXT,
    deferral_type VARCHAR(20), -- 'temporary', 'permanent'
    deferral_until DATE,
    last_donation_date DATE,
    next_eligible_date DATE,
    total_donations INTEGER DEFAULT 0,
    registration_date DATE DEFAULT CURRENT_DATE,
    qr_code VARCHAR(255) UNIQUE, -- QR code for quick identification
    photo_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_gender CHECK (gender IN ('Male', 'Female', 'Other')),
    CONSTRAINT chk_civil_status CHECK (civil_status IN ('Single', 'Single with Partner', 'Married', 'Widow', 'Separated', 'Divorced')),
    CONSTRAINT chk_blood_type CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    CONSTRAINT chk_donor_type CHECK (donor_type IN ('Voluntary', 'Replacement', 'Walk-in', 'Repeat')),
    CONSTRAINT chk_status CHECK (status IN ('active', 'deferred', 'inactive')),
    CONSTRAINT chk_eligibility CHECK (eligibility_status IN ('eligible', 'temporarily_deferred', 'permanently_deferred')),
    CONSTRAINT chk_deferral_type CHECK (deferral_type IS NULL OR deferral_type IN ('temporary', 'permanent')),
    CONSTRAINT chk_total_donations CHECK (total_donations >= 0)
);

CREATE INDEX idx_donors_code ON donors(donor_code);
CREATE INDEX idx_donors_blood_type ON donors(blood_type);
CREATE INDEX idx_donors_status ON donors(status);
CREATE INDEX idx_donors_eligibility ON donors(eligibility_status);
CREATE INDEX idx_donors_address ON donors(address_id);
CREATE INDEX idx_donors_next_eligible ON donors(next_eligible_date);

-- =====================================================
-- 6. STAKEHOLDERS TABLE WITH ENCRYPTED SENSITIVE DATA
-- =====================================================
CREATE TABLE stakeholders (
    id SERIAL PRIMARY KEY,
    stakeholder_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL, -- LGU, Hospital, NGO, etc.
    address_id INTEGER REFERENCES addresses(id),
    email_encrypted BYTEA,
    phone_encrypted BYTEA,
    website VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Active', -- 'Active', 'Inactive', 'Prospect'
    total_donations INTEGER DEFAULT 0,
    last_activity_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_stakeholder_status CHECK (status IN ('Active', 'Inactive', 'Prospect')),
    CONSTRAINT chk_stakeholder_donations CHECK (total_donations >= 0)
);

CREATE INDEX idx_stakeholders_code ON stakeholders(stakeholder_code);
CREATE INDEX idx_stakeholders_category ON stakeholders(category);
CREATE INDEX idx_stakeholders_status ON stakeholders(status);
CREATE INDEX idx_stakeholders_address ON stakeholders(address_id);

-- =====================================================
-- 7. STAKEHOLDER COORDINATORS
-- =====================================================
CREATE TABLE stakeholder_coordinators (
    id SERIAL PRIMARY KEY,
    stakeholder_id INTEGER NOT NULL REFERENCES stakeholders(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    designation VARCHAR(255),
    contact_encrypted BYTEA, -- Encrypted contact number
    email_encrypted BYTEA, -- Encrypted email
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_coordinators_stakeholder ON stakeholder_coordinators(stakeholder_id);
CREATE INDEX idx_coordinators_primary ON stakeholder_coordinators(is_primary);

-- =====================================================
-- 8. MOBILE BLOOD DRIVES (MBD) TABLE
-- =====================================================
CREATE TABLE mobile_drives (
    id SERIAL PRIMARY KEY,
    drive_code VARCHAR(50) NOT NULL UNIQUE,
    venue VARCHAR(255) NOT NULL,
    address_id INTEGER REFERENCES addresses(id),
    drive_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    district VARCHAR(100),
    target_units INTEGER NOT NULL,
    achieved_units INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Planned', -- 'Planned', 'Confirmed', 'Completed', 'Cancelled'
    coordinator_user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_drive_status CHECK (status IN ('Planned', 'Confirmed', 'In Progress', 'Completed', 'Cancelled')),
    CONSTRAINT chk_target_units CHECK (target_units > 0),
    CONSTRAINT chk_achieved_units CHECK (achieved_units >= 0),
    CONSTRAINT chk_time_range CHECK (end_time > start_time)
);

CREATE INDEX idx_mobile_drives_code ON mobile_drives(drive_code);
CREATE INDEX idx_mobile_drives_date ON mobile_drives(drive_date);
CREATE INDEX idx_mobile_drives_status ON mobile_drives(status);
CREATE INDEX idx_mobile_drives_address ON mobile_drives(address_id);
CREATE INDEX idx_mobile_drives_coordinator ON mobile_drives(coordinator_user_id);

-- =====================================================
-- 9. MANY-TO-MANY: STAKEHOLDERS AND MOBILE DRIVES
-- =====================================================
CREATE TABLE stakeholder_mobile_drives (
    id SERIAL PRIMARY KEY,
    stakeholder_id INTEGER NOT NULL REFERENCES stakeholders(id) ON DELETE CASCADE,
    mobile_drive_id INTEGER NOT NULL REFERENCES mobile_drives(id) ON DELETE CASCADE,
    role_description VARCHAR(255), -- e.g., 'Host', 'Co-organizer', 'Sponsor'
    contribution_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(stakeholder_id, mobile_drive_id)
);

CREATE INDEX idx_stakeholder_drives_stakeholder ON stakeholder_mobile_drives(stakeholder_id);
CREATE INDEX idx_stakeholder_drives_drive ON stakeholder_mobile_drives(mobile_drive_id);

-- =====================================================
-- 10. MOBILE DRIVE STAFF ASSIGNMENTS
-- =====================================================
CREATE TABLE mobile_drive_staff (
    id SERIAL PRIMARY KEY,
    mobile_drive_id INTEGER NOT NULL REFERENCES mobile_drives(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id),
    staff_role VARCHAR(100) NOT NULL, -- 'Team Leader', 'Screener', 'Phlebotomist', etc.
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(mobile_drive_id, user_id, staff_role)
);

CREATE INDEX idx_drive_staff_drive ON mobile_drive_staff(mobile_drive_id);
CREATE INDEX idx_drive_staff_user ON mobile_drive_staff(user_id);

-- =====================================================
-- 11. DONATION RECORDS
-- =====================================================
CREATE TABLE donation_records (
    id SERIAL PRIMARY KEY,
    donation_code VARCHAR(50) NOT NULL UNIQUE,
    donor_id INTEGER NOT NULL REFERENCES donors(id),
    mobile_drive_id INTEGER REFERENCES mobile_drives(id),
    donation_date DATE NOT NULL,
    venue VARCHAR(255) NOT NULL,
    unit_number VARCHAR(50) UNIQUE,
    bag_type VARCHAR(50) NOT NULL, -- '450mL', '350mL', 'Apheresis'
    blood_type VARCHAR(5) NOT NULL,
    outcome VARCHAR(50) NOT NULL, -- 'Accepted', 'QNS', 'Deferred'
    deferral_reason TEXT,
    screening_notes TEXT,
    screener_user_id INTEGER REFERENCES users(id),
    phlebotomist_user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_bag_type CHECK (bag_type IN ('450mL', '350mL', 'Apheresis')),
    CONSTRAINT chk_donation_blood_type CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    CONSTRAINT chk_outcome CHECK (outcome IN ('Accepted', 'QNS', 'Deferred', 'Rejected'))
);

CREATE INDEX idx_donation_records_donor ON donation_records(donor_id);
CREATE INDEX idx_donation_records_drive ON donation_records(mobile_drive_id);
CREATE INDEX idx_donation_records_date ON donation_records(donation_date);
CREATE INDEX idx_donation_records_outcome ON donation_records(outcome);
CREATE INDEX idx_donation_records_code ON donation_records(donation_code);

-- =====================================================
-- 12. TEST RESULTS
-- =====================================================
CREATE TABLE test_results (
    id SERIAL PRIMARY KEY,
    donation_id INTEGER NOT NULL REFERENCES donation_records(id) ON DELETE CASCADE,
    test_type VARCHAR(100) NOT NULL, -- 'HIV', 'Hepatitis B', 'Hepatitis C', 'Syphilis', etc.
    result VARCHAR(50) NOT NULL, -- 'Reactive', 'Non-Reactive', 'Pending', 'Inconclusive'
    tested_date DATE NOT NULL,
    tested_by_user_id INTEGER REFERENCES users(id),
    verified_by_user_id INTEGER REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_test_result CHECK (result IN ('Reactive', 'Non-Reactive', 'Pending', 'Inconclusive'))
);

CREATE INDEX idx_test_results_donation ON test_results(donation_id);
CREATE INDEX idx_test_results_type ON test_results(test_type);
CREATE INDEX idx_test_results_result ON test_results(result);

-- =====================================================
-- 13. BLOOD INVENTORY
-- =====================================================
CREATE TABLE blood_inventory (
    id SERIAL PRIMARY KEY,
    unit_number VARCHAR(50) NOT NULL UNIQUE,
    donation_id INTEGER REFERENCES donation_records(id),
    blood_type VARCHAR(5) NOT NULL,
    component_type VARCHAR(100) NOT NULL, -- 'Whole Blood', 'RBC', 'Plasma', 'Platelets', etc.
    volume_ml INTEGER NOT NULL,
    collection_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'Available', -- 'Available', 'Reserved', 'Issued', 'Expired', 'Discarded'
    location VARCHAR(100), -- Storage location
    temperature_log JSONB, -- JSON log of temperature readings
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_inventory_blood_type CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    CONSTRAINT chk_component_type CHECK (component_type IN ('Whole Blood', 'RBC', 'Plasma', 'Platelets', 'Cryoprecipitate', 'FFP')),
    CONSTRAINT chk_inventory_status CHECK (status IN ('Available', 'Reserved', 'Issued', 'Expired', 'Discarded', 'Quarantined')),
    CONSTRAINT chk_volume CHECK (volume_ml > 0)
);

CREATE INDEX idx_inventory_unit ON blood_inventory(unit_number);
CREATE INDEX idx_inventory_blood_type ON blood_inventory(blood_type);
CREATE INDEX idx_inventory_status ON blood_inventory(status);
CREATE INDEX idx_inventory_expiry ON blood_inventory(expiry_date);
CREATE INDEX idx_inventory_component ON blood_inventory(component_type);

-- =====================================================
-- 14. BLOOD REQUESTS
-- =====================================================
CREATE TABLE blood_requests (
    id SERIAL PRIMARY KEY,
    request_code VARCHAR(50) NOT NULL UNIQUE,
    requester_name VARCHAR(255) NOT NULL,
    requester_contact_encrypted BYTEA,
    hospital_name VARCHAR(255),
    patient_name_encrypted BYTEA, -- Encrypted for privacy
    blood_type VARCHAR(5) NOT NULL,
    component_type VARCHAR(100) NOT NULL,
    units_requested INTEGER NOT NULL,
    units_issued INTEGER DEFAULT 0,
    urgency VARCHAR(50) NOT NULL, -- 'Emergency', 'Urgent', 'Routine'
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    required_by_date DATE,
    status VARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'Approved', 'Partially Fulfilled', 'Fulfilled', 'Cancelled'
    approved_by_user_id INTEGER REFERENCES users(id),
    issued_by_user_id INTEGER REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_request_blood_type CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    CONSTRAINT chk_request_component CHECK (component_type IN ('Whole Blood', 'RBC', 'Plasma', 'Platelets', 'Cryoprecipitate', 'FFP')),
    CONSTRAINT chk_urgency CHECK (urgency IN ('Emergency', 'Urgent', 'Routine')),
    CONSTRAINT chk_request_status CHECK (status IN ('Pending', 'Approved', 'Partially Fulfilled', 'Fulfilled', 'Cancelled', 'Rejected')),
    CONSTRAINT chk_units_requested CHECK (units_requested > 0),
    CONSTRAINT chk_units_issued CHECK (units_issued >= 0)
);

CREATE INDEX idx_blood_requests_code ON blood_requests(request_code);
CREATE INDEX idx_blood_requests_status ON blood_requests(status);
CREATE INDEX idx_blood_requests_urgency ON blood_requests(urgency);
CREATE INDEX idx_blood_requests_blood_type ON blood_requests(blood_type);

-- =====================================================
-- 15. ISSUANCE RECORDS
-- =====================================================
CREATE TABLE issuance_records (
    id SERIAL PRIMARY KEY,
    request_id INTEGER NOT NULL REFERENCES blood_requests(id),
    inventory_id INTEGER NOT NULL REFERENCES blood_inventory(id),
    issued_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    issued_by_user_id INTEGER NOT NULL REFERENCES users(id),
    received_by VARCHAR(255) NOT NULL,
    notes TEXT,
    UNIQUE(request_id, inventory_id)
);

CREATE INDEX idx_issuance_request ON issuance_records(request_id);
CREATE INDEX idx_issuance_inventory ON issuance_records(inventory_id);
CREATE INDEX idx_issuance_date ON issuance_records(issued_date);

-- =====================================================
-- 16. DOCUMENTS/ATTACHMENTS
-- =====================================================
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL, -- 'donor', 'stakeholder', 'mobile_drive', 'donation'
    entity_id INTEGER NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    document_type VARCHAR(100) NOT NULL, -- 'ID', 'Medical Certificate', 'Consent Form', etc.
    file_url VARCHAR(500) NOT NULL,
    file_size_kb INTEGER,
    mime_type VARCHAR(100),
    uploaded_by_user_id INTEGER REFERENCES users(id),
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    CONSTRAINT chk_entity_type CHECK (entity_type IN ('donor', 'stakeholder', 'mobile_drive', 'donation', 'request', 'other'))
);

CREATE INDEX idx_documents_entity ON documents(entity_type, entity_id);
CREATE INDEX idx_documents_type ON documents(document_type);

-- =====================================================
-- 17. AUDIT LOG
-- =====================================================
CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', etc.
    entity_type VARCHAR(50) NOT NULL,
    entity_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_action ON audit_log(action);
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_timestamp ON audit_log(timestamp);

-- =====================================================
-- HELPER FUNCTIONS FOR ENCRYPTION/DECRYPTION
-- =====================================================

-- Function to encrypt sensitive data
CREATE OR REPLACE FUNCTION encrypt_data(data TEXT, encryption_key TEXT)
RETURNS BYTEA AS $$
BEGIN
    RETURN pgp_sym_encrypt(data, encryption_key);
END;
$$ LANGUAGE plpgsql;

-- Function to decrypt sensitive data
CREATE OR REPLACE FUNCTION decrypt_data(encrypted_data BYTEA, encryption_key TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN pgp_sym_decrypt(encrypted_data, encryption_key);
END;
$$ LANGUAGE plpgsql;

-- Function to hash tokens
CREATE OR REPLACE FUNCTION hash_token(token TEXT)
RETURNS VARCHAR(255) AS $$
BEGIN
    RETURN encode(digest(token, 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS FOR AUTOMATIC TIMESTAMP UPDATES
-- =====================================================

-- Generic function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all relevant tables
CREATE TRIGGER update_addresses_timestamp BEFORE UPDATE ON addresses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_roles_timestamp BEFORE UPDATE ON roles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_timestamp BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_donors_timestamp BEFORE UPDATE ON donors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stakeholders_timestamp BEFORE UPDATE ON stakeholders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coordinators_timestamp BEFORE UPDATE ON stakeholder_coordinators
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mobile_drives_timestamp BEFORE UPDATE ON mobile_drives
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_donation_records_timestamp BEFORE UPDATE ON donation_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_test_results_timestamp BEFORE UPDATE ON test_results
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_timestamp BEFORE UPDATE ON blood_inventory
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_requests_timestamp BEFORE UPDATE ON blood_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- REPORTING VIEWS
-- =====================================================

-- View 1: Donor Activity Summary
CREATE OR REPLACE VIEW donor_activity_summary AS
SELECT 
    d.id,
    d.donor_code,
    d.first_name || ' ' || d.last_name AS donor_name,
    d.blood_type,
    d.donor_type,
    d.status,
    d.eligibility_status,
    d.total_donations,
    d.last_donation_date,
    d.next_eligible_date,
    d.registration_date,
    COUNT(dr.id) AS verified_donation_count,
    MAX(dr.donation_date) AS most_recent_donation,
    MIN(dr.donation_date) AS first_donation_date,
    ROUND(AVG(CASE WHEN dr.outcome = 'Accepted' THEN 1 ELSE 0 END) * 100, 2) AS acceptance_rate,
    a.province,
    a.city,
    a.barangay
FROM donors d
LEFT JOIN donation_records dr ON d.id = dr.donor_id
LEFT JOIN addresses a ON d.address_id = a.id
GROUP BY d.id, d.donor_code, d.first_name, d.last_name, d.blood_type, d.donor_type, 
         d.status, d.eligibility_status, d.total_donations, d.last_donation_date, 
         d.next_eligible_date, d.registration_date, a.province, a.city, a.barangay;

-- View 2: Stakeholder Performance Insights
CREATE OR REPLACE VIEW stakeholder_performance_insights AS
SELECT 
    s.id,
    s.stakeholder_code,
    s.name AS stakeholder_name,
    s.category,
    s.status,
    s.total_donations,
    s.last_activity_date,
    COUNT(DISTINCT smd.mobile_drive_id) AS total_drives_participated,
    COUNT(DISTINCT CASE WHEN md.status = 'Completed' THEN smd.mobile_drive_id END) AS completed_drives,
    SUM(CASE WHEN md.status = 'Completed' THEN md.achieved_units ELSE 0 END) AS total_units_collected,
    AVG(CASE WHEN md.status = 'Completed' THEN md.achieved_units ELSE NULL END) AS avg_units_per_drive,
    MAX(md.drive_date) AS last_drive_date,
    a.province,
    a.city
FROM stakeholders s
LEFT JOIN stakeholder_mobile_drives smd ON s.id = smd.stakeholder_id
LEFT JOIN mobile_drives md ON smd.mobile_drive_id = md.id
LEFT JOIN addresses a ON s.address_id = a.id
GROUP BY s.id, s.stakeholder_code, s.name, s.category, s.status, 
         s.total_donations, s.last_activity_date, a.province, a.city;

-- View 3: Donation Statistics by Blood Type
CREATE OR REPLACE VIEW donation_statistics_by_blood_type AS
SELECT 
    blood_type,
    COUNT(*) AS total_donations,
    COUNT(CASE WHEN outcome = 'Accepted' THEN 1 END) AS accepted_donations,
    COUNT(CASE WHEN outcome = 'QNS' THEN 1 END) AS qns_donations,
    COUNT(CASE WHEN outcome = 'Deferred' THEN 1 END) AS deferred_donations,
    ROUND(COUNT(CASE WHEN outcome = 'Accepted' THEN 1 END)::NUMERIC / COUNT(*)::NUMERIC * 100, 2) AS acceptance_rate,
    DATE_TRUNC('month', donation_date) AS month,
    EXTRACT(YEAR FROM donation_date) AS year
FROM donation_records
GROUP BY blood_type, DATE_TRUNC('month', donation_date), EXTRACT(YEAR FROM donation_date)
ORDER BY year DESC, month DESC, blood_type;

-- View 4: Mobile Drive Performance
CREATE OR REPLACE VIEW mobile_drive_performance AS
SELECT 
    md.id,
    md.drive_code,
    md.venue,
    md.drive_date,
    md.district,
    md.status,
    md.target_units,
    md.achieved_units,
    ROUND((md.achieved_units::NUMERIC / md.target_units::NUMERIC * 100), 2) AS achievement_percentage,
    COUNT(DISTINCT dr.id) AS total_donors,
    COUNT(CASE WHEN dr.outcome = 'Accepted' THEN 1 END) AS successful_donations,
    COUNT(DISTINCT smd.stakeholder_id) AS stakeholder_count,
    STRING_AGG(DISTINCT s.name, ', ') AS stakeholder_names,
    u.first_name || ' ' || u.last_name AS coordinator_name,
    a.province,
    a.city
FROM mobile_drives md
LEFT JOIN donation_records dr ON md.id = dr.mobile_drive_id
LEFT JOIN stakeholder_mobile_drives smd ON md.id = smd.mobile_drive_id
LEFT JOIN stakeholders s ON smd.stakeholder_id = s.id
LEFT JOIN users u ON md.coordinator_user_id = u.id
LEFT JOIN addresses a ON md.address_id = a.id
GROUP BY md.id, md.drive_code, md.venue, md.drive_date, md.district, md.status,
         md.target_units, md.achieved_units, u.first_name, u.last_name, a.province, a.city;

-- View 5: Blood Inventory Status
CREATE OR REPLACE VIEW blood_inventory_status AS
SELECT 
    blood_type,
    component_type,
    COUNT(*) AS total_units,
    COUNT(CASE WHEN status = 'Available' THEN 1 END) AS available_units,
    COUNT(CASE WHEN status = 'Reserved' THEN 1 END) AS reserved_units,
    COUNT(CASE WHEN status = 'Issued' THEN 1 END) AS issued_units,
    COUNT(CASE WHEN status = 'Expired' THEN 1 END) AS expired_units,
    SUM(CASE WHEN status = 'Available' THEN volume_ml ELSE 0 END) AS available_volume_ml,
    MIN(CASE WHEN status = 'Available' THEN expiry_date END) AS earliest_expiry,
    COUNT(CASE WHEN status = 'Available' AND expiry_date <= CURRENT_DATE + INTERVAL '7 days' THEN 1 END) AS expiring_soon_count
FROM blood_inventory
GROUP BY blood_type, component_type
ORDER BY blood_type, component_type;

-- View 6: Monthly Donation Trends
CREATE OR REPLACE VIEW monthly_donation_trends AS
SELECT 
    DATE_TRUNC('month', donation_date) AS month,
    EXTRACT(YEAR FROM donation_date) AS year,
    EXTRACT(MONTH FROM donation_date) AS month_number,
    COUNT(*) AS total_donations,
    COUNT(CASE WHEN outcome = 'Accepted' THEN 1 END) AS accepted_donations,
    COUNT(DISTINCT donor_id) AS unique_donors,
    COUNT(DISTINCT mobile_drive_id) AS total_drives,
    STRING_AGG(DISTINCT blood_type, ', ') AS blood_types_collected
FROM donation_records
GROUP BY DATE_TRUNC('month', donation_date), EXTRACT(YEAR FROM donation_date), EXTRACT(MONTH FROM donation_date)
ORDER BY year DESC, month_number DESC;

-- View 7: User Activity Summary
CREATE OR REPLACE VIEW user_activity_summary AS
SELECT 
    u.id,
    u.username,
    u.first_name || ' ' || u.last_name AS full_name,
    r.role_name,
    u.is_active,
    u.last_login,
    u.created_at AS account_created,
    COUNT(DISTINCT dr.id) AS donations_screened,
    COUNT(DISTINCT md.id) AS drives_coordinated,
    COUNT(DISTINCT al.id) AS total_actions
FROM users u
LEFT JOIN roles r ON u.role_id = r.id
LEFT JOIN donation_records dr ON u.id = dr.screener_user_id
LEFT JOIN mobile_drives md ON u.id = md.coordinator_user_id
LEFT JOIN audit_log al ON u.id = al.user_id
GROUP BY u.id, u.username, u.first_name, u.last_name, r.role_name, 
         u.is_active, u.last_login, u.created_at;

-- View 8: Blood Request Fulfillment Status
CREATE OR REPLACE VIEW blood_request_fulfillment_status AS
SELECT 
    br.id,
    br.request_code,
    br.requester_name,
    br.hospital_name,
    br.blood_type,
    br.component_type,
    br.units_requested,
    br.units_issued,
    br.urgency,
    br.status,
    br.request_date,
    br.required_by_date,
    ROUND((br.units_issued::NUMERIC / br.units_requested::NUMERIC * 100), 2) AS fulfillment_percentage,
    CASE 
        WHEN br.status = 'Fulfilled' THEN 'Complete'
        WHEN br.required_by_date < CURRENT_DATE AND br.status NOT IN ('Fulfilled', 'Cancelled') THEN 'Overdue'
        WHEN br.required_by_date <= CURRENT_DATE + INTERVAL '2 days' AND br.status = 'Pending' THEN 'Critical'
        ELSE 'On Track'
    END AS fulfillment_status,
    u1.first_name || ' ' || u1.last_name AS approved_by,
    u2.first_name || ' ' || u2.last_name AS issued_by,
    COUNT(ir.id) AS issuance_count
FROM blood_requests br
LEFT JOIN users u1 ON br.approved_by_user_id = u1.id
LEFT JOIN users u2 ON br.issued_by_user_id = u2.id
LEFT JOIN issuance_records ir ON br.id = ir.request_id
GROUP BY br.id, br.request_code, br.requester_name, br.hospital_name, br.blood_type,
         br.component_type, br.units_requested, br.units_issued, br.urgency, br.status,
         br.request_date, br.required_by_date, u1.first_name, u1.last_name,
         u2.first_name, u2.last_name;

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE addresses IS 'Centralized address table for all entities';
COMMENT ON TABLE roles IS 'User roles with JSON permissions and schema versioning';
COMMENT ON TABLE users IS 'System users with encrypted sensitive data';
COMMENT ON TABLE user_tokens IS 'Enhanced tokens with revocation support and device tracking';
COMMENT ON TABLE donors IS 'Blood donors with encrypted personal information';
COMMENT ON TABLE stakeholders IS 'Organizations and entities participating in blood donation';
COMMENT ON TABLE stakeholder_coordinators IS 'Contact persons for stakeholders';
COMMENT ON TABLE mobile_drives IS 'Mobile blood donation drives/events';
COMMENT ON TABLE stakeholder_mobile_drives IS 'Many-to-many mapping of stakeholders to drives';
COMMENT ON TABLE mobile_drive_staff IS 'Staff assignments for mobile drives';
COMMENT ON TABLE donation_records IS 'Individual donation records';
COMMENT ON TABLE test_results IS 'Laboratory test results for donations';
COMMENT ON TABLE blood_inventory IS 'Blood product inventory management';
COMMENT ON TABLE blood_requests IS 'Blood product requests from hospitals/patients';
COMMENT ON TABLE issuance_records IS 'Records of blood product issuance';
COMMENT ON TABLE documents IS 'Document attachments for various entities';
COMMENT ON TABLE audit_log IS 'System audit trail';

COMMENT ON COLUMN addresses.geo_coord IS 'Geographic coordinates using PostGIS GEOGRAPHY type';
COMMENT ON COLUMN roles.schema_version IS 'Version number for JSON schema migration tracking';
COMMENT ON COLUMN users.email_encrypted IS 'Email encrypted using pgcrypto pgp_sym_encrypt';
COMMENT ON COLUMN users.phone_encrypted IS 'Phone number encrypted using pgcrypto';
COMMENT ON COLUMN user_tokens.token_hash IS 'SHA-256 hash of the token for secure storage';
COMMENT ON COLUMN user_tokens.device_info IS 'JSON containing device details (browser, OS, IP)';
COMMENT ON COLUMN user_tokens.is_revoked IS 'Flag to revoke tokens for security';
COMMENT ON COLUMN donors.id_number_encrypted IS 'Encrypted government-issued ID number';

-- =====================================================
-- END OF SCHEMA
-- =====================================================
