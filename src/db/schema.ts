import { pgTable, serial, varchar, text, timestamp, integer, uuid, boolean, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table (Admin collection in Payload)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  payloadId: varchar('payload_id').unique(),
  email: varchar('email').unique().notNull(),
  firstName: varchar('first_name'),
  lastName: varchar('last_name'),
  role: varchar('role').default('member'), // 'admin', 'member', 'moderator'
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Member profiles table (Custom Drizzle-managed data)
export const memberProfiles = pgTable('member_profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  bio: text('bio'),
  joinDate: timestamp('join_date').defaultNow(),
  membershipLevel: varchar('membership_level').default('standard'), // 'standard', 'knight', 'patriarch'
  phone: varchar('phone'),
  address: text('address'),
  city: varchar('city'),
  state: varchar('state'),
  zipCode: varchar('zip_code'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Events table (Content collection in Payload, but we track RSVPs)
export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  payloadId: varchar('payload_id').unique(),
  title: varchar('title').notNull(),
  description: text('description'),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  location: varchar('location'),
  capacity: integer('capacity'),
  imageUrl: varchar('image_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// RSVPs table (Custom Drizzle-managed data)
export const rsvps = pgTable('rsvps', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  status: varchar('status').default('going'), // 'going', 'maybe', 'not_going', 'cancelled'
  guestCount: integer('guest_count').default(1),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Form submissions table (Custom Drizzle-managed data)
export const formSubmissions = pgTable('form_submissions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'set null' }),
  formType: varchar('form_type').notNull(), // 'contact', 'membership_inquiry', 'volunteer'
  submissionData: jsonb('submission_data'),
  status: varchar('status').default('pending'), // 'pending', 'reviewed', 'resolved'
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Define relationships
export const usersRelations = relations(users, ({ one, many }) => ({
  memberProfile: one(memberProfiles, {
    fields: [users.id],
    references: [memberProfiles.userId],
  }),
  rsvps: many(rsvps),
  formSubmissions: many(formSubmissions),
}));

export const memberProfilesRelations = relations(memberProfiles, ({ one }) => ({
  user: one(users, {
    fields: [memberProfiles.userId],
    references: [users.id],
  }),
}));

export const eventsRelations = relations(events, ({ many }) => ({
  rsvps: many(rsvps),
}));

export const rsvpsRelations = relations(rsvps, ({ one }) => ({
  event: one(events, {
    fields: [rsvps.eventId],
    references: [events.id],
  }),
  user: one(users, {
    fields: [rsvps.userId],
    references: [users.id],
  }),
}));

export const formSubmissionsRelations = relations(formSubmissions, ({ one }) => ({
  user: one(users, {
    fields: [formSubmissions.userId],
    references: [users.id],
  }),
}));
