import { z } from "zod";
import { query } from "@wagyu-a5/db";
import { publicProcedure, protectedProcedure, router } from "../index";
import { randomUUID } from "crypto";
import { TRPCError } from "@trpc/server";

// ─── Order ───────────────────────────────────────────────────────────────────

const orderRouter_ = router({
  getById: publicProcedure
    .input(z.object({ orderId: z.string().uuid() }))
    .query(async ({ input }) => {
      const result = await query(
        `SELECT order_id, order_date, payment_status, total_amount, customer_id
         FROM tiktaktuk.orders WHERE order_id = $1`,
        [input.orderId],
      );
      return result.rows[0] ?? null;
    }),

  listByCustomer: publicProcedure
    .input(z.object({ customerId: z.string().uuid() }))
    .query(async ({ input }) => {
      const result = await query(
        `SELECT order_id, order_date, payment_status, total_amount, customer_id
         FROM tiktaktuk.orders WHERE customer_id = $1 ORDER BY order_date DESC`,
        [input.customerId],
      );
      return result.rows;
    }),

  list: publicProcedure.query(async () => {
    const result = await query(
      `SELECT order_id, order_date, payment_status, total_amount, customer_id
       FROM tiktaktuk.orders ORDER BY order_date DESC`,
    );
    return result.rows;
  }),

  listForCurrentUser: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const role = ctx.session.user.role;

    if (role === "ADMIN") {
      const result = await query(
        `SELECT o.order_id, o.order_date, o.payment_status, o.total_amount, o.customer_id,
                c.full_name AS customer_name
         FROM tiktaktuk.orders o
         JOIN tiktaktuk.customer c ON o.customer_id = c.customer_id
         ORDER BY o.order_date DESC`,
      );
      return result.rows;
    }

    if (role === "ORGANIZER") {
      const result = await query(
        `SELECT o.order_id, o.order_date, o.payment_status, o.total_amount, o.customer_id,
                c.full_name AS customer_name
         FROM tiktaktuk.orders o
         JOIN tiktaktuk.customer c ON o.customer_id = c.customer_id
         WHERE EXISTS (
           SELECT 1 FROM tiktaktuk.ticket t
           JOIN tiktaktuk.ticket_category tc ON t.tcategory_id = tc.category_id
           JOIN tiktaktuk.event e ON tc.tevent_id = e.event_id
           WHERE t.torder_id = o.order_id
           AND e.organizer_id = (
             SELECT organizer_id FROM tiktaktuk.organizer WHERE user_id = $1 LIMIT 1
           )
         )
         ORDER BY o.order_date DESC`,
        [userId],
      );
      return result.rows;
    }

    const result = await query(
      `SELECT o.order_id, o.order_date, o.payment_status, o.total_amount, o.customer_id,
              c.full_name AS customer_name
       FROM tiktaktuk.orders o
       JOIN tiktaktuk.customer c ON o.customer_id = c.customer_id
       WHERE c.user_id = $1
       ORDER BY o.order_date DESC`,
      [userId],
    );
    return result.rows;
  }),

  create: protectedProcedure
    .input(
      z.object({
        orderDate: z.string().datetime(),
        paymentStatus: z.string().min(1).max(20),
        totalAmount: z.number().nonnegative(),
        customerId: z.string().uuid(),
      }),
    )
    .mutation(async ({ input }) => {
      const id = randomUUID();
      const result = await query(
        `INSERT INTO tiktaktuk.orders (order_id, order_date, payment_status, total_amount, customer_id)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING order_id, order_date, payment_status, total_amount, customer_id`,
        [id, input.orderDate, input.paymentStatus, input.totalAmount, input.customerId],
      );
      return result.rows[0];
    }),

  createForCurrentUser: protectedProcedure
    .input(
      z.object({
        totalAmount: z.number().nonnegative(),
        paymentStatus: z.string().min(1).max(20).optional(),
        orderDate: z.string().datetime().optional(),
        promoCode: z.string().optional(),
        ticketCount: z.number().positive().optional(),
        categoryId: z.string().uuid().optional(),
        seatIds: z.array(z.string().uuid()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log("createForCurrentUser input:", input);
      const userId = ctx.session.user.id;
      const customerResult = await query(
        `SELECT customer_id
         FROM tiktaktuk.customer
         WHERE user_id = $1
         LIMIT 1`,
        [userId],
      );

      const customerId = customerResult.rows[0]?.customer_id as string | undefined;
      if (!customerId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Customer profile not found for current user",
        });
      }

      // 1. Validasi kategori tiket dan ambil tanggal event
      let categoryData: any = null;
      let eventDatetime: string | null = null;
      if (input.categoryId && input.ticketCount) {
        const catResult = await query(
          `SELECT tc.category_id, tc.quota, e.event_datetime, e.venue_id
           FROM tiktaktuk.ticket_category tc
           JOIN tiktaktuk.event e ON tc.tevent_id = e.event_id
           WHERE tc.category_id = $1`,
          [input.categoryId],
        );
        categoryData = catResult.rows[0];
        eventDatetime = categoryData?.event_datetime ?? null;

        if (!categoryData) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Kategori tiket tidak valid",
          });
        }
        if (categoryData.quota < input.ticketCount) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Kuota tiket tidak mencukupi. Sisa kuota: ${categoryData.quota}, dipesan: ${input.ticketCount}`,
          });
        }
      }

      // 2. Validasi promo terlebih dahulu jika ada
      let promoId: string | null = null;
      if (input.promoCode && input.ticketCount) {
        const promoResult = await query(
          `SELECT promotion_id, promo_code, usage_limit, usage_count, start_date, end_date FROM tiktaktuk.promotion WHERE promo_code = $1`,
          [input.promoCode],
        );
        const promo = promoResult.rows[0];

        // Validation: Existence
        if (!promo) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `ERROR: Promotion dengan ID ${input.promoCode} tidak ditemukan.`,
          });
        }

        // Validation: Usage Limit
        if (promo.usage_count + input.ticketCount > promo.usage_limit) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `ERROR: Promotion "${promo.promo_code}" telah mencapai batas maksimum penggunaan.`,
          });
        }

        // Validation: Date Period (start_date <= event_date <= end_date)
        if (eventDatetime) {
          const eventDate = new Date(eventDatetime);
          const startDate = new Date(promo.start_date);
          const endDate = new Date(promo.end_date);

          if (eventDate < startDate || eventDate > endDate) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: `ERROR: Promotion "${promo.promo_code}" tidak berlaku untuk tanggal event ini.`,
            });
          }
        }

        promoId = promo.promotion_id;
      }

      const seatIds = input.seatIds ?? [];
      if (seatIds.length > 0) {
        if (!categoryData || !input.ticketCount) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Seat selection requires a valid ticket category",
          });
        }
        if (seatIds.length !== input.ticketCount) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Jumlah kursi harus sama dengan jumlah tiket (${input.ticketCount}).`,
          });
        }

        const uniqueSeatIds = new Set(seatIds);
        if (uniqueSeatIds.size !== seatIds.length) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Seat selection contains duplicates",
          });
        }

        const seatResult = await query(
          `SELECT s.seat_id, s.venue_id, hr.seat_id AS assigned_seat_id
           FROM tiktaktuk.seat s
           LEFT JOIN tiktaktuk.has_relationship hr ON s.seat_id = hr.seat_id
           WHERE s.seat_id = ANY($1::uuid[])`,
          [seatIds],
        );

        if (seatResult.rowCount !== seatIds.length) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Satu atau lebih kursi tidak valid",
          });
        }

        const invalidVenue = seatResult.rows.find((row) => row.venue_id !== categoryData.venue_id);
        if (invalidVenue) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Kursi tidak sesuai dengan venue event",
          });
        }

        const alreadyAssigned = seatResult.rows.find((row) => row.assigned_seat_id);
        if (alreadyAssigned) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Satu atau lebih kursi sudah terisi",
          });
        }
      }

      const id = randomUUID();
      const result = await query(
        `INSERT INTO tiktaktuk.orders (order_id, order_date, payment_status, total_amount, customer_id)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING order_id, order_date, payment_status, total_amount, customer_id`,
        [
          id,
          input.orderDate ?? new Date().toISOString(),
          input.paymentStatus ?? "PENDING",
          input.totalAmount,
          customerId,
        ],
      );
      const createdOrder = result.rows[0];

      if (promoId && input.ticketCount) {
        await query(
          `UPDATE tiktaktuk.promotion SET usage_count = usage_count + $1 WHERE promotion_id = $2`,
          [input.ticketCount, promoId],
        );

        const opId = randomUUID();
        await query(
          `INSERT INTO tiktaktuk.order_promotion (order_promotion_id, order_id, promotion_id) VALUES ($1, $2, $3)`,
          [opId, createdOrder.order_id, promoId],
        );
      }

      if (categoryData && input.ticketCount) {
        console.log(
          `Creating ${input.ticketCount} tickets for category ${categoryData.category_id}...`,
        );
        // Kurangi kuota
        await query(
          `UPDATE tiktaktuk.ticket_category SET quota = quota - $1 WHERE category_id = $2`,
          [input.ticketCount, categoryData.category_id],
        );

        const createdTicketIds: string[] = [];
        // Buat tiket sebanyak ticketCount
        for (let i = 0; i < input.ticketCount; i++) {
          const ticketCode = `TCK-${randomUUID().slice(0, 8).toUpperCase()}`;
          const ticketResult = await query(
            `INSERT INTO tiktaktuk.ticket (ticket_code, tcategory_id, torder_id)
             VALUES ($1, $2, $3)
             RETURNING ticket_id`,
            [ticketCode, categoryData.category_id, createdOrder.order_id],
          );
          if (ticketResult.rows[0]?.ticket_id) {
            createdTicketIds.push(ticketResult.rows[0].ticket_id);
          }
        }

        if (seatIds.length > 0 && createdTicketIds.length === seatIds.length) {
          for (let i = 0; i < seatIds.length; i++) {
            await query(
              `INSERT INTO tiktaktuk.has_relationship (seat_id, ticket_id) VALUES ($1, $2)`,
              [seatIds[i], createdTicketIds[i]],
            );
          }
        }
        console.log("Tickets created successfully.");
      } else {
        console.warn("Ticket creation skipped: categoryData or ticketCount missing.", {
          categoryData: !!categoryData,
          ticketCount: input.ticketCount,
        });
      }

      return createdOrder;
    }),

  update: protectedProcedure
    .input(
      z.object({
        orderId: z.string().uuid(),
        paymentStatus: z.string().min(1).max(20).optional(),
        totalAmount: z.number().nonnegative().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { id: userId, role } = ctx.session.user;

      if (role === "ORGANIZER") {
        const accessCheck = await query(
          `SELECT 1 FROM tiktaktuk.orders o
           WHERE o.order_id = $1 AND EXISTS (
             SELECT 1 FROM tiktaktuk.ticket t
             JOIN tiktaktuk.ticket_category tc ON t.tcategory_id = tc.category_id
             JOIN tiktaktuk.event e ON tc.tevent_id = e.event_id
             WHERE t.torder_id = o.order_id
             AND e.organizer_id = (SELECT organizer_id FROM tiktaktuk.organizer WHERE user_id = $2 LIMIT 1)
           )`,
          [input.orderId, userId],
        );
        if (accessCheck.rowCount === 0) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Anda tidak memiliki akses untuk mengubah pesanan ini.",
          });
        }
      }

      const sets: string[] = [];
      const params: any[] = [];
      let idx = 1;
      if (input.paymentStatus !== undefined) {
        sets.push(`payment_status = $${idx++}`);
        params.push(input.paymentStatus);
      }
      if (input.totalAmount !== undefined) {
        sets.push(`total_amount = $${idx++}`);
        params.push(input.totalAmount);
      }
      if (sets.length === 0) return null;
      params.push(input.orderId);
      const result = await query(
        `UPDATE tiktaktuk.orders SET ${sets.join(", ")} WHERE order_id = $${idx}
         RETURNING order_id, order_date, payment_status, total_amount, customer_id`,
        params,
      );
      return result.rows[0] ?? null;
    }),

  delete: protectedProcedure
    .input(z.object({ orderId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const { id: userId, role } = ctx.session.user;

      if (role === "ORGANIZER") {
        const accessCheck = await query(
          `SELECT 1 FROM tiktaktuk.orders o
           WHERE o.order_id = $1 AND EXISTS (
             SELECT 1 FROM tiktaktuk.ticket t
             JOIN tiktaktuk.ticket_category tc ON t.tcategory_id = tc.category_id
             JOIN tiktaktuk.event e ON tc.tevent_id = e.event_id
             WHERE t.torder_id = o.order_id
             AND e.organizer_id = (SELECT organizer_id FROM tiktaktuk.organizer WHERE user_id = $2 LIMIT 1)
           )`,
          [input.orderId, userId],
        );
        if (accessCheck.rowCount === 0) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Anda tidak memiliki akses untuk menghapus pesanan ini.",
          });
        }
      }

      // 1. Kembalikan kuota kategori tiket (quota) yang terpakai
      await query(
        `UPDATE tiktaktuk.ticket_category
         SET quota = quota + sub.cnt
         FROM (
           SELECT tcategory_id, COUNT(*) as cnt
           FROM tiktaktuk.ticket
           WHERE torder_id = $1
           GROUP BY tcategory_id
         ) sub
         WHERE tiktaktuk.ticket_category.category_id = sub.tcategory_id`,
        [input.orderId],
      );

      // 2. Kembalikan kuota promo (usage_count) yang terpakai
      await query(
        `UPDATE tiktaktuk.promotion
         SET usage_count = GREATEST(0, usage_count - COALESCE(
           NULLIF((SELECT COUNT(*) FROM tiktaktuk.ticket WHERE torder_id = $1), 0), 
           1
         ))
         WHERE promotion_id IN (
           SELECT promotion_id FROM tiktaktuk.order_promotion WHERE order_id = $1
         )`,
        [input.orderId],
      );

      // 3. Hapus relasi di junction table dan tiket fisik agar tidak error Foreign Key
      await query(`DELETE FROM tiktaktuk.order_promotion WHERE order_id = $1`, [input.orderId]);
      await query(`DELETE FROM tiktaktuk.ticket WHERE torder_id = $1`, [input.orderId]);

      // 3. Hapus order
      const result = await query(
        `DELETE FROM tiktaktuk.orders WHERE order_id = $1 RETURNING order_id`,
        [input.orderId],
      );
      return result.rowCount! > 0;
    }),
});

