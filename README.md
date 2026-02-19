#  Knights of Columbus - Our Lady of the Prairie, Council 5264

## Documents

npm install
```

#### 1.2 Configure Environment Variables

Create a `.env.local` file based on `env.example`:

```bash
cp env.example .env.local
```

Edit `.env.local` and fill in your values:

```env
# Database Configuration
# Format: postgresql://username:password@host:port/database
DATABASE_URL=postgresql://user:password@localhost:5432/community_db

# Environment
NODE_ENV=development
```

#### 1.3 Create PostgreSQL Database

```bash
# Using psql
psql -U postgres -c "CREATE DATABASE community_db;"

# Or using your database client of choice

## Step 3: Start Development Server

```bash
npm run dev
```

The application will start on `http://localhost:3000`.

## Step 4: Verify Everything Works

### 4.1 Check Database

Verify tables were created:

```bash
# Using psql
psql -U user -d community_db -c "\dt"

# Should show these tables:
# - users
# - member_profiles
# - events
# - rsvps
# - form_submissions
```

### 4.2 Test Events Page

1. Visit `http://localhost:3000/events`
2. You should see the events you created
3. (Optional) Test RSVP button if you've set up authentication

## Step 5: Development Workflow


3. **Update UI Components**
   Update EventCard or other components to use the new field

### Creating New Server Actions

1. Create action file: `src/app/actions/myaction.ts`
   ```typescript
   'use server';
   import { db } from '@/src/db';
   
   export async function myAction(params: any) {
     // Database operations
   }
   ```

2. Use in components:
   ```typescript
   'use client';
   import { myAction } from '@/src/app/actions/myaction';
   
   // In event handler:
   await myAction(params);
   ```

### Creating New API Routes

1. Create route file: `src/app/api/myendpoint/route.ts`
   ```typescript
   import { NextRequest, NextResponse } from 'next/server';
   
   export async function GET(request: NextRequest) {
     // Handle GET
   }
   ```

## Step 6: Production Deployment

### 7.1 Environment Variables

Set these in your hosting platform (Vercel, Railway, etc.):

```env
DATABASE_URL=postgresql://user:password@your-prod-db.example.com:5432/db
NODE_ENV=production
```

### 7.2 Database Migration

Before deploying:
```

### 7.3 Deploy to Vercel

```bash
# Push to GitHub (if not already done)
git push origin main

# Deploy via Vercel dashboard or CLI
vercel
```

### 6.4 Post-Deployment

1. Test the application
2. Verify database connectivity
3. Test events page

## Troubleshooting

### Database Connection Error

```
Error: ECONNREFUSED - Connection refused
```

**Solution:**
- Check `DATABASE_URL` is correct
- Verify PostgreSQL is running
- Test connection: `psql $DATABASE_URL`

### Migration Fails

```
Error: relation "users" already exists
```

**Solution:**
- Check if migrations already ran
- If database is fresh, migrations should be new
- Drop database and restart if needed (dev only): `DROP DATABASE community_db;`

### Build Errors

```
Error: Module not found