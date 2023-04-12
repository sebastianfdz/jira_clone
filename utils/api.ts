import { createTRPCReact } from "@trpc/react-query";
import { type inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/api/root";

export type RouterOutputs = inferRouterOutputs<AppRouter>;

export const api = createTRPCReact<AppRouter>();
