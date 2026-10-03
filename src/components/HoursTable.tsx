import { dayNames, type Unit } from "../data/units";
import { openStatus } from "../lib/hours";
import { cabralWa } from "../lib/links";
import { useNow } from "../hooks/useNow";
import Icon from "./Icon";

export default function HoursTable({ unit }: { unit: Unit }) {
  const now = useNow();
  const status = openStatus(unit, now);

  if (!unit.week) {
    return (
      <div className="hours-table hours-table--empty">
        <Icon name="clock" size={32} />
        <h3>Horário em confirmação</h3>
        <p>Ainda não temos os horários desta unidade. Fale com a unidade antes de sair para treinar.</p>
      </div>
    );
  }

  return (
    <div className="hours-table">
      {status && (
        <span className={`open-badge ${status.open ? "is-open" : ""}`} role="status">
          <i aria-hidden="true" />
          {status.label}
        </span>
      )}
      <ul>
        {unit.week.map((day, index) => (
          <li key={dayNames[index]}>
            <span>{dayNames[index]}</span>
            <strong>
              {Array.isArray(day) ? (
                day.map((period) => <span key={period}>{period}</span>)
              ) : day === "closed" ? (
                <span>Fechado</span>
              ) : (
                <span className="is-unknown">A confirmar</span>
              )}
            </strong>
          </li>
        ))}
      </ul>
      {unit.hoursNote && (
        <p className="hours-table__note">
          {unit.hoursNote}{" "}
          {unit.id === "cabral" && (
            <a href={cabralWa("horarios")} target="_blank" rel="noopener noreferrer">
              Perguntar no WhatsApp
            </a>
          )}
        </p>
      )}
    </div>
  );
}
