import { z } from "zod";
import { query } from "@wagyu-a5/db";
import { publicProcedure, protectedProcedure, router } from "../index";
import { randomUUID } from "crypto";
import { TRPCError } from "@trpc/server";

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

  listAll: publicProcedure.query(async () => {
    const result = await query(
      `SELECT tc.category_id, tc.category_name, tc.quota, tc.price, tc.tevent_id,
              e.event_title AS event_name
       FROM tiktaktuk.ticket_category tc
       JOIN tiktaktuk.event e ON tc.tevent_id = e.event_id
       ORDER BY e.event_title, tc.category_name`,
    );
    return result.rows;
  }),

  create: protectedProcedure
    .input(
      z.object({
        categoryName: z.string().min(1).max(50),
        quota: z.number().int().positive(),
        price: z.number().nonnegative(),
        eventId: z.string().uuid(),
      }),
    )
    .mutation(async ({ input }) => {
      // 1. Dapatkan kapasitas venue untuk event ini
      const capacityQuery = await query(
        `SELECT v.kapasitas FROM tiktaktuk.event e 
         JOIN tiktaktuk.venue v ON e.venue_id = v.venue_id 
         WHERE e.event_id = $1`,
        [input.eventId]
      );
      
      if (capacityQuery.rowCount === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Event tidak ditemukan" });
      }
      
      const kapasitas = capacityQuery.rows[0].kapasitas;

      // 2. Dapatkan total kuota tiket yang sudah ada untuk event ini
      const quotaQuery = await query(
        `SELECT COALESCE(SUM(quota), 0) as total_quota 
         FROM tiktaktuk.ticket_category 
         WHERE tevent_id = $1`,
        [input.eventId]
      );
      
      const totalQuotaSekarang = parseInt(quotaQuery.rows[0].total_quota, 10);

      // 3. Validasi apakah total kuota + kuota baru melebihi kapasitas
      if (totalQuotaSekarang + input.quota > kapasitas) {
        throw new TRPCError({ 
          code: "BAD_REQUEST", 
          message: `Gagal: Total kuota tiket (${totalQuotaSekarang + input.quota}) melebihi kapasitas venue (${kapasitas}). Sisa kapasitas yang bisa ditambahkan: ${kapasitas - totalQuotaSekarang}`
        });
      }

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
    .input(
      z.object({
        categoryId: z.string().uuid(),
        categoryName: z.string().min(1).max(50).optional(),
        quota: z.number().int().positive().optional(),
        price: z.number().nonnegative().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const sets: string[] = [];
      const params: any[] = [];
      let idx = 1;
      if (input.categoryName !== undefined) {
        sets.push(`category_name = $${idx++}`);
        params.push(input.categoryName);
      }
      if (input.quota !== undefined) {
        sets.push(`quota = $${idx++}`);
        params.push(input.quota);
      }
      if (input.price !== undefined) {
        sets.push(`price = $${idx++}`);
        params.push(input.price);
      }
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

  // Memanggil Stored Procedure: sp_get_ticket_category_quota
  getQuotaByEvent: publicProcedure
    .input(z.object({ eventId: z.string().uuid() }))
    .query(async ({ input }) => {
      const result = await query(
        `SELECT * FROM tiktaktuk.sp_get_ticket_category_quota($1)`,
        [input.eventId],
      );
      return result.rows;
    }),
});

// ─── Ticket ──────────────────────────────────────────────────────────────────

const ticketRouter_ = router({
  getById: publicProcedure
    .input(z.object({ ticketId: z.string().uuid() }))
    .query(async ({ input }) => {
      const result = await query(
        `SELECT ticket_id, ticket_code, tcategory_id, torder_id, status
         FROM tiktaktuk.ticket WHERE ticket_id = $1`,
        [input.ticketId],
      );
      return result.rows[0] ?? null;
    }),

  listByOrder: publicProcedure
    .input(z.object({ orderId: z.string().uuid() }))
    .query(async ({ input }) => {
      const result = await query(
        `SELECT ticket_id, ticket_code, tcategory_id, torder_id, status
         FROM tiktaktuk.ticket WHERE torder_id = $1 ORDER BY ticket_code`,
        [input.orderId],
      );
      return result.rows;
    }),

  listByCategory: publicProcedure
    .input(z.object({ categoryId: z.string().uuid() }))
    .query(async ({ input }) => {
      const result = await query(
        `SELECT ticket_id, ticket_code, tcategory_id, torder_id, status
         FROM tiktaktuk.ticket WHERE tcategory_id = $1 ORDER BY ticket_code`,
        [input.categoryId],
      );
      return result.rows;
    }),

  listEnriched: publicProcedure.query(async () => {
    const result = await query(
      `SELECT t.ticket_id, t.ticket_code, t.tcategory_id, t.torder_id, t.status,
              tc.category_name, tc.price,
              e.event_title, e.event_datetime, e.event_id,
              v.venue_name,
              o.order_id, o.payment_status,
              c.full_name AS customer_name, c.customer_id,
              s.section, s.seat_number, s.row_number
       FROM tiktaktuk.ticket t
       JOIN tiktaktuk.ticket_category tc ON t.tcategory_id = tc.category_id
       JOIN tiktaktuk.event e ON tc.tevent_id = e.event_id
       JOIN tiktaktuk.venue v ON e.venue_id = v.venue_id
       JOIN tiktaktuk.orders o ON t.torder_id = o.order_id
       JOIN tiktaktuk.customer c ON o.customer_id = c.customer_id
       LEFT JOIN tiktaktuk.has_relationship hr ON t.ticket_id = hr.ticket_id
       LEFT JOIN tiktaktuk.seat s ON hr.seat_id = s.seat_id
       ORDER BY t.ticket_code`,
    );
    return result.rows;
  }),

  listByCustomer: publicProcedure
    .input(z.object({ customerId: z.string().uuid() }))
    .query(async ({ input }) => {
      const result = await query(
        `SELECT t.ticket_id, t.ticket_code, t.tcategory_id, t.torder_id, t.status,
                tc.category_name, tc.price,
                e.event_title, e.event_datetime, e.event_id,
                v.venue_name,
                o.order_id, o.payment_status,
                c.full_name AS customer_name, c.customer_id,
                s.section, s.seat_number, s.row_number
         FROM tiktaktuk.ticket t
         JOIN tiktaktuk.ticket_category tc ON t.tcategory_id = tc.category_id
         JOIN tiktaktuk.event e ON tc.tevent_id = e.event_id
         JOIN tiktaktuk.venue v ON e.venue_id = v.venue_id
         JOIN tiktaktuk.orders o ON t.torder_id = o.order_id
         JOIN tiktaktuk.customer c ON o.customer_id = c.customer_id
         LEFT JOIN tiktaktuk.has_relationship hr ON t.ticket_id = hr.ticket_id
         LEFT JOIN tiktaktuk.seat s ON hr.seat_id = s.seat_id
         WHERE c.customer_id = $1
         ORDER BY t.ticket_code`,
        [input.customerId],
      );
      return result.rows;
    }),

  listByOrganizer: publicProcedure
    .input(z.object({ organizerId: z.string().uuid() }))
    .query(async ({ input }) => {
      const result = await query(
        `SELECT t.ticket_id, t.ticket_code, t.tcategory_id, t.torder_id, t.status,
                tc.category_name, tc.price,
                e.event_title, e.event_datetime, e.event_id,
                v.venue_name,
                o.order_id, o.payment_status,
                c.full_name AS customer_name, c.customer_id,
                s.section, s.seat_number, s.row_number
         FROM tiktaktuk.ticket t
         JOIN tiktaktuk.ticket_category tc ON t.tcategory_id = tc.category_id
         JOIN tiktaktuk.event e ON tc.tevent_id = e.event_id
         JOIN tiktaktuk.venue v ON e.venue_id = v.venue_id
         JOIN tiktaktuk.orders o ON t.torder_id = o.order_id
         JOIN tiktaktuk.customer c ON o.customer_id = c.customer_id
         LEFT JOIN tiktaktuk.has_relationship hr ON t.ticket_id = hr.ticket_id
         LEFT JOIN tiktaktuk.seat s ON hr.seat_id = s.seat_id
         WHERE e.organizer_id = $1
         ORDER BY t.ticket_code`,
        [input.organizerId],
      );
      return result.rows;
    }),

  listForCurrentUser: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const role = ctx.session.user.role;

    if (role === "ADMIN") {
      // Admin sees all tickets
      const result = await query(
        `SELECT t.ticket_id, t.ticket_code, t.tcategory_id, t.torder_id, t.status,
                tc.category_name, tc.price,
                e.event_title, e.event_datetime, e.event_id,
                v.venue_name,
                o.order_id, o.payment_status,
                c.full_name AS customer_name, c.customer_id,
                s.section, s.seat_number, s.row_number
         FROM tiktaktuk.ticket t
         JOIN tiktaktuk.ticket_category tc ON t.tcategory_id = tc.category_id
         JOIN tiktaktuk.event e ON tc.tevent_id = e.event_id
         JOIN tiktaktuk.venue v ON e.venue_id = v.venue_id
         JOIN tiktaktuk.orders o ON t.torder_id = o.order_id
         JOIN tiktaktuk.customer c ON o.customer_id = c.customer_id
         LEFT JOIN tiktaktuk.has_relationship hr ON t.ticket_id = hr.ticket_id
         LEFT JOIN tiktaktuk.seat s ON hr.seat_id = s.seat_id
         ORDER BY t.ticket_code`,
      );
      return result.rows;
    }

    if (role === "ORGANIZER") {
      // Organizer sees tickets for their events
      const result = await query(
        `SELECT t.ticket_id, t.ticket_code, t.tcategory_id, t.torder_id, t.status,
                tc.category_name, tc.price,
                e.event_title, e.event_datetime, e.event_id,
                v.venue_name,
                o.order_id, o.payment_status,
                c.full_name AS customer_name, c.customer_id,
                s.section, s.seat_number, s.row_number
         FROM tiktaktuk.ticket t
         JOIN tiktaktuk.ticket_category tc ON t.tcategory_id = tc.category_id
         JOIN tiktaktuk.event e ON tc.tevent_id = e.event_id
         JOIN tiktaktuk.venue v ON e.venue_id = v.venue_id
         JOIN tiktaktuk.orders o ON t.torder_id = o.order_id
         JOIN tiktaktuk.customer c ON o.customer_id = c.customer_id
         LEFT JOIN tiktaktuk.has_relationship hr ON t.ticket_id = hr.ticket_id
         LEFT JOIN tiktaktuk.seat s ON hr.seat_id = s.seat_id
         WHERE e.organizer_id = (
           SELECT organizer_id FROM tiktaktuk.organizer WHERE user_id = $1 LIMIT 1
         )
         ORDER BY t.ticket_code`,
        [userId],
      );
      return result.rows;
    }

    // Customer sees only their own tickets
    const result = await query(
      `SELECT t.ticket_id, t.ticket_code, t.tcategory_id, t.torder_id, t.status,
              tc.category_name, tc.price,
              e.event_title, e.event_datetime, e.event_id,
              v.venue_name,
              o.order_id, o.payment_status,
              c.full_name AS customer_name, c.customer_id,
              s.section, s.seat_number, s.row_number
       FROM tiktaktuk.ticket t
       JOIN tiktaktuk.ticket_category tc ON t.tcategory_id = tc.category_id
       JOIN tiktaktuk.event e ON tc.tevent_id = e.event_id
       JOIN tiktaktuk.venue v ON e.venue_id = v.venue_id
       JOIN tiktaktuk.orders o ON t.torder_id = o.order_id
       JOIN tiktaktuk.customer c ON o.customer_id = c.customer_id
       LEFT JOIN tiktaktuk.has_relationship hr ON t.ticket_id = hr.ticket_id
       LEFT JOIN tiktaktuk.seat s ON hr.seat_id = s.seat_id
       WHERE c.user_id = $1
       ORDER BY t.ticket_code`,
      [userId],
    );
    return result.rows;
  }),

  create: protectedProcedure
    .input(
      z.object({
        categoryId: z.string().uuid(),
        orderId: z.string().uuid(),
        seatId: z.string().uuid().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const generatedCode = `TCK-${randomUUID().substring(0, 8).toUpperCase()}`;
      const result = await query(
        `INSERT INTO tiktaktuk.ticket (ticket_id, ticket_code, tcategory_id, torder_id)
         VALUES (gen_random_uuid(), $1, $2, $3)
         RETURNING ticket_id, ticket_code, tcategory_id, torder_id, status`,
        [generatedCode, input.categoryId, input.orderId],
      );
      const ticket = result.rows[0];
      // Assign seat if provided
      if (input.seatId && ticket) {
        await query(`INSERT INTO tiktaktuk.has_relationship (seat_id, ticket_id) VALUES ($1, $2)`, [
          input.seatId,
          ticket.ticket_id,
        ]);
      }
      return ticket;
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        ticketId: z.string().uuid(),
        status: z.enum(["VALID", "TERPAKAI", "BATAL"]),
        seatId: z.string().uuid().optional().nullable(),
      }),
    )
    .mutation(async ({ input }) => {
      const result = await query(
        `UPDATE tiktaktuk.ticket SET status = $1 WHERE ticket_id = $2
         RETURNING ticket_id, ticket_code, tcategory_id, torder_id, status`,
        [input.status, input.ticketId],
      );
      
      const ticket = result.rows[0];
      if (!ticket) return null;

      // Handle seat updates
      if (input.seatId !== undefined) {
        // First delete existing seat relationship
        await query(`DELETE FROM tiktaktuk.has_relationship WHERE ticket_id = $1`, [input.ticketId]);
        
        // Add new if provided
        if (input.seatId !== null) {
           await query(`INSERT INTO tiktaktuk.has_relationship (seat_id, ticket_id) VALUES ($1, $2)`, [
             input.seatId,
             input.ticketId,
           ]);
        }
      }

      return ticket;
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
