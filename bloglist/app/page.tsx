export default function Home() {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Home
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Welcome to the bloglist application. Use the navigation bar to browse
        the list of blogs.
      </p>
    </section>
  );
}
