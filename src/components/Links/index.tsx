"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

type Props = {
  linkList: string[];
};
export function Links({ linkList }: Props) {
  const pathname = usePathname();

  return (
    <nav>
      <ul style={{ display: "flex", listStyle: "none" }}>
        {linkList.map((link: string) => {
          return (
            <li key={link} style={{ margin: "0 20px" }}>
              <Link
                className={`${pathname === link ? "active" : ""}`}
                href={link === "home" ? "/" : "/" + link}
              >
                {link}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// 'use client'

// import { useRouter } from 'next/navigation'

// export default function Page() {
//   const router = useRouter()

//   return (
//     <button type="button" onClick={() => router.push('/dashboard')}>
//       Dashboard
//     </button>
//   )
// }
