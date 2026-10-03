import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { nav } from "../data/site";
import { cabralWa } from "../lib/links";
import Brand from "./Brand";
import Button from "./Button";
import Icon from "./Icon";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <>
    <header className={`header ${scrolled || menuOpen ? "is-solid" : ""}`}>
      <Link className="header__brand" to="/" aria-label="Central Academia Premium — página inicial">
        <Brand />
      </Link>
      <nav className="desktop-nav" aria-label="Navegação principal">
        {nav.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end}>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <Button className="header__cta" href={cabralWa("planos")} icon="whatsapp">
        Falar no WhatsApp
      </Button>
      <button
        className="menu-button"
        type="button"
        onClick={() => setMenuOpen((open) => !open)}
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
      >
        <Icon name={menuOpen ? "x" : "menu"} />
      </button>
    </header>
      <div className={`mobile-menu ${menuOpen ? "is-open" : ""}`} id="mobile-menu" inert={!menuOpen}>
      <div className="mobile-menu__inner">
        <span className="eyebrow">Menu</span>
        {nav.map((item, index) => (
          <NavLink key={item.to} to={item.to} end={item.end}>
            <span>0{index + 1}</span>
            {item.label}
          </NavLink>
        ))}
        <Button href={cabralWa("planos")} icon="whatsapp">
          Falar no WhatsApp
        </Button>
      </div>
    </div>
    </>
  );
}
