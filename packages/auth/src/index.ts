import { query } from "@wagyu-a5/db";
import { env } from "@wagyu-a5/env/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";

export const SESSION_COOKIE_NAME = "wagyu_session";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role?: string | null;
};

export type Session = {
  user: SessionUser;
};

export type RegisterInput = {
  username: string;
  password: string;
  role: RoleName;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
};

export type RoleName = "ADMIN" | "CUSTOMER" | "ORGANIZER";

type SessionTokenPayload = {
  sub: string;
  name: string;
  email: string;
  role?: string | null;
};

const SESSION_ISSUER = "wagyu-a5";
const SESSION_AUDIENCE = "wagyu-a5";

export class AuthError extends Error {
  code: "USERNAME_TAKEN" | "INVALID_ROLE" | "UNKNOWN";

  constructor(message: string, code: AuthError["code"] = "UNKNOWN") {
    super(message);
    this.code = code;
  }
}

export async function authenticateUser(
  username: string,
  password: string,
): Promise<Session | null> {
  const userResult = await query(
    `SELECT user_id, username, password
     FROM tiktaktuk.user_account
     WHERE username = $1
     LIMIT 1`,
    [username],
  );

  const user = userResult.rows[0];
  if (!user) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return null;
  }

  const roleResult = await query(
    `SELECT r.role_name
     FROM tiktaktuk.account_role ar
     INNER JOIN tiktaktuk.role r ON ar.role_id = r.role_id
     WHERE ar.user_id = $1
     LIMIT 1`,
    [user.user_id],
  );

  const userRole = roleResult.rows[0]?.role_name ?? null;

  return {
    user: {
      id: user.user_id,
      name: user.username,
      email: user.username,
      role: userRole,
    },
  };
}

export async function registerUser(input: RegisterInput): Promise<Session> {
  const normalizedRole = normalizeRole(input.role);

  const existingResult = await query(
    `SELECT user_id
     FROM tiktaktuk.user_account
     WHERE username = $1
     LIMIT 1`,
    [input.username],
  );

  if (existingResult.rows[0]) {
    throw new AuthError("Username already exists", "USERNAME_TAKEN");
  }

  const roleId = await ensureRole(normalizedRole);
  const userId = randomUUID();
  const hashedPassword = await bcrypt.hash(input.password, 10);

  await query(
    `INSERT INTO tiktaktuk.user_account (user_id, username, password)
     VALUES ($1, $2, $3)`,
    [userId, input.username, hashedPassword],
  );

  await query(
    `INSERT INTO tiktaktuk.account_role (role_id, user_id)
     VALUES ($1, $2)`,
    [roleId, userId],
  );

  if (normalizedRole === "CUSTOMER") {
    await query(
      `INSERT INTO tiktaktuk.customer (customer_id, full_name, phone_number, user_id)
       VALUES ($1, $2, $3, $4)`,
      [randomUUID(), input.fullName ?? input.username, input.phoneNumber ?? null, userId],
    );
  }

  if (normalizedRole === "ORGANIZER") {
    await query(
      `INSERT INTO tiktaktuk.organizer (organizer_id, organizer_name, contact_email, user_id)
       VALUES ($1, $2, $3, $4)`,
      [randomUUID(), input.fullName ?? input.username, input.email ?? null, userId],
    );
  }

  return {
    user: {
      id: userId,
      name: input.username,
      email: input.email ?? input.username,
      role: normalizedRole,
    },
  };
}

export function createSessionToken(session: Session): string {
  const payload: SessionTokenPayload = {
    sub: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role: session.user.role ?? null,
  };

  return jwt.sign(payload, env.BETTER_AUTH_SECRET, {
    issuer: SESSION_ISSUER,
    audience: SESSION_AUDIENCE,
    expiresIn: "7d",
  });
}

export function getSessionFromCookieHeader(
  cookieHeader: string | null | undefined,
): Session | null {
  if (!cookieHeader) {
    return null;
  }

  const cookies = parseCookieHeader(cookieHeader);
  const token = cookies[SESSION_COOKIE_NAME];

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, env.BETTER_AUTH_SECRET, {
      issuer: SESSION_ISSUER,
      audience: SESSION_AUDIENCE,
    }) as SessionTokenPayload;

    return {
      user: {
        id: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role ?? null,
      },
    };
  } catch {
    return null;
  }
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? ("none" as const) : ("lax" as const),
    path: "/",
  };
}

export function getSessionCookieClearOptions() {
  return getSessionCookieOptions();
}

function parseCookieHeader(cookieHeader: string) {
  return cookieHeader.split(";").reduce<Record<string, string>>((acc, part) => {
    const [rawKey, ...rest] = part.trim().split("=");
    if (!rawKey) {
      return acc;
    }
    acc[rawKey] = decodeURIComponent(rest.join("="));
    return acc;
  }, {});
}

async function ensureRole(roleName: RoleName) {
  const existingResult = await query(
    `SELECT role_id
     FROM tiktaktuk.role
     WHERE role_name = $1
     LIMIT 1`,
    [roleName],
  );

  if (existingResult.rows[0]) {
    return existingResult.rows[0].role_id as string;
  }

  const roleId = randomUUID();
  await query(
    `INSERT INTO tiktaktuk.role (role_id, role_name)
     VALUES ($1, $2)`,
    [roleId, roleName],
  );
  return roleId;
}

function normalizeRole(roleName: string): RoleName {
  if (roleName === "ADMIN" || roleName === "CUSTOMER" || roleName === "ORGANIZER") {
    return roleName;
  }
  throw new AuthError("Invalid role", "INVALID_ROLE");
}
