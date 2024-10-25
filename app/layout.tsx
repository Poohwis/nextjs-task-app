import type { Metadata } from "next";
import { Inter, Noto_Sans } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

const noto = Noto_Sans({subsets: ["latin"]})

export const metadata: Metadata = {
  title: {
    default: "TaskMaster", 
    template : `%s | TaskMaster`
  },
  description: "Task management app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={noto.className}>
        <SessionProvider >
        {children}
        </SessionProvider>

        </body>
    </html>
  );
}
