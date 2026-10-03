import { Link } from "react-router-dom";
import type { Unit } from "../data/units";
import Icon from "./Icon";

export default function UnitCard({ unit, index }: { unit: Unit; index: number }) {
  return (
    <Link className={`unit-card ${unit.id === "cabral" ? "unit-card--featured" : ""}`} to={`/unidades/${unit.id}`} data-reveal>
      <span className="unit-card__num">0{index + 1}</span>
      <div className="unit-card__body">
        <small>{unit.city}</small>
        <h3>{unit.shortName}</h3>
        <p>{unit.street}</p>
      </div>
      <span className="unit-card__go">
        Ver unidade <Icon name="arrow" size={18} />
      </span>
      {unit.id === "cabral" && <em className="unit-card__tag">Em destaque</em>}
    </Link>
  );
}
