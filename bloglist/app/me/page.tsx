import Link from "next/link";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { auth } from "../auth";
import { db } from "../db";
import { users } from "../db/schema";
import { generateToken, markAsRead } from "./actions";

type ReadingListEntry = {
  id: number;
  read: boolean;
  blog: {
    id: number;
    title: string;
    author: string;
  };
};

function ReadingListSection({
  title,
  entries,
  emptyTestId,
  emptyText,
  sectionTestId,
  showMarkAsRead,
}: {
  title: string;
  entries: ReadingListEntry[];
  emptyTestId: string;
  emptyText: string;
  sectionTestId: string;
  showMarkAsRead: boolean;
}) {
  return (
    <section data-testid={sectionTestId}>
      <header className="mb-3 flex items-baseline gap-2">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          {title}
        </h3>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          ({entries.length})
        </span>
      </header>

      {entries.length === 0 ? (
        <p
          data-testid={emptyTestId}
          className="text-sm text-zinc-500 dark:text-zinc-400"
        >
          {emptyText}
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {entries.map((entry) => (
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

              {showMarkAsRead && (
                <form action={markAsRead}>
                  <input type="hidden" name="entryId" value={entry.id} />
                  <button
                    type="submit"
                    data-testid={`mark-read-${entry.id}`}
                    className="shrink-0 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  >
                    Mark as read
                  </button>
                </form>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

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

  const unread = user.readingList.filter((entry) => !entry.read);
  const read = user.readingList.filter((entry) => entry.read);

  return (
    <section className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-12">
      <article
        data-testid="user-profile"
        className="rounded-lg border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
      >
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          My Profile
        </h1>

        <dl className="mt-6 flex flex-col gap-3 text-sm">
          <div className="flex gap-2">
            <dt className="font-semibold text-zinc-900 dark:text-zinc-100">
              Name:
            </dt>
            <dd
              data-testid="user-name"
              className="text-zinc-700 dark:text-zinc-300"
            >
              {user.name}
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-semibold text-zinc-900 dark:text-zinc-100">
              Username:
            </dt>
            <dd
              data-testid="user-username"
              className="text-zinc-700 dark:text-zinc-300"
            >
              {user.username}
            </dd>
          </div>
        </dl>

        <hr className="my-8 border-zinc-200 dark:border-zinc-800" />

        <section data-testid="api-token-section">
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            API Token
          </h2>

          <div className="mt-4 rounded-md bg-zinc-50 p-4 dark:bg-zinc-900">
            {user.token ? (
              <div data-testid="token-display">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Current token:
                </p>
                <code
                  data-testid="api-token"
                  className="mt-2 block break-all rounded border border-zinc-200 bg-white px-3 py-2 font-mono text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                >
                  {user.token}
                </code>
              </div>
            ) : (
              <p
                data-testid="no-token-message"
                className="text-sm text-zinc-600 dark:text-zinc-400"
              >
                No token has been generated yet.
              </p>
            )}
          </div>

          <form action={generateToken} className="mt-6">
            <button
              type="submit"
              data-testid="generate-token-button"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              {user.token ? "Generate New Token" : "Generate Token"}
            </button>
          </form>
        </section>
      </article>

      <article
        data-testid="reading-list-section"
        className="flex flex-col gap-6 rounded-lg border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
      >
        <header>
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Reading list
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {user.readingList.length === 0
              ? "Your reading list is empty."
              : `${user.readingList.length} blog${user.readingList.length === 1 ? "" : "s"} total · ${unread.length} unread, ${read.length} read`}
          </p>
        </header>

        {user.readingList.length === 0 ? (
          <p
            data-testid="empty-reading-list"
            className="text-sm text-zinc-500 dark:text-zinc-400"
          >
            Add blogs from the list to start tracking your reading.
          </p>
        ) : (
          <>
            <ReadingListSection
              title="Unread"
              entries={unread}
              emptyText="Nothing to read right now."
              emptyTestId="no-unread-blogs"
              sectionTestId="unread-section"
              showMarkAsRead
            />

            <ReadingListSection
              title="Read"
              entries={read}
              emptyText="You haven't marked any blogs as read yet."
              emptyTestId="no-read-blogs"
              sectionTestId="read-section"
              showMarkAsRead={false}
            />
          </>
        )}
      </article>
    </section>
  );
}
