// "use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { useSelectedLayoutSegment, useSelectedLayoutSegments } from "next/navigation";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NX Manager",
  description: "NX Manager",
};

export default function RootLayout({
  children,
  team,
  analytics,
}: {
  children: React.ReactNode;
  team: React.ReactNode;
  analytics: React.ReactNode;
}) {
  //   const allSegments = useSelectedLayoutSegments();
  //   console.log("allSegments", allSegments);
  return (
    <html lang="en">
      <body className={inter.className}>
        <>
          {children}
          {team}
          {analytics}
          <Link style={{ position: "absolute", marginTop: 100 }} href={`/`}>
            back index
          </Link>
        </>
      </body>
    </html>
  );
}
