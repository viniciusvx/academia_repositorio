import { Link } from "react-router-dom";
import { nav } from "../data/site";
import { cabral, units } from "../data/units";
import { mapsUrl } from "../lib/links";
import Brand from "./Brand";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__top">
        <div className="footer__brand">
          <Brand />
          <p>{cabral.street}</p>
          <p>Centro · Corumbá - MS</p>
          <p>
            <a href={mapsUrl(cabral)} target="_blank" rel="noopener noreferrer">
              Como chegar
            </a>
            {" · "}
            <a href={cabral.instagram?.url} target="_blank" rel="noopener noreferrer">
              {cabral.instagram?.label}
            </a>
          </p>
        </div>
        <div className="footer__links">
          <div>
            <span>Navegue</span>
            {nav.map((item) => (
              <Link key={item.to} to={item.to}>
                {item.label}
              </Link>
            ))}
          </div>
          <div>
            <span>Unidades</span>
            {units.map((unit) => (
              <Link key={unit.id} to={`/unidades/${unit.id}`}>
                {unit.shortName}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="wrap footer__bottom">
        <p>© {new Date().getFullYear()} Central Academia. Todos os direitos reservados.</p>
        <p>Horários sujeitos a alterações. Confirme com a unidade antes da visita.</p>
      </div>
    </footer>
  );
}
