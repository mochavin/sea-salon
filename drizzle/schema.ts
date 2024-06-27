import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

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

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  fullName: text('full_name').notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phoneNumber: varchar('phone_number', { length: 20 }).notNull(),
  password: text('password').notNull(),
  role: varchar('role', { length: 20 }).notNull().default('Customer'),
});

export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  duration: integer('duration').notNull(), // in minutes
});

export type SelectUser = InferSelectModel<typeof users>;
export type SelectService = InferSelectModel<typeof services>;
export type SelectReservation = InferSelectModel<typeof reservations>;
export type SelectReview = InferSelectModel<typeof reviews>;

export type InsertUser = InferInsertModel<typeof users>;
export type InsertService = InferInsertModel<typeof services>;
export type InsertReservation = InferInsertModel<typeof reservations>;
export type InsertReview = InferInsertModel<typeof reviews>;
