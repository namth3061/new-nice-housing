"use client";

import { useEffect } from "react";

const DEFAULT_FAVICON = "/favicon.ico";
const FAVICON_ID = "dynamic-favicon-link";

export function DynamicFavicon() {
  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        const href =
          data?.favicon_url && typeof data.favicon_url === "string"
            ? data.favicon_url
            : DEFAULT_FAVICON;

        // Reuse a single stable <link> element — avoids removeChild on nodes
        // that React's concurrent renderer may have already claimed.
        let link = document.getElementById(FAVICON_ID) as HTMLLinkElement | null;
        if (!link) {
          link = document.createElement("link");
          link.id = FAVICON_ID;
          link.rel = "icon";
          document.head.appendChild(link);
        }
        link.href = href;
      })
      .catch(() => { });
  }, []);

  return null;
}
