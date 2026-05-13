import { z } from "zod";
import { query } from "@wagyu-a5/db";
import { publicProcedure, protectedProcedure, router } from "../index";
import { randomUUID } from "crypto";

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

  create: protectedProcedure
    .input(z.object({
      orderDate: z.string().datetime(),
      paymentStatus: z.string().min(1).max(20),
      totalAmount: z.number().nonnegative(),
      customerId: z.string().uuid(),
    }))
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

  update: protectedProcedure
    .input(z.object({
      orderId: z.string().uuid(),
      paymentStatus: z.string().min(1).max(20).optional(),
      totalAmount: z.number().nonnegative().optional(),
    }))
    .mutation(async ({ input }) => {
      const sets: string[] = [];
      const params: any[] = [];
      let idx = 1;
      if (input.paymentStatus !== undefined) { sets.push(`payment_status = $${idx++}`); params.push(input.paymentStatus); }
      if (input.totalAmount !== undefined) { sets.push(`total_amount = $${idx++}`); params.push(input.totalAmount); }
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
    .mutation(async ({ input }) => {
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
        `SELECT promotion_id, promo_code, discount_type, discount_value, start_date, end_date, usage_limit
         FROM tiktaktuk.promotion WHERE promotion_id = $1`,
        [input.promotionId],
      );
      return result.rows[0] ?? null;
    }),

  list: publicProcedure.query(async () => {
    const result = await query(
      `SELECT promotion_id, promo_code, discount_type, discount_value, start_date, end_date, usage_limit
       FROM tiktaktuk.promotion ORDER BY start_date DESC`,
    );
    return result.rows;
  }),

  getByCode: publicProcedure
    .input(z.object({ promoCode: z.string().min(1) }))
    .query(async ({ input }) => {
      const result = await query(
        `SELECT promotion_id, promo_code, discount_type, discount_value, start_date, end_date, usage_limit
         FROM tiktaktuk.promotion WHERE promo_code = $1`,
        [input.promoCode],
      );
      return result.rows[0] ?? null;
    }),

  create: protectedProcedure
    .input(z.object({
      promoCode: z.string().min(1).max(50),
      discountType: z.enum(["NOMINAL", "PERCENTAGE"]),
      discountValue: z.number().positive(),
      startDate: z.string(),
      endDate: z.string(),
      usageLimit: z.number().int().positive(),
    }))
    .mutation(async ({ input }) => {
      const id = randomUUID();
      const result = await query(
        `INSERT INTO tiktaktuk.promotion (promotion_id, promo_code, discount_type, discount_value, start_date, end_date, usage_limit)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING promotion_id, promo_code, discount_type, discount_value, start_date, end_date, usage_limit`,
        [id, input.promoCode, input.discountType, input.discountValue, input.startDate, input.endDate, input.usageLimit],
      );
      return result.rows[0];
    }),

  update: protectedProcedure
    .input(z.object({
      promotionId: z.string().uuid(),
      promoCode: z.string().min(1).max(50).optional(),
      discountType: z.enum(["NOMINAL", "PERCENTAGE"]).optional(),
      discountValue: z.number().positive().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      usageLimit: z.number().int().positive().optional(),
    }))
    .mutation(async ({ input }) => {
      const sets: string[] = [];
      const params: any[] = [];
      let idx = 1;
      if (input.promoCode !== undefined) { sets.push(`promo_code = $${idx++}`); params.push(input.promoCode); }
      if (input.discountType !== undefined) { sets.push(`discount_type = $${idx++}`); params.push(input.discountType); }
      if (input.discountValue !== undefined) { sets.push(`discount_value = $${idx++}`); params.push(input.discountValue); }
      if (input.startDate !== undefined) { sets.push(`start_date = $${idx++}`); params.push(input.startDate); }
      if (input.endDate !== undefined) { sets.push(`end_date = $${idx++}`); params.push(input.endDate); }
      if (input.usageLimit !== undefined) { sets.push(`usage_limit = $${idx++}`); params.push(input.usageLimit); }
      if (sets.length === 0) return null;
      params.push(input.promotionId);
      const result = await query(
        `UPDATE tiktaktuk.promotion SET ${sets.join(", ")} WHERE promotion_id = $${idx}
         RETURNING promotion_id, promo_code, discount_type, discount_value, start_date, end_date, usage_limit`,
        params,
      );
      return result.rows[0] ?? null;
    }),

  delete: protectedProcedure
    .input(z.object({ promotionId: z.string().uuid() }))
    .mutation(async ({ input }) => {
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
