"use client";

import { useEffect } from "react";

const DEFAULT_FAVICON = "/favicon.ico";

export function DynamicFavicon() {
  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        const href = data?.favicon_url && typeof data.favicon_url === "string" ? data.favicon_url : DEFAULT_FAVICON;

        // Safely remove existing favicons
        document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]').forEach(el => {
          if (el.parentNode) {
            el.parentNode.removeChild(el);
          }
        });

        // Add new favicon
        const link = document.createElement("link");
        link.rel = "icon";
        link.href = href;
        document.head.appendChild(link);
      })
      .catch(() => { });
  }, []);

  return null;
}
