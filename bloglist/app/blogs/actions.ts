"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { addBlog, incrementLikes } from "./data";

function readString(formData: FormData, field: string): string {
  const value = formData.get(field);
  if (typeof value !== "string") {
    throw new Error(`Field "${field}" is required`);
  }
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error(`Field "${field}" must not be empty`);
  }
  return trimmed;
}

function readId(formData: FormData): number {
  const raw = readString(formData, "id");
  const id = Number.parseInt(raw, 10);
  if (!Number.isInteger(id)) {
    throw new Error(`Field "id" must be an integer, got "${raw}"`);
  }
  return id;
}

export async function createBlog(formData: FormData): Promise<void> {
  const title = readString(formData, "title");
  const author = readString(formData, "author");
  const url = readString(formData, "url");

  await addBlog({ title, author, url });

  revalidatePath("/blogs");
  redirect("/blogs");
}

export async function likeBlog(formData: FormData): Promise<void> {
  const id = readId(formData);

  const updated = await incrementLikes(id);
  if (!updated) {
    throw new Error(`Blog with id "${id}" not found`);
  }

  revalidatePath("/blogs");
  revalidatePath(`/blogs/${id}`);
}
