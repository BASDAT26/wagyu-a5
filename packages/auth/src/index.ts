import { createDb, accountRole, role, userAccount, customer, organizer } from "@wagyu-a5/db";
import { env } from "@wagyu-a5/env/server";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
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

const db = createDb();

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
  const user = await db
    .select({
      id: userAccount.userId,
      username: userAccount.username,
      password: userAccount.password,
    })
    .from(userAccount)
    .where(eq(userAccount.username, username))
    .limit(1)
    .then((rows) => rows[0]);

  if (!user) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return null;
  }

  const userRole = await db
    .select({ name: role.roleName })
    .from(accountRole)
    .innerJoin(role, eq(accountRole.roleId, role.roleId))
    .where(eq(accountRole.userId, user.id))
    .limit(1)
    .then((rows) => rows[0]?.name ?? null);

  return {
    user: {
      id: user.id,
      name: user.username,
      email: user.username,
      role: userRole,
    },
  };
}

export async function registerUser(input: RegisterInput): Promise<Session> {
  const normalizedRole = normalizeRole(input.role);
  const existingUser = await db
    .select({ id: userAccount.userId })
    .from(userAccount)
    .where(eq(userAccount.username, input.username))
    .limit(1)
    .then((rows) => rows[0]);

  if (existingUser) {
    throw new AuthError("Username already exists", "USERNAME_TAKEN");
  }

  const roleId = await ensureRole(normalizedRole);
  const userId = randomUUID();
  const hashedPassword = await bcrypt.hash(input.password, 10);

  await db.insert(userAccount).values({
    userId,
    username: input.username,
    password: hashedPassword,
  });

  await db.insert(accountRole).values({
    roleId,
    userId,
  });

  if (normalizedRole === "CUSTOMER") {
    await db.insert(customer).values({
      customerId: randomUUID(),
      fullName: input.fullName ?? input.username,
      phoneNumber: input.phoneNumber ?? null,
      userId,
    });
  }

  if (normalizedRole === "ORGANIZER") {
    await db.insert(organizer).values({
      organizerId: randomUUID(),
      organizerName: input.fullName ?? input.username,
      contactEmail: input.email ?? null,
      userId,
    });
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
    sameSite: "lax" as const,
    path: "/",
  };
}

export function getSessionCookieClearOptions() {
  return {
    path: "/",
  };
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
  const existingRole = await db
    .select({ id: role.roleId })
    .from(role)
    .where(eq(role.roleName, roleName))
    .limit(1)
    .then((rows) => rows[0]);

  if (existingRole) {
    return existingRole.id;
  }

  const roleId = randomUUID();
  await db.insert(role).values({
    roleId,
    roleName,
  });
  return roleId;
}

function normalizeRole(roleName: string): RoleName {
  if (roleName === "ADMIN" || roleName === "CUSTOMER" || roleName === "ORGANIZER") {
    return roleName;
  }
  throw new AuthError("Invalid role", "INVALID_ROLE");
}
