import { initTRPC, TRPCError } from "@trpc/server";

import type { Context } from "./context";

export const t = initTRPC.context<Context>().create();

export const router = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication required",
      cause: "No session",
    });
  }
  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
    },
  });
});

const requireRole = (roles: string[]) =>
  t.middleware(({ ctx, next }) => {
    const role = ctx.session?.user?.role ?? null;
    if (!role || !roles.includes(role)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Insufficient permissions",
      });
    }
    return next({
      ctx: {
        ...ctx,
        session: ctx.session,
      },
    });
  });

export const adminOrOrganizerProcedure = protectedProcedure.use(
  requireRole(["ADMIN", "ORGANIZER"]),
);
