import { randomUUID } from "node:crypto";

export type Blog = {
  id: string;
  title: string;
  author: string;
  url: string;
  likes: number;
};

export type NewBlogInput = {
  title: string;
  author: string;
  url: string;
};

let blogs: Blog[] = [
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

export function getBlogs(): readonly Blog[] {
  return blogs;
}

export function getBlogById(id: string): Blog | null {
  return blogs.find((blog) => blog.id === id) ?? null;
}

export function addBlog(input: NewBlogInput): Blog {
  const newBlog: Blog = {
    id: randomUUID(),
    title: input.title,
    author: input.author,
    url: input.url,
    likes: 0,
  };
  blogs = [...blogs, newBlog];
  return newBlog;
}
