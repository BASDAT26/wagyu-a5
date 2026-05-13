import { z } from "zod";
import { query } from "@wagyu-a5/db";
import { publicProcedure, protectedProcedure, router } from "../index";
import { randomUUID } from "crypto";

// ─── Event ───────────────────────────────────────────────────────────────────

const eventRouter_ = router({
  getById: publicProcedure
    .input(z.object({ eventId: z.string().uuid() }))
    .query(async ({ input }) => {
      const result = await query(
        `SELECT event_id, event_datetime, event_title, venue_id, organizer_id
         FROM tiktaktuk.event WHERE event_id = $1`,
        [input.eventId],
      );
      return result.rows[0] ?? null;
    }),

  list: publicProcedure.query(async () => {
    const result = await query(
      `SELECT event_id, event_datetime, event_title, venue_id, organizer_id
       FROM tiktaktuk.event ORDER BY event_datetime DESC`,
    );
    return result.rows;
  }),

  create: protectedProcedure
    .input(z.object({
      eventDatetime: z.string().datetime(),
      eventTitle: z.string().min(1).max(200),
      venueId: z.string().uuid(),
      organizerId: z.string().uuid(),
    }))
    .mutation(async ({ input }) => {
      const id = randomUUID();
      const result = await query(
        `INSERT INTO tiktaktuk.event (event_id, event_datetime, event_title, venue_id, organizer_id)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING event_id, event_datetime, event_title, venue_id, organizer_id`,
        [id, input.eventDatetime, input.eventTitle, input.venueId, input.organizerId],
      );
      return result.rows[0];
    }),

  update: protectedProcedure
    .input(z.object({
      eventId: z.string().uuid(),
      eventDatetime: z.string().datetime().optional(),
      eventTitle: z.string().min(1).max(200).optional(),
      venueId: z.string().uuid().optional(),
      organizerId: z.string().uuid().optional(),
    }))
    .mutation(async ({ input }) => {
      const sets: string[] = [];
      const params: any[] = [];
      let idx = 1;
      if (input.eventDatetime !== undefined) { sets.push(`event_datetime = $${idx++}`); params.push(input.eventDatetime); }
      if (input.eventTitle !== undefined) { sets.push(`event_title = $${idx++}`); params.push(input.eventTitle); }
      if (input.venueId !== undefined) { sets.push(`venue_id = $${idx++}`); params.push(input.venueId); }
      if (input.organizerId !== undefined) { sets.push(`organizer_id = $${idx++}`); params.push(input.organizerId); }
      if (sets.length === 0) return null;
      params.push(input.eventId);
      const result = await query(
        `UPDATE tiktaktuk.event SET ${sets.join(", ")} WHERE event_id = $${idx}
         RETURNING event_id, event_datetime, event_title, venue_id, organizer_id`,
        params,
      );
      return result.rows[0] ?? null;
    }),

  delete: protectedProcedure
    .input(z.object({ eventId: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const result = await query(
        `DELETE FROM tiktaktuk.event WHERE event_id = $1 RETURNING event_id`,
        [input.eventId],
      );
      return result.rowCount! > 0;
    }),
});

// ─── Artist ──────────────────────────────────────────────────────────────────

const artistRouter = router({
  getById: publicProcedure
    .input(z.object({ artistId: z.string().uuid() }))
    .query(async ({ input }) => {
      const result = await query(
        `SELECT artist_id, name, genre FROM tiktaktuk.artist WHERE artist_id = $1`,
        [input.artistId],
      );
      return result.rows[0] ?? null;
    }),

  list: publicProcedure.query(async () => {
    const result = await query(`SELECT artist_id, name, genre FROM tiktaktuk.artist ORDER BY name`);
    return result.rows;
  }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1).max(100), genre: z.string().max(100).optional() }))
    .mutation(async ({ input }) => {
      const id = randomUUID();
      const result = await query(
        `INSERT INTO tiktaktuk.artist (artist_id, name, genre) VALUES ($1, $2, $3)
         RETURNING artist_id, name, genre`,
        [id, input.name, input.genre ?? null],
      );
      return result.rows[0];
    }),

  update: protectedProcedure
    .input(z.object({
      artistId: z.string().uuid(),
      name: z.string().min(1).max(100).optional(),
      genre: z.string().max(100).optional(),
    }))
    .mutation(async ({ input }) => {
      const sets: string[] = [];
      const params: any[] = [];
      let idx = 1;
      if (input.name !== undefined) { sets.push(`name = $${idx++}`); params.push(input.name); }
      if (input.genre !== undefined) { sets.push(`genre = $${idx++}`); params.push(input.genre); }
      if (sets.length === 0) return null;
      params.push(input.artistId);
      const result = await query(
        `UPDATE tiktaktuk.artist SET ${sets.join(", ")} WHERE artist_id = $${idx}
         RETURNING artist_id, name, genre`,
        params,
      );
      return result.rows[0] ?? null;
    }),

  delete: protectedProcedure
    .input(z.object({ artistId: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const result = await query(`DELETE FROM tiktaktuk.artist WHERE artist_id = $1 RETURNING artist_id`, [input.artistId]);
      return result.rowCount! > 0;
    }),
});

// ─── EventArtist (Junction) ─────────────────────────────────────────────────

const eventArtistRouter = router({
  listByEvent: publicProcedure
    .input(z.object({ eventId: z.string().uuid() }))
    .query(async ({ input }) => {
      const result = await query(
        `SELECT ea.event_id, ea.artist_id, ea.role, a.name AS artist_name, a.genre
         FROM tiktaktuk.event_artist ea
         INNER JOIN tiktaktuk.artist a ON ea.artist_id = a.artist_id
         WHERE ea.event_id = $1 ORDER BY a.name`,
        [input.eventId],
      );
      return result.rows;
    }),

  create: protectedProcedure
    .input(z.object({ eventId: z.string().uuid(), artistId: z.string().uuid(), role: z.string().max(100).optional() }))
    .mutation(async ({ input }) => {
      const result = await query(
        `INSERT INTO tiktaktuk.event_artist (event_id, artist_id, role) VALUES ($1, $2, $3)
         RETURNING event_id, artist_id, role`,
        [input.eventId, input.artistId, input.role ?? null],
      );
      return result.rows[0];
    }),

  delete: protectedProcedure
    .input(z.object({ eventId: z.string().uuid(), artistId: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const result = await query(
        `DELETE FROM tiktaktuk.event_artist WHERE event_id = $1 AND artist_id = $2 RETURNING event_id`,
        [input.eventId, input.artistId],
      );
      return result.rowCount! > 0;
    }),
});

// ─── Combined ────────────────────────────────────────────────────────────────

export const eventRouter = router({
  event: eventRouter_,
  artist: artistRouter,
  eventArtist: eventArtistRouter,
});
