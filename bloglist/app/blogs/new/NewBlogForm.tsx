"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { useNotification } from "../../context/NotificationContext";
import { createBlog, type CreateBlogState } from "../actions";

const initialCreateBlogState: CreateBlogState = {
  values: { title: "", author: "", url: "" },
  errors: {},
};

function inputClasses(hasError: boolean): string {
  const base =
    "w-full rounded-md border bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:outline-none focus:ring-2 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500";
  return hasError
    ? `${base} border-red-400 focus:border-red-500 focus:ring-red-500 dark:border-red-700`
    : `${base} border-zinc-300 focus:border-zinc-500 focus:ring-zinc-500 dark:border-zinc-700`;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <span role="alert" className="text-xs text-red-600 dark:text-red-400">
      {message}
    </span>
  );
}

export default function NewBlogForm() {
  const router = useRouter();
  const { notify } = useNotification();

  const [state, formAction, pending] = useActionState<
    CreateBlogState,
    FormData
  >(createBlog, initialCreateBlogState);

  useEffect(() => {
    if (state.success) {
      notify(`Blog "${state.success.title}" created`, "success");
      router.push("/blogs");
      router.refresh();
    }
  }, [state.success, notify, router]);

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="title" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Title
        </label>
        <input
          id="title"
          type="text"
          name="title"
          placeholder="e.g. Why I love Server Components"
          defaultValue={state.values.title}
          aria-invalid={Boolean(state.errors.title)}
          aria-describedby={state.errors.title ? "title-error" : undefined}
          className={inputClasses(Boolean(state.errors.title))}
        />
        <FieldError message={state.errors.title} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="author" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Author
        </label>
        <input
          id="author"
          type="text"
          name="author"
          placeholder="Jane Doe"
          defaultValue={state.values.author}
          aria-invalid={Boolean(state.errors.author)}
          className={inputClasses(Boolean(state.errors.author))}
        />
        <FieldError message={state.errors.author} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="url" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          URL
        </label>
        <input
          id="url"
          type="text"
          name="url"
          placeholder="https://example.com/post"
          defaultValue={state.values.url}
          aria-invalid={Boolean(state.errors.url)}
          className={inputClasses(Boolean(state.errors.url))}
        />
        <FieldError message={state.errors.url} />
      </div>

      <button
        type="submit"
        disabled={pending}
        data-testid="create-blog-button"
        className="self-start rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
      >
        {pending ? "Creating…" : "Create"}
      </button>
    </form>
  );
}
