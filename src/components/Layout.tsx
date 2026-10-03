import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useReveal } from "../hooks/useReveal";
import FloatingWhatsApp from "./FloatingWhatsApp";
import Footer from "./Footer";
import Header from "./Header";

// Leva ao topo a cada nova rota, ou até a âncora (#id) quando ela existe na página de destino.
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      // Espera a página nova montar e assentar o layout antes de rolar até a âncora.
      const timer = window.setTimeout(() => {
        const target = document.getElementById(hash.slice(1));
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        else window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      }, 250);
      return () => window.clearTimeout(timer);
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname, hash]);
  return null;
}

export default function Layout() {
  const { pathname } = useLocation();
  useReveal(pathname);
  return (
    <div className="site-shell">
      <ScrollManager />
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo" key={pathname} className="page">
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
