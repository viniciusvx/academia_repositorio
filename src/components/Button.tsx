import { Link } from "react-router-dom";
import Icon, { type IconName } from "./Icon";

type Props = {
  to?: string; // rota interna
  href?: string; // destino externo (WhatsApp, Maps, Instagram, tel:)
  variant?: "red" | "outline" | "outline-dark" | "ghost";
  icon?: IconName;
  trailing?: boolean;
  children: React.ReactNode;
  className?: string;
};

export default function Button({ to, href, variant = "red", icon, trailing, children, className = "" }: Props) {
  const cls = `button button--${variant} ${className}`.trim();
  const content = (
    <>
      {icon && !trailing && <Icon name={icon} size={18} />}
      <span>{children}</span>
      {icon && trailing && <Icon name={icon} size={18} />}
    </>
  );
  if (to) {
    return (
      <Link className={cls} to={to}>
        {content}
      </Link>
    );
  }
  const external = !!href && !href.startsWith("tel:");
  return (
    <a className={cls} href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {content}
    </a>
  );
}
