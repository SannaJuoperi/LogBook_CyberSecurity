-- Users Table
CREATE TABLE xyz123_xyz789_users (
    id SERIAL PRIMARY KEY,
    pseudonym VARCHAR(100) NOT NULL,
    email_hash CHAR(64) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('reserver', 'admin')) NOT NULL,
    age INT NOT NULL CHECK (age >= 15),
    consent BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_expiry TIMESTAMP DEFAULT CURRENT_TIMESTAMP + INTERVAL '2 years'
);

-- Resources Table
CREATE TABLE xyz123_xyz789_resources (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reservations Table
CREATE TABLE xyz123_xyz789_reservations (
    id SERIAL PRIMARY KEY,
    user_pseudonym VARCHAR(100) NOT NULL,
    resource_id INT REFERENCES xyz123_xyz789_resources(id) ON DELETE CASCADE,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (end_time > start_time)
);

-- Audit Log Table
CREATE TABLE xyz123_xyz789_audit_logs (
    id SERIAL PRIMARY KEY,
    action VARCHAR(50) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    performed_by VARCHAR(100) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);