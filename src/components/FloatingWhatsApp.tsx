import { useEffect, useState } from "react";
import { cabralWa } from "../lib/links";
import Icon from "./Icon";

export default function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.5);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <a
      className={`fab ${visible ? "is-visible" : ""}`}
      href={cabralWa("planos")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a Central Academia Premium no WhatsApp"
      tabIndex={visible ? 0 : -1}
    >
      <Icon name="whatsapp" size={24} />
      <span>WhatsApp</span>
    </a>
  );
}
