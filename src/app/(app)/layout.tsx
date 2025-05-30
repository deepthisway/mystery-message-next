'use client'
import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
const metadata: Metadata = {
  authors: [{ name: "Deepanshu" }],
  description: "A Next.js starter styled with Tailwind CSS and TypeScript.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar/>
        {children}
      </body>
    </html>
  );
}
