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

# Payload CMS Secret (use a strong random string)
# Generate with: openssl rand -base64 32
PAYLOAD_SECRET=your-super-secret-key

# Environment
NODE_ENV=development
```

#### 1.3 Create PostgreSQL Database

```bash
# Using psql
psql -U postgres -c "CREATE DATABASE community_db;"

# Or using your database client of choice
```

## Step 2: Initialize Drizzle Schema

### 2.1 Generate Initial Migration

```bash
# Generate migration files from schema.ts
npx drizzle-kit generate:pg
```

This creates migration files in `src/db/migrations/`.

### 2.2 Run Migration

```bash
# Apply migrations to your database
npx drizzle-kit migrate
```

This creates all Drizzle-managed tables:
- `users`
- `member_profiles`
- `events`
- `rsvps`
- `form_submissions`

## Step 3: Start Development Server

```bash
npm run dev
```

The application will start on `http://localhost:3000`.

## Step 4: Initialize Payload CMS

### 4.1 Access Payload Admin

Open your browser and visit: `http://localhost:3000/admin`

### 4.2 Create Admin User

Payload will prompt you to create an admin user on first access:
- Email: your-email@example.com
- Password: (create a secure password)

After creating the admin user, you're logged into the Payload admin dashboard.

### 4.3 Create Content Collections

In the Payload admin:

1. **Create Media**
   - Upload images for event headers and hero sections
   - Use the Media collection

2. **Create Hero Sections**
   - Title: "Welcome to Our Community"
   - Subtitle: "Building connections, making a difference"
   - Background image: (upload from media)
   - CTA Text: "Explore Events"
   - CTA Link: "/events"

3. **Create Events**
   - Title: "Community Service Day"
   - Description: "Join us for our monthly community service initiative"
   - Start Date: (select future date)
   - Location: "Community Center"
   - Category: "Charity"
   - Event Image: (upload from media)

4. **Create Users (Admin Collection)**
   - Email: member@example.com
   - First Name: John
   - Last Name: Doe
   - Role: "Member"
   - Password: (secure password)

5. **Create Pages**
   - Title: "About Us"
   - Slug: "about"
   - Content: (rich text content)
   - Published: true

## Step 5: Verify Everything Works

### 5.1 Check Database

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
# - plus Payload's internal tables
```

### 5.2 Test Events Page

1. Visit `http://localhost:3000/events`
2. You should see the events you created
3. (Optional) Test RSVP button if you've set up authentication

### 5.3 Test Payload Admin

1. Visit `http://localhost:3000/admin`
2. Log in with admin credentials
3. Browse collections and edit content

## Step 6: Development Workflow

### Adding New Fields to Events

1. **Update Drizzle Schema**
   ```typescript
   // src/db/schema.ts
   export const events = pgTable('events', {
     // ... existing fields
     eventType: varchar('event_type'), // new field
   });
   ```

2. **Generate and Run Migration**
   ```bash
   npx drizzle-kit generate:pg
   npx drizzle-kit migrate
   ```

3. **Update Payload Collection** (if needed)
   ```typescript
   // src/payload/collections/Events.ts
   {
     name: 'eventType',
     type: 'select',
     options: [/* ... */],
   }
   ```

4. **Update UI Components**
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

## Step 7: Production Deployment

### 7.1 Environment Variables

Set these in your hosting platform (Vercel, Railway, etc.):

```env
DATABASE_URL=postgresql://user:password@your-prod-db.example.com:5432/db
PAYLOAD_SECRET=<your-production-secret>
NODE_ENV=production
```

### 7.2 Database Migration

Before deploying:

```bash
# Run migrations against production database
DATABASE_URL=postgresql://... npx drizzle-kit migrate
```

### 7.3 Deploy to Vercel

```bash
# Push to GitHub (if not already done)
git push origin main

# Deploy via Vercel dashboard or CLI
vercel
```

### 7.4 Post-Deployment

1. Visit `your-domain.com/admin`
2. Create production admin user
3. Create initial content
4. Test events page

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

### Payload Admin Not Loading

```
Error: Cannot find module '@payloadcms/db-postgres'