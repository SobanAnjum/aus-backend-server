import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Define the 'users' table (Advisors/Administrators)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: text('role').notNull().default('consultant'), // 'admin' or 'consultant'
  createdAt: timestamp('created_at').defaultNow(),
});

// Define the 'clients' table (Mandanten)
export const clients = pgTable('clients', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  sinceYear: integer('since_year').default(2024),
  createdAt: timestamp('created_at').defaultNow(),
});

// Define the 'appointments' table (Termine)
export const appointments = pgTable('appointments', {
  id: serial('id').primaryKey(),
  clientId: integer('client_id')
    .references(() => clients.id, { onDelete: 'cascade' })
    .notNull(),
  advisorId: integer('advisor_id')
    .references(() => users.id, { onDelete: 'set null' }),
  title: text('title').notNull(), // e.g. "Investitionsanalyse"
  date: text('date').notNull(), // YYYY-MM-DD
  startTime: text('start_time').notNull(), // HH:MM
  endTime: text('end_time').notNull(), // HH:MM
  status: text('status').notNull().default('Bestätigt'), // 'Bestätigt', 'Verschoben', 'Storniert'
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Define the 'documents' table (File Attachments)
export const documents = pgTable('documents', {
  id: serial('id').primaryKey(),
  appointmentId: integer('appointment_id')
    .references(() => appointments.id, { onDelete: 'cascade' })
    .notNull(),
  fileName: text('file_name').notNull(),
  fileSize: text('file_size'), // e.g. "1.2 MB"
  fileUrl: text('file_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Define database relations
export const usersRelations = relations(users, ({ many }) => ({
  appointments: many(appointments),
}));

export const clientsRelations = relations(clients, ({ many }) => ({
  appointments: many(appointments),
}));

export const appointmentsRelations = relations(appointments, ({ one, many }) => ({
  client: one(clients, {
    fields: [appointments.clientId],
    references: [clients.id],
  }),
  advisor: one(users, {
    fields: [appointments.advisorId],
    references: [users.id],
  }),
  documents: many(documents),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  appointment: one(appointments, {
    fields: [documents.appointmentId],
    references: [appointments.id],
  }),
}));
