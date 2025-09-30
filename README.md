# Sabir KhataBook

A comprehensive bilingual (Urdu/English) SaaS ledger application for agricultural sellers to manage fertilizers, seeds, sprays, clients, and transactions.

## Features

- **Bilingual Support**: Full Urdu and English interface with RTL layout support
- **Role-based Access**: Admin and Manager roles with appropriate permissions
- **Product Management**: Track fertilizers, seeds, and sprays with stock levels
- **Client Management**: Maintain customer records with balance tracking
- **Transaction Processing**: Handle sales and payments with automatic balance updates
- **Invoice Generation**: Print-ready invoices with bilingual support
- **Reports & Analytics**: Summary dashboards and transaction reports
- **Authentication**: JWT-based secure authentication system

## Tech Stack

- **Frontend**: Next.js 14, React, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: SQLite (dev), PostgreSQL (production)
- **ORM**: Prisma
- **Authentication**: JWT with bcrypt password hashing
- **Testing**: Jest, Supertest
- **Deployment**: Vercel-ready with environment configuration

## Local Development Setup

### Prerequisites

- Node.js 18+ and pnpm
- Git

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd sabir-khatabook
pnpm install
cd apps/web && npm install
cd ../../packages/db && npm install
```

2. **Environment setup:**
```bash
cp .env.example .env
```

3. **Database setup:**
```bash
# Generate Prisma client
pnpm prisma:generate

# Run migrations
pnpm prisma:migrate

# Seed database with sample data
pnpm prisma:seed
```

4. **Start development server:**
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

### Demo Credentials

- **Admin**: `admin@sabirkhatabook.test` / `Admin123!`
- **Manager**: `ahmed@sabirkhatabook.test` / `Manager123!`
- **Manager**: `hassan@sabirkhatabook.test` / `Manager123!`

## Production Deployment (Vercel)

### Database Migration: SQLite to PostgreSQL

**IMPORTANT**: SQLite does not work reliably on Vercel's serverless platform due to ephemeral storage. For production deployment on Vercel, you must use a managed PostgreSQL database.

### Steps for Production Deployment:

1. **Set up PostgreSQL database:**
   - Use Vercel Postgres, Supabase, or another managed PostgreSQL provider
   - Get the connection string (e.g., `postgresql://user:pass@host:port/db`)

2. **Configure Vercel project:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login and configure
   vercel login
   vercel
   ```

3. **Set environment variables in Vercel:**
   ```bash
   DATABASE_URL=postgresql://your-postgres-connection-string
   JWT_SECRET=your-secure-jwt-secret-key
   NODE_ENV=production
   ```

4. **Deploy:**
   ```bash
   vercel --prod
   ```

5. **Run database migrations on production:**
   ```bash
   # After deployment, run migrations
   vercel env pull .env.production
   DATABASE_URL="your-postgres-url" npx prisma migrate deploy --schema packages/db/schema.prisma
   DATABASE_URL="your-postgres-url" npx tsx packages/db/prisma/seed.ts
   ```

### Alternative: Single-Server Deployment

If you need to use SQLite in production, deploy to a single-server environment like Railway, Render, or a VPS where the SQLite file can persist:

1. **Railway deployment:**
   ```bash
   # Connect your GitHub repo to Railway
   # Set environment variables in Railway dashboard
   # The same codebase works with both SQLite and PostgreSQL
   ```

2. **Docker deployment:**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY . .
   RUN pnpm install
   RUN cd apps/web && npm run build
   EXPOSE 3000
   CMD ["pnpm", "start"]
   ```

## Project Structure

```
sabir-khatabook/
├── apps/
│   └── web/                 # Next.js application
│       ├── pages/          # Pages and API routes
│       ├── components/     # React components
│       ├── styles/         # CSS styles
│       └── utils/          # Client utilities
├── packages/
│   ├── db/                 # Prisma schema and database logic
│   ├── ui/                 # Shared React components
│   └── utils/              # Shared utilities (auth, validators)
├── locales/                # Translation files
│   ├── en/common.json      # English translations
│   └── ur/common.json      # Urdu translations
└── tests/                  # Test files
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Create new manager (admin only)
- `GET /api/auth/me` - Get current user info

### Manager Endpoints (Protected)
- `GET /api/manager/products` - List products
- `POST /api/manager/products` - Create product
- `PUT /api/manager/products/:id` - Update product
- `DELETE /api/manager/products/:id` - Delete product
- `GET /api/manager/clients` - List clients
- `POST /api/manager/clients` - Create client
- `PUT /api/manager/clients/:id` - Update client
- `DELETE /api/manager/clients/:id` - Delete client
- `GET /api/manager/clients/:id/transactions` - Get client transactions
- `POST /api/manager/clients/:id/transactions` - Create transaction
- `GET /api/manager/reports/summary` - Get reports summary

## Testing

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test --watch
```

## Database Schema

The application uses a flexible Prisma schema that supports both SQLite and PostgreSQL:

- **Users**: Admin and manager accounts with role-based access
- **Products**: Fertilizers, seeds, and sprays with stock tracking
- **Clients**: Customer information with balance management
- **Transactions**: Sales and payment records with automatic balance updates

## Internationalization

The app supports full RTL (Right-to-Left) layout for Urdu:

- Language switcher persists selection in cookies
- Automatic layout direction change (`dir="rtl"` for Urdu)
- Font support for Urdu text (Noto Nastaliq Urdu)
- All UI text externalized to JSON translation files

## Security Features

- JWT authentication with secure token storage
- Role-based access control (RBAC)
- Resource ownership validation
- Password hashing with bcrypt
- Input validation with Zod schemas
- API rate limiting considerations

## Performance Considerations

- Server-side rendering for better SEO
- Optimized database queries with Prisma
- Efficient client-side state management
- Responsive design for mobile performance

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Submit a pull request

## License

MIT License - see LICENSE file for details.

---

**Note**: This application is production-ready but requires proper environment configuration and database setup for deployment. Always use HTTPS in production and implement additional security measures as needed for your specific use case.