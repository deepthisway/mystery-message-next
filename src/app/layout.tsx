'use client'
import React from "react";
import type { Metadata } from "next";
import AuthProvider from "@/context/authProvider";
import { Toaster } from "@/components/ui/toaster"
import Navbar from "@/components/Navbar";
import './globals.css';
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
      <AuthProvider>
      <body>
        <Navbar/>
        {children}
      <Toaster/>
      </body>
      </AuthProvider>
    </html>
  );
}
