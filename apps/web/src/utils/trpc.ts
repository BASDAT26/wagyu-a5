import { QueryCache, QueryClient } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink, httpLink, splitLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import type { AppRouter } from "@wagyu-a5/api/routers/index";
import { env } from "@wagyu-a5/env/web";
import { toast } from "sonner";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      toast.error(error.message, {
        action: {
          label: "retry",
          onClick: query.invalidate,
        },
      });
    },
  }),
});

const fetchWithCredentials: typeof fetch = (url, options) =>
  fetch(url, { ...options, credentials: "include" });

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    splitLink({
      condition: (op) => op.type === "mutation",
      true: httpLink({
        url: `${env.VITE_SERVER_URL}/trpc`,
        fetch: fetchWithCredentials,
      }),
      false: httpBatchLink({
        url: `${env.VITE_SERVER_URL}/trpc`,
        fetch: fetchWithCredentials,
      }),
    }),
  ],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});
