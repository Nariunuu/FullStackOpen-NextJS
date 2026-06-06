"use server";

import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "../auth";
import { db } from "../db";
import { users } from "../db/schema";

export async function generateToken(): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const userId = Number.parseInt(session.user.id, 10);
  if (!Number.isInteger(userId)) {
    throw new Error("Invalid session user id");
  }

  await db
    .update(users)
    .set({ token: randomUUID() })
    .where(eq(users.id, userId));

  revalidatePath("/me");
}
