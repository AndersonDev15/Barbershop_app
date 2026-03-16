CREATE DATABASE IF NOT EXISTS auth;
CREATE DATABASE IF NOT EXISTS barber;

-- =============================================
-- AUTH DATABASE
-- =============================================
USE auth;

CREATE TABLE IF NOT EXISTS oauth2_registered_client (
    id VARCHAR(100) PRIMARY KEY,
    client_id VARCHAR(100) NOT NULL,
    client_id_issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    client_secret VARCHAR(200),
    client_secret_expires_at TIMESTAMP,
    client_name VARCHAR(200) NOT NULL,
    client_authentication_methods VARCHAR(1000) NOT NULL,
    authorization_grant_types VARCHAR(1000) NOT NULL,
    redirect_uris VARCHAR(1000),
    post_logout_redirect_uris VARCHAR(1000),
    scopes VARCHAR(1000) NOT NULL,
    client_settings VARCHAR(2000) NOT NULL,
    token_settings VARCHAR(2000) NOT NULL
);

CREATE TABLE IF NOT EXISTS oauth2_authorization (
    id VARCHAR(100) NOT NULL PRIMARY KEY,
    registered_client_id VARCHAR(100) NOT NULL,
    principal_name VARCHAR(200) NOT NULL,
    authorization_grant_type VARCHAR(100) NOT NULL,
    authorized_scopes VARCHAR(1000) DEFAULT NULL,
    attributes BLOB DEFAULT NULL,
    state VARCHAR(500) DEFAULT NULL,
    authorization_code_value BLOB DEFAULT NULL,
    authorization_code_issued_at TIMESTAMP DEFAULT NULL,
    authorization_code_expires_at TIMESTAMP DEFAULT NULL,
    authorization_code_metadata BLOB DEFAULT NULL,
    access_token_value BLOB DEFAULT NULL,
    access_token_issued_at TIMESTAMP DEFAULT NULL,
    access_token_expires_at TIMESTAMP DEFAULT NULL,
    access_token_metadata BLOB DEFAULT NULL,
    access_token_type VARCHAR(100) DEFAULT NULL,
    access_token_scopes VARCHAR(1000) DEFAULT NULL,
    oidc_id_token_value BLOB DEFAULT NULL,
    oidc_id_token_issued_at TIMESTAMP DEFAULT NULL,
    oidc_id_token_expires_at TIMESTAMP DEFAULT NULL,
    oidc_id_token_metadata BLOB DEFAULT NULL,
    refresh_token_value BLOB DEFAULT NULL,
    refresh_token_issued_at TIMESTAMP DEFAULT NULL,
    refresh_token_expires_at TIMESTAMP DEFAULT NULL,
    refresh_token_metadata BLOB DEFAULT NULL,
    user_code_value BLOB DEFAULT NULL,
    user_code_issued_at TIMESTAMP DEFAULT NULL,
    user_code_expires_at TIMESTAMP DEFAULT NULL,
    user_code_metadata BLOB DEFAULT NULL,
    device_code_value BLOB DEFAULT NULL,
    device_code_issued_at TIMESTAMP DEFAULT NULL,
    device_code_expires_at TIMESTAMP DEFAULT NULL,
    device_code_metadata BLOB DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS oauth2_authorization_consent (
    registered_client_id VARCHAR(100) NOT NULL,
    principal_name VARCHAR(200) NOT NULL,
    authorities VARCHAR(1000) NOT NULL,
    PRIMARY KEY (registered_client_id, principal_name)
);

CREATE TABLE IF NOT EXISTS auth_identity (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_uuid CHAR(36) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    enabled BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL,
    last_synced_at DATETIME NULL,
    UNIQUE (email),
    UNIQUE (user_uuid)
);

CREATE TABLE IF NOT EXISTS auth_role (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

INSERT IGNORE INTO auth_role(name) VALUES ('CLIENTE');
INSERT IGNORE INTO auth_role(name) VALUES ('BARBERO');
INSERT IGNORE INTO auth_role(name) VALUES ('BARBERIA');

CREATE TABLE IF NOT EXISTS auth_identity_role (
    auth_identity_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (auth_identity_id, role_id),
    FOREIGN KEY (auth_identity_id) REFERENCES auth_identity(id),
    FOREIGN KEY (role_id) REFERENCES auth_role(id)
);

CREATE TABLE IF NOT EXISTS federated_identities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    auth_identity_id BIGINT NOT NULL,
    provider VARCHAR(50) NOT NULL,
    provider_id VARCHAR(255) NOT NULL,
    provider_email VARCHAR(255) NOT NULL,
    provider_username VARCHAR(255),
    provider_display_name VARCHAR(255),
    linked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_federated_auth_identity FOREIGN KEY (auth_identity_id) REFERENCES auth_identity(id) ON DELETE CASCADE,
    CONSTRAINT uk_provider_provider_id UNIQUE (provider, provider_id)
);

CREATE TABLE IF NOT EXISTS email_verification_token (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(255) NOT NULL UNIQUE,
    identity_id BIGINT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_token_identity FOREIGN KEY (identity_id) REFERENCES auth_identity(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS password_reset_token (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL,
    otp_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    attempts INT DEFAULT 0
);

-- =============================================
-- BARBER DATABASE
-- =============================================
USE barber;

CREATE TABLE IF NOT EXISTS user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_uuid CHAR(36) NOT NULL,
    email VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(30),
    registration_date TIMESTAMP,
    status ENUM('ACTIVO','DESACTIVADO','BLOQUEADO'),
    updated_at TIMESTAMP,
    last_synced_at TIMESTAMP,
    UNIQUE (user_uuid)
);

CREATE TABLE IF NOT EXISTS barbershop (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    address VARCHAR(255),
    phone VARCHAR(255),
    owner_id BIGINT,
    status ENUM('ACTIVO','INACTIVO'),
    UNIQUE (owner_id),
    FOREIGN KEY (owner_id) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS barber (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    document_number VARCHAR(255),
    commission DECIMAL(38,2),
    barbershop_id BIGINT,
    status ENUM('ACTIVO','INACTIVO','VACACIONES'),
    UNIQUE (user_id),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (barbershop_id) REFERENCES barbershop(id)
);

CREATE TABLE IF NOT EXISTS barber_break (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    barber_id BIGINT,
    start TIME,
    end TIME,
    break_date DATE,
    FOREIGN KEY (barber_id) REFERENCES barber(id)
);

CREATE TABLE IF NOT EXISTS barber_invitation (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(100),
    invited_email VARCHAR(100),
    invitation_status ENUM('PENDING','ACCEPTED','EXPIRED','CANCELED'),
    document_number VARCHAR(50),
    commission DECIMAL(5,2),
    barber_shop_id BIGINT,
    expires_at DATETIME,
    created_at DATETIME,
    UNIQUE (token),
    FOREIGN KEY (barber_shop_id) REFERENCES barbershop(id)
);

CREATE TABLE IF NOT EXISTS barber_shop_image (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    image_url VARCHAR(255),
    public_id VARCHAR(255),
    is_cover TINYINT(1),
    uploaded_at TIMESTAMP,
    barbershop_id BIGINT,
    FOREIGN KEY (barbershop_id) REFERENCES barbershop(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS category (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    description VARCHAR(255),
    barbershop_id BIGINT,
    status ENUM('ACTIVO','INACTIVO'),
    FOREIGN KEY (barbershop_id) REFERENCES barbershop(id)
);

CREATE TABLE IF NOT EXISTS subcategory (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    description VARCHAR(255),
    duration INT,
    price DECIMAL(38,2),
    category_id BIGINT,
    FOREIGN KEY (category_id) REFERENCES category(id)
);

CREATE TABLE IF NOT EXISTS opening_hours (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    barbershop_id BIGINT,
    day_of_week ENUM('MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY'),
    start_time TIME,
    end_time TIME,
    FOREIGN KEY (barbershop_id) REFERENCES barbershop(id)
);

CREATE TABLE IF NOT EXISTS client (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    created_at TIMESTAMP,
    UNIQUE (user_id),
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS reservations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    client_id BIGINT,
    barber_id BIGINT,
    status ENUM('PENDIENTE','CONFIRMADA','EN_CURSO','COMPLETADA','CANCELADA'),
    final_price DECIMAL(38,2),
    reservation_date DATE,
    start_time TIME,
    end_time TIME,
    FOREIGN KEY (client_id) REFERENCES client(id),
    FOREIGN KEY (barber_id) REFERENCES barber(id)
);

CREATE TABLE IF NOT EXISTS reservation_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reservation_id BIGINT,
    subcategory_id BIGINT,
    created_at TIMESTAMP,
    FOREIGN KEY (reservation_id) REFERENCES reservations(id)
);

CREATE TABLE IF NOT EXISTS transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reservation_id BIGINT,
    barber_id BIGINT,
    total_amount DECIMAL(38,2),
    barber_comision DECIMAL(38,2),
    barber_amount DECIMAL(38,2),
    tip DECIMAL(38,2),
    payment_method ENUM('EFECTIVO','TRANFERENCIA'),
    payment_status ENUM('PENDIENTE','PAGADO','REEMBOLSADO','RECHAZADO'),
    transaction_code VARCHAR(255),
    payment_date TIMESTAMP,
    notes VARCHAR(255),
    UNIQUE (reservation_id),
    FOREIGN KEY (reservation_id) REFERENCES reservations(id),
    FOREIGN KEY (barber_id) REFERENCES barber(id)
);

CREATE TABLE IF NOT EXISTS barbershop_incomes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    transaction_id BIGINT,
    barbershop_id BIGINT,
    barber_id BIGINT,
    total_amount DECIMAL(38,2),
    barbershop_share_amount DECIMAL(38,2),
    barber_share_amount DECIMAL(38,2),
    tip_amount DECIMAL(38,2),
    commission_percentage DECIMAL(38,2),
    payment_method ENUM('EFECTIVO','TRANFERENCIA'),
    transaction_code VARCHAR(255),
    transaction_date TIMESTAMP,
    creation_date TIMESTAMP,
    note VARCHAR(255),
    FOREIGN KEY (transaction_id) REFERENCES transactions(id),
    FOREIGN KEY (barbershop_id) REFERENCES barbershop(id),
    FOREIGN KEY (barber_id) REFERENCES barber(id)
);