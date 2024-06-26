import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const UserMessages = pgTable('user_messages', {
  user_id: text('user_id').primaryKey().notNull(),
  createTs: timestamp('create_ts').defaultNow().notNull(),
  message: text('message').notNull(),
});

export const reservations = pgTable('reservations', {
  id: serial('id').primaryKey(),
  name: text('name'),
  phone: text('phone'),
  service: text('service'),
  dateTime: text('dateTime'),
});

export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  customerName: text('customer_name').notNull(),
  starRating: integer('star_rating').notNull(),
  comment: text('comment').notNull(),
});
