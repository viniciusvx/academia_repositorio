import { Link } from "react-router-dom";
import type { Photo } from "../data/photos";

type Props = {
  eyebrow: string;
  title: React.ReactNode;
  lead?: string;
  photo?: Photo;
  logo?: string;
  crumb?: { to: string; label: string };
  children?: React.ReactNode;
};

// Cabeçalho das páginas internas: foto grande, título em destaque e ação principal.
export default function PageHero({ eyebrow, title, lead, photo, logo, crumb, children }: Props) {
  return (
    <section className={`page-hero ${photo ? "" : "page-hero--plain"}`}>
      <div className="page-hero__media" aria-hidden="true">
        {photo && <img src={photo.src} alt="" style={{ objectPosition: photo.position }} fetchPriority="high" />}
        {logo && <img className="page-hero__logo" src={logo} alt="" />}
      </div>
      <div className="wrap page-hero__content">
        {crumb && (
          <Link className="crumb" to={crumb.to}>
            ← {crumb.label}
          </Link>
        )}
        <p className="eyebrow eyebrow--light">{eyebrow}</p>
        <h1>{title}</h1>
        {lead && <p className="page-hero__lead">{lead}</p>}
        {children && <div className="page-hero__actions">{children}</div>}
      </div>
    </section>
  );
}
