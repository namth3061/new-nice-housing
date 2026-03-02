"use client";

import { useEffect } from "react";

const DEFAULT_FAVICON = "/favicon.ico";

export function DynamicFavicon() {
  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        const href = data?.favicon_url && typeof data.favicon_url === "string" ? data.favicon_url : DEFAULT_FAVICON;
        let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
        if (!link) {
          link = document.createElement("link");
          link.rel = "icon";
          document.head.appendChild(link);
        }
        link.href = href;
      })
      .catch(() => {});
  }, []);

  return null;
}
