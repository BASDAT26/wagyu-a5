import { protectedProcedure, publicProcedure, router } from "../index";
import { userRouter } from "./user.router";
import { venueRouter } from "./venue.router";
import { eventRouter } from "./event.router";
import { ticketRouter } from "./ticket.router";
import { orderRouter } from "./order.router";
import { dashboardRouter } from "./dashboard.router";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),
  privateData: protectedProcedure.query(({ ctx }) => {
    return {
      message: "This is private",
      user: ctx.session.user,
    };
  }),
  user: userRouter,
  venue: venueRouter,
  event: eventRouter,
  ticket: ticketRouter,
  order: orderRouter,
  dashboard: dashboardRouter,
});
export type AppRouter = typeof appRouter;
