"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function SearchResultRedirectPage() {
  const router = useRouter();
  const { t } = useLanguage();
  useEffect(() => {
    router.replace("/hotel");
  }, [router]);
  return (
    <div style={{ padding: "48px", textAlign: "center", color: "var(--mid)" }}>
      {t("common.redirecting_to_list")}
    </div>
  );
}
