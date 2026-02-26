"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SearchResultRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/hotel");
  }, [router]);
  return (
    <div style={{ padding: "48px", textAlign: "center", color: "var(--mid)" }}>
      Đang chuyển đến trang Khách sạn...
    </div>
  );
}
