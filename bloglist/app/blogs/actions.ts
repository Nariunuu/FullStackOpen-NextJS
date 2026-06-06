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

export async function createBlog(formData: FormData): Promise<void> {
  const title = readString(formData, "title");
  const author = readString(formData, "author");
  const url = readString(formData, "url");

  addBlog({ title, author, url });

  revalidatePath("/blogs");
  redirect("/blogs");
}

export async function likeBlog(formData: FormData): Promise<void> {
  const id = readString(formData, "id");

  const updated = incrementLikes(id);
  if (!updated) {
    throw new Error(`Blog with id "${id}" not found`);
  }

  revalidatePath("/blogs");
  revalidatePath(`/blogs/${id}`);
}
