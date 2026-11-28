
CREATE DATABASE IF NOT EXISTS prime_productions;
USE prime_productions;

-- ADMIN USERS
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(190) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('superadmin', 'admin') DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PROJECTS / REELS / VIDEOS
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    niche VARCHAR(100) NOT NULL,
    format ENUM('short', 'long') NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    media_url VARCHAR(500),
    media_type ENUM('video', 'image', 'youtube', 'vimeo') DEFAULT 'video',
    thumbnail_url VARCHAR(500),
    external_url VARCHAR(500),
    sort_order INT DEFAULT 0,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- THUMBNAILS
CREATE TABLE IF NOT EXISTS thumbnails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    niche VARCHAR(100) NOT NULL,
    before_text VARCHAR(255),
    after_text VARCHAR(255),
    before_image VARCHAR(500),
    after_image VARCHAR(500),
    image_url VARCHAR(500),
    sort_order INT DEFAULT 0,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SERVICES
CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    icon VARCHAR(50),
    description TEXT,
    tags JSON,
    points JSON,
    turnaround VARCHAR(150),
    sort_order INT DEFAULT 0,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PRICING PLANS
CREATE TABLE IF NOT EXISTS pricing_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    features JSON,
    button_text VARCHAR(100),
    plan_style VARCHAR(50),
    price_inr VARCHAR(100),
    price_usd VARCHAR(100),
    sort_order INT DEFAULT 0,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ABOUT / MILESTONES
CREATE TABLE IF NOT EXISTS milestones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    sort_order INT DEFAULT 0,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TESTIMONIALS
CREATE TABLE IF NOT EXISTS testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_name VARCHAR(150),
    client_role VARCHAR(150),
    message TEXT NOT NULL,
    rating INT DEFAULT 5,
    image_url VARCHAR(500),
    sort_order INT DEFAULT 0,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- WEBSITE CONTENT / TEXT
CREATE TABLE IF NOT EXISTS site_content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section_key VARCHAR(150) NOT NULL UNIQUE,
    content JSON NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- BOOKINGS / ENQUIRIES
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    contact VARCHAR(190) NOT NULL,
    service VARCHAR(120) NOT NULL,
    booking_date DATE NULL,
    booking_time VARCHAR(50) NULL,
    note TEXT,
    status ENUM('new', 'contacted', 'in_progress', 'completed', 'cancelled')
        DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
