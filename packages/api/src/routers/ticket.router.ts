import { z } from "zod";
import { query } from "@wagyu-a5/db";
import { publicProcedure, protectedProcedure, router } from "../index";
import { randomUUID } from "crypto";

// ─── TicketCategory ──────────────────────────────────────────────────────────

const ticketCategoryRouter = router({
  getById: publicProcedure
    .input(z.object({ categoryId: z.string().uuid() }))
    .query(async ({ input }) => {
      const result = await query(
        `SELECT category_id, category_name, quota, price, tevent_id
         FROM tiktaktuk.ticket_category WHERE category_id = $1`,
        [input.categoryId],
      );
      return result.rows[0] ?? null;
    }),

  listByEvent: publicProcedure
    .input(z.object({ eventId: z.string().uuid() }))
    .query(async ({ input }) => {
      const result = await query(
        `SELECT category_id, category_name, quota, price, tevent_id
         FROM tiktaktuk.ticket_category WHERE tevent_id = $1 ORDER BY price`,
        [input.eventId],
      );
      return result.rows;
    }),

  create: protectedProcedure
    .input(z.object({
      categoryName: z.string().min(1).max(50),
      quota: z.number().int().positive(),
      price: z.number().nonnegative(),
      eventId: z.string().uuid(),
    }))
    .mutation(async ({ input }) => {
      const id = randomUUID();
      const result = await query(
        `INSERT INTO tiktaktuk.ticket_category (category_id, category_name, quota, price, tevent_id)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING category_id, category_name, quota, price, tevent_id`,
        [id, input.categoryName, input.quota, input.price, input.eventId],
      );
      return result.rows[0];
    }),

  update: protectedProcedure
    .input(z.object({
      categoryId: z.string().uuid(),
      categoryName: z.string().min(1).max(50).optional(),
      quota: z.number().int().positive().optional(),
      price: z.number().nonnegative().optional(),
    }))
    .mutation(async ({ input }) => {
      const sets: string[] = [];
      const params: any[] = [];
      let idx = 1;
      if (input.categoryName !== undefined) { sets.push(`category_name = $${idx++}`); params.push(input.categoryName); }
      if (input.quota !== undefined) { sets.push(`quota = $${idx++}`); params.push(input.quota); }
      if (input.price !== undefined) { sets.push(`price = $${idx++}`); params.push(input.price); }
      if (sets.length === 0) return null;
      params.push(input.categoryId);
      const result = await query(
        `UPDATE tiktaktuk.ticket_category SET ${sets.join(", ")} WHERE category_id = $${idx}
         RETURNING category_id, category_name, quota, price, tevent_id`,
        params,
      );
      return result.rows[0] ?? null;
    }),

  delete: protectedProcedure
    .input(z.object({ categoryId: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const result = await query(
        `DELETE FROM tiktaktuk.ticket_category WHERE category_id = $1 RETURNING category_id`,
        [input.categoryId],
      );
      return result.rowCount! > 0;
    }),
});

// ─── Ticket ──────────────────────────────────────────────────────────────────

const ticketRouter_ = router({
  getById: publicProcedure
    .input(z.object({ ticketId: z.string().uuid() }))
    .query(async ({ input }) => {
      const result = await query(
        `SELECT ticket_id, ticket_code, tcategory_id, torder_id
         FROM tiktaktuk.ticket WHERE ticket_id = $1`,
        [input.ticketId],
      );
      return result.rows[0] ?? null;
    }),

  listByOrder: publicProcedure
    .input(z.object({ orderId: z.string().uuid() }))
    .query(async ({ input }) => {
      const result = await query(
        `SELECT ticket_id, ticket_code, tcategory_id, torder_id
         FROM tiktaktuk.ticket WHERE torder_id = $1 ORDER BY ticket_code`,
        [input.orderId],
      );
      return result.rows;
    }),

  listByCategory: publicProcedure
    .input(z.object({ categoryId: z.string().uuid() }))
    .query(async ({ input }) => {
      const result = await query(
        `SELECT ticket_id, ticket_code, tcategory_id, torder_id
         FROM tiktaktuk.ticket WHERE tcategory_id = $1 ORDER BY ticket_code`,
        [input.categoryId],
      );
      return result.rows;
    }),

  create: protectedProcedure
    .input(z.object({
      ticketCode: z.string().min(1).max(100),
      categoryId: z.string().uuid(),
      orderId: z.string().uuid(),
    }))
    .mutation(async ({ input }) => {
      const result = await query(
        `INSERT INTO tiktaktuk.ticket (ticket_id, ticket_code, tcategory_id, torder_id)
         VALUES (gen_random_uuid(), $1, $2, $3)
         RETURNING ticket_id, ticket_code, tcategory_id, torder_id`,
        [input.ticketCode, input.categoryId, input.orderId],
      );
      return result.rows[0];
    }),

  delete: protectedProcedure
    .input(z.object({ ticketId: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const result = await query(
        `DELETE FROM tiktaktuk.ticket WHERE ticket_id = $1 RETURNING ticket_id`,
        [input.ticketId],
      );
      return result.rowCount! > 0;
    }),
});

// ─── HasRelationship (Junction: Seat ↔ Ticket) ──────────────────────────────

const hasRelationshipRouter = router({
  listByTicket: publicProcedure
    .input(z.object({ ticketId: z.string().uuid() }))
    .query(async ({ input }) => {
      const result = await query(
        `SELECT hr.seat_id, hr.ticket_id, s.section, s.seat_number, s.row_number
         FROM tiktaktuk.has_relationship hr
         INNER JOIN tiktaktuk.seat s ON hr.seat_id = s.seat_id
         WHERE hr.ticket_id = $1`,
        [input.ticketId],
      );
      return result.rows;
    }),

  create: protectedProcedure
    .input(z.object({ seatId: z.string().uuid(), ticketId: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const result = await query(
        `INSERT INTO tiktaktuk.has_relationship (seat_id, ticket_id) VALUES ($1, $2)
         RETURNING seat_id, ticket_id`,
        [input.seatId, input.ticketId],
      );
      return result.rows[0];
    }),

  delete: protectedProcedure
    .input(z.object({ seatId: z.string().uuid(), ticketId: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const result = await query(
        `DELETE FROM tiktaktuk.has_relationship WHERE seat_id = $1 AND ticket_id = $2 RETURNING seat_id`,
        [input.seatId, input.ticketId],
      );
      return result.rowCount! > 0;
    }),
});

// ─── Combined ────────────────────────────────────────────────────────────────

export const ticketRouter = router({
  category: ticketCategoryRouter,
  ticket: ticketRouter_,
  hasRelationship: hasRelationshipRouter,
});
