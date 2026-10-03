import { useEffect } from "react";
import { SITE_URL } from "../data/site";

// Título, descrição e canonical por página (SEO local sem biblioteca extra).
export function useMeta(title: string, description: string, path = "/") {
  useEffect(() => {
    document.title = title;
    const set = (selector: string, attr: string, value: string) =>
      document.head.querySelector(selector)?.setAttribute(attr, value);
    set('meta[name="description"]', "content", description);
    set('meta[property="og:title"]', "content", title);
    set('meta[property="og:description"]', "content", description);
    set('meta[property="og:url"]', "content", `${SITE_URL}${path}`);
    set('link[rel="canonical"]', "href", `${SITE_URL}${path}`);
  }, [title, description, path]);
}
