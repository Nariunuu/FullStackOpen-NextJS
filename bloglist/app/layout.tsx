import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";
import Notification from "./components/Notification";
import AuthSessionProvider from "./components/SessionProvider";
import { NotificationProvider } from "./context/NotificationContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bloglist",
  description: "Full Stack Open — Next.js bloglist",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthSessionProvider>
          <NotificationProvider>
            <Notification />
            <Navigation />
            <main className="flex flex-1 flex-col">{children}</main>
          </NotificationProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
