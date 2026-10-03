type Props = {
  eyebrow: string;
  title: React.ReactNode;
  aside?: React.ReactNode;
  light?: boolean;
  id?: string;
};

export default function SectionHeading({ eyebrow, title, aside, light, id }: Props) {
  return (
    <div className={`section-heading ${light ? "section-heading--light" : ""}`} data-reveal>
      <div>
        <p className={`eyebrow ${light ? "eyebrow--light" : ""}`}>{eyebrow}</p>
        <h2 id={id}>{title}</h2>
      </div>
      {aside && <p>{aside}</p>}
    </div>
  );
}
