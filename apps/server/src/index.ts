import { trpcServer } from "@hono/trpc-server";
import { createContext } from "@wagyu-a5/api/context";
import { appRouter } from "@wagyu-a5/api/routers/index";
import {
  SESSION_COOKIE_NAME,
  AuthError,
  authenticateUser,
  createSessionToken,
  getSessionCookieClearOptions,
  getSessionCookieOptions,
  getSessionFromCookieHeader,
  registerUser,
} from "@wagyu-a5/auth";
import { env } from "@wagyu-a5/env/server";
import { Hono } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { z } from "zod";

const app = new Hono();

app.use(logger());
app.use(
  "/*",
  cors({
    origin: env.CORS_ORIGIN,
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: (_opts, context) => {
      return createContext({ context });
    },
  }),
);

app.post("/auth/login", async (c) => {
  const body = await c.req.json().catch(() => null);
  const parsed = z
    .object({
      username: z.string().min(1),
      password: z.string().min(1),
    })
    .safeParse(body);

  if (!parsed.success) {
    return c.json({ message: "Invalid credentials" }, 400);
  }

  const session = await authenticateUser(parsed.data.username, parsed.data.password);

  if (!session) {
    return c.json({ message: "Invalid username or password" }, 401);
  }

  const token = createSessionToken(session);
  setCookie(c, SESSION_COOKIE_NAME, token, getSessionCookieOptions());
  return c.json({ session });
});

app.post("/auth/logout", async (c) => {
  deleteCookie(c, SESSION_COOKIE_NAME, getSessionCookieClearOptions());
  return c.json({ ok: true });
});

app.post("/auth/register", async (c) => {
  const body = await c.req.json().catch(() => null);
  const parsed = z
    .object({
      username: z.string().min(3),
      password: z.string().min(6),
      role: z.enum(["ADMIN", "ORGANIZER", "CUSTOMER"]),
      fullName: z.string().optional(),
      email: z.string().email().optional(),
      phoneNumber: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.role !== "ADMIN") {
        if (!data.fullName) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Full name is required",
            path: ["fullName"],
          });
        }
        if (!data.email) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Email is required",
            path: ["email"],
          });
        }
      }
    })
    .safeParse(body);

  if (!parsed.success) {
    return c.json({ message: "Invalid registration data" }, 400);
  }

  try {
    const session = await registerUser(parsed.data);
    const token = createSessionToken(session);
    setCookie(c, SESSION_COOKIE_NAME, token, getSessionCookieOptions());
    return c.json({ session });
  } catch (error) {
    if (error instanceof AuthError && error.code === "USERNAME_TAKEN") {
      return c.json({ message: error.message }, 409);
    }
    return c.json({ message: "Registration failed" }, 500);
  }
});

app.get("/auth/session", (c) => {
  const session = getSessionFromCookieHeader(c.req.header("cookie"));
  return c.json({ session });
});

app.get("/", (c) => {
  return c.text("OK");
});

import { serve } from "@hono/node-server";

const port = env.PORT;

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
