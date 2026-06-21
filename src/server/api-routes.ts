import { Hono } from "hono";
import { cors } from "hono/cors";
import { tmdbRoutes } from "./tmdb-routes";

type ApiBindings = { Bindings: CloudflareBindings };

export const apiRoutes = new Hono<ApiBindings>()
  .use(
    "*",
    cors({
      origin: (origin) => origin ?? "*",
      allowMethods: ["GET", "OPTIONS"],
      maxAge: 86400,
    }),
  )
  .route("/", tmdbRoutes);

export const honoApp = new Hono<ApiBindings>().route("/api/tmdb", apiRoutes);

export type HonoAppType = typeof honoApp;
