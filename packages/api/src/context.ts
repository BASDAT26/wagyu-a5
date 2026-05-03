import type { Context as HonoContext } from "hono";
import { getSessionFromCookieHeader } from "@wagyu-a5/auth";

export type CreateContextOptions = {
  context: HonoContext;
};

export async function createContext({ context }: CreateContextOptions) {
  const session = getSessionFromCookieHeader(context.req.header("cookie"));
  return {
    session,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
