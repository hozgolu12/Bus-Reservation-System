-- Create database
CREATE DATABASE bus_reservation;

-- Connect to the database
\c bus_reservation;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (for Django auth)
CREATE TABLE IF NOT EXISTS auth_user (
    id SERIAL PRIMARY KEY,
    password VARCHAR(128) NOT NULL,
    last_login TIMESTAMP WITH TIME ZONE,
    is_superuser BOOLEAN NOT NULL DEFAULT FALSE,
    username VARCHAR(150) NOT NULL UNIQUE,
    first_name VARCHAR(150) NOT NULL DEFAULT '',
    last_name VARCHAR(150) NOT NULL DEFAULT '',
    email VARCHAR(254) NOT NULL UNIQUE,
    is_staff BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    date_joined TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create custom user fields table
CREATE TABLE IF NOT EXISTS authentication_user (
    id SERIAL PRIMARY KEY,
    password VARCHAR(128) NOT NULL,
    last_login TIMESTAMP WITH TIME ZONE,
    is_superuser BOOLEAN NOT NULL DEFAULT FALSE,
    username VARCHAR(150) NOT NULL UNIQUE,
    first_name VARCHAR(150) NOT NULL DEFAULT '',
    last_name VARCHAR(150) NOT NULL DEFAULT '',
    email VARCHAR(254) NOT NULL UNIQUE,
    is_staff BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    date_joined TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    phone_number VARCHAR(15),
    date_of_birth DATE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create routes table
CREATE TABLE IF NOT EXISTS routes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    source VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    distance VARCHAR(50) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    amenities JSON,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create buses table
CREATE TABLE IF NOT EXISTS buses (
    id SERIAL PRIMARY KEY,
    bus_number VARCHAR(50) NOT NULL,
    type VARCHAR(100) NOT NULL,
    operator VARCHAR(100) NOT NULL,
    total_seats INTEGER NOT NULL,
    seat_map JSON NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    rating DECIMAL(3,2) DEFAULT 4.0,
    amenities JSON,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    route_id INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE
);

-- Create tickets table
CREATE TABLE IF NOT EXISTS tickets_ticket (
    id SERIAL PRIMARY KEY,
    ticket_number VARCHAR(20) NOT NULL UNIQUE,
    passenger_name VARCHAR(100) NOT NULL,
    passenger_email VARCHAR(254) NOT NULL,
    passenger_phone VARCHAR(15) NOT NULL,
    route_id VARCHAR(50) NOT NULL,
    route_name VARCHAR(200) NOT NULL,
    bus_id VARCHAR(50) NOT NULL,
    bus_number VARCHAR(50) NOT NULL,
    departure_date DATE NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    seat_numbers JSON NOT NULL,
    price_per_seat DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'confirmed',
    booking_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES authentication_user(id) ON DELETE CASCADE
);

-- Insert sample routes
INSERT INTO routes (name, source, destination, distance, duration, base_price, amenities) VALUES
('NYC Express', 'New York', 'Boston', '215 miles', '4h 30m', 45.00, '["WiFi", "AC", "Charging Ports", "Snacks"]'),
('Capital Corridor', 'New York', 'Washington DC', '225 miles', '4h 15m', 55.00, '["WiFi", "AC", "Reclining Seats", "Movies"]'),
('Liberty Line', 'New York', 'Philadelphia', '95 miles', '2h 00m', 35.00, '["WiFi", "AC", "Charging Ports", "Snacks"]'),
('Coastal Express', 'Boston', 'Portland', '105 miles', '2h 30m', 40.00, '["WiFi", "AC", "Scenic Views", "Snacks"]'),
('Metro Connect', 'Washington DC', 'Baltimore', '40 miles', '1h 15m', 25.00, '["WiFi", "AC", "Charging Ports", "Express Service"]'),
('Sunshine Route', 'Miami', 'Orlando', '235 miles', '3h 45m', 50.00, '["WiFi", "AC", "Reclining Seats", "Entertainment"]');

-- Insert sample buses
INSERT INTO buses (bus_number, type, operator, total_seats, seat_map, departure_time, arrival_time, price, rating, amenities, route_id) VALUES
('NYC-101', 'Luxury Coach', 'Express Lines', 40, '[]', '08:30:00', '13:00:00', 45.00, 4.5, '["WiFi", "AC", "Charging Ports", "Snacks", "Reclining Seats"]', 1),
('NYC-102', 'Standard Coach', 'City Transport', 35, '[]', '10:15:00', '14:45:00', 40.00, 4.2, '["WiFi", "AC", "Charging Ports"]', 1),
('NYC-103', 'Premium Express', 'Premium Travel', 30, '[]', '14:30:00', '19:00:00', 55.00, 4.8, '["WiFi", "AC", "Charging Ports", "Snacks", "Entertainment", "Premium Seats"]', 1),
('DC-201', 'Luxury Coach', 'Capital Express', 40, '[]', '09:00:00', '13:15:00', 55.00, 4.4, '["WiFi", "AC", "Charging Ports", "Snacks", "Reclining Seats"]', 2),
('PHL-301', 'Standard Coach', 'Liberty Lines', 35, '[]', '11:00:00', '13:00:00', 35.00, 4.6, '["WiFi", "AC", "Charging Ports"]', 3);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_routes_source ON routes(source);
CREATE INDEX IF NOT EXISTS idx_routes_destination ON routes(destination);
CREATE INDEX IF NOT EXISTS idx_buses_route_id ON buses(route_id);
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets_ticket(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets_ticket(status);
CREATE INDEX IF NOT EXISTS idx_tickets_departure_date ON tickets_ticket(departure_date);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_routes_updated_at BEFORE UPDATE ON routes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_buses_updated_at BEFORE UPDATE ON buses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON tickets_ticket FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON authentication_user FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();