import Homepage from "./homepage.mdx";

export default function Home() {
  return (
    <section className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <div className="markdown text-zinc-800 dark:text-zinc-200">
        <Homepage />
      </div>
    </section>
  );
}
