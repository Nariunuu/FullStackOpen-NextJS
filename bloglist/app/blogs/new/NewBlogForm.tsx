"use client";

import { useActionState } from "react";
import { createBlog, type CreateBlogState } from "../actions";

const initialCreateBlogState: CreateBlogState = {
  values: { title: "", author: "", url: "" },
  errors: {},
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <span role="alert" className="text-xs text-red-600 dark:text-red-400">
      {message}
    </span>
  );
}

export default function NewBlogForm() {
  const [state, formAction, pending] = useActionState<
    CreateBlogState,
    FormData
  >(createBlog, initialCreateBlogState);

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
        Title
        <input
          type="text"
          name="title"
          defaultValue={state.values.title}
          aria-invalid={Boolean(state.errors.title)}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
        />
        <FieldError message={state.errors.title} />
      </label>

      <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
        Author
        <input
          type="text"
          name="author"
          defaultValue={state.values.author}
          aria-invalid={Boolean(state.errors.author)}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
        />
        <FieldError message={state.errors.author} />
      </label>

      <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
        URL
        <input
          type="text"
          name="url"
          defaultValue={state.values.url}
          aria-invalid={Boolean(state.errors.url)}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
        />
        <FieldError message={state.errors.url} />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
      >
        {pending ? "Creating…" : "Create"}
      </button>
    </form>
  );
}
