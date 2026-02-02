# Community Website Architecture

This document outlines the architecture of the professional community website built with **Payload CMS 3.x**, **Drizzle ORM**, **Next.js 15**, and **PostgreSQL**.

## 🏗️ System Overview

### Clear Separation of Concerns

```
┌─────────────────────────────────────────┐
│   Next.js 15 Frontend (App Router)      │
│  - Server Components                    │
│  - Server Actions                       │
│  - API Routes                           │
└──────────────┬──────────────────────────┘
               │
        ┌──────┴─────────┐
        │                │
    ┌───▼────────────┐  ┌──▼──────────────────┐
    │  Payload CMS   │  │ Drizzle ORM         │
    │  (Content &    │  │ (App Data)          │
    │   Admin Colls) │  │                     │
    └────┬──────────┘  └──┬───────────────────┘
         │                 │
         └────────┬────────┘
                  │
         ┌────────▼────────┐
         │  PostgreSQL DB  │
         │  (Single Pool)  │
         └─────────────────┘
```

### Three-Layer Architecture

1. **Presentation Layer** (Next.js)
   - Server Components for data fetching
   - Server Actions for mutations (RSVP, form submissions)
   - API routes for external/client queries
   - Client components for interactive UI

2. **CMS Layer** (Payload)
   - Content collections (Pages, Media, Hero Sections, Events)
   - Admin collections (Users, Programs, Form Submissions)
   - Admin dashboard for content editors and administrators
   - Native authentication for Payload users

3. **Data Layer** (Drizzle + PostgreSQL)
   - Custom Drizzle-managed tables for application data
   - Relational tables not managed by Payload
   - Hybrid database where both Payload and Drizzle tables coexist

## 📂 Project Structure

```
project-root/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── events/route.ts          # Events API endpoints
│   │   │   └── rsvp/route.ts            # RSVP API endpoints
│   │   ├── actions/
│   │   │   └── rsvp.ts                  # RSVP Server Actions
│   │   ├── events/
│   │   │   └── page.tsx                 # Events listing page
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── EventCard.tsx                # Event card component
│   ├── db/
│   │   ├── schema.ts                    # Drizzle schema definitions
│   │   ├── index.ts                     # Drizzle client initialization
│   │   └── migrations/                  # Auto-generated migrations
│   ├── payload/
│   │   ├── collections/
│   │   │   ├── Media.ts                 # Media collection (content)
│   │   │   ├── Pages.ts                 # Pages collection (content)
│   │   │   ├── HeroSections.ts          # Hero sections (content)
│   │   │   ├── Events.ts                # Events collection (content)
│   │   │   ├── Users.ts                 # Users collection (admin)
│   │   │   └── Programs.ts              # Programs collection (admin)
│   │   └── ...
│   └── payload.config.ts                # Payload CMS configuration
├── drizzle.config.ts                    # Drizzle Kit configuration
├── next.config.mjs                      # Next.js configuration
├── package.json
└── ARCHITECTURE.md
```

## 🗄️ Database Schema

### Payload-Managed Collections

**Content Collections** (visible to editors):
- `media` - Media uploads (images, videos, audio)
- `pages` - Marketing pages with slug-based routing
- `hero-sections` - Hero banners for pages
- `events` - Public event listings

**Admin Collections** (hidden from non-admins):
- `users` - User accounts with authentication
- `programs` - Community programs and initiatives

### Drizzle-Managed Tables

