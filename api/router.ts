import { authRouter } from "./auth-router";
import { askmeRouter, adminRouter } from "./askme-router";
import { adminAuthRouter } from "./admin-auth";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  askme: askmeRouter,
  admin: adminRouter,
  adminAuth: adminAuthRouter,

  // TODO: add feature routers here, e.g.
  // todo: createRouter({
  //   list: publicQuery.query(() => findTodos()),
  // }),
});

export type AppRouter = typeof appRouter;
