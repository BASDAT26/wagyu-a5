import { z } from "zod";
import { query } from "@wagyu-a5/db";
import { publicProcedure, protectedProcedure, router } from "../index";
import { randomUUID } from "crypto";

// ─── Venue ───────────────────────────────────────────────────────────────────

const venueSchema = z.object({
  venueName: z.string().min(1).max(100),
  capacity: z.number().int().positive(),
  address: z.string().min(1),
  city: z.string().min(1).max(100),
});

const venueRouter_ = router({
  getById: publicProcedure
    .input(z.object({ venueId: z.string().uuid() }))
    .query(async ({ input }) => {
      const result = await query(
        `SELECT venue_id, venue_name, capacity, address, city
         FROM tiktaktuk.venue
         WHERE venue_id = $1`,
        [input.venueId],
      );
      return result.rows[0] ?? null;
    }),

  list: publicProcedure.query(async () => {
    const result = await query(
      `SELECT venue_id, venue_name, capacity, address, city
       FROM tiktaktuk.venue
       ORDER BY venue_name`,
    );
    return result.rows;
  }),

  create: protectedProcedure
    .input(venueSchema)
    .mutation(async ({ input }) => {
      const id = randomUUID();
      const result = await query(
        `INSERT INTO tiktaktuk.venue (venue_id, venue_name, capacity, address, city)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING venue_id, venue_name, capacity, address, city`,
        [id, input.venueName, input.capacity, input.address, input.city],
      );
      return result.rows[0];
    }),

  update: protectedProcedure
    .input(
      z.object({
        venueId: z.string().uuid(),
        venueName: z.string().min(1).max(100).optional(),
        capacity: z.number().int().positive().optional(),
        address: z.string().min(1).optional(),
        city: z.string().min(1).max(100).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const sets: string[] = [];
      const params: any[] = [];
      let idx = 1;

      if (input.venueName !== undefined) {
        sets.push(`venue_name = $${idx++}`);
        params.push(input.venueName);
      }
      if (input.capacity !== undefined) {
        sets.push(`capacity = $${idx++}`);
        params.push(input.capacity);
      }
      if (input.address !== undefined) {
        sets.push(`address = $${idx++}`);
        params.push(input.address);
      }
      if (input.city !== undefined) {
        sets.push(`city = $${idx++}`);
        params.push(input.city);
      }

      if (sets.length === 0) return null;

      params.push(input.venueId);
      const result = await query(
        `UPDATE tiktaktuk.venue SET ${sets.join(", ")}
         WHERE venue_id = $${idx}
         RETURNING venue_id, venue_name, capacity, address, city`,
        params,
      );
      return result.rows[0] ?? null;
    }),

  delete: protectedProcedure
    .input(z.object({ venueId: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const result = await query(
        `DELETE FROM tiktaktuk.venue WHERE venue_id = $1 RETURNING venue_id`,
        [input.venueId],
      );
      return result.rowCount! > 0;
    }),
});

// ─── Seat ────────────────────────────────────────────────────────────────────

const seatSchema = z.object({
  section: z.string().min(1).max(50),
  seatNumber: z.string().min(1).max(10),
  rowNumber: z.string().min(1).max(10),
  venueId: z.string().uuid(),
});

const seatRouter = router({
  getById: publicProcedure
    .input(z.object({ seatId: z.string().uuid() }))
    .query(async ({ input }) => {
      const result = await query(
        `SELECT seat_id, section, seat_number, row_number, venue_id
         FROM tiktaktuk.seat
         WHERE seat_id = $1`,
        [input.seatId],
      );
      return result.rows[0] ?? null;
    }),

  listByVenue: publicProcedure
    .input(z.object({ venueId: z.string().uuid() }))
    .query(async ({ input }) => {
      const result = await query(
        `SELECT seat_id, section, seat_number, row_number, venue_id
         FROM tiktaktuk.seat
         WHERE venue_id = $1
         ORDER BY section, row_number, seat_number`,
        [input.venueId],
      );
      return result.rows;
    }),

  create: protectedProcedure
    .input(seatSchema)
    .mutation(async ({ input }) => {
      const id = randomUUID();
      const result = await query(
        `INSERT INTO tiktaktuk.seat (seat_id, section, seat_number, row_number, venue_id)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING seat_id, section, seat_number, row_number, venue_id`,
        [id, input.section, input.seatNumber, input.rowNumber, input.venueId],
      );
      return result.rows[0];
    }),

  update: protectedProcedure
    .input(
      z.object({
        seatId: z.string().uuid(),
        section: z.string().min(1).max(50).optional(),
        seatNumber: z.string().min(1).max(10).optional(),
        rowNumber: z.string().min(1).max(10).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const sets: string[] = [];
      const params: any[] = [];
      let idx = 1;

      if (input.section !== undefined) {
        sets.push(`section = $${idx++}`);
        params.push(input.section);
      }
      if (input.seatNumber !== undefined) {
        sets.push(`seat_number = $${idx++}`);
        params.push(input.seatNumber);
      }
      if (input.rowNumber !== undefined) {
        sets.push(`row_number = $${idx++}`);
        params.push(input.rowNumber);
      }

      if (sets.length === 0) return null;

      params.push(input.seatId);
      const result = await query(
        `UPDATE tiktaktuk.seat SET ${sets.join(", ")}
         WHERE seat_id = $${idx}
         RETURNING seat_id, section, seat_number, row_number, venue_id`,
        params,
      );
      return result.rows[0] ?? null;
    }),

  delete: protectedProcedure
    .input(z.object({ seatId: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const result = await query(
        `DELETE FROM tiktaktuk.seat WHERE seat_id = $1 RETURNING seat_id`,
        [input.seatId],
      );
      return result.rowCount! > 0;
    }),
});

// ─── Combined Venue Router ──────────────────────────────────────────────────

export const venueRouter = router({
  venue: venueRouter_,
  seat: seatRouter,
});
