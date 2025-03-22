'use client'
import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/context/authProvider";

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
        {children}
      </body>
      </AuthProvider>
      
    </html>
  );
}
