"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "../db";
import { users } from "../db/schema";

export type SignupState = { error?: string };

const SALT_ROUNDS = 10;

function readField(formData: FormData, field: string): string {
  const value = formData.get(field);
  if (typeof value !== "string") {
    throw new Error(`Field "${field}" is required`);
  }
  return value.trim();
}

export async function signup(
  _prev: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const username = readField(formData, "username");
  const name = readField(formData, "name");
  const password = formData.get("password");

  if (!username || !name) {
    return { error: "Username and name are required" };
  }
  if (typeof password !== "string" || password.length < 4) {
    return { error: "Password must be at least 4 characters" };
  }

  const existing = await db.query.users.findFirst({
    where: eq(users.username, username),
    columns: { id: true },
  });
  if (existing) {
    return { error: "Username is already taken" };
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  await db.insert(users).values({ username, name, passwordHash });

  redirect("/login");
}
