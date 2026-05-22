-- FitMetric Pro Database Schema
-- Compatible with PostgreSQL / MySQL / SQLite

-- 1. User Accounts
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. User Profiles (Health Settings)
CREATE TABLE profiles (
    user_id VARCHAR(36) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    age INTEGER,
    starting_weight DECIMAL(5,2),
    target_weight DECIMAL(5,2),
    goal_type VARCHAR(10) CHECK (goal_type IN ('lose', 'gain')),
    weekly_goal DECIMAL(3,2), -- kg per week
    daily_calories INTEGER,
    daily_water INTEGER, -- in ml
    height INTEGER, -- in cm
    gender VARCHAR(10) CHECK (gender IN ('male', 'female')),
    is_premium BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Weight Logs
CREATE TABLE weight_logs (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    weight DECIMAL(5,2) NOT NULL,
    time_of_day VARCHAR(10) CHECK (time_of_day IN ('morning', 'evening')),
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Body Measurements
CREATE TABLE measurements (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    waist DECIMAL(5,2),
    chest DECIMAL(5,2),
    hips DECIMAL(5,2),
    thighs DECIMAL(5,2),
    arms DECIMAL(5,2),
    neck DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Nutrition Logs
CREATE TABLE nutrition_logs (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    name VARCHAR(255) NOT NULL,
    calories INTEGER NOT NULL,
    protein DECIMAL(5,2),
    carbs DECIMAL(5,2),
    fat DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Meal Prep Plans
CREATE TABLE meal_plans (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
    day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6),
    meal_type VARCHAR(20), -- breakfast, snack1, lunch, etc.
    name VARCHAR(255) NOT NULL,
    calories INTEGER,
    protein DECIMAL(5,2),
    carbs DECIMAL(5,2),
    fat DECIMAL(5,2),
    ingredients TEXT, -- Can be JSON string or CSV
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Water Logs
CREATE TABLE water_logs (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
    date TIMESTAMP NOT NULL,
    amount INTEGER NOT NULL -- ml
);

-- 8. Supplements / Medications
CREATE TABLE supplements (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    type VARCHAR(20), -- vitamin, medicine, supplement
    purpose VARCHAR(255),
    frequency VARCHAR(20) -- daily, weekly, as-needed
);

-- 9. Supplement Logs (Adherence)
CREATE TABLE supplement_logs (
    id VARCHAR(36) PRIMARY KEY,
    supplement_id VARCHAR(36) REFERENCES supplements(id) ON DELETE CASCADE,
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    taken BOOLEAN DEFAULT TRUE
);

-- 10. Notifications / Reminders
CREATE TABLE reminders (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    time VARCHAR(5) NOT NULL, -- HH:MM
    type VARCHAR(20), -- weight, water, nutrition, medicine
    enabled BOOLEAN DEFAULT TRUE
);

-- Indexes for performance
CREATE INDEX idx_weight_user ON weight_logs(user_id, date);
CREATE INDEX idx_nutrition_user ON nutrition_logs(user_id, date);
CREATE INDEX idx_water_user ON water_logs(user_id, date);
