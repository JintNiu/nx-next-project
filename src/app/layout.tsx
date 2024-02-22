// "use client";
import "@/assets/styles/globals.css";
import { Metadata } from "next";
import Link from "next/link";

// import { useSelectedLayoutSegment, useSelectedLayoutSegments } from "next/navigation";

export const metadata: Metadata = {
  title: "nx",
  description: "...",
};

export default function RootLayout({
  children,
  team,
  analytics,
  modal,
}: {
  children: React.ReactNode;
  team: React.ReactNode;
  analytics: React.ReactNode;
  modal: React.ReactNode;
}) {
  //   const allSegments = useSelectedLayoutSegments();
  //   const allSegment = useSelectedLayoutSegment();
  //   console.log("allSegments", allSegments, allSegment);
  return (
    <html lang="en">
      <body>
        <>
          <Link style={{ position: "absolute", marginTop: 100 }} href={`/`}>
            back index
          </Link>
          {children}
          {modal}
        </>
      </body>
    </html>
  );
}
