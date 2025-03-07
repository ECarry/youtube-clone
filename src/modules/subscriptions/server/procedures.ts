import { db } from "@/db";
import { categories } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const subscriptionsRouter = createTRPCRouter({
  getMany: baseProcedure.query(async () => {
    const data = await db.select().from(categories);

    return data;
  }),
});
