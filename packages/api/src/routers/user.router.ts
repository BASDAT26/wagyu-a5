import { z } from "zod";
import { query } from "@wagyu-a5/db";
import { publicProcedure, protectedProcedure, router } from "../index";
import { randomUUID } from "crypto";

// ─── Customer ────────────────────────────────────────────────────────────────

const customerSchema = z.object({
  fullName: z.string().min(1).max(100),
  phoneNumber: z.string().max(20).optional(),
  userId: z.string().uuid(),
});

const customerRouter = router({
  getById: publicProcedure
    .input(z.object({ customerId: z.string().uuid() }))
    .query(async ({ input }) => {
      const result = await query(
        `SELECT customer_id, full_name, phone_number, user_id
         FROM tiktaktuk.customer
         WHERE customer_id = $1`,
        [input.customerId],
      );
      return result.rows[0] ?? null;
    }),
  me: protectedProcedure.query(async ({ ctx }) => {
    const result = await query(
      `SELECT customer_id, full_name, phone_number, user_id
       FROM tiktaktuk.customer
       WHERE user_id = $1`,
      [ctx.session.user.id],
    );
    return result.rows[0] ?? null;
  }),

  list: publicProcedure.query(async () => {
    const result = await query(
      `SELECT customer_id, full_name, phone_number, user_id
       FROM tiktaktuk.customer
       ORDER BY full_name`,
    );
    return result.rows;
  }),

  create: protectedProcedure.input(customerSchema).mutation(async ({ input }) => {
    const id = randomUUID();
    const result = await query(
      `INSERT INTO tiktaktuk.customer (customer_id, full_name, phone_number, user_id)
         VALUES ($1, $2, $3, $4)
         RETURNING customer_id, full_name, phone_number, user_id`,
      [id, input.fullName, input.phoneNumber ?? null, input.userId],
    );
    return result.rows[0];
  }),

  update: protectedProcedure
    .input(
      z.object({
        customerId: z.string().uuid(),
        fullName: z.string().min(1).max(100).optional(),
        phoneNumber: z.string().max(20).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const sets: string[] = [];
      const params: any[] = [];
      let idx = 1;

      if (input.fullName !== undefined) {
        sets.push(`full_name = $${idx++}`);
        params.push(input.fullName);
      }
      if (input.phoneNumber !== undefined) {
        sets.push(`phone_number = $${idx++}`);
        params.push(input.phoneNumber);
      }

      if (sets.length === 0) return null;

      params.push(input.customerId);
      const result = await query(
        `UPDATE tiktaktuk.customer SET ${sets.join(", ")}
         WHERE customer_id = $${idx}
         RETURNING customer_id, full_name, phone_number, user_id`,
        params,
      );
      return result.rows[0] ?? null;
    }),

  delete: protectedProcedure
    .input(z.object({ customerId: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const result = await query(
        `DELETE FROM tiktaktuk.customer WHERE customer_id = $1 RETURNING customer_id`,
        [input.customerId],
      );
      return result.rowCount! > 0;
    }),
});

// ─── Organizer ───────────────────────────────────────────────────────────────

const organizerSchema = z.object({
  organizerName: z.string().min(1).max(100),
  contactEmail: z.string().max(100).optional(),
  userId: z.string().uuid(),
});

const organizerRouter = router({
  getById: publicProcedure
    .input(z.object({ organizerId: z.string().uuid() }))
    .query(async ({ input }) => {
      const result = await query(
        `SELECT organizer_id, organizer_name, contact_email, user_id
         FROM tiktaktuk.organizer
         WHERE organizer_id = $1`,
        [input.organizerId],
      );
      return result.rows[0] ?? null;
    }),
  me: protectedProcedure.query(async ({ ctx }) => {
    const result = await query(
      `SELECT organizer_id, organizer_name, contact_email, user_id
       FROM tiktaktuk.organizer
       WHERE user_id = $1`,
      [ctx.session.user.id],
    );
    return result.rows[0] ?? null;
  }),

  list: publicProcedure.query(async () => {
    const result = await query(
      `SELECT organizer_id, organizer_name, contact_email, user_id
       FROM tiktaktuk.organizer
       ORDER BY organizer_name`,
    );
    return result.rows;
  }),

  create: protectedProcedure.input(organizerSchema).mutation(async ({ input }) => {
    const id = randomUUID();
    const result = await query(
      `INSERT INTO tiktaktuk.organizer (organizer_id, organizer_name, contact_email, user_id)
         VALUES ($1, $2, $3, $4)
         RETURNING organizer_id, organizer_name, contact_email, user_id`,
      [id, input.organizerName, input.contactEmail ?? null, input.userId],
    );
    return result.rows[0];
  }),

  update: protectedProcedure
    .input(
      z.object({
        organizerId: z.string().uuid(),
        organizerName: z.string().min(1).max(100).optional(),
        contactEmail: z.string().max(100).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const sets: string[] = [];
      const params: any[] = [];
      let idx = 1;

      if (input.organizerName !== undefined) {
        sets.push(`organizer_name = $${idx++}`);
        params.push(input.organizerName);
      }
      if (input.contactEmail !== undefined) {
        sets.push(`contact_email = $${idx++}`);
        params.push(input.contactEmail);
      }

      if (sets.length === 0) return null;

      params.push(input.organizerId);
      const result = await query(
        `UPDATE tiktaktuk.organizer SET ${sets.join(", ")}
         WHERE organizer_id = $${idx}
         RETURNING organizer_id, organizer_name, contact_email, user_id`,
        params,
      );
      return result.rows[0] ?? null;
    }),

  delete: protectedProcedure
    .input(z.object({ organizerId: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const result = await query(
        `DELETE FROM tiktaktuk.organizer WHERE organizer_id = $1 RETURNING organizer_id`,
        [input.organizerId],
      );
      return result.rowCount! > 0;
    }),
});

// ─── Combined User Router ───────────────────────────────────────────────────

export const userRouter = router({
  customer: customerRouter,
  organizer: organizerRouter,
});
