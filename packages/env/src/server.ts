import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

const corsOriginList = z
  .string()
  .min(1)
  .transform((value) =>
    value
      .split(/[;,]/)
      .map((origin) => origin.trim())
      .filter(Boolean),
  )
  .refine((origins) => origins.every((origin) => z.string().url().safeParse(origin).success), {
    message: "CORS_ORIGIN must be a URL or a list of URLs separated by ';' or ','",
  });

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.url(),
    CORS_ORIGIN: corsOriginList,
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.coerce.number().default(3000),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
