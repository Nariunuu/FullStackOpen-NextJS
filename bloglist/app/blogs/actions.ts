"use server";

import { revalidatePath } from "next/cache";
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

export type CreateBlogState = {
  values: { title: string; author: string; url: string };
  errors: { title?: string; author?: string; url?: string };
  success?: { title: string };
};

const MIN_LENGTH = 5;

function validateField(value: string, label: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return `${label} is required`;
  }
  if (trimmed.length < MIN_LENGTH) {
    return `${label} must be at least ${MIN_LENGTH} characters`;
  }
  return undefined;
}

export async function createBlog(
  _prev: CreateBlogState,
  formData: FormData,
): Promise<CreateBlogState> {
  const title = (formData.get("title") ?? "").toString();
  const author = (formData.get("author") ?? "").toString();
  const url = (formData.get("url") ?? "").toString();

  const errors: CreateBlogState["errors"] = {
    title: validateField(title, "Title"),
    author: validateField(author, "Author"),
    url: validateField(url, "URL"),
  };

  if (errors.title || errors.author || errors.url) {
    return { values: { title, author, url }, errors };
  }

  const trimmedTitle = title.trim();
  await addBlog({
    title: trimmedTitle,
    author: author.trim(),
    url: url.trim(),
  });

  revalidatePath("/blogs");

  return {
    values: { title: "", author: "", url: "" },
    errors: {},
    success: { title: trimmedTitle },
  };
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
