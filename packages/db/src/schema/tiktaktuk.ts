import {
  pgSchema,
  uuid,
  varchar,
  text,
  integer,
  timestamp,
  numeric,
  date,
  primaryKey,
  unique,
} from "drizzle-orm/pg-core";

export const tiktaktukSchema = pgSchema("tiktaktuk");

export const roleEnum = tiktaktukSchema.enum("role_enum", ["ADMIN", "CUSTOMER", "ORGANIZER"]);

export const userAccount = tiktaktukSchema.table("user_account", {
  userId: uuid("user_id").primaryKey(),
  username: varchar("username", { length: 100 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
});

export const role = tiktaktukSchema.table("role", {
  roleId: uuid("role_id").primaryKey(),
  roleName: roleEnum("role_name").unique().notNull(),
});

export const accountRole = tiktaktukSchema.table(
  "account_role",
  {
    roleId: uuid("role_id")
      .notNull()
      .references(() => role.roleId),
    userId: uuid("user_id")
      .notNull()
      .references(() => userAccount.userId),
  },
  (t) => [primaryKey({ columns: [t.roleId, t.userId] })],
);

export const customer = tiktaktukSchema.table("customer", {
  customerId: uuid("customer_id").primaryKey(),
  fullName: varchar("full_name", { length: 100 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 20 }),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => userAccount.userId),
});

export const organizer = tiktaktukSchema.table("organizer", {
  organizerId: uuid("organizer_id").primaryKey(),
  organizerName: varchar("organizer_name", { length: 100 }).notNull(),
  contactEmail: varchar("contact_email", { length: 100 }),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => userAccount.userId),
});

export const venue = tiktaktukSchema.table("venue", {
  venueId: uuid("venue_id").primaryKey(),
  venueName: varchar("venue_name", { length: 100 }).notNull(),
  capacity: integer("capacity").notNull(),
  address: text("address").notNull(),
  city: varchar("city", { length: 100 }).notNull(),
});

export const seat = tiktaktukSchema.table("seat", {
  seatId: uuid("seat_id").primaryKey(),
  section: varchar("section", { length: 50 }).notNull(),
  seatNumber: varchar("seat_number", { length: 10 }).notNull(),
  rowNumber: varchar("row_number", { length: 10 }).notNull(),
  venueId: uuid("venue_id")
    .notNull()
    .references(() => venue.venueId, { onDelete: "cascade" }),
});

export const event = tiktaktukSchema.table("event", {
  eventId: uuid("event_id").primaryKey(),
  eventDatetime: timestamp("event_datetime").notNull(),
  eventTitle: varchar("event_title", { length: 200 }).notNull(),
  venueId: uuid("venue_id")
    .notNull()
    .references(() => venue.venueId),
  organizerId: uuid("organizer_id")
    .notNull()
    .references(() => organizer.organizerId),
});

export const artist = tiktaktukSchema.table("artist", {
  artistId: uuid("artist_id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  genre: varchar("genre", { length: 100 }),
});

export const eventArtist = tiktaktukSchema.table(
  "event_artist",
  {
    eventId: uuid("event_id")
      .notNull()
      .references(() => event.eventId),
    artistId: uuid("artist_id")
      .notNull()
      .references(() => artist.artistId),
    role: varchar("role", { length: 100 }),
  },
  (t) => [primaryKey({ columns: [t.eventId, t.artistId] })],
);

export const ticketCategory = tiktaktukSchema.table("ticket_category", {
  categoryId: uuid("category_id").primaryKey(),
  categoryName: varchar("category_name", { length: 50 }).notNull(),
  quota: integer("quota").notNull(),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  teventId: uuid("tevent_id")
    .notNull()
    .references(() => event.eventId),
});

export const orders = tiktaktukSchema.table("orders", {
  orderId: uuid("order_id").primaryKey(),
  orderDate: timestamp("order_date").notNull(),
  paymentStatus: varchar("payment_status", { length: 20 }).notNull(),
  totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(),
  customerId: uuid("customer_id")
    .notNull()
    .references(() => customer.customerId),
});

export const ticket = tiktaktukSchema.table("ticket", {
  ticketId: uuid("ticket_id").defaultRandom().primaryKey(),
  ticketCode: varchar("ticket_code", { length: 100 }).unique().notNull(),
  tcategoryId: uuid("tcategory_id")
    .notNull()
    .references(() => ticketCategory.categoryId, { onDelete: "cascade" }),
  torderId: uuid("torder_id")
    .notNull()
    .references(() => orders.orderId, { onDelete: "cascade" }),
});

export const hasRelationship = tiktaktukSchema.table(
  "has_relationship",
  {
    seatId: uuid("seat_id")
      .notNull()
      .references(() => seat.seatId, { onDelete: "cascade" }),
    ticketId: uuid("ticket_id")
      .notNull()
      .references(() => ticket.ticketId, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.seatId, t.ticketId] })],
);

export const promotion = tiktaktukSchema.table("promotion", {
  promotionId: uuid("promotion_id").primaryKey(),
  promoCode: varchar("promo_code", { length: 50 }).unique().notNull(),
  discountType: varchar("discount_type", { length: 20 }).notNull(),
  discountValue: numeric("discount_value", { precision: 12, scale: 2 }).notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  usageLimit: integer("usage_limit").notNull(),
});

export const orderPromotion = tiktaktukSchema.table(
  "order_promotion",
  {
    orderPromotionId: uuid("order_promotion_id").primaryKey(),
    promotionId: uuid("promotion_id")
      .notNull()
      .references(() => promotion.promotionId),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.orderId),
  },
  (t) => [unique("unique_order_promo").on(t.orderId, t.promotionId)],
);
