import Link from "next/link";
import { sql } from "drizzle-orm";
import { db } from "../db";
import { blogs as blogsTable, users } from "../db/schema";

export default async function UsersPage() {
  const rows = await db
    .select({
      id: users.id,
      username: users.username,
      name: users.name,
      blogs: sql<number>`count(${blogsTable.id})`.mapWith(Number),
    })
    .from(users)
    .leftJoin(blogsTable, sql`${blogsTable.userId} = ${users.id}`)
    .groupBy(users.id)
    .orderBy(users.username);

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-12">
      <header className="border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Users
        </h1>
      </header>

      {rows.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          No users yet.
        </p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
            <tr>
              <th className="py-2 font-medium">User</th>
              <th className="py-2 text-right font-medium">Blogs created</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-zinc-100 dark:border-zinc-900"
              >
                <td className="py-3">
                  <Link
                    href={`/users/${row.username}`}
                    className="font-medium text-zinc-900 hover:underline dark:text-zinc-50"
                  >
                    {row.name}
                  </Link>
                  <span className="ml-2 text-zinc-500 dark:text-zinc-400">
                    @{row.username}
                  </span>
                </td>
                <td className="py-3 text-right text-zinc-700 dark:text-zinc-300">
                  {row.blogs}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
