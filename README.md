# Bus Reservation System

A comprehensive full-stack bus reservation system built with Next.js, Django, NestJS, and PostgreSQL.

## Architecture

### Frontend
- **Framework**: Next.js 13 with App Router
- **UI Library**: Tailwind CSS + shadcn/ui
- **State Management**: React Context API
- **Authentication**: JWT tokens

### Backend Services
- **Django API** (Port 8000): User authentication and ticket management
- **NestJS API** (Port 3001): Route and bus management with seat reservations
- **PostgreSQL**: Primary database for all services

### Key Features
- User registration and authentication
- Route search and filtering
- Real-time seat selection and booking
- Ticket management and cancellation
- Responsive design for all devices
- Production-ready architecture

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)
- PostgreSQL 15+ (for local development)

### Using Docker (Recommended)

1. Clone the repository
2. Start all services:
```bash
docker-compose up -d
```

3. Access the application:
- Frontend: http://localhost:3000
- Django API: http://localhost:8000
- NestJS API: http://localhost:3001
- PostgreSQL: localhost:5432

### Local Development

#### Database Setup
```bash
# Start PostgreSQL
docker run -d \
  --name bus_reservation_db \
  -e POSTGRES_DB=bus_reservation \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  postgres:15

# Initialize database
psql -h localhost -U postgres -d bus_reservation -f database/init.sql
```

#### Django API Setup
```bash
cd backend/django-auth-api
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cd .env.example .env
python manage.py migrate
python manage.py runserver 8000
```

#### NestJS API Setup
```bash
cd backend/nestjs-routes-api
npm install
cd .env.example .env
npm run start:dev
```

#### Frontend Setup
```bash
npm install
npm run dev
```

## API Documentation

### Django Authentication API (Port 8000)

#### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

#### Ticket Management Endpoints
- `GET /api/tickets/` - Get user tickets
- `POST /api/tickets/book/` - Book a new ticket
- `GET /api/tickets/{id}/` - Get ticket details
- `DELETE /api/tickets/{id}/cancel/` - Cancel a ticket

### NestJS Routes API (Port 3001)

#### Route Management
- `GET /api/routes` - Get all routes (with filtering)
- `GET /api/routes/{id}` - Get route details
- `GET /api/routes/{id}/buses` - Get buses for a route
- `POST /api/routes` - Create new route (admin)

#### Bus Management
- `GET /api/buses` - Get all buses
- `GET /api/buses/{id}` - Get bus details with seat map
- `PATCH /api/buses/{id}/reserve` - Reserve seats
- `PATCH /api/buses/{id}/cancel` - Cancel seat reservations

## Database Schema

### Core Tables
- `authentication_user` - User accounts and profiles
- `routes` - Bus routes with source/destination
- `buses` - Bus information with seat maps
- `tickets_ticket` - Booking records and passenger details

### Key Relationships
- Users have many Tickets
- Routes have many Buses
- Tickets reference Routes and Buses by ID

## Deployment

### Production Environment Variables

#### Django API
```env
SECRET_KEY=your-production-secret-key
DEBUG=False
DB_NAME=bus_reservation
DB_USER=postgres
DB_PASSWORD=your-db-password
DB_HOST=your-db-host
DB_PORT=5432
```

#### NestJS API
```env
NODE_ENV=production
DB_HOST=your-db-host
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your-db-password
DB_NAME=bus_reservation
```

#### Frontend
```env
NEXT_PUBLIC_DJANGO_API_URL=https://your-django-api.com
NEXT_PUBLIC_NESTJS_API_URL=https://your-nestjs-api.com
```

### Deployment Platforms
- **Frontend**: Vercel, Netlify
- **Django API**: Railway, Render, Heroku
- **NestJS API**: Render, Fly.io, Railway
- **Database**: Supabase, Neon, AWS RDS

## Development

### Project Structure
```
├── app/                    # Next.js frontend
├── backend/
│   ├── django-auth-api/    # Django authentication service
│   └── nestjs-routes-api/  # NestJS routes service
├── database/               # Database initialization
├── components/             # Reusable UI components
├── contexts/              # React contexts
└── lib/                   # Utility functions
```

### Adding New Features
1. Update database schema in `database/init.sql`
2. Add API endpoints in respective backend services
3. Update frontend components and pages
4. Test integration between services

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
