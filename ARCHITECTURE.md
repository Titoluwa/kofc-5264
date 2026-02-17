# CMS Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        KNIGHTS OF COLUMBUS CMS                  │
│                          Complete System                        │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                     FRONTEND (Client-Side)                       │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Public Pages (/page.tsx)                                │  │
│  │ - Homepage with event display                           │  │
│  │ - Newsletter subscribe form                             │  │
│  │ - Static pages (About, Contact, etc.)                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Admin Dashboard (/edit/*)                               │  │
│  │ - Protected by middleware                               │  │
│  │ - Event management                                      │  │
│  │ - Program management                                    │  │
│  │ - Resource management                                   │  │
│  │ - Newsletter management                                 │  │
│  │ - Page management                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Authentication                                          │  │
│  │ - Login page (/login)                                   │  │
│  │ - Session management                                    │  │
│  │ - Protected route middleware                            │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
                              ↕ HTTP/HTTPS
┌──────────────────────────────────────────────────────────────────┐
│                    NEXT.JS API LAYER                            │
│                    Route Handlers                               │
│                                                                  │
│  Authentication Routes:                                        │
│  ├─ POST /api/auth/login                                       │
│  ├─ POST /api/auth/logout                                      │
│  └─ GET /api/auth/me                                           │
│                                                                  │
│  Content Management Routes (Protected):                        │
│  ├─ /api/events          [GET, POST, PATCH, DELETE]           │
│  ├─ /api/programs        [GET, POST, PATCH, DELETE]           │
│  ├─ /api/resources       [GET, POST, PATCH, DELETE]           │
│  ├─ /api/newsletters     [GET, POST, PATCH, DELETE]           │
│  ├─ /api/pages           [GET, POST, PATCH, DELETE]           │
│  └─ /api/subscribers     [GET, DELETE]                         │
│                                                                  │
│  Public Routes:                                                │
│  └─ POST /api/newsletter-subscribe                             │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
                              ↕ Prisma ORM
┌──────────────────────────────────────────────────────────────────┐
│                   BUSINESS LOGIC LAYER                          │
│                                                                  │
│  /lib/auth.ts                                                  │
│  ├─ hashPassword()          - bcrypt password hashing         │
│  ├─ verifyPassword()        - password comparison             │
│  ├─ generateToken()         - JWT token creation              │
│  ├─ verifyToken()           - JWT token validation            │
│  ├─ setAuthCookie()         - session persistence             │
│  ├─ getAuthToken()          - retrieve auth token             │
│  ├─ clearAuthCookie()       - logout/session cleanup          │
│  └─ getCurrentUser()        - get authenticated user          │
│                                                                  │
│  /lib/db.ts                                                    │
│  └─ Prisma client singleton                                    │
│                                                                  │
│  /components/admin/*                                           │
│  └─ Reusable UI components (ImageUpload, etc.)               │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
                              ↕ SQL Queries
┌──────────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER (PostgreSQL)                  │
│                                                                  │
│  Tables:                                                       │
│  ├─ User                                                       │
│  │  ├─ id, email (unique), password (hashed)                 │
│  │  ├─ name, role (admin/editor)                             │
│  │  └─ createdAt, updatedAt                                  │
│  │                                                             │
│  ├─ Event                                                      │
│  │  ├─ id, title, description, date, time                   │
│  │  ├─ location, image (base64)                             │
│  │  ├─ createdBy (FK to User)                               │
│  │  └─ createdAt, updatedAt                                 │
│  │                                                             │
│  ├─ Program                                                    │
│  │  ├─ id, title, description, content                      │
│  │  ├─ icon (base64), order                                 │
│  │  ├─ createdBy (FK to User)                               │
│  │  └─ createdAt, updatedAt                                 │
│  │                                                             │
│  ├─ Resource                                                   │
│  │  ├─ id, title, description, category                     │
│  │  ├─ url, content, image (base64)                         │
│  │  ├─ createdBy (FK to User)                               │
│  │  └─ createdAt, updatedAt                                 │
│  │                                                             │
│  ├─ Newsletter                                                │
│  │  ├─ id, subject, content                                 │
│  │  ├─ sentDate, createdBy (FK to User)                     │
│  │  └─ createdAt, updatedAt                                 │
│  │                                                             │
│  ├─ NewsletterSubscriber                                      │
│  │  ├─ id, email (unique), isActive                         │
│  │  ├─ subscribedAt, unsubscribedAt                         │
│  │                                                             │
│  └─ Page                                                       │
│     ├─ id, slug (unique), title, content                    │
│     ├─ image (base64)                                        │
│     ├─ createdBy (FK to User)                                │
│     └─ createdAt, updatedAt                                  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Authentication Flow
```
User Login Request (email/password)
            ↓
    POST /api/auth/login
            ↓
    Verify email exists → Hash password match
            ↓
    Generate JWT token
            ↓
    Set HTTP-only cookie
            ↓
    Redirect to /edit dashboard
```

### Content Creation Flow
```
Admin creates/edits content
            ↓
    Submit form (with image as base64)
            ↓
    POST/PATCH /api/[content-type]/[id]
            ↓
    Middleware verifies JWT token
            ↓
    Validate request data
            ↓
    Create/Update via Prisma
            ↓
    Store in PostgreSQL
            ↓
    Return updated content to frontend
            ↓
    Display success message
```

### Content Display Flow
```
Frontend requests data
            ↓
    GET /api/[content-type]
            ↓
    Prisma queries database
            ↓
    PostgreSQL returns records
            ↓
    Format and return JSON
            ↓
    Frontend renders content
```

### Newsletter Subscription Flow
```
Visitor subscribes via public form
            ↓
    POST /api/newsletter-subscribe (public)
            ↓
    Validate email format
            ↓
    Check if already subscribed
            ↓
    Create or reactivate subscriber
            ↓
    Store in NewsletterSubscriber table
            ↓
    Return success response
```

## Security Architecture

```
┌─────────────────────────────────────────────┐
│         Security Layers                     │
└─────────────────────────────────────────────┘

Layer 1: Input Validation
├─ Email format validation
├─ Password requirements
├─ Image file type/size validation
└─ Required field checks

Layer 2: Authentication
├─ Password hashing (bcryptjs)
├─ JWT token generation
├─ HTTP-only cookie storage
└─ Token expiration (7 days)

Layer 3: Authorization
├─ Route middleware checks auth token
├─ Protected API routes verify user
├─ Role-based access (admin/editor)
└─ Unauthorized redirects to login

Layer 4: Data Protection
├─ Parameterized queries (Prisma prevents SQL injection)
├─ Password never stored plaintext
├─ Environment variables for secrets
└─ CORS handling

Layer 5: HTTP Security
├─ Secure flag for cookies (production)
├─ SameSite: Lax for CSRF protection
├─ HTTPS only in production
└─ No sensitive data in URLs
```

## Component Architecture

```
Admin Dashboard Structure:
│
├─ EditLayout (layout.tsx)
│  ├─ Sidebar navigation
│  ├─ Mobile menu
│  ├─ User profile display
│  └─ Logout button
│
├─ Dashboard Page (page.tsx)
│  └─ Statistics cards
│
├─ Events Page (events/page.tsx)
│  ├─ Event list
│  ├─ Add event dialog
│  ├─ Edit/delete buttons
│  └─ Event form
│
├─ Programs Page (programs/page.tsx)
│  ├─ Program list
│  ├─ Add program dialog
│  └─ Program form
│
├─ Resources Page (resources/page.tsx)
│  ├─ Resource list
│  └─ Resource form
│
├─ Newsletters Page (newsletters/page.tsx)
│  ├─ Newsletter list
│  ├─ Subscriber list
│  └─ Newsletter form
│
└─ Pages Page (pages/page.tsx)
   ├─ Page list
   └─ Page editor form

Shared Components:
├─ ImageUpload
│  ├─ File input
│  ├─ Preview display
│  ├─ Base64 conversion
│  └─ Validation
│
└─ UI Components (shadcn/ui)
   ├─ Dialog
   ├─ Form elements
   ├─ Alert
   ├─ Card
   └─ etc.
```

## Technology Stack

**Frontend:**
- Next.js 16 (React 19)
- TypeScript
- shadcn/ui components
- Tailwind CSS
- Lucide icons

**Backend:**
- Next.js API Routes
- Node.js runtime

**Database:**
- PostgreSQL 12+
- Prisma ORM

**Authentication:**
- bcryptjs (password hashing)
- jsonwebtoken (JWT)
- HTTP-only cookies

**Development:**
- TypeScript compiler
- Prisma CLI

## Performance Considerations

1. **Database Queries**
   - Indexes on frequently queried fields
   - Selective column selection in responses
   - Relationship eager loading where needed

2. **Image Storage**
   - Base64 increases database size
   - Consider compression before storage
   - Lazy load images on frontend

3. **API Responses**
   - Pagination recommended for large datasets
   - Only return necessary fields
   - Cache static content where possible

4. **Client-Side**
   - Next.js Server Components reduce JS
   - Code splitting per route
   - Image lazy loading

## Deployment Architecture

```
Local Development
├─ PostgreSQL (local)
├─ Next.js dev server
└─ File: .env.local

Production (Vercel)
├─ PostgreSQL (managed service)
├─ Vercel edge deployment
├─ Environment variables in Vercel
└─ GitHub repository for CI/CD
```

## Backup & Recovery

```
Database Backups:
├─ Manual: pg_dump, pg_restore
├─ Automated: Scheduled backups
└─ Versioning: Keep multiple backups

Code Backups:
├─ GitHub repository (version control)
├─ Automatic deployment from main
└─ Rollback capability via git

File Backups:
├─ Database dumps (.sql files)
└─ Configuration files (.env.local)
```

## Monitoring & Maintenance

```
Key Metrics to Monitor:
├─ Database performance
│  ├─ Query execution time
│  ├─ Connection pool usage
│  └─ Disk space
│
├─ Application health
│  ├─ Error rates
│  ├─ Response times
│  └─ User authentication failures
│
└─ Security
   ├─ Failed login attempts
   ├─ Unauthorized API access
   └─ Suspicious queries
```

---

This architecture provides a secure, scalable foundation for managing the Knights of Columbus website content.
