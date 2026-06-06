"use server";

import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "../auth";
import { db } from "../db";
import { readingList, users } from "../db/schema";

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

export async function markAsRead(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const userId = Number.parseInt(session.user.id, 10);
  if (!Number.isInteger(userId)) {
    throw new Error("Invalid session user id");
  }

  const raw = formData.get("entryId");
  const entryId =
    typeof raw === "string" ? Number.parseInt(raw, 10) : Number.NaN;
  if (!Number.isInteger(entryId)) {
    throw new Error("Invalid entry id");
  }

  await db
    .update(readingList)
    .set({ read: true })
    .where(
      and(eq(readingList.id, entryId), eq(readingList.userId, userId)),
    );

  revalidatePath("/me");
}