// ─── Promotion ───────────────────────────────────────────────────────────────

const promotionRouter = router({
  getById: publicProcedure
    .input(z.object({ promotionId: z.string().uuid() }))
    .query(async ({ input }) => {
      const result = await query(
        `SELECT promotion_id, promo_code, discount_type, discount_value, start_date, end_date, usage_limit, usage_count
         FROM tiktaktuk.promotion WHERE promotion_id = $1`,
        [input.promotionId],
      );
      return result.rows[0] ?? null;
    }),

  list: publicProcedure.query(async () => {
    const result = await query(
      `SELECT promotion_id, promo_code, discount_type, discount_value, start_date, end_date, usage_limit, usage_count
       FROM tiktaktuk.promotion ORDER BY start_date DESC`,
    );
    return result.rows;
  }),

  getByCode: publicProcedure
    .input(z.object({ promoCode: z.string().min(1) }))
    .query(async ({ input }) => {
      const result = await query(
        `SELECT promotion_id, promo_code, discount_type, discount_value, start_date, end_date, usage_limit, usage_count
         FROM tiktaktuk.promotion WHERE promo_code = $1`,
        [input.promoCode],
      );
      return result.rows[0] ?? null;
    }),

  create: protectedProcedure
    .input(
      z.object({
        promoCode: z.string().min(1).max(50),
        discountType: z.enum(["NOMINAL", "PERCENTAGE"]),
        discountValue: z.number().positive(),
        startDate: z.string(),
        endDate: z.string(),
        usageLimit: z.number().int().positive(),
      }),
    )
    .mutation(async ({ input }) => {
      const id = randomUUID();
      const result = await query(
        `INSERT INTO tiktaktuk.promotion (promotion_id, promo_code, discount_type, discount_value, start_date, end_date, usage_limit, usage_count)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 0)
         RETURNING promotion_id, promo_code, discount_type, discount_value, start_date, end_date, usage_limit, usage_count`,
        [
          id,
          input.promoCode,
          input.discountType,
          input.discountValue,
          input.startDate,
          input.endDate,
          input.usageLimit,
        ],
      );
      return result.rows[0];
    }),

  update: protectedProcedure
    .input(
      z.object({
        promotionId: z.string().uuid(),
        promoCode: z.string().min(1).max(50).optional(),
        discountType: z.enum(["NOMINAL", "PERCENTAGE"]).optional(),
        discountValue: z.number().positive().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        usageLimit: z.number().int().positive().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const sets: string[] = [];
      const params: any[] = [];
      let idx = 1;
      if (input.promoCode !== undefined) {
        sets.push(`promo_code = $${idx++}`);
        params.push(input.promoCode);
      }
      if (input.discountType !== undefined) {
        sets.push(`discount_type = $${idx++}`);
        params.push(input.discountType);
      }
      if (input.discountValue !== undefined) {
        sets.push(`discount_value = $${idx++}`);
        params.push(input.discountValue);
      }
      if (input.startDate !== undefined) {
        sets.push(`start_date = $${idx++}`);
        params.push(input.startDate);
      }
      if (input.endDate !== undefined) {
        sets.push(`end_date = $${idx++}`);
        params.push(input.endDate);
      }
      if (input.usageLimit !== undefined) {
        sets.push(`usage_limit = $${idx++}`);
        params.push(input.usageLimit);
      }
      if (sets.length === 0) return null;
      params.push(input.promotionId);
      const result = await query(
        `UPDATE tiktaktuk.promotion SET ${sets.join(", ")} WHERE promotion_id = $${idx}
         RETURNING promotion_id, promo_code, discount_type, discount_value, start_date, end_date, usage_limit, usage_count`,
        params,
      );
      return result.rows[0] ?? null;
    }),

  delete: protectedProcedure
    .input(z.object({ promotionId: z.string().uuid() }))
    .mutation(async ({ input }) => {
      // 1. Ubah status order menjadi CANCELLED atau REFUNDED
      await query(
        `UPDATE tiktaktuk.orders
         SET payment_status = CASE 
           WHEN payment_status = 'PENDING' THEN 'CANCELLED'
           WHEN payment_status = 'PAID' THEN 'REFUNDED'
           ELSE payment_status
         END
         WHERE order_id IN (
           SELECT order_id FROM tiktaktuk.order_promotion WHERE promotion_id = $1
         )`,
        [input.promotionId],
      );

      // 2. Hapus relasi di junction table agar tidak melanggar Foreign Key
      await query(`DELETE FROM tiktaktuk.order_promotion WHERE promotion_id = $1`, [
        input.promotionId,
      ]);

      // 3. Baru hapus promosinya
      const result = await query(
        `DELETE FROM tiktaktuk.promotion WHERE promotion_id = $1 RETURNING promotion_id`,
        [input.promotionId],
      );
      return result.rowCount! > 0;
    }),
});

// ─── OrderPromotion (Junction) ───────────────────────────────────────────────

const orderPromotionRouter = router({
  listByOrder: publicProcedure
    .input(z.object({ orderId: z.string().uuid() }))
    .query(async ({ input }) => {
      const result = await query(
        `SELECT op.order_promotion_id, op.promotion_id, op.order_id, p.promo_code, p.discount_type, p.discount_value
         FROM tiktaktuk.order_promotion op
         INNER JOIN tiktaktuk.promotion p ON op.promotion_id = p.promotion_id
         WHERE op.order_id = $1`,
        [input.orderId],
      );
      return result.rows;
    }),

  create: protectedProcedure
    .input(z.object({ promotionId: z.string().uuid(), orderId: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const id = randomUUID();
      const result = await query(
        `INSERT INTO tiktaktuk.order_promotion (order_promotion_id, promotion_id, order_id)
         VALUES ($1, $2, $3)
         RETURNING order_promotion_id, promotion_id, order_id`,
        [id, input.promotionId, input.orderId],
      );
      return result.rows[0];
    }),

  delete: protectedProcedure
    .input(z.object({ orderPromotionId: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const result = await query(
        `DELETE FROM tiktaktuk.order_promotion WHERE order_promotion_id = $1 RETURNING order_promotion_id`,
        [input.orderPromotionId],
      );
      return result.rowCount! > 0;
    }),
});

// ─── Combined ────────────────────────────────────────────────────────────────

export const orderRouter = router({
  order: orderRouter_,
  promotion: promotionRouter,
  orderPromotion: orderPromotionRouter,
});
