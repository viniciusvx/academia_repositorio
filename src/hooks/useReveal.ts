import { useEffect } from "react";

// Marca elementos [data-reveal] como visíveis ao entrar na tela.
// Sem IntersectionObserver ou com prefers-reduced-motion, a classe "js" nunca é aplicada e tudo aparece direto.
export function useReveal(routeKey: string) {
  useEffect(() => {
    if (!document.documentElement.classList.contains("js")) return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" },
    );
    document.querySelectorAll("[data-reveal]:not(.is-in)").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [routeKey]);
}
