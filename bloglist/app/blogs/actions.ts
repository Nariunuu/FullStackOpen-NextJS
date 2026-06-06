"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { addBlog } from "./data";

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
