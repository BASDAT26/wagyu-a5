import { useQuery } from "@tanstack/react-query";
import { env } from "@wagyu-a5/env/web";

import { queryClient } from "@/utils/trpc";

type SessionUser = {
  id: string;
  name: string;
  email: string;
  role?: string | null;
};

type Session = {
  user: SessionUser;
};

type SignInOptions = {
  onSuccess?: (session: Session) => void;
  onError?: (error: { error: { message: string } }) => void;
};

type SignUpOptions = {
  onSuccess?: (session: Session) => void;
  onError?: (error: { error: { message: string } }) => void;
};

type SignOutOptions = {
  fetchOptions?: {
    onSuccess?: () => void;
    onError?: (error: { error: { message: string } }) => void;
  };
};

const sessionKey = ["auth", "session"];

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${env.VITE_SERVER_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message = errorBody?.message || response.statusText;
    throw new Error(message);
  }

  return (await response.json()) as T;
}

async function fetchSession(): Promise<Session | null> {
  const data = await requestJson<{ session: Session | null }>("/auth/session");
  return data.session;
}

export const authClient = {
  useSession() {
    return useQuery({
      queryKey: sessionKey,
      queryFn: fetchSession,
      staleTime: 30_000,
    });
  },
  signIn: {
    async email(input: { email: string; password: string }, options?: SignInOptions) {
      try {
        const data = await requestJson<{ session: Session }>("/auth/login", {
          method: "POST",
          body: JSON.stringify({
            username: input.email,
            password: input.password,
          }),
        });
        queryClient.setQueryData(sessionKey, data.session);
        options?.onSuccess?.(data.session);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Login failed";
        options?.onError?.({ error: { message } });
      }
    },
  },
  async signUp(
    input: {
      username: string;
      password: string;
      role: "CUSTOMER" | "ORGANIZER" | "ADMIN";
      fullName?: string;
      email?: string;
      phoneNumber?: string;
    },
    options?: SignUpOptions,
  ) {
    try {
      const data = await requestJson<{ session: Session }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(input),
      });
      queryClient.setQueryData(sessionKey, data.session);
      options?.onSuccess?.(data.session);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Register failed";
      options?.onError?.({ error: { message } });
    }
  },
  async signOut(options?: SignOutOptions) {
    try {
      await requestJson<{ ok: boolean }>("/auth/logout", {
        method: "POST",
      });
      queryClient.setQueryData(sessionKey, null);
      options?.fetchOptions?.onSuccess?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Logout failed";
      options?.fetchOptions?.onError?.({ error: { message } });
    }
  },
};
