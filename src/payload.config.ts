import path from 'path';
import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import sharp from 'sharp';

// Content Collections (for non-technical editors)
import { Media } from './payload/collections/Media';
import { Pages } from './payload/collections/Pages';
import { HeroSections } from './payload/collections/HeroSections';
import { Events } from './payload/collections/Events';

// Admin Collections (for administrators only)
import { Users } from './payload/collections/Users';
import { Programs } from './payload/collections/Programs';

export default buildConfig({
  admin: {
    user: 'users',
    meta: {
      titleSuffix: ' - Community Admin',
      favicon: '/favicon.ico',
    },
  },
  collections: [
    // Content Collections (visible to content editors)
    Media,
    Pages,
    HeroSections,
    Events,

    // Admin Collections (admin-only, hidden from content editors)
    Users,
    Programs,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'your-secret-key',
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
    // Custom beforeSchemaInit hook for adding Drizzle-managed tables
    beforeSchemaInit: async (sql) => {
      // Drizzle tables are managed separately via migrations
      // This hook can be used to add custom SQL if needed
      console.log('[Payload] Database initialized with Drizzle schema');
    },
  }),
  sharp,
  plugins: [],
});
