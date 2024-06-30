import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import {
  integer,
  pgTable,
  serial,
  text,
  time,
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
  serviceId: integer('service_id')
    .references(() => services.id)
    .notNull(),
  dateTime: text('dateTime'),
  userId: integer('user_id').references(() => users.id),
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
  id: serial('id').primaryKey().unique(),
  name: text('name').notNull(),
  duration: integer('duration').notNull(), // in minutes
});

export const branches = pgTable('branches', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  location: text('location').notNull(),
  openingTime: time('opening_time').notNull(),
  closingTime: time('closing_time').notNull(),
});

export const branchesServices = pgTable('branches_services', {
  branchId: integer('branch_id')
    .references(() => branches.id)
    .notNull(),
  serviceId: integer('service_id')
    .references(() => services.id)
    .notNull(),
});

export type SelectUser = InferSelectModel<typeof users>;
export type SelectService = InferSelectModel<typeof services>;
export type SelectReservation = InferSelectModel<typeof reservations>;
export type SelectReview = InferSelectModel<typeof reviews>;
export type SelectBranch = InferSelectModel<typeof branches>;

export type InsertUser = InferInsertModel<typeof users>;
export type InsertService = InferInsertModel<typeof services>;
export type InsertReservation = InferInsertModel<typeof reservations>;
export type InsertReview = InferInsertModel<typeof reviews>;
export type InsertBranch = InferInsertModel<typeof branches>;
