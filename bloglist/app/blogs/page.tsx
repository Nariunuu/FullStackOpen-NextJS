type Blog = {
  id: string;
  title: string;
  author: string;
  url: string;
  likes: number;
};

const blogs: Blog[] = [
  {
    id: "1",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    id: "2",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
    likes: 5,
  },
  {
    id: "3",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "https://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  },
  {
    id: "4",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html",
    likes: 10,
  },
];

export default function BlogsPage() {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Blogs
      </h1>
      <ul className="flex flex-col gap-4">
        {blogs.map((blog) => (
          <li
            key={blog.id}
            className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
              {blog.title}
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              by {blog.author}
            </p>
            <a
              href={blog.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              {blog.url}
            </a>
            <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
              {blog.likes} likes
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
