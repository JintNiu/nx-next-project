"use client";

import { Links } from "@/components/Links";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <Links linkList={["dashboard", "settings"]} />
    // <button type="button" onClick={() => router.push("/dashboard")}>
    //   Dashboard
    // </button>
  );
}
