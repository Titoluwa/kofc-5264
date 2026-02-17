# Setup and Deployemnt Guide - Knights of Columbus CMS

Get the CMS up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- PostgreSQL installed and running
- About 5 minutes of your time

## 5-Minute Setup

### Step 1: Create Database (1 min)

```bash
# Create a new PostgreSQL database
createdb koc_cms
```

### Step 2: Update Environment Variables (1 min)

Open `.env.local` and make sure it has:

```env
DATABASE_URL="postgresql://postgres@localhost:5432/koc_cms"
JWT_SECRET="your-secret-key"
```

### Step 3: Install & Setup Database (2 min)

```bash
# Install dependencies
pnpm install

# Create database tables
pnpm db:push

# Create admin user
pnpm db:seed
```

### Step 4: Start Development Server (1 min)

```bash
pnpm dev
```

Done! Your CMS is running!

## Access the CMS

**Frontend Website:**
- http://localhost:3000

**Admin Dashboard:**
- http://localhost:3000/login
- Email: `admin@koc.local`
- Password: `admin123`

## What You Can Do Now

From the admin dashboard at `/edit`:

1. **Manage Events** - Create upcoming events with dates, locations, images
2. **Manage Programs** - Add programs and ministries  
3. **Manage Resources** - Add links and resources
4. **Send Newsletters** - Compose and manage newsletters
5. **Create Pages** - Edit static pages (About, Contact, etc.)
6. **View Subscribers** - See newsletter subscribers

## Common Commands

```bash
# Start development
pnpm dev

# View database in UI
pnpm db:studio

# Reset database (deletes all data!)
pnpm db:push --force-reset

# View database via command line
psql -U postgres -d koc_cms
```

## Troubleshooting

**"Cannot connect to database"**
- Ensure PostgreSQL is running: `brew services start postgresql`
- Check DATABASE_URL in `.env.local`

**"Table does not exist"**
- Run: `pnpm db:push`

**"Port 3000 already in use"**
- Run on different port: `pnpm dev -- -p 3001`

**"Module not found"**
- Run: `pnpm install`

## Next Steps

1. Change the default admin password
2. Create your first event
3. Add content to pages
4. Customize the design
5. Deploy to production

## Documentation

- **Full Setup:** Read `CMS_SETUP.md`
- **Implementation Details:** Read `CMS_IMPLEMENTATION_SUMMARY.md`
- **Database Schema:** Check `prisma/schema.prisma`

## Security Reminder

⚠️ **Before going live:**
1. Change `admin@koc.local` password immediately
2. Generate a new JWT_SECRET
3. Use a strong PostgreSQL password
4. Set `NODE_ENV=production`
5. Enable HTTPS

---

That's it! You're ready to manage your Knights of Columbus website content! 🎉