```sql
-- Users (linked to Payload users)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  payload_id VARCHAR UNIQUE,
  email VARCHAR UNIQUE NOT NULL,
  first_name VARCHAR,
  last_name VARCHAR,
  role VARCHAR DEFAULT 'member',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Member Profiles
CREATE TABLE member_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  join_date TIMESTAMP DEFAULT NOW(),
  membership_level VARCHAR DEFAULT 'standard',
  phone VARCHAR,
  address TEXT,
  city VARCHAR,
  state VARCHAR,
  zip_code VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Events (content from Payload)
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  payload_id VARCHAR UNIQUE,
  title VARCHAR NOT NULL,
  description TEXT,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP,
  location VARCHAR,
  capacity INTEGER,
  image_url VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- RSVPs (custom application data)
CREATE TABLE rsvps (
  id SERIAL PRIMARY KEY,
  event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR DEFAULT 'going', -- 'going', 'maybe', 'not_going', 'cancelled'
  guest_count INTEGER DEFAULT 1,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Form Submissions
CREATE TABLE form_submissions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  form_type VARCHAR NOT NULL, -- 'contact', 'membership_inquiry', 'volunteer'
  submission_data JSONB,
  status VARCHAR DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🔄 Data Flow Examples

### Example 1: Fetching Event Data

```
User visits /events
├─ Server Component: EventsPage
├─ Queries: db.select().from(events)  [Drizzle]
├─ Queries: RSVPs for each event      [Drizzle]
├─ Renders: EventCard components
└─ Output: HTML with event data
```

### Example 2: RSVP Submission

```
User clicks "Going" button
├─ Client Action: submitRSVP()
├─ Step 1: Verify event exists         [Drizzle query]
├─ Step 2: Verify user exists          [Drizzle query]
├─ Step 3: Insert/Update RSVP record   [Drizzle mutation]
├─ Cache: Revalidate tags
└─ Success: UI updates with new status
```

### Example 3: Content Management

```
Editor creates new event in Payload Admin
├─ Payload CMS: Accepts event creation
├─ Database: Inserts into Payload's events collection
├─ Webhook (optional): Syncs to Drizzle events table
├─ Frontend: Queries Drizzle events table
└─ User: Sees new event in /events listing
```

## 🔐 Security & Access Control

### Authentication
- **Payload Users**: Native Payload CMS authentication
- **Role-based Access Control**:
  - `admin` - Full system access
  - `editor` - Can edit content collections
  - `moderator` - Can moderate content
  - `member` - Limited to personal data

### Admin Collections Visibility
- Admin collections are hidden from non-admin users
- Configured via `hidden: ({ user }) => user?.role !== 'admin'`
- Enforced on both UI and API levels

### Database Security
- Server Actions execute on the server (secure)
- API routes validate authentication
- SQL injection prevented via Drizzle ORM parameterized queries
- Environment variables for sensitive config

## 🚀 Server Actions

### RSVP Actions (`/src/app/actions/rsvp.ts`)

**`submitRSVP(params)`**
- Validates event and user exist
- Creates or updates RSVP record
- Revalidates cache tags
- Returns success/error status

**`cancelRSVP(eventId, userId)`**
- Marks RSVP as cancelled
- Updates cache

**`fetchEventRSVPs(eventId)`**
- Returns all RSVPs for an event
- Used for guest counts

## 📡 API Routes

### `/api/rsvp`
- `GET ?eventId=1&userId=2` - Fetch RSVP status
- `DELETE ?eventId=1&userId=2` - Delete RSVP

### `/api/events`
- `GET ?upcoming=true&limit=10` - Fetch events with RSVP counts

## 🎨 UI Components

### EventCard Component
- Displays event details (date, time, location)
- Shows RSVP count and attendance status
- RSVP buttons (Going, Maybe, Can't Go)
- Category badge and event image
- Responsive grid layout

### Events Page
- Hero section with introduction
- Filter bar for future extensions
- Grid of event cards (3 columns on desktop)
- Empty state messaging
- Call-to-action for event organizers

## 📦 Dependencies

```json
{
  "payload": "^3.0.0",
  "drizzle-orm": "^0.30.0",
  "drizzle-kit": "^0.20.0",
  "pg": "^8.11.0",
  "@payloadcms/db-postgres": "^3.0.0",
  "next": "16.0.10",
  "react": "19.2.0",
  "tailwindcss": "^4.1.9"
}
```

## 🔧 Setup Instructions

### 1. Environment Setup
```bash
cp env.example .env.local
# Fill in DATABASE_URL and PAYLOAD_SECRET
```

### 2. Database Setup
```bash
npm install
npx drizzle-kit generate:pg
npx drizzle-kit migrate
```

### 3. Payload CMS Setup
```bash
npm run dev
# Visit http://localhost:3000/admin
# Create admin user during first setup
```

### 4. Seed Data
```bash
# Use Payload admin to create content collections
# Drizzle tables are automatically synced
```

## 🎯 Key Design Decisions

1. **Hybrid Database**: Single PostgreSQL instance with both Payload and Drizzle tables allows:
   - Relational integrity between CMS content and app data
   - Single database connection
   - Simplified deployment and backups

2. **Content-First Approach**: Payload handles all marketing/content content, Drizzle handles application state
   - Cleanly separates editor responsibilities
   - Allows non-technical users to manage content
   - Admin collections for sensitive application data

3. **Server-First Data Fetching**: Next.js 13+ App Router with Server Components
   - Data fetched at build time or request time
   - No unnecessary client-side data fetching
   - Natural integration with Drizzle ORM

4. **Server Actions for Mutations**: Secure server-side mutations without exposing database
   - RSVP submission handled securely
   - Cache revalidation built-in
   - No client-side API credentials needed

## 📚 Further Reading

- [Payload CMS Documentation](https://payloadcms.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
