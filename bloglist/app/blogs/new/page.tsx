import Link from "next/link";
import NewBlogForm from "./NewBlogForm";

export default function NewBlogPage() {
  return (
    <section className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Create new blog
        </h1>
        <Link
          href="/blogs"
          className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          Cancel
        </Link>
      </div>
      <NewBlogForm />
    </section>
  );
}
