import bcrypt from "bcryptjs";
import { NextResponse, type NextRequest } from "next/server";
import { db } from "../../../db";
import { users } from "../../../db/schema";

const SALT_ROUNDS = 10;

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "This endpoint is not available in production" },
      { status: 403 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON" },
      { status: 400 },
    );
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json(
      { error: "Request body must be an object" },
      { status: 400 },
    );
  }

  const { username, name, password } = body as Record<string, unknown>;

  if (typeof username !== "string" || !username.trim()) {
    return NextResponse.json(
      { error: "Field 'username' is required" },
      { status: 400 },
    );
  }
  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json(
      { error: "Field 'name' is required" },
      { status: 400 },
    );
  }
  if (typeof password !== "string" || !password) {
    return NextResponse.json(
      { error: "Field 'password' is required" },
      { status: 400 },
    );
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const [created] = await db
    .insert(users)
    .values({
      username: username.trim(),
      name: name.trim(),
      passwordHash,
    })
    .returning({
      id: users.id,
      username: users.username,
      name: users.name,
    });

  return NextResponse.json(created, { status: 201 });
}
