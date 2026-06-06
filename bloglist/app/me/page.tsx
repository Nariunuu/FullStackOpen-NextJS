import Link from "next/link";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { auth } from "../auth";
import { db } from "../db";
import { users } from "../db/schema";
import { generateToken } from "./actions";

export default async function MePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = Number.parseInt(session.user.id, 10);
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { id: true, username: true, name: true, token: true },
    with: {
      readingList: {
        with: { blog: true },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <section className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-12">
      <article className="rounded-lg border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          My Profile
        </h1>

        <dl className="mt-6 flex flex-col gap-3 text-sm">
          <div className="flex gap-2">
            <dt className="font-semibold text-zinc-900 dark:text-zinc-100">
              Name:
            </dt>
            <dd className="text-zinc-700 dark:text-zinc-300">{user.name}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-semibold text-zinc-900 dark:text-zinc-100">
              Username:
            </dt>
            <dd className="text-zinc-700 dark:text-zinc-300">
              {user.username}
            </dd>
          </div>
        </dl>

        <hr className="my-8 border-zinc-200 dark:border-zinc-800" />

        <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          API Token
        </h2>

        <div className="mt-4 rounded-md bg-zinc-50 p-4 dark:bg-zinc-900">
          {user.token ? (
            <>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Current token:
              </p>
              <code className="mt-2 block break-all rounded border border-zinc-200 bg-white px-3 py-2 font-mono text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100">
                {user.token}
              </code>
            </>
          ) : (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              No token has been generated yet.
            </p>
          )}
        </div>

        <form action={generateToken} className="mt-6">
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {user.token ? "Generate New Token" : "Generate Token"}
          </button>
        </form>
      </article>

      <article className="rounded-lg border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Reading list
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {user.readingList.length === 0
            ? "Your reading list is empty."
            : `${user.readingList.length} blog${user.readingList.length === 1 ? "" : "s"} on your list.`}
        </p>

        {user.readingList.length > 0 && (
          <ul className="mt-4 flex flex-col gap-2">
            {user.readingList.map((entry) => (
              <li
                key={entry.id}
                className="flex items-center justify-between gap-4 rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="min-w-0">
                  <Link
                    href={`/blogs/${entry.blog.id}`}
                    className="font-medium text-zinc-900 hover:underline dark:text-zinc-50"
                  >
                    {entry.blog.title}
                  </Link>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    by {entry.blog.author}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                    entry.read
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
                      : "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  }`}
                >
                  {entry.read ? "read" : "unread"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </article>
    </section>
  );
}
