"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "../db";
import { users } from "../db/schema";

export type RegisterState = {
  values: { username: string; name: string };
  errors: {
    username?: string;
    name?: string;
    password?: string;
    passwordConfirm?: string;
  };
};

const SALT_ROUNDS = 10;
const MIN_USERNAME_LENGTH = 4;
const MIN_PASSWORD_LENGTH = 4;

function readString(formData: FormData, field: string): string {
  const value = formData.get(field);
  return typeof value === "string" ? value : "";
}

export async function registerUser(
  _prev: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const username = readString(formData, "username").trim();
  const name = readString(formData, "name").trim();
  const password = readString(formData, "password");
  const passwordConfirm = readString(formData, "passwordConfirm");

  const errors: RegisterState["errors"] = {};

  if (!username) {
    errors.username = "Username is required";
  } else if (username.length < MIN_USERNAME_LENGTH) {
    errors.username = `Username must be at least ${MIN_USERNAME_LENGTH} characters`;
  }

  if (!name) {
    errors.name = "Name is required";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }

  if (!errors.password) {
    if (!passwordConfirm) {
      errors.passwordConfirm = "Please confirm your password";
    } else if (password !== passwordConfirm) {
      errors.passwordConfirm = "Passwords do not match";
    }
  }

  if (!errors.username) {
    const existing = await db.query.users.findFirst({
      where: eq(users.username, username),
      columns: { id: true },
    });
    if (existing) {
      errors.username = "Username is already taken";
    }
  }

  if (Object.values(errors).some(Boolean)) {
    return { values: { username, name }, errors };
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  await db.insert(users).values({ username, name, passwordHash });

  redirect("/login");
}
