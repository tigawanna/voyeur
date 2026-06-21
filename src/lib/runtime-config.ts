import { getRuntimeConfig } from "#/lib/runtime-config.functions";
import { queryOptions } from "@tanstack/react-query";

export const runtimeConfigQueryOptions = queryOptions({
  queryKey: ["runtime-config"],
  queryFn: () => getRuntimeConfig(),
  staleTime: Number.POSITIVE_INFINITY,
});
